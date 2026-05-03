import React, { useState } from 'react';
import { MessageCircle, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatBot from './ChatBot';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[550px] shadow-2xl rounded-3xl overflow-hidden border border-gray-200"
          >
            <ChatBot />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-primary-600 text-white rotate-0'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative">
            <MessageCircle className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-primary-600 rounded-full animate-pulse"></span>
          </div>
        )}
      </button>

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
