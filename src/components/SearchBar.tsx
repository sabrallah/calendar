import React, { useState, useEffect } from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SortMode } from '../types/calendar';

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  sortMode: SortMode;
  onSortChange: (sortMode: SortMode) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  onSearch, 
  sortMode, 
  onSortChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleToggleExpand = () => {
    if (isExpanded && inputValue) {
      // Clear input if closing
      setInputValue('');
      onSearch('');
    }
    setIsExpanded(!isExpanded);
    setShowSortOptions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setInputValue('');
    onSearch('');
  };

  const handleToggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  const handleSortChange = (newSortMode: SortMode) => {
    onSortChange(newSortMode);
    setShowSortOptions(false);
  };

  const getSortLabel = (mode: SortMode): string => {
    switch (mode) {
      case 'title':
        return 'Titre';
      case 'createdAt':
        return 'Date de création';
      case 'updatedAt':
        return 'Date de modification';
      case 'none':
        return 'Aucun tri';
      default:
        return 'Trier par';
    }
  };

  return (
    <div className="relative flex items-center mb-4">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex"
          >
            <input
              type="text"
              placeholder="Rechercher des notes..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
            {inputValue && (
              <button
                onClick={handleClearSearch}
                className="bg-gray-200 px-2 flex items-center justify-center hover:bg-gray-300"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
            >
              Rechercher
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex ml-2">
        <button
          onClick={handleToggleExpand}
          className={`p-2 rounded ${isExpanded ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          aria-label={isExpanded ? 'Fermer la recherche' : 'Ouvrir la recherche'}
        >
          {isExpanded ? <X size={20} /> : <Search size={20} />}
        </button>

        <div className="relative ml-2">
          <button
            onClick={handleToggleSortOptions}
            className={`p-2 rounded flex items-center ${
              sortMode !== 'none' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label="Options de tri"
          >
            <ArrowUpDown size={20} />
          </button>

          {showSortOptions && (
            <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded z-50 w-48">
              <div className="py-1">
                <button
                  onClick={() => handleSortChange('title')}
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                    sortMode === 'title' ? 'bg-blue-100' : ''
                  }`}
                >
                  Trier par titre
                </button>
                <button
                  onClick={() => handleSortChange('updatedAt')}
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                    sortMode === 'updatedAt' ? 'bg-blue-100' : ''
                  }`}
                >
                  Dernière modification
                </button>
                <button
                  onClick={() => handleSortChange('createdAt')}
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                    sortMode === 'createdAt' ? 'bg-blue-100' : ''
                  }`}
                >
                  Date de création
                </button>
                <button
                  onClick={() => handleSortChange('none')}
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                    sortMode === 'none' ? 'bg-blue-100' : ''
                  }`}
                >
                  Aucun tri
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {sortMode !== 'none' && !isExpanded && (
        <div className="ml-2 text-sm text-gray-600 hidden sm:block">
          Trié par: {getSortLabel(sortMode)}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
