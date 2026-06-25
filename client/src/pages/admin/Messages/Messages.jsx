// frontend/src/pages/admin/Messages/Messages.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Reply, Trash2, Archive, CheckCircle, Clock, RefreshCw, LogIn, AlertCircle } from "lucide-react";
import { contactService } from "../../../services/contactService";

const STATUS_COLORS = {
  unread: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  read: "bg-gray-700 text-gray-400 border-gray-600",
  replied: "bg-green-500/10 text-green-400 border-green-500/20",
  archived: "bg-gray-800 text-gray-600 border-gray-700",
};

const AdminMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState(false);
  const listRef = useRef(null);
  const hasFetched = useRef(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    setAuthError(false);
    try {
      const res = await contactService.getAll({
        status: filter || undefined,
        limit: 50,
      });
      setMessages(res.data.data || res.data || []);
      if (listRef.current) listRef.current.scrollTop = 0;
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "";
      if (
        msg.includes("401") ||
        msg.includes("Unauthorized") ||
        msg.includes("token") ||
        err?.response?.status === 401
      ) {
        setAuthError(true);
      } else {
        setError("Failed to load messages");
      }
      console.error("Messages fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchMessages();
    }
  }, [fetchMessages]);

  useEffect(() => {
    if (hasFetched.current) fetchMessages();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const openMessage = async (msg) => {
    setSelected(msg);
    setReplyText("");
    setSuccess("");
    setError("");
    if (msg.status === "unread") {
      try {
        await contactService.getById(msg._id);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: "read" } : m))
        );
        setSelected((s) => ({ ...s, status: "read" }));
      } catch {
        /* silently fail - still show message */
      }
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    setSending(true);
    setError("");
    setSuccess("");
    try {
      await contactService.reply(selected._id, replyText);
      setSuccess("Reply sent via Brevo!");
      setMessages((prev) =>
        prev.map((m) =>
          m._id === selected._id ? { ...m, status: "replied", replyMessage: replyText } : m
        )
      );
      setSelected((s) => ({ ...s, status: "replied", replyMessage: replyText }));
      setReplyText("");
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Failed to send reply";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    setError("");
    try {
      await contactService.delete(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to delete message");
    }
  };

  const handleArchive = async (id) => {
    setError("");
    try {
      await contactService.updateStatus(id, "archived");
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: "archived" } : m))
      );
      if (selected?._id === id) setSelected((s) => ({ ...s, status: "archived" }));
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to archive message");
    }
  };

  // ─── Auth Error Screen ───────────────────────────────────
  if (authError) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full mb-5">
            <LogIn className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Session Expired</h2>
          <p className="text-gray-400 mb-6">
            Your authentication token is missing or expired. Please log in again to view messages.
          </p>
          <button
            onClick={() => navigate("/admin/login")}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Layout ─────────────────────────────────────────
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Mail className="text-cyan-400" /> Messages
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {messages.length > 0
              ? `${messages.length} message${messages.length !== 1 ? "s" : ""}`
              : "No messages yet"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-500 transition disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-cyan-500 transition"
          >
            <option value="">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 flex items-center justify-between bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </span>
          <button
            onClick={() => setError("")}
            className="text-red-300 hover:text-white ml-4 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Message List ─────────────────────────────── */}
        <div
          ref={listRef}
          className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin"
        >
          {loading ? (
            <div className="text-center py-12">
              <span className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin inline-block" />
              <p className="text-gray-500 text-sm mt-3">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <Mail className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No messages found</p>
              {filter && (
                <button
                  onClick={() => setFilter("")}
                  className="text-cyan-500 text-xs mt-2 hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?._id === msg._id
                    ? "border-cyan-500/50 bg-cyan-500/5"
                    : msg.status === "unread"
                    ? "border-gray-700 bg-gray-900 shadow-[0_0_12px_rgba(0,243,255,0.08)]"
                    : "border-gray-800 bg-gray-900 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-medium text-sm truncate mr-2 ${
                      msg.status === "unread" ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {msg.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                      STATUS_COLORS[msg.status] || STATUS_COLORS.read
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-1 truncate font-medium">
                  {msg.subject}
                </p>
                <p className="text-gray-600 text-xs truncate">{msg.message}</p>
                <p className="text-gray-700 text-xs mt-2">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>

        {/* ── Message Detail ───────────────────────────── */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              {/* Detail Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-white truncate">
                    {selected.subject}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {selected.name} &lt;{selected.email}&gt;
                  </p>
                  <p className="text-gray-600 text-xs mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleArchive(selected._id)}
                    className="p-2 text-gray-500 hover:text-yellow-400 transition"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selected._id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Original Message */}
              <div className="bg-black/40 rounded-xl p-5 mb-6 border border-gray-800">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              {/* Previous Reply */}
              {selected.replyMessage && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-5">
                  <p className="text-green-400 text-xs font-medium mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Replied
                    {selected.repliedAt && (
                      <span className="text-green-500/60 ml-2">
                        {new Date(selected.repliedAt).toLocaleString()}
                      </span>
                    )}
                  </p>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">
                    {selected.replyMessage}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Reply{" "}
                  <span className="text-gray-600">
                    (sends via Brevo to {selected.email})
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition resize-none"
                />
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={handleReply}
                    disabled={sending || !replyText.trim()}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-lg transition"
                  >
                    {sending ? (
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Reply className="w-4 h-4" />
                    )}
                    Send Reply
                  </button>
                  {success && (
                    <span className="text-sm text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {success}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-gray-900 border border-dashed border-gray-800 rounded-xl flex items-center justify-center text-gray-600">
              <div className="text-center">
                <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;