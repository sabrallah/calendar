import type { Reminder } from '../types/calendar';

// Vérifier si les notifications sont supportées par le navigateur
export const areNotificationsSupported = (): boolean => {
  return 'Notification' in window;
};

// Demander la permission pour les notifications
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!areNotificationsSupported()) {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Envoyer une notification locale
export const sendLocalNotification = (title: string, options?: NotificationOptions): boolean => {
  if (!areNotificationsSupported()) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    new Notification(title, options);
    return true;  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    return false;
  }
};

// Programmation des rappels de notification
let notificationTimers: Record<string, ReturnType<typeof setTimeout>> = {};

// Planifier les rappels pour les notifications
export const scheduleReminders = (reminders: Record<string, Reminder[]>): void => {
  // Annuler les rappels existants
  Object.values(notificationTimers).forEach(timer => clearTimeout(timer));
  notificationTimers = {};

  const now = new Date();
  
  // Parcourir tous les rappels et les planifier
  Object.values(reminders).forEach(dailyReminders => {
    dailyReminders.forEach(reminder => {
      if (reminder.status === 'pending' && reminder.type === 'local') {
        const reminderTime = new Date(reminder.time);
        
        // Ne planifier que les rappels futurs
        if (reminderTime > now) {
          const timeUntilReminder = reminderTime.getTime() - now.getTime();
          
          notificationTimers[reminder.id] = setTimeout(() => {
            // Envoyer la notification
            sendLocalNotification('Rappel de calendrier', {
              body: `Vous avez une note programmée pour maintenant.`,
              icon: '/calendar.svg'
            });
            
            // Mettre à jour le statut du rappel comme "envoyé"
            const event = new CustomEvent('reminderSent', { detail: reminder.id });
            window.dispatchEvent(event);
          }, timeUntilReminder);
        }
      }
    });
  });
};

// Simuler l'envoi d'un e-mail (remplacez par une vraie API en production)
export const sendEmailReminder = async (reminder: Reminder, noteTitle: string): Promise<boolean> => {
  // Simulation d'un appel API
  console.log(`Email de rappel envoyé à ${reminder.email} pour la note: ${noteTitle}`);
  
  // En production, vous appelleriez une API réelle ici
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
