import React from 'react';
import { Clock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CalendarDay } from '../types/calendar';

interface CalendarDayProps {
  day: CalendarDay;
  onSelectDay: (date: Date) => void;
}

const CalendarDayComponent: React.FC<CalendarDayProps> = ({ day, onSelectDay }) => {
  const { date, isCurrentMonth, isToday, isSelected, dayNumber, notes, reminders } = day;
  
  const hasNotes = notes.length > 0;
  const hasReminders = reminders.length > 0;
  
  const maxNotesToShow = 2;
  const hasMoreNotes = notes.length > maxNotesToShow;
  
  const handleClick = () => {
    onSelectDay(date);
  };
  
  return (
    <motion.div
      className={`calendar-day ${isToday ? 'calendar-day-current' : ''} ${
        isSelected ? 'border-primary-500 ring-2 ring-primary-200' : ''
      } ${!isCurrentMonth ? 'opacity-40' : ''}`}
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${isToday ? 'rounded-full bg-primary-500 px-1.5 py-0.5 text-white' : ''}`}>
          {dayNumber}
        </span>
        {hasReminders && (
          <div className="flex items-center space-x-1 text-xs">
            {reminders.some(r => r.type === 'local') && (
              <Clock className="h-3 w-3 text-amber-500" />
            )}
            {reminders.some(r => r.type === 'email') && (
              <Mail className="h-3 w-3 text-amber-500" />
            )}
          </div>
        )}
      </div>
      
      {hasNotes && (
        <div className="mt-1 space-y-1">
          {notes.slice(0, maxNotesToShow).map(note => (
            <div 
              key={note.id} 
              className="note"
              style={{ backgroundColor: `${note.color}20`, color: note.color }}
            >
              {note.title}
            </div>
          ))}
          
          {hasMoreNotes && (
            <div className="text-center text-xs text-gray-500">
              +{notes.length - maxNotesToShow} plus
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CalendarDayComponent;
