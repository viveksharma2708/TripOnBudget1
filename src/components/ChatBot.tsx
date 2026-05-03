import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Trash2, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAI } from '../services/geminiService';
import { usePackages } from '../context/PackageContext';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
};

export default function ChatBot({ inline = false }: { inline?: boolean }) {
  const { packages } = usePackages();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome',
      role: 'model', 
      text: 'Hi! I am your TripOnBudget assistant. How can I help you plan your next adventure today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const finalInput = textOverride || input;
    if (!finalInput.trim() || isLoading) return;

    const userMessage = finalInput.trim();
    if (!textOverride) setInput('');
    
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    // Format history for Gemini API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const aiResponse = await chatWithAI(userMessage, packages, history);
    
    const newAiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponse || 'I am sorry, I am unable to respond at the moment.',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newAiMsg]);
    setIsLoading(false);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const clearChat = () => {
    if (messages.length <= 1) return;
    if (window.confirm('Are you sure you want to clear your conversation history? This cannot be undone.')) {
      setMessages([{ 
        id: 'welcome',
        role: 'model', 
        text: 'Hi! I am your TripOnBudget assistant. How can I help you plan your next adventure today?',
        timestamp: new Date()
      }]);
    }
  };

  const suggestions = [
    "What are the best domestic packages?",
    "Show me adventure trips",
    "Weekend getaway options",
    "How do I book a trip?"
  ];

  return (
    <div className={`flex flex-col bg-white overflow-hidden shadow-2xl ${inline ? 'h-[600px] rounded-3xl border border-gray-100' : 'h-full'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold tracking-tight">TripOnBudget Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
              <p className="text-[10px] text-white/80 uppercase font-black tracking-widest">Online</p>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-95 text-[10px] font-bold uppercase tracking-wider"
          title="Clear Chat History"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Reset Context</span>
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-slate-50/50"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              className={`flex group ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-white text-gray-600 border border-gray-100'
                }`}>
                  {m.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 group-hover:flex">
                    <div className={`relative p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                      m.role === 'user' 
                        ? 'bg-primary-600 text-white rounded-tr-none hover:bg-primary-700' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none hover:border-primary-200'
                    }`}>
                      {m.text}
                      
                      {m.role === 'user' && (
                        <button 
                          onClick={() => deleteMessage(m.id)}
                          className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-sm border border-gray-100"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] text-gray-400 px-1 font-medium ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 text-gray-600 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length < 3 && !isLoading && (
        <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar bg-slate-50/30">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(undefined, s)}
              className="whitespace-nowrap px-4 py-2 bg-white border border-primary-100 text-primary-700 text-xs font-semibold rounded-full hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3 h-3 text-primary-500" />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-5 bg-white border-t border-gray-100 flex gap-3 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-5 py-3.5 bg-gray-100/80 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary-600 text-white p-3.5 rounded-2xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_8px_16px_rgba(37,99,235,0.2)] active:scale-95 group"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          )}
        </button>
      </form>
    </div>
  );
}
