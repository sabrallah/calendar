export interface Note {
  id: string;
  date: string; // ISO format
  title: string;
  content: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  noteId: string;
  type: 'local' | 'email';
  time: string; // ISO format
  status: 'pending' | 'sent' | 'failed';
  email?: string;
}

export type ViewMode = 'month' | 'week' | 'day';

export type SortMode = 'updatedAt' | 'createdAt' | 'title' | 'none';

export interface CalendarState {
  currentDate: Date;
  viewMode: ViewMode;
  selectedDate: Date | null;
  notes: Record<string, Note[]>;
  reminders: Record<string, Reminder[]>;
  searchQuery: string;
  sortMode: SortMode;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  dayNumber: number;
  notes: Note[];
  reminders: Reminder[];
}
