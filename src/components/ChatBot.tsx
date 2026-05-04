import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Trash2, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
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
      text: 'Hi! I am your TripOnBudget assistant. I can help you find domestic packages, adventure trips, or spiritual journeys. What are you looking for today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
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

    try {
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
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Sorry, I encountered an error. Please check your connection or try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const clearChat = () => {
    if (messages.length <= 1) return;
    if (window.confirm('Clear conversation history?')) {
      setMessages([{ 
        id: 'welcome',
        role: 'model', 
        text: 'Hi! I am your TripOnBudget assistant. How can I help you plan your next adventure today?',
        timestamp: new Date()
      }]);
    }
  };

  const suggestions = [
    "Best domestic packages",
    "Adventure trips",
    "Weekend getaways",
    "Budget friendly tours"
  ];

  return (
    <div className={`flex flex-col bg-white overflow-hidden shadow-2xl ${inline ? 'h-[600px] rounded-3xl border border-gray-100' : 'h-full'}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-none mb-1">TripOnBudget Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Expert Concierge</p>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
          title="Reset Chat"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/30"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === 'user' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-400 border border-gray-100'
                }`}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className={`relative p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
                    m.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1 prose-headings:my-2 prose-ul:my-2 prose-li:my-0.5">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className={m.role === 'user' ? 'text-white' : 'text-gray-800'}>{children}</p>,
                          li: ({ children }) => <li className={m.role === 'user' ? 'text-white' : 'text-gray-800'}>{children}</li>,
                          strong: ({ children }) => <strong className={m.role === 'user' ? 'text-white font-bold' : 'text-primary-700 font-bold'}>{children}</strong>,
                          a: ({ href, children }) => <a href={href} className={m.role === 'user' ? 'text-white underline' : 'text-primary-600 underline'} target="_blank" rel="noopener noreferrer">{children}</a>
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <span className={`text-[9px] text-gray-400 px-1 font-medium ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 text-gray-300 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length < 3 && !isLoading && (
        <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-50 bg-white">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(undefined, s)}
              className="whitespace-nowrap px-4 py-2 bg-primary-50 text-primary-700 text-[11px] font-bold rounded-xl hover:bg-primary-100 transition-all shadow-sm flex items-center gap-1.5 shrink-0 border border-primary-100"
            >
              <Sparkles className="w-3 h-3" />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Plan your next trip..."
            className="w-full pl-5 pr-14 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2.5 rounded-xl hover:bg-primary-700 disabled:bg-gray-200 transition-all shadow-lg shadow-primary-200 active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
          Powered by Gemini AI • Professional Trip Planning
        </p>
      </div>
    </div>
  );
}
