import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash, Clock, Mail, X } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import type { Note, Reminder } from '../types/calendar';

interface NoteDetailProps {
  note: Note;
  reminders: Reminder[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const NoteDetail: React.FC<NoteDetailProps> = ({
  note,
  reminders,
  onEdit,
  onDelete,
  onClose
}) => {
  const { title, content, color, createdAt, updatedAt } = note;
  
  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      onDelete();
    }
  };
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: `${color}20` }}
        >
          <h3 className="text-lg font-medium" style={{ color }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4 whitespace-pre-wrap text-gray-700">
            {content || <em className="text-gray-400">Aucun contenu</em>}
          </div>
          
          {reminders.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Rappels programmés:</h4>
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                  >
                    {reminder.type === 'local' ? (
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4 text-amber-500" />
                    )}
                    <span>
                      {formatDate(reminder.time, 'dd MMM yyyy à HH:mm')}
                      {reminder.type === 'email' && reminder.email && (
                        <span className="ml-1 text-xs text-gray-500">
                          ({reminder.email})
                        </span>
                      )}
                    </span>
                    <span className="ml-2 text-xs">
                      {reminder.status === 'pending' ? (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800">
                          En attente
                        </span>
                      ) : reminder.status === 'sent' ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-800">
                          Envoyé
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-800">
                          Échoué
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-4 text-xs text-gray-500">
            <div>Créé le {formatDate(createdAt, 'dd MMMM yyyy à HH:mm')}</div>
            {createdAt !== updatedAt && (
              <div>Modifié le {formatDate(updatedAt, 'dd MMMM yyyy à HH:mm')}</div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleDelete}
              className="btn btn-danger flex items-center"
            >
              <Trash className="mr-1 h-4 w-4" />
              Supprimer
            </button>
            <button
              onClick={onEdit}
              className="btn btn-primary flex items-center"
            >
              <Edit className="mr-1 h-4 w-4" />
              Modifier
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NoteDetail;
