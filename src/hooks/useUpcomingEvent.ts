import { useState, useEffect } from 'react';
import { isAfter, isBefore, addMinutes } from 'date-fns';
import type { Note } from '../types/calendar';

interface UpcomingEvent {
  title: string;
  date: Date;
  content: string;
}

export const useUpcomingEvent = (notes: Record<string, Note[]>) => {
  const [upcomingEvent, setUpcomingEvent] = useState<UpcomingEvent | null>(null);

  useEffect(() => {
    const findNextEvent = () => {
      const now = new Date();
      let nextEvent: UpcomingEvent | null = null;
      let nearestDate: Date | null = null;      // Parcourir toutes les notes pour trouver le prochain événement
      Object.entries(notes).forEach(([, dailyNotes]) => {
        dailyNotes.forEach((note) => {
          const eventDate = new Date(note.date);
          
          // Vérifier si l'événement est à venir (dans les prochaines 24h)
          if (isAfter(eventDate, now) && isBefore(eventDate, addMinutes(now, 1440))) {
            if (!nearestDate || isBefore(eventDate, nearestDate)) {
              nearestDate = eventDate;
              nextEvent = {
                title: note.title,
                date: eventDate,
                content: note.content,
              };
            }
          }
        });
      });

      setUpcomingEvent(nextEvent);
    };

    // Trouver le prochain événement immédiatement
    findNextEvent();

    // Mettre à jour toutes les minutes
    const interval = setInterval(findNextEvent, 60000);

    return () => clearInterval(interval);
  }, [notes]);

  return upcomingEvent;
};

export default useUpcomingEvent;