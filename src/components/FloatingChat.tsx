import React, { useState } from 'react';
import { X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatBot from './ChatBot';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile to handle the "merging" issue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-4 w-[calc(100vw-2rem)] sm:w-[400px] h-[60vh] sm:h-[550px] max-h-[700px] shadow-2xl rounded-3xl overflow-hidden border border-gray-100 bg-white"
            >
              <ChatBot />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-[10000] ${
            isOpen ? 'bg-gray-900 text-white shadow-primary-200' : 'bg-primary-600 text-white shadow-primary-200'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : (
            <div className="relative">
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-primary-600 rounded-full animate-pulse"></span>
            </div>
          )}
        </button>
      </div>

      {/* Suggestion Tooltip (Desktop only) */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-16 right-0 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100 hidden md:flex items-center gap-2 whitespace-nowrap mb-2 mr-2"
        >
          <Bot className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-gray-700 italic">Need help planning your trip?</span>
        </motion.div>
      )}
    </div>
  );
}
