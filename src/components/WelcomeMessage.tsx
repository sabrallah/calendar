import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

// Composant qui affiche un message de bienvenue pour les utilisateurs la première fois qu'ils visitent le site
const WelcomeMessage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    // Vérifier si le message a déjà été vu
    const hasSeenWelcome = localStorage.getItem('has_seen_welcome');
    return !hasSeenWelcome;
  });

  const handleDismiss = () => {
    // Enregistrer que l'utilisateur a vu le message
    localStorage.setItem('has_seen_welcome', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 max-w-md rounded-lg bg-white p-4 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-primary-500" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="mb-2 text-base font-medium">Bienvenue dans Calendrier Moderne !</h3>
              <p className="text-sm text-gray-600">
                Pour commencer, sélectionnez une date dans le calendrier et ajoutez une note.
                Vous pouvez également ajouter des rappels à vos notes pour être sûr de ne rien oublier.
              </p>
              <div className="mt-3 space-x-2">
                <button
                  type="button"
                  className="rounded-md border border-primary-500 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
                  onClick={handleDismiss}
                >
                  Compris !
                </button>
              </div>
            </div>
            <button
              type="button"
              className="ml-2 inline-flex rounded-md p-1.5 text-gray-400 hover:bg-gray-100"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeMessage;
