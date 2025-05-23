import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Mail } from 'lucide-react';
import { format } from 'date-fns';

import type { Note, Reminder } from '../types/calendar';
import { formatDate } from '../utils/dateUtils';

interface NoteFormProps {
  initialNote?: Note;
  selectedDate: Date;
  onSave: (title: string, content: string, date: Date, color?: string) => Note;
  onUpdate: (noteId: string, updates: Partial<Note>, dateKey: string) => void;
  onClose: () => void;
  onAddReminder: (noteId: string, noteTitle: string, type: 'local' | 'email', time: Date, email?: string) => void;
  reminders: Reminder[];
  onDeleteReminder: (reminderId: string, dateKey: string) => void;
}

const COLORS = [
  { value: '#3b82f6', label: 'Bleu' },
  { value: '#ef4444', label: 'Rouge' },
  { value: '#10b981', label: 'Vert' },
  { value: '#f59e0b', label: 'Jaune' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ec4899', label: 'Rose' },
];

const NoteForm: React.FC<NoteFormProps> = ({ 
  initialNote, 
  selectedDate, 
  onSave, 
  onUpdate, 
  onClose,
  onAddReminder,
  reminders = [],
  onDeleteReminder
}) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [color, setColor] = useState(initialNote?.color || COLORS[0].value);
  
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderType, setReminderType] = useState<'local' | 'email'>('local');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderEmail, setReminderEmail] = useState('');
  
  const isEditMode = !!initialNote;
  
  useEffect(() => {
    if (selectedDate) {
      // Définir l'heure par défaut à maintenant pour un nouveau rappel
      const now = new Date();
      setReminderTime(format(now, 'yyyy-MM-dd\'T\'HH:mm'));
    }
  }, [selectedDate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() === '') {
      return;
    }
    
    if (isEditMode && initialNote) {
      onUpdate(initialNote.id, { title, content, color }, initialNote.date);
    } else {
      onSave(title, content, selectedDate, color);
    }
    
    onClose();
  };
  
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reminderTime) return;
    
    const reminderDate = new Date(reminderTime);
    
    if (isEditMode && initialNote) {
      onAddReminder(
        initialNote.id,
        initialNote.title,
        reminderType,
        reminderDate,
        reminderType === 'email' ? reminderEmail : undefined
      );
    }
    
    // Réinitialiser le formulaire
    setShowReminderForm(false);
    setReminderType('local');
    setReminderEmail('');
    
    // Définir l'heure par défaut pour le prochain rappel
    const now = new Date();
    setReminderTime(format(now, 'yyyy-MM-dd\'T\'HH:mm'));
  };
  
  const handleDeleteReminder = (reminder: Reminder) => {
    const dateKey = reminder.time.split('T')[0];
    onDeleteReminder(reminder.id, dateKey);
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
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h3 className="text-lg font-medium">
            {isEditMode ? 'Modifier la note' : 'Ajouter une note'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full"
              placeholder="Titre de la note"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
              Contenu
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input w-full"
              rows={4}
              placeholder="Contenu de la note"
            />
          </div>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Couleur
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((colorOption) => (
                <div
                  key={colorOption.value}
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                    color === colorOption.value ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  onClick={() => setColor(colorOption.value)}
                  title={colorOption.label}
                >
                  {color === colorOption.value && (
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {isEditMode && (
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Rappels</h4>
                <button
                  type="button"
                  className="text-xs text-primary-600"
                  onClick={() => setShowReminderForm(!showReminderForm)}
                >
                  {showReminderForm ? 'Cacher' : 'Ajouter un rappel'}
                </button>
              </div>
              
              {reminders.length > 0 && (
                <div className="mt-2 space-y-2">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                    >
                      <div className="flex items-center">
                        {reminder.type === 'local' ? (
                          <Clock className="mr-2 h-4 w-4 text-amber-500" />
                        ) : (
                          <Mail className="mr-2 h-4 w-4 text-amber-500" />
                        )}
                        <span>
                          {formatDate(reminder.time, 'dd MMM yyyy à HH:mm')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteReminder(reminder)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {showReminderForm && (
                <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                  <form onSubmit={handleAddReminder}>
                    <div className="mb-3">
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Type de rappel
                      </label>
                      <div className="flex space-x-2">
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            checked={reminderType === 'local'}
                            onChange={() => setReminderType('local')}
                            className="text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-sm">Notification locale</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            checked={reminderType === 'email'}
                            onChange={() => setReminderType('email')}
                            className="text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-sm">Email</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Date et heure
                      </label>
                      <input
                        type="datetime-local"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="input w-full text-sm"
                        required
                      />
                    </div>
                    
                    {reminderType === 'email' && (
                      <div className="mb-3">
                        <label className="mb-1 block text-xs font-medium text-gray-700">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          value={reminderEmail}
                          onChange={(e) => setReminderEmail(e.target.value)}
                          className="input w-full text-sm"
                          placeholder="email@exemple.com"
                          required={reminderType === 'email'}
                        />
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      className="w-full rounded-md bg-primary-500 py-1 text-sm text-white hover:bg-primary-600"
                    >
                      Ajouter ce rappel
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim()}
            >
              {isEditMode ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NoteForm;
