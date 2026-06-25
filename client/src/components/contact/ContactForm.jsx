// ═══════════════════════════════════════════════════════════════
//  CONTACT FORM — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-[#171717] border border-[#D4AF37]/12 rounded-lg px-4 py-3 text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300"
          />
        </div>
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-[#171717] border border-[#D4AF37]/12 rounded-lg px-4 py-3 text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300"
          />
        </div>
      </div>

      <textarea
        rows="5"
        placeholder="Your Message"
        className="w-full bg-[#171717] border border-[#D4AF37]/12 rounded-lg px-4 py-3 text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-300 resize-none"
      ></textarea>

      <button
        type="submit"
        disabled={status === 'sending' || status === 'success'}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer ${
          status === 'success'
            ? 'bg-[#22c55e] text-[#0A0A0A]'
            : 'bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F0D060] hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] disabled:opacity-60 disabled:cursor-not-allowed'
        }`}
      >
        {status === 'idle' && <><Send className="w-5 h-5" /> Send Message</>}
        {status === 'sending' && 'Sending...'}
        {status === 'success' && 'Message Sent!'}
      </button>
    </form>
  );
};

export default ContactForm;