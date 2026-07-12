import React, { useState, useRef, useEffect } from "react";
import { chatAI } from "../../services/aiService";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
} from "lucide-react";

const SYSTEM_PROMPT = `You are an AI assistant for Omkar Jadhav's developer portfolio.

You help visitors learn about Omkar's skills, projects, experience, certifications and resume.

Be friendly, concise and professional.
Keep responses under 150 words unless more details are requested.
`;

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "👋 Hi! I'm Omkar's AI Assistant.\n\nAsk me anything about his projects, skills, experience or resume.",
    },
  ]);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    const aiId = Date.now() + 1;

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: aiId, role: "assistant", content: "", streaming: true },
    ]);

    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => !m.streaming)
        .map((m) => ({ role: m.role, content: m.content }));

      const { reply } = await chatAI(userMessage.content, history, SYSTEM_PROMPT);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiId ? { ...msg, content: reply, streaming: false } : msg
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiId
            ? {
                ...msg,
                content: err.message || "Unable to connect to AI server.",
                streaming: false,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {open && (
        <div className="mb-4 flex flex-col w-[340px] sm:w-[360px] max-w-[calc(100vw-24px)] h-[500px] sm:h-[540px] max-h-[75vh] rounded-2xl border border-yellow-500/20 bg-[#101010]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-500/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Omkar AI</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div key={msg.id} className={`flex gap-2 ${isUser ? "justify-end" : ""}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-black" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                      isUser
                        ? "bg-yellow-500 text-black rounded-br-md"
                        : "bg-[#181818] border border-yellow-500/10 text-white rounded-bl-md"
                    }`}
                  >
                    {msg.streaming ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-yellow-500/10">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
              className="flex-1 rounded-xl bg-[#090909] border border-yellow-500/20 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-yellow-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center transition"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <Send className="w-4 h-4 text-black" />
              )}
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,.45)] transition-all hover:scale-110"
      >
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </div>
  );
}