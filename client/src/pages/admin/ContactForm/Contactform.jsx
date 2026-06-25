import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { contactService } from "../../../services/contactService";
import { trackEvent } from "../../../services/analyticsService";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await contactService.submit(form);
      await trackEvent("contact_form_submit", "/contact");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to send message. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
        <p className="text-gray-400">Thank you for reaching out. I've received your message and will get back to you within 24-48 hours. A confirmation email has been sent to your inbox.</p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm transition">
          Send another message
        </button>
      </div>
    );
  }

  const inp = "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition";

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Name *</label>
          <input name="name" required value={form.name} onChange={handleChange} className={inp} placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Email *</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange} className={inp} placeholder="you@example.com" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Subject *</label>
        <input name="subject" required value={form.subject} onChange={handleChange} className={inp} placeholder="Project Inquiry" />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Message *</label>
        <textarea
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className={inp}
          placeholder="Tell me about your project..."
          minLength={10}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-lg transition-all"
      >
        {status === "sending" ? (
          <>
            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>

      <p className="text-center text-gray-600 text-xs">
        Your message is sent securely. You'll receive an auto-confirmation email.
      </p>
    </form>
  );
};

export default ContactForm;