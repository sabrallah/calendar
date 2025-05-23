import { saveAs } from 'file-saver';
import type { Note, Reminder } from '../types/calendar';

// Fonction pour exporter les notes et rappels au format JSON
export const exportCalendarData = (notes: Record<string, Note[]>, reminders: Record<string, Reminder[]>): void => {
  const exportData = {
    notes,
    reminders,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  saveAs(blob, `calendrier-export-${new Date().toISOString().split('T')[0]}.json`);
};

// Fonction pour importer des données de calendrier à partir d'un fichier JSON
export const importCalendarData = (
  file: File,
  onSuccess: (notes: Record<string, Note[]>, reminders: Record<string, Reminder[]>) => void,
  onError: (error: string) => void
): void => {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    try {
      if (!event.target || !event.target.result) {
        throw new Error('Échec de la lecture du fichier');
      }
      
      const jsonData = JSON.parse(event.target.result as string);
      
      // Vérifier que les données importées ont le bon format
      if (!jsonData.notes || !jsonData.reminders) {
        throw new Error('Format de fichier invalide');
      }
      
      onSuccess(jsonData.notes, jsonData.reminders);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erreur inconnue lors de l\'importation');
    }
  };
  
  reader.onerror = () => {
    onError('Erreur lors de la lecture du fichier');
  };
  
  reader.readAsText(file);
};
