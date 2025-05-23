import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO, 
  addMonths, 
  addWeeks, 
  subMonths, 
  subWeeks 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import type { CalendarDay, Note, Reminder } from '../types/calendar';

// Formatter une date selon le format voulu
export const formatDate = (date: Date | string, formatString: string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: fr });
};

// Générer un ID unique
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Obtenir les jours du mois pour l'affichage du calendrier
export const getCalendarDays = (
  currentDate: Date, 
  notes: Record<string, Note[]>,
  reminders: Record<string, Reminder[]>,
  selectedDate: Date | null
): CalendarDay[] => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const today = new Date();
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    return {
      date,
      isCurrentMonth: isSameMonth(date, currentDate),
      isToday: isSameDay(date, today),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      dayNumber: date.getDate(),
      notes: notes[dateStr] || [],
      reminders: reminders[dateStr] || []
    };
  });
};

// Obtenir les jours de la semaine formatés en français
export const getWeekDays = (): string[] => {
  const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(weekStartDate);
    date.setDate(weekStartDate.getDate() + index);
    return format(date, 'EEEE', { locale: fr });
  });
};

// Naviguer entre les mois/semaines
export const navigateCalendar = (
  currentDate: Date, 
  direction: 'next' | 'prev', 
  viewMode: 'month' | 'week'
): Date => {
  if (viewMode === 'month') {
    return direction === 'next' 
      ? addMonths(currentDate, 1) 
      : subMonths(currentDate, 1);
  } else {
    return direction === 'next' 
      ? addWeeks(currentDate, 1) 
      : subWeeks(currentDate, 1);
  }
};

// Formater la date pour l'en-tête du calendrier
export const formatCalendarHeader = (date: Date, viewMode: 'month' | 'week' | 'day'): string => {
  if (viewMode === 'month') {
    return format(date, 'MMMM yyyy', { locale: fr });
  } else if (viewMode === 'week') {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    
    if (isSameMonth(weekStart, weekEnd)) {
      return `${format(weekStart, 'd')} - ${format(weekEnd, 'd MMMM yyyy', { locale: fr })}`;
    } else {
      return `${format(weekStart, 'd MMMM', { locale: fr })} - ${format(weekEnd, 'd MMMM yyyy', { locale: fr })}`;
    }
  } else {
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  }
};
