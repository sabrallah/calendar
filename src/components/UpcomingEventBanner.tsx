import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, Calendar, ChevronRight } from 'lucide-react';

interface UpcomingEventBannerProps {
  event: {
    title: string;
    date: Date;
    content: string;
  } | null;
}

const UpcomingEventBanner: React.FC<UpcomingEventBannerProps> = ({ event }) => {
  if (!event) return null;

  const formattedDate = format(event.date, 'EEEE d MMMM', { locale: fr });
  const formattedTime = format(event.date, 'HH:mm');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg p-4 shadow-lg mb-6"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold mb-2"
            >
              Prochain événement
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-1"
            >
              <Calendar className="w-4 h-4" />
              <span className="capitalize">{formattedDate}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>{formattedTime}</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex-1"
          >
            <h4 className="text-lg font-semibold mb-2">{event.title}</h4>
            <p className="text-white/90">{event.content}</p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full 
                     transition-colors duration-200 text-sm font-medium backdrop-blur-sm"
          >
            Voir les détails
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpcomingEventBanner;