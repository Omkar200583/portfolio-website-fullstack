// ═══════════════════════════════════════════════════════════════
//  CHAT BOT (Simple) — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Omkar's AI Assistant. Ask me about his projects or skills.", sender: 'bot' }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now()+1, text: "I can help you navigate the portfolio. What are you interested in?", sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#0A0A0A] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-110 transition-transform cursor-pointer"
      >
        {isOpen ? <X /> : <MessageSquare />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 h-96 bg-[#0A0A0A] border border-[#D4AF37]/15 rounded-xl flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 bg-[#171717] border-b border-[#D4AF37]/10 flex items-center gap-2">
              <Bot className="text-[#D4AF37]" />
              <span className="font-bold text-[#FFFFFF]">AI Assistant</span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    msg.sender === 'user' ? 'bg-[#D4AF37] text-[#0A0A0A] font-medium' : 'bg-[#171717] text-[#A3A3A3] border border-[#D4AF37]/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-[#171717] border-t border-[#D4AF37]/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-[#0A0A0A] border border-[#D4AF37]/12 rounded px-3 py-1 text-[#FFFFFF] text-sm focus:outline-none focus:border-[#D4AF37]/40 placeholder-[#666666] transition-colors"
                placeholder="Type here..."
              />
              <button type="submit" className="text-[#D4AF37] hover:text-[#F0D060] transition-colors cursor-pointer">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;