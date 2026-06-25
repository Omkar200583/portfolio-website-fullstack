import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, User, Send, Sparkles, Loader2 } from "lucide-react";
import { chatAI } from "../../services/aiService";

const SUGGESTIONS = [
  "Explain the MERN stack to a beginner",
  "How do I prepare for a backend developer interview?",
  "Review my approach: JWT vs session-based auth",
  "Suggest a roadmap to learn Node.js in 8 weeks",
];

const INITIAL_MESSAGE = {
  id: "init",
  role: "assistant",
  text: "Hi! I'm your AI assistant. Ask me about coding, career guidance, or any doubts you have — I'll keep my answers clear and structured.",
};

export default function ChatAssistant() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const value = (text ?? input).trim();
    if (!value || loading) return;

    const userMsg = { id: Date.now(), role: "user", text: value };
    const history = messages.map(({ role, text }) => ({ role, text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const { reply } = await chatAI(value, history);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: reply }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0B0C10] text-[#E6E8EB] min-h-screen py-24 px-4 sm:px-6 font-[Inter]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }

        @keyframes floatGlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.06); }
        }
        .glow-float { animation: floatGlow 14s ease-in-out infinite; }

        @keyframes floatGlow2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-24px, 24px) scale(1.04); }
        }
        .glow-float-2 { animation: floatGlow2 18s ease-in-out infinite; }

        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .typing-dot { animation: typingDot 1.2s infinite ease-in-out; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#101216] to-[#15181D]" />
      <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#4AA8FF]/[0.08] blur-[140px] glow-float" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#3FE0D0]/[0.06] blur-[130px] glow-float-2" />

      <div className="relative z-10 container mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#9AA4B2] uppercase mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#4AA8FF] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4AA8FF]" />
            </span>
            AI Tool
          </span>
          <h1 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-white">
            AI Chat{" "}
            <span className="bg-gradient-to-r from-[#4AA8FF] via-[#7FC8FF] to-[#3FE0D0] bg-clip-text text-transparent">
              Assistant
            </span>
          </h1>
          <p className="mt-4 text-[#9AA4B2] text-base sm:text-lg max-w-2xl mx-auto">
            Ask coding questions, get career guidance, or work through any doubts you have.
          </p>
        </motion.div>

        {/* Chat panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] flex flex-col h-[640px] max-h-[75vh]"
        >
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-white/10 text-[#E6E8EB]"
                      : "bg-gradient-to-br from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10]"
                  }`}
                >
                  {msg.role === "user" ? <User size={15} /> : <Bot size={15} />}
                </div>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#4AA8FF]/[0.12] border border-[#4AA8FF]/20 text-[#E6E8EB]"
                      : "bg-white/[0.03] border border-white/10 text-[#9AA4B2]"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10]">
                  <Bot size={15} />
                </div>
                <div className="px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AA4B2] typing-dot" style={{ animationDelay: "0s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AA4B2] typing-dot" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AA4B2] typing-dot" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-400 pl-11">{error}</p>}

            {/* Suggestions — only show initially */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pl-11 pt-2">
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
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300"
              />
              <motion.button
                type="submit"
                disabled={loading || !input.trim()}
                whileHover={{ scale: loading ? 1 : 1.06 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10] flex items-center justify-center hover:shadow-[0_0_20px_rgba(74,168,255,0.45)] transition-shadow duration-300 disabled:opacity-50"
                aria-label="Send message"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
