import type { Note, Reminder } from '../types/calendar';

const STORAGE_KEYS = {
  NOTES: 'calendar_notes',
  REMINDERS: 'calendar_reminders'
};

export const saveNotes = (notes: Record<string, Note[]>): void => {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

export const loadNotes = (): Record<string, Note[]> => {
  const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
  return storedNotes ? JSON.parse(storedNotes) : {};
};

export const saveReminders = (reminders: Record<string, Reminder[]>): void => {
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
};

export const loadReminders = (): Record<string, Reminder[]> => {
  const storedReminders = localStorage.getItem(STORAGE_KEYS.REMINDERS);
  return storedReminders ? JSON.parse(storedReminders) : {};
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.NOTES);
  localStorage.removeItem(STORAGE_KEYS.REMINDERS);
};

export const addNote = (notes: Record<string, Note[]>, note: Note): Record<string, Note[]> => {
  const dateKey = note.date.split('T')[0];
  const updatedNotes = { ...notes };
  
  if (!updatedNotes[dateKey]) {
    updatedNotes[dateKey] = [];
  }
  
  updatedNotes[dateKey] = [...updatedNotes[dateKey], note];
  saveNotes(updatedNotes);
  
  return updatedNotes;
};

export const updateNote = (notes: Record<string, Note[]>, note: Note): Record<string, Note[]> => {
  const dateKey = note.date.split('T')[0];
  const updatedNotes = { ...notes };
  
  if (!updatedNotes[dateKey]) {
    return addNote(notes, note);
  }
  
  updatedNotes[dateKey] = updatedNotes[dateKey].map(n => n.id === note.id ? note : n);
  saveNotes(updatedNotes);
  
  return updatedNotes;
};

export const deleteNote = (notes: Record<string, Note[]>, noteId: string, dateKey: string): Record<string, Note[]> => {
  const updatedNotes = { ...notes };
  
  if (!updatedNotes[dateKey]) {
    return notes;
  }
  
  updatedNotes[dateKey] = updatedNotes[dateKey].filter(n => n.id !== noteId);
  
  if (updatedNotes[dateKey].length === 0) {
    delete updatedNotes[dateKey];
  }
  
  saveNotes(updatedNotes);
  
  return updatedNotes;
};

export const addReminder = (reminders: Record<string, Reminder[]>, reminder: Reminder): Record<string, Reminder[]> => {
  const dateKey = reminder.time.split('T')[0];
  const updatedReminders = { ...reminders };
  
  if (!updatedReminders[dateKey]) {
    updatedReminders[dateKey] = [];
  }
  
  updatedReminders[dateKey] = [...updatedReminders[dateKey], reminder];
  saveReminders(updatedReminders);
  
  return updatedReminders;
};

export const updateReminder = (reminders: Record<string, Reminder[]>, reminder: Reminder): Record<string, Reminder[]> => {
  const dateKey = reminder.time.split('T')[0];
  const updatedReminders = { ...reminders };
  
  if (!updatedReminders[dateKey]) {
    return addReminder(reminders, reminder);
  }
  
  updatedReminders[dateKey] = updatedReminders[dateKey].map(r => r.id === reminder.id ? reminder : r);
  saveReminders(updatedReminders);
  
  return updatedReminders;
};

export const deleteReminder = (reminders: Record<string, Reminder[]>, reminderId: string, dateKey: string): Record<string, Reminder[]> => {
  const updatedReminders = { ...reminders };
  
  if (!updatedReminders[dateKey]) {
    return reminders;
  }
  
  updatedReminders[dateKey] = updatedReminders[dateKey].filter(r => r.id !== reminderId);
  
  if (updatedReminders[dateKey].length === 0) {
    delete updatedReminders[dateKey];
  }
  
  saveReminders(updatedReminders);
  
  return updatedReminders;
};
