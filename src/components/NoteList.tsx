import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Clock } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import type { Note, Reminder } from '../types/calendar';

interface NoteListProps {
  date: Date;
  notes: Note[];
  reminders: Reminder[];
  onAddNote: () => void;
  onViewNote: (note: Note) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  date,
  notes,
  reminders,
  onAddNote,
  onViewNote
}) => {
  const hasNotes = notes.length > 0;
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Notes du {formatDate(date, 'EEEE d MMMM yyyy')}
        </h3>
        <button
          onClick={onAddNote}
          className="btn btn-primary flex items-center"
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          Ajouter une note
        </button>
      </div>
      
      {hasNotes ? (
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {notes.map((note) => {
            const noteReminders = reminders.filter(r => r.noteId === note.id);
            const hasReminders = noteReminders.length > 0;
            
            return (
              <motion.div
                key={note.id}
                className="cursor-pointer overflow-hidden rounded-md border border-gray-200 transition-all hover:border-primary-300 hover:shadow-md"
                style={{ borderLeftColor: note.color, borderLeftWidth: '4px' }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onViewNote(note)}
              >
                <div className="px-4 py-3">
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="font-medium">{note.title}</h4>
                    {hasReminders && (
                      <div className="flex items-center text-xs text-amber-600">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{noteReminders.length}</span>
                      </div>
                    )}
                  </div>
                  
                  {note.content && (
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {note.content}
                    </p>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {formatDate(note.updatedAt, 'HH:mm')}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-200 py-8 text-center">
          <Clock className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-gray-500">Aucune note pour ce jour</p>
          <p className="text-sm text-gray-400">
            Cliquez sur "Ajouter une note" pour commencer
          </p>
        </div>
      )}
    </div>
  );
};

export default NoteList;
