import '@testing-library/jest-dom';

// Mock pour window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
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

// Mock pour window.Notification
class MockNotification {
  title: string;
  options: any;
  
  static permission = 'granted';
  static requestPermission = jest.fn().mockResolvedValue('granted');
  
  constructor(title: string, options?: any) {
    this.title = title;
    this.options = options;
  }
}

Object.defineProperty(window, 'Notification', {
  value: MockNotification,
  writable: true
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock CustomEvent
window.CustomEvent = jest.fn().mockImplementation((_event: string, params?: any) => ({
  detail: params?.detail,
}));

// Mock pour window.dispatchEvent
window.dispatchEvent = jest.fn();

// Initialisation des timers simulés
beforeAll(() => {
  jest.useFakeTimers();
});

// Réinitialisation des mocks après chaque test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});
