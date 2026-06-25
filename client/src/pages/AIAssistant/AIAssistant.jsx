import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, AlertCircle } from "lucide-react";

const SUGGESTIONS = [
  "What projects has Omkar built?",
  "What are his core skills?",
  "Tell me about his internships",
  "How can I contact him?",
];

const INITIAL_MESSAGE = {
  id: "init",
  role: "assistant",
  text:
    "Hi, I'm Omkar's AI assistant. Ask me about his projects, skills, experience, or how to get in touch.",
};

// ✅ FIXED: Empty string = Vite proxy handles /api/* → http://localhost:5000
const API_BASE = "";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-ai-assistant", handler);
    return () => window.removeEventListener("open-ai-assistant", handler);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sendMessage = async (text) => {
    const value = text ?? input;
    if (!value.trim()) return;

    const userMsg = { id: Date.now(), role: "user", text: value.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: value.trim(),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const reply = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.data?.message?.content || "Sorry, I couldn't generate a response.",
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("AI Assistant Error:", err);
      setError("Failed to get response. Please try again.");

      const errorMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,168,255,0.35), 0 8px 30px -10px rgba(0,0,0,0.6); }
          50% { box-shadow: 0 0 0 10px rgba(74,168,255,0), 0 8px 30px -10px rgba(0,0,0,0.6); }
        }
        .fab-pulse { animation: pulseGlow 2.6s ease-in-out infinite; }

        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .typing-dot { animation: typingDot 1.2s infinite ease-in-out; }
      `}</style>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10] flex items-center justify-center fab-pulse font-[Inter]"
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sparkles size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 bottom-[88px] right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[70vh] sm:max-h-[560px] flex flex-col rounded-2xl border border-white/10 bg-[#101216]/95 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden font-[Inter]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4AA8FF] to-[#3FE0D0] flex items-center justify-center text-[#0B0C10]">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-white">AI Assistant</p>
                  <p className="text-xs text-[#9AA4B2] flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#3FE0D0] opacity-70 animate-ping" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3FE0D0]" />
                    </span>
                    Powered by GPT-4o
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full text-[#9AA4B2] hover:text-[#3FE0D0] hover:bg-white/[0.05] transition-colors duration-200"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[260px]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-white/10 text-[#E6E8EB]"
                        : "bg-gradient-to-br from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10]"
                    }`}
                  >
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#4AA8FF]/[0.12] border border-[#4AA8FF]/20 text-[#E6E8EB]"
                        : "bg-white/[0.03] border border-white/10 text-[#9AA4B2]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}

              {typing && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10]">
                    <Bot size={14} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9AA4B2] typing-dot" style={{ animationDelay: "0s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9AA4B2] typing-dot" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9AA4B2] typing-dot" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}

              {messages.length === 1 && !typing && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs font-mono text-[#7FC8FF] bg-[#4AA8FF]/[0.08] px-3 py-1.5 rounded-full border border-[#4AA8FF]/20 hover:border-[#3FE0D0]/40 hover:text-[#3FE0D0] hover:bg-[#3FE0D0]/[0.08] transition-colors duration-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about projects, skills, experience..."
                  disabled={typing}
                  className="flex-1 bg-[#0B0C10] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  disabled={typing}
                  className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10] flex items-center justify-center hover:shadow-[0_0_20px_rgba(74,168,255,0.45)] transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}