import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarDay from './CalendarDay';
import { 
  getCalendarDays, 
  getWeekDays, 
  navigateCalendar, 
  formatCalendarHeader 
} from '../utils/dateUtils';
import type { ViewMode } from '../types/calendar';

interface CalendarProps {
  currentDate: Date;
  viewMode: ViewMode;
  notes: Record<string, any>;
  reminders: Record<string, any>;
  selectedDate: Date | null;
  onNavigate: (date: Date) => void;
  onSelectDate: (date: Date) => void;
  onChangeViewMode: (mode: ViewMode) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  viewMode,
  notes,
  reminders,
  selectedDate,
  onNavigate,
  onSelectDate,
  onChangeViewMode
}) => {
  const weekDays = getWeekDays();
  const calendarDays = getCalendarDays(currentDate, notes, reminders, selectedDate);
  
  const handlePrevious = () => {
    onNavigate(navigateCalendar(currentDate, 'prev', viewMode === 'day' ? 'week' : viewMode));
  };
  
  const handleNext = () => {
    onNavigate(navigateCalendar(currentDate, 'next', viewMode === 'day' ? 'week' : viewMode));
  };
  
  const handleToday = () => {
    onNavigate(new Date());
  };
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <motion.h2 
          className="text-xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={formatCalendarHeader(currentDate, viewMode)}
        >
          {formatCalendarHeader(currentDate, viewMode)}
        </motion.h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleToday}
            className="btn btn-ghost rounded-md px-2 py-1 text-sm"
          >
            Aujourd'hui
          </button>
          
          <div className="flex items-center rounded-md border border-gray-200">
            <button 
              onClick={handlePrevious}
              className="btn btn-ghost rounded-l-md px-2 py-1"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={handleNext}
              className="btn btn-ghost rounded-r-md px-2 py-1"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center rounded-md border border-gray-200">
            <button
              onClick={() => onChangeViewMode('month')}
              className={`rounded-l-md px-3 py-1 text-sm ${
                viewMode === 'month' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => onChangeViewMode('week')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'week' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => onChangeViewMode('day')}
              className={`rounded-r-md px-3 py-1 text-sm ${
                viewMode === 'day' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'
              }`}
            >
              Jour
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7">
        {weekDays.map((day, index) => (
          <div key={index} className="calendar-day-header capitalize">
            {viewMode === 'month' ? day.slice(0, 3) : day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <CalendarDay 
            key={`${day.date.toISOString()}-${index}`} 
            day={day} 
            onSelectDay={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
