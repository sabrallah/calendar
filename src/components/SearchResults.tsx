import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import type { Note } from '../types/calendar';

interface SearchResultsProps {
  results: Note[];
  onNoteSelect: (note: Note) => void;
  searchQuery: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  onNoteSelect,
  searchQuery
}) => {
  // Highlight the search query in the text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} className="bg-yellow-200">{part}</span> 
        : part
    );
  };

  if (!searchQuery) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="p-4 bg-white shadow rounded mb-4">
        <p className="text-gray-600">
          Aucun résultat trouvé pour "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <h2 className="font-semibold text-lg mb-2">
        {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
      </h2>
      
      <div className="space-y-2">
        {results.map(note => (
          <motion.div
            key={note.id}
            whileHover={{ scale: 1.01 }}
            className="p-3 bg-white shadow rounded cursor-pointer flex flex-col hover:shadow-md transition-shadow"
            onClick={() => onNoteSelect(note)}
            style={{ borderLeft: `4px solid ${note.color || '#3b82f6'}` }}
          >
            <h3 className="font-medium">
              {highlightText(note.title, searchQuery)}
            </h3>
            
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {highlightText(note.content, searchQuery)}
            </p>
            
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>
                {format(new Date(note.date), 'EEEE d MMMM yyyy', { locale: fr })}
              </span>
              <span>
                {format(new Date(note.updatedAt), 'HH:mm')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchResults;
