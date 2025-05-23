import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { exportCalendarData, importCalendarData } from '../utils/exportUtils';

interface ExportImportProps {
  notes: Record<string, any>;
  reminders: Record<string, any>;
  onImport: (notes: Record<string, any>, reminders: Record<string, any>) => void;
  onClose: () => void;
}

const ExportImport: React.FC<ExportImportProps> = ({
  notes,
  reminders,
  onImport,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = () => {
    exportCalendarData(notes, reminders);
    toast.success('Exportation réussie !');
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    importCalendarData(
      file,
      (importedNotes, importedReminders) => {
        onImport(importedNotes, importedReminders);
        toast.success('Importation réussie !');
        onClose();
      },
      (error) => {
        toast.error(`Erreur d'importation : ${error}`);
      }
    );
    
    // Réinitialiser l'input de fichier
    e.target.value = '';
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
            Exporter / Importer les données
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="mb-4 text-sm text-gray-600">
            Exportez vos données pour les sauvegarder ou les importer dans une autre instance de l'application.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              className="flex items-center justify-center rounded-md bg-primary-100 px-4 py-6 text-primary-700 transition-colors hover:bg-primary-200"
            >
              <div className="flex flex-col items-center">
                <Download className="mb-2 h-10 w-10" />
                <span className="font-medium">Exporter</span>
                <span className="text-xs">Télécharger en JSON</span>
              </div>
            </button>
            
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center rounded-md bg-primary-100 px-4 py-6 text-primary-700 transition-colors hover:bg-primary-200"
            >
              <div className="flex flex-col items-center">
                <Upload className="mb-2 h-10 w-10" />
                <span className="font-medium">Importer</span>
                <span className="text-xs">Charger un fichier JSON</span>
              </div>
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Note : L'importation remplacera toutes les données existantes.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExportImport;
