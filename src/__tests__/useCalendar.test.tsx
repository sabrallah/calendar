import { renderHook, act } from '@testing-library/react-hooks';
import useCalendar from '../hooks/useCalendar';
import { format } from 'date-fns';
import '@testing-library/jest-dom';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

// Mock pour window.Notification
const mockNotification = {
  permission: 'granted',
  requestPermission: jest.fn().mockResolvedValue('granted')
};

// Setup mocks
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
  });
  
  Object.defineProperty(window, 'Notification', {
    value: mockNotification,
    writable: true
  });
  
  // Mock pour matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
    // Mock pour CustomEvent
  window.CustomEvent = jest.fn().mockImplementation((_event, params) => ({
    detail: params?.detail
  }));
  
  // Mock pour window.dispatchEvent
  window.dispatchEvent = jest.fn();
});

describe('useCalendar hook', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });
  
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useCalendar());
    
    expect(result.current.state.viewMode).toBe('month');
    expect(result.current.state.selectedDate).toBe(null);
    expect(result.current.state.notes).toEqual({});
    expect(result.current.state.reminders).toEqual({});
    expect(result.current.state.searchQuery).toBe('');
    expect(result.current.state.sortMode).toBe('updatedAt');
  });
  
  test('should create a note', () => {
    const { result } = renderHook(() => useCalendar());
    
    const title = 'Test Note';
    const content = 'This is a test note';
    const date = new Date();
    const color = '#ff0000';
    
    act(() => {
      result.current.createNote(title, content, date, color);
    });
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const notes = result.current.state.notes[dateStr] || [];
    
    expect(notes.length).toBe(1);
    expect(notes[0].title).toBe(title);
    expect(notes[0].content).toBe(content);
    expect(notes[0].color).toBe(color);
  });
  
  test('should filter notes by search query', () => {
    const { result } = renderHook(() => useCalendar());
    
    const date = new Date();
    
    // Créer plusieurs notes
    act(() => {
      result.current.createNote('Meeting', 'Team meeting at 10 AM', date);
      result.current.createNote('Lunch', 'Lunch with client', date);
      result.current.createNote('Important', 'Very important task', date);
    });
    
    // Rechercher des notes contenant "meeting"
    act(() => {
      result.current.updateSearchQuery('meeting');
    });
    
    // Rechercher dans toutes les notes
    const searchResults = result.current.searchAllNotes();
    
    expect(result.current.state.searchQuery).toBe('meeting');
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].title).toBe('Meeting');
    
    // Rechercher des notes contenant "important"
    act(() => {
      result.current.updateSearchQuery('important');
    });
    
    const newSearchResults = result.current.searchAllNotes();
    
    expect(newSearchResults.length).toBe(1);
    expect(newSearchResults[0].title).toBe('Important');
  });
  
  test('should sort notes by different criteria', () => {
    const { result } = renderHook(() => useCalendar());
    
    const date = new Date();
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Créer manuellement deux notes avec des horodatages différents
    act(() => {
      // Override de l'état interne du hook directement
      result.current.setState(prevState => {
        const now = new Date().toISOString();
        const earlier = new Date(Date.now() - 10000).toISOString();
        
        const noteB = {
          id: '1',
          date: dateStr,
          title: 'B Note',
          content: 'Content B',
          color: '#ff0000',
          createdAt: earlier,
          updatedAt: earlier
        };
        
        const noteA = {
          id: '2',
          date: dateStr,
          title: 'A Note',
          content: 'Content A',
          color: '#00ff00',
          createdAt: now,
          updatedAt: now
        };
        
        const notes = { ...prevState.notes };
        notes[dateStr] = [noteB, noteA];
        
        return { ...prevState, notes };
      });
    });
    
    // Par défaut, le tri est par updatedAt (le plus récent en premier)
    let notes = result.current.getNotesForDate(date);
    
    expect(notes.length).toBe(2);
    expect(notes[0].title).toBe('A Note'); // Créé en dernier (updatedAt plus récent), devrait être en premier
    expect(notes[1].title).toBe('B Note');
    
    // Trier par titre
    act(() => {
      result.current.updateSortMode('title');
    });
    
    notes = result.current.getNotesForDate(date);
    expect(notes[0].title).toBe('A Note'); // Premier alphabétiquement
    expect(notes[1].title).toBe('B Note');
    
    // Trier par date de création
    act(() => {
      result.current.updateSortMode('createdAt');
    });
    
    notes = result.current.getNotesForDate(date);
    expect(notes[0].title).toBe('A Note'); // Créé en dernier, devrait être en premier en ordre décroissant
    expect(notes[1].title).toBe('B Note');
  });
});
