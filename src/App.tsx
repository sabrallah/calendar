import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Download } from 'lucide-react';

import Calendar from './components/Calendar';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import NoteDetail from './components/NoteDetail';
import WelcomeMessage from './components/WelcomeMessage';
import ExportImport from './components/ExportImport';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import UpcomingEventBanner from './components/UpcomingEventBanner';
import useCalendar from './hooks/useCalendar';
import useUpcomingEvent from './hooks/useUpcomingEvent';
import type { Note, SortMode } from './types/calendar';

const App: React.FC = () => {
  const {
    state,
    changeCurrentDate,
    changeViewMode,
    selectDate,
    createNote,
    updateNoteData,
    removeNote,
    createReminder,
    removeReminder,
    getNotesForDate,
    getRemindersForDate,
    getRemindersForNote,
    setState,
    updateSortMode,
    updateSearchQuery,
    searchAllNotes
  } = useCalendar();

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isViewingNote, setIsViewingNote] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);

  // Hook pour les événements à venir
  const upcomingEvent = useUpcomingEvent(state.notes);

  // Handler pour ajouter une note
  const handleAddNote = () => {
    if (!state.selectedDate) return;
    setSelectedNote(null);
    setShowNoteForm(true);
  };

  // Handler pour voir une note
  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setIsViewingNote(true);
  };

  // Handler pour éditer une note
  const handleEditNote = () => {
    setIsViewingNote(false);
    setShowNoteForm(true);
  };

  // Handler pour supprimer une note
  const handleDeleteNote = () => {
    if (!selectedNote) return;
    
    const dateKey = selectedNote.date;
    removeNote(selectedNote.id, dateKey);
    setSelectedNote(null);
    setIsViewingNote(false);
  };

  // Handler pour fermer tous les modaux
  const handleCloseModal = () => {
    setShowNoteForm(false);
    setIsViewingNote(false);
  };

  // Handler pour changer le mode de tri
  const handleSortChange = (sortMode: SortMode) => {
    updateSortMode(sortMode);
  };

  // Handler pour la recherche
  const handleSearch = (query: string) => {
    updateSearchQuery(query);
  };

  // Handler pour sélectionner une note depuis les résultats de recherche
  const handleSearchResultSelect = (note: Note) => {
    // Sélectionner la date de la note
    const noteDate = new Date(note.date);
    changeCurrentDate(noteDate);
    selectDate(noteDate);
    
    // Ouvrir les détails de la note
    setSelectedNote(note);
    setIsViewingNote(true);
  };

  // Récupérer les notes et rappels pour la date sélectionnée
  const notesForSelectedDate = state.selectedDate 
    ? getNotesForDate(state.selectedDate) 
    : [];
  
  const remindersForSelectedDate = state.selectedDate 
    ? getRemindersForDate(state.selectedDate) 
    : [];
  
  // Récupérer les rappels pour la note sélectionnée
  const remindersForSelectedNote = selectedNote
    ? getRemindersForNote(selectedNote.id)
    : [];

  // Obtenir les résultats de recherche
  const searchResults = searchAllNotes();

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <Toaster position="top-right" />
      
      <main className="mx-auto max-w-6xl">
        <header className="mb-6 text-center">
          <motion.h1 
            className="mb-2 text-3xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Calendrier Moderne
          </motion.h1>
          <div className="flex items-center justify-center space-x-2">
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Gérez vos notes et rappels de manière simple et efficace
            </motion.p>
            <motion.button
              className="flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowExportImport(true)}
            >
              <Download className="mr-1 h-3 w-3" />
              Exporter/Importer
            </motion.button>
          </div>
        </header>        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <SearchBar 
            searchQuery={state.searchQuery}
            onSearch={handleSearch}
            sortMode={state.sortMode}
            onSortChange={handleSortChange}
          />
        </motion.div>

        {/* Bannière d'événement à venir */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <UpcomingEventBanner event={upcomingEvent} />
        </motion.div>

        {state.searchQuery && (
          <SearchResults
            results={searchResults}
            onNoteSelect={handleSearchResultSelect}
            searchQuery={state.searchQuery}
          />
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Calendar
                currentDate={state.currentDate}
                viewMode={state.viewMode}
                notes={state.notes}
                reminders={state.reminders}
                selectedDate={state.selectedDate}
                onNavigate={changeCurrentDate}
                onSelectDate={selectDate}
                onChangeViewMode={changeViewMode}
              />
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            {state.selectedDate && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <NoteList
                  date={state.selectedDate}
                  notes={notesForSelectedDate}
                  reminders={remindersForSelectedDate}
                  onAddNote={handleAddNote}
                  onViewNote={handleViewNote}
                />
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Modaux */}
      {showNoteForm && state.selectedDate && (
        <NoteForm
          initialNote={selectedNote || undefined}
          selectedDate={state.selectedDate}
          onSave={createNote}
          onUpdate={updateNoteData}
          onClose={handleCloseModal}
          onAddReminder={createReminder}
          reminders={remindersForSelectedNote}
          onDeleteReminder={removeReminder}
        />
      )}      
      {isViewingNote && selectedNote && (
        <NoteDetail
          note={selectedNote}
          reminders={remindersForSelectedNote}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          onClose={handleCloseModal}
        />
      )}
      
      {showExportImport && (
        <ExportImport
          notes={state.notes}
          reminders={state.reminders}
          onImport={(notes, reminders) => {
            setState(prev => ({ ...prev, notes, reminders }));
          }}
          onClose={() => setShowExportImport(false)}
        />
      )}
      
      {/* Message de bienvenue */}
      <WelcomeMessage />
    </div>
  );
};

export default App;
