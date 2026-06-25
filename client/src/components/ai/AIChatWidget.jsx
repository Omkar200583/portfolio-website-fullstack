// ═══════════════════════════════════════════════════════════════
//  AI CHAT WIDGET — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader } from "lucide-react";

const SYSTEM_PROMPT = `You are an AI assistant for Omkar Jadhav's developer portfolio.
You help visitors learn about Omkar's skills (React, Node.js, MongoDB, OpenAI, TypeScript), projects, experience, and blog posts.
You can also answer general questions about web development and technology.
Be concise, friendly, and professional. Keep responses under 150 words unless asked for details.`;

const ChatBubble = ({ msg }) => (
  <div className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
    {msg.role === "assistant" && (
      <div className="w-6 h-6 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center shrink-0">
        <Bot className="w-3 h-3 text-[#D4AF37]" />
      </div>
    )}
    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${msg.role === "user" ? "bg-[#D4AF37] text-[#0A0A0A] font-medium rounded-br-sm" : "bg-[#171717] text-[#A3A3A3] border border-[#D4AF37]/10 rounded-bl-sm"}`}>
      {msg.content}
      {msg.streaming && <span className="inline-block w-1 h-4 bg-[#F0D060] ml-1 animate-pulse" />}
    </div>
    {msg.role === "user" && (
      <div className="w-6 h-6 rounded-full bg-[#171717] border border-[#D4AF37]/15 flex items-center justify-center shrink-0">
        <User className="w-3 h-3 text-[#A3A3A3]" />
      </div>
    )}
  </div>
);

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hi! I'm Omkar's AI assistant. Ask me anything about his skills, projects, or experience! 👋" }
  ]);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || streaming) return;

    const userMsg = { id: Date.now(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    const aiMsgId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: aiMsgId, role: "assistant", content: "", streaming: true }]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          messages: [
            ...messages.slice(-8).map(({ role, content }) => ({ role, content })),
            { role: "user", content: userMsg.content },
          ],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const replyText = data.data?.message?.content || "Sorry, I couldn't generate a response.";

      setMessages((prev) =>
        prev.map((m) => m.id === aiMsgId ? { ...m, content: replyText, streaming: false } : m)
      );
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) =>
        prev.map((m) => m.id === aiMsgId ? { ...m, content: "Sorry, I couldn't connect. Please try again.", streaming: false } : m)
      );
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {open && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[480px] bg-[#0A0A0A] border border-[#D4AF37]/15 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-[#171717] border-b border-[#D4AF37]/10">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#FFFFFF] text-sm">AI Assistant</p>
              <p className="text-[#666666] text-xs">Powered by GPT-4o</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#666666] hover:text-[#FFFFFF] transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => <ChatBubble key={msg.id} msg={msg} />)}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-[#171717] border-t border-[#D4AF37]/10 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={streaming}
              placeholder="Ask me anything..."
              className="flex-1 bg-[#0A0A0A] border border-[#D4AF37]/12 rounded-xl px-3 py-2 text-[#FFFFFF] text-sm placeholder-[#666666] focus:outline-none focus:border-[#D4AF37]/40 transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="w-9 h-9 bg-[#D4AF37] hover:bg-[#F0D060] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition cursor-pointer"
            >
              {streaming ? <Loader className="w-4 h-4 text-[#0A0A0A] animate-spin" /> : <Send className="w-4 h-4 text-[#0A0A0A]" />}
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-[#D4AF37] hover:bg-[#F0D060] rounded-full flex items-center justify-center text-[#0A0A0A] shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_30px_rgba(212,175,55,0.55)] transition-all hover:scale-110 cursor-pointer"
      >
        {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default AIChatWidget;