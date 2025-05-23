import { useState, useEffect, useCallback } from 'react';
import { 
  format
} from 'date-fns';
import { toast } from 'react-hot-toast';

import type { CalendarState, Note, Reminder, ViewMode, SortMode } from '../types/calendar';
import { generateId } from '../utils/dateUtils';
import { 
  loadNotes, 
  loadReminders,
  saveReminders, 
  addNote, 
  updateNote, 
  deleteNote,
  addReminder,
  deleteReminder
} from '../utils/storageUtils';
import { 
  scheduleReminders,
  requestNotificationPermission
} from '../utils/notificationUtils';

const useCalendar = () => {
  const [state, setState] = useState<CalendarState>({
    currentDate: new Date(),
    viewMode: 'month',
    selectedDate: null,
    notes: {},
    reminders: {},
    searchQuery: '',
    sortMode: 'updatedAt'
  });

  // Charger les données au démarrage
  useEffect(() => {
    const notes = loadNotes();
    const reminders = loadReminders();
    
    setState(prevState => ({
      ...prevState,
      notes,
      reminders
    }));

    // Planifier les rappels
    scheduleReminders(reminders);

    // Demander la permission pour les notifications
    requestNotificationPermission();

    // Écouter les événements de rappel
    const handleReminderSent = (event: CustomEvent) => {
      const reminderId = event.detail;
      
      // Mettre à jour le statut du rappel
      updateReminderStatus(reminderId, 'sent');
    };

    window.addEventListener('reminderSent', handleReminderSent as EventListener);

    return () => {
      window.removeEventListener('reminderSent', handleReminderSent as EventListener);
    };
  }, []);

  // Mettre à jour le statut d'un rappel
  const updateReminderStatus = useCallback((reminderId: string, status: 'pending' | 'sent' | 'failed') => {
    setState(prevState => {
      const updatedReminders = { ...prevState.reminders };
      
      // Trouver le rappel dans toutes les dates
      for (const dateKey in updatedReminders) {
        const reminderIndex = updatedReminders[dateKey].findIndex(r => r.id === reminderId);
        
        if (reminderIndex !== -1) {
          updatedReminders[dateKey][reminderIndex] = {
            ...updatedReminders[dateKey][reminderIndex],
            status
          };
          
          saveReminders(updatedReminders);
          return {
            ...prevState,
            reminders: updatedReminders
          };
        }
      }
      
      return prevState;
    });
  }, []);

  // Changer la date actuelle
  const changeCurrentDate = useCallback((date: Date) => {
    setState(prevState => ({
      ...prevState,
      currentDate: date
    }));
  }, []);

  // Changer le mode d'affichage
  const changeViewMode = useCallback((viewMode: ViewMode) => {
    setState(prevState => ({
      ...prevState,
      viewMode
    }));
  }, []);

  // Sélectionner une date
  const selectDate = useCallback((date: Date | null) => {
    setState(prevState => ({
      ...prevState,
      selectedDate: date
    }));
  }, []);

  // Mettre à jour le mode de tri
  const updateSortMode = useCallback((sortMode: SortMode) => {
    setState(prevState => ({
      ...prevState,
      sortMode
    }));
  }, []);

  // Mettre à jour la requête de recherche
  const updateSearchQuery = useCallback((searchQuery: string) => {
    setState(prevState => ({
      ...prevState,
      searchQuery
    }));
  }, []);

  // Créer une nouvelle note
  const createNote = useCallback((title: string, content: string, date: Date, color?: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const now = new Date().toISOString();
    
    const newNote: Note = {
      id: generateId(),
      date: dateStr,
      title,
      content,
      color: color || '#3b82f6',
      createdAt: now,
      updatedAt: now
    };

    setState(prevState => {
      const updatedNotes = addNote(prevState.notes, newNote);
      
      return {
        ...prevState,
        notes: updatedNotes
      };
    });

    toast.success('Note créée avec succès');
    return newNote;
  }, []);

  // Mettre à jour une note
  const updateNoteData = useCallback((noteId: string, updates: Partial<Note>, dateKey: string) => {
    setState(prevState => {
      const dateNotes = prevState.notes[dateKey] || [];
      const noteToUpdate = dateNotes.find(note => note.id === noteId);
      
      if (!noteToUpdate) {
        return prevState;
      }
      
      const updatedNote: Note = {
        ...noteToUpdate,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const updatedNotes = updateNote(prevState.notes, updatedNote);
      
      return {
        ...prevState,
        notes: updatedNotes
      };
    });
    
    toast.success('Note mise à jour');
  }, []);

  // Supprimer une note
  const removeNote = useCallback((noteId: string, dateKey: string) => {
    setState(prevState => {
      const updatedNotes = deleteNote(prevState.notes, noteId, dateKey);
      
      // Également supprimer tous les rappels associés à cette note
      const updatedReminders = { ...prevState.reminders };
      
      for (const reminderDateKey in updatedReminders) {
        updatedReminders[reminderDateKey] = updatedReminders[reminderDateKey].filter(
          reminder => reminder.noteId !== noteId
        );
        
        if (updatedReminders[reminderDateKey].length === 0) {
          delete updatedReminders[reminderDateKey];
        }
      }
      
      saveReminders(updatedReminders);
      
      return {
        ...prevState,
        notes: updatedNotes,
        reminders: updatedReminders
      };
    });
    
    toast.success('Note supprimée');
  }, []);
  // Créer un rappel
  const createReminder = useCallback((noteId: string, _: string, type: 'local' | 'email', time: Date, email?: string) => {
    const timeStr = time.toISOString();
    
    const newReminder: Reminder = {
      id: generateId(),
      noteId,
      type,
      time: timeStr,
      status: 'pending',
      ...(type === 'email' && email ? { email } : {})
    };

    setState(prevState => {
      const updatedReminders = addReminder(prevState.reminders, newReminder);
      
      // Replanifier tous les rappels
      scheduleReminders(updatedReminders);
      
      return {
        ...prevState,
        reminders: updatedReminders
      };
    });

    toast.success(`Rappel ${type === 'local' ? 'local' : 'par e-mail'} créé`);
    return newReminder;
  }, []);

  // Supprimer un rappel
  const removeReminder = useCallback((reminderId: string, dateKey: string) => {
    setState(prevState => {
      const updatedReminders = deleteReminder(prevState.reminders, reminderId, dateKey);
      
      // Replanifier les rappels restants
      scheduleReminders(updatedReminders);
      
      return {
        ...prevState,
        reminders: updatedReminders
      };
    });
    
    toast.success('Rappel supprimé');
  }, []);

  // Fonction pour trier les notes
  const sortNotes = useCallback((notes: Note[]): Note[] => {
    if (state.sortMode === 'none') return notes;

    return [...notes].sort((a, b) => {
      switch (state.sortMode) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updatedAt':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  }, [state.sortMode]);

  // Fonction pour filtrer les notes en fonction de la recherche
  const filterNotes = useCallback((notes: Note[]): Note[] => {
    if (!state.searchQuery) return notes;
    
    const query = state.searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    );
  }, [state.searchQuery]);
  // Obtenir les notes pour une date spécifique avec tri et filtrage
  const getNotesForDate = useCallback((date: Date): Note[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const notes = state.notes[dateStr] || [];
    
    return filterNotes(sortNotes(notes));
  }, [state.notes, sortNotes, filterNotes]);

  // Obtenir les rappels pour une date spécifique
  const getRemindersForDate = useCallback((date: Date): Reminder[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return state.reminders[dateStr] || [];
  }, [state.reminders]);

  // Obtenir les rappels pour une note spécifique
  const getRemindersForNote = useCallback((noteId: string): Reminder[] => {
    const allReminders: Reminder[] = [];
    
    for (const dateKey in state.reminders) {
      const found = state.reminders[dateKey].filter(reminder => reminder.noteId === noteId);
      allReminders.push(...found);
    }
    
    return allReminders;
  }, [state.reminders]);

  // Rechercher des notes dans tout le calendrier
  const searchAllNotes = useCallback((): Note[] => {
    if (!state.searchQuery) return [];
    
    const allNotes: Note[] = [];
    
    for (const dateKey in state.notes) {
      const filteredNotes = filterNotes(state.notes[dateKey]);
      allNotes.push(...filteredNotes);
    }
    
    return sortNotes(allNotes);
  }, [state.notes, state.searchQuery, filterNotes, sortNotes]);

  return {
    state,
    changeCurrentDate,
    changeViewMode,
    selectDate,
    createNote,
    updateNoteData,
    removeNote,
    createReminder,
    removeReminder,
    getNotesForDate,
    getRemindersForDate,
    getRemindersForNote,
    updateReminderStatus,
    setState,
    updateSortMode,
    updateSearchQuery,
    searchAllNotes
  };
};

export default useCalendar;
