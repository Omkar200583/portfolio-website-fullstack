// ═══════════════════════════════════════════════════════════════
//  CONTACT — Premium Black & Gold (Fully Animated + Icons)
// ═══════════════════════════════════════════════════════════════
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Send, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ResumeModal from "../../components/ResumeModal/ResumeModal";
import { sendContactForm } from "../../services/contactService";

const NAME = "Omkar Nilkanth Jadhav";
const ROLE = "Full Stack Developer | Software Developer";
const EMAIL = "omkarjadhav415523@gmail.com";

/* ─── Reusable Animated Form Group ─── */
function AnimatedGroup({ label, id, children, error, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <label
        htmlFor={id}
        className="block text-xs font-medium tracking-[0.12em] text-[#A3A3A3] uppercase mb-2"
      >
        {label}
      </label>
      {children}
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -4 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-red-400 text-xs mt-1.5"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [resumeOpen, setResumeOpen] = useState(false);
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    setErrorMsg("");
    setFieldErrors({});
    const result = await sendContactForm({ 
      name: form.name, 
      email: form.email, 
      message: form.message, 
      subject: "Portfolio Contact" 
    });
    if (result.success) { 
      setStatus("sent"); 
      setForm({ name: "", email: "", message: "" }); 
    } else { 
      setStatus("error"); 
      if (result.errors) setFieldErrors(result.errors); 
      else setErrorMsg(result.message || "Failed to send. Please try again."); 
    }
  };

  const inputClass = (fieldName) =>
    `w-full bg-[#0A0A0A] border rounded-xl px-4 py-3.5 text-[#FFFFFF] placeholder:text-[#525252] focus:ring-2 focus:outline-none transition-all duration-300 ${
      fieldErrors[fieldName] 
        ? "border-red-500/50 focus:border-red-400/50 focus:ring-red-500/20" 
        : "border-[#D4AF37]/12 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20"
    }`;

  const leftStagger = (i) => ({
    initial: { opacity: 0, y: 24, filter: "blur(4px)" },
    animate: isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="contact" ref={sectionRef} className="relative w-full overflow-hidden bg-[#0A0A0A] text-[#FFFFFF] min-h-screen flex items-center py-24 px-4 sm:px-6 font-[Inter]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        @keyframes floatGlow { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -30px) scale(1.06); } }
        .glow-float { animation: floatGlow 14s ease-in-out infinite; }
        @keyframes floatGlow2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-24px, 24px) scale(1.04); } }
        .glow-float-2 { animation: floatGlow2 18s ease-in-out infinite; }
        @keyframes ringPulse { 0%, 100% { opacity: 0.45; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
        .ring-pulse { animation: ringPulse 6s ease-in-out infinite; }
        @keyframes shineSweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .btn-shine:hover .shine-effect { animation: shineSweep 0.7s ease-out forwards; }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0D0D0D]" />
      <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#D4AF37]/[0.06] blur-[140px] glow-float" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#F0D060]/[0.04] blur-[130px] glow-float-2" />

      <div className="relative z-10 container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#A3A3A3] uppercase mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            Let's Connect
          </span>
          <h2 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF]">
            Get In{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C847] to-[#F0D060] bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="mt-4 text-[#A3A3A3] text-base sm:text-lg max-w-2xl mx-auto">Have a role or project in mind? I'd love to hear from you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-center">
          
          {/* LEFT — Profile */}
          <div className="flex flex-col items-center text-center">
            {/* Image */}
            <motion.div {...leftStagger(0)} className="relative w-[200px] sm:w-[240px] aspect-square mb-6 group">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-[#D4AF37]/20 via-[#F0D060]/10 to-transparent blur-3xl ring-pulse" />
              <div className="absolute -inset-3 rounded-full border border-[#D4AF37]/15 transition-all duration-500 group-hover:border-[#D4AF37]/35" />
              <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.3 }}
                className="relative w-full h-full rounded-full overflow-hidden border border-[#D4AF37]/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] bg-[#171717] transition-shadow duration-500 group-hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]"
              >
                <img src="/images/Photo.png" alt={NAME} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/30 via-transparent to-transparent" />
              </motion.div>
            </motion.div>

            {/* Name & Role */}
            <motion.h3 {...leftStagger(1)} className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF] mb-1">{NAME}</motion.h3>
            <motion.p {...leftStagger(2)} className="text-sm sm:text-base text-[#A3A3A3] mb-4">{ROLE}</motion.p>

            {/* Status Badge */}
            <motion.span {...leftStagger(3)} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] backdrop-blur-sm text-xs font-medium text-[#A3A3A3] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#F0D060] opacity-70 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F0D060]" />
              </span>
              Open to Full-Time &amp; Freelance
            </motion.span>

            {/* Action Buttons with Icons */}
            <motion.div {...leftStagger(4)} className="flex flex-wrap items-center justify-center gap-3">
              <motion.button onClick={() => setResumeOpen(true)} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.25 }}
                className="btn-shine relative overflow-hidden px-5 py-3 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] font-display font-semibold text-sm text-[#FFFFFF] flex items-center gap-2 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.06] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300"
              >
                <span className="shine-effect absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent translate-x-[-100%]" />
                <FileText size={16} className="relative z-10" /> <span className="relative z-10">Resume</span>
              </motion.button>

              <motion.a href="https://github.com/Omkar200583" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.25 }}
                className="btn-shine relative overflow-hidden px-5 py-3 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] font-display font-semibold text-sm text-[#FFFFFF] flex items-center gap-2 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.06] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300"
              >
                <span className="shine-effect absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent translate-x-[-100%]" />
                <FaGithub size={18} className="relative z-10" /> <span className="relative z-10">GitHub</span>
              </motion.a>

              <motion.a href="https://linkedin.com/in/omkar-jadhav-6915052a1" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.25 }}
                className="btn-shine relative overflow-hidden px-5 py-3 rounded-xl border border-[#F0D060]/15 bg-[#F0D060]/[0.03] font-display font-semibold text-sm text-[#FFFFFF] flex items-center gap-2 hover:border-[#F0D060]/50 hover:text-[#F0D060] hover:bg-[#F0D060]/[0.06] hover:shadow-[0_0_20px_rgba(240,208,96,0.15)] transition-all duration-300"
              >
                <span className="shine-effect absolute inset-0 bg-gradient-to-r from-transparent via-[#F0D060]/20 to-transparent translate-x-[-100%]" />
                <FaLinkedin size={18} className="relative z-10" /> <span className="relative z-10">LinkedIn</span>
              </motion.a>
            </motion.div>
          </div>

          {/* RIGHT — Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            animate={isInView ? { opacity: 1, x: 0 } : {}} 
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-6 sm:p-8 md:p-10 border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && errorMsg && (
                <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle size={16} className="shrink-0" />{errorMsg}
                </motion.div>
              )}

              <AnimatedGroup label="Name" id="name" error={fieldErrors.name} delay={0.2}>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required className={inputClass("name")} placeholder="Your name" />
              </AnimatedGroup>

              <AnimatedGroup label="Email" id="email" error={fieldErrors.email} delay={0.3}>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass("email")} placeholder="you@example.com" />
              </AnimatedGroup>

              <AnimatedGroup label="Message" id="message" error={fieldErrors.message} delay={0.4}>
                <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} required className={`${inputClass("message")} resize-none`} placeholder="Tell me about the role or project..." />
              </AnimatedGroup>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.button 
                  type="submit" 
                  disabled={status === "sending"} 
                  whileHover={{ scale: status === "sending" ? 1 : 1.02, y: -2 }} 
                  whileTap={{ scale: status === "sending" ? 1 : 0.98 }} 
                  transition={{ duration: 0.25 }}
                  className="btn-shine relative overflow-hidden w-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] text-[#0A0A0A] font-display font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_32px_rgba(212,175,55,0.4)] transition-shadow duration-300 disabled:opacity-70"
                >
                  <span className="shine-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%]" />
                  
                  {status === "sending" ? (
                    <>
                      <span className="w-5 h-5 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin relative z-10" /> 
                      <span className="relative z-10">Sending...</span>
                    </>
                  ) : status === "sent" ? (
                    <>
                      <CheckCircle2 size={20} className="relative z-10" /> 
                      <span className="relative z-10">Message Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} className="relative z-10" /> 
                      <span className="relative z-10">Send Message</span>
                    </>
                  )}
                </motion.button>
              </motion.div>

              {status === "sent" && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-[#F0D060] text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={14} /> Thanks for reaching out — I'll get back to you soon.
                </motion.p>
              )}
            </form>

            {/* ✅ FIXED SYNTAX ERROR HERE (Removed extra `}`) */}
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={isInView ? { opacity: 1 } : {}}
               transition={{ delay: 0.7, duration: 0.5 }}
               className="mt-6 pt-6 border-t border-[#D4AF37]/10 text-center"
            >
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 text-sm text-[#A3A3A3] hover:text-[#D4AF37] transition-colors duration-300 group">
                <Mail size={16} className="group-hover:scale-110 transition-transform" /> 
                or email directly at: <span className="font-mono text-[#F0D060] group-hover:underline">{EMAIL}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
}