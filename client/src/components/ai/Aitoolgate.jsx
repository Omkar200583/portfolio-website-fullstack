// ═══════════════════════════════════════════════════════════════
//  AI TOOL AUTH GATE — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Mail, Phone, ArrowRight, Loader2, AlertCircle, CheckCircle, ShieldCheck } from "lucide-react";
import aiOtpService from "../../services/aiOtpService";

const STORAGE_KEY = "ai_tools_verified";

const KF_ID = "ai-auth-gate-kf";
if (typeof document !== "undefined" && !document.getElementById(KF_ID)) {
  const tag = document.createElement("style");
  tag.id = KF_ID;
  tag.textContent = `
    @keyframes authFloatA {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(20px, -30px) scale(1.06); }
    }
    @keyframes authFloatB {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-24px, 24px) scale(1.04); }
    }
    @keyframes authPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); }
      50% { box-shadow: 0 0 0 8px rgba(212,175,55,0); }
    }
  `;
  document.head.appendChild(tag);
}

function getStoredVerification() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export default function AIToolAuthGate({ children }) {
  const [verified, setVerified] = useState(() => getStoredVerification());
  const [step, setStep] = useState("form");
  const [method, setMethod] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [maskedTarget, setMaskedTarget] = useState("");
  const otpRefs = useRef([]);

  if (verified) return children;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !phone.trim()) { setError("All fields are required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Please enter a valid email address."); return; }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) { setError("Please enter a valid 10-digit Indian mobile number."); return; }

    setSending(true);
    try {
      await aiOtpService.sendOtp({ name: name.trim(), email: email.trim(), phone: phone.trim(), method });
      if (method === "email") {
        const parts = email.trim().split("@");
        setMaskedTarget(`${parts[0][0]}***@${parts[1]}`);
      } else {
        const p = phone.trim();
        setMaskedTarget(`******${p.slice(-4)}`);
      }
      setStep("otp");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally { setSending(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) { setError("Please enter the 6-digit OTP."); return; }

    setVerifying(true);
    try {
      await aiOtpService.verifyOtp({ email: email.trim(), phone: phone.trim(), otp: otp.trim(), method });
      const record = { name: name.trim(), email: email.trim(), phone: phone.trim() };
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch (e) {}
      setStep("success");
      setTimeout(() => setVerified(record), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp("");
      otpRefs.current[0]?.focus();
    } finally { setVerifying(false); }
  };

  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
    const newOtp = otp.split("");
    newOtp[idx] = val;
    const joined = newOtp.join("").slice(0, 6);
    setOtp(joined);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeydown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted); otpRefs.current[5]?.focus(); }
  };

  const handleResend = async () => {
    setSending(true); setError("");
    try {
      await aiOtpService.sendOtp({ name: name.trim(), email: email.trim(), phone: phone.trim(), method });
    } catch (err) { setError(err?.response?.data?.message || "Failed to resend OTP."); }
    finally { setSending(false); }
  };

  const handleBack = () => { setStep("form"); setOtp(""); setError(""); };

  const inp = "w-full bg-[#0A0A0A] border border-[#D4AF37]/12 rounded-xl px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#666666] focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-[#0A0A0A]" />

      <div
        className="absolute top-[-10%] right-[-5%] w-[480px] h-[480px] rounded-full bg-[#D4AF37]/[0.06] blur-[140px] pointer-events-none"
        style={{ animation: "authFloatA 14s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[-15%] left-[-10%] w-[420px] h-[420px] rounded-full bg-[#F0D060]/[0.04] blur-[130px] pointer-events-none"
        style={{ animation: "authFloatB 18s ease-in-out infinite" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* SUCCESS */}
        {step === "success" && (
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 mb-6 mx-auto"
              style={{ animation: "authPulse 1.5s ease-in-out infinite" }}
            >
              <ShieldCheck className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h2 className="font-bold text-2xl text-[#FFFFFF] mb-2">Verified Successfully</h2>
            <p className="text-[#A3A3A3] text-sm">Opening AI Tools...</p>
          </div>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <div>
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F0D060] text-[#0A0A0A] mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="font-bold text-2xl text-[#FFFFFF] mb-1">Verify OTP</h1>
              <p className="text-[#A3A3A3] text-sm">
                Code sent to <span className="text-[#FFFFFF] font-medium">{maskedTarget}</span> via {method === "email" ? "email" : "SMS"}
              </p>
            </div>

            <div className="rounded-2xl p-6 sm:p-7 border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle size={14} className="shrink-0" /> {error}
                  </div>
                )}

                <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => handleOtpChange(e, i)}
                      onKeyDown={(e) => handleOtpKeydown(e, i)}
                      autoFocus={i === 0}
                      className="w-12 h-14 text-center text-xl font-bold text-[#FFFFFF] bg-[#0A0A0A] border border-[#D4AF37]/12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={verifying || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] text-[#0A0A0A] font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-[0_0_28px_rgba(212,175,55,0.35)] transition-shadow cursor-pointer"
                >
                  {verifying ? (
                    <><Loader2 size={17} className="animate-spin" /> Verifying...</>
                  ) : (
                    <><CheckCircle size={17} /> Verify OTP</>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#D4AF37]/10">
                <button type="button" onClick={handleBack} className="text-sm text-[#A3A3A3] hover:text-[#FFFFFF] transition-colors cursor-pointer">
                  ← Back
                </button>
                <button type="button" onClick={handleResend} disabled={sending} className="text-sm text-[#D4AF37] hover:text-[#F0D060] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer">
                  {sending ? <Loader2 size={13} className="animate-spin" /> : null}
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FORM STEP */}
        {step === "form" && (
          <div>
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F0D060] text-[#0A0A0A] mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h1 className="font-bold text-2xl text-[#FFFFFF] mb-1">
                Access{" "}
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#F0D060] bg-clip-text text-transparent">
                  AI Tools
                </span>
              </h1>
              <p className="text-[#A3A3A3] text-sm">
                Verify your identity to unlock all AI-powered career tools.
              </p>
            </div>

            <div className="rounded-2xl p-6 sm:p-7 border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
              <form onSubmit={handleSendOtp} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle size={14} className="shrink-0" /> {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium tracking-[0.12em] text-[#A3A3A3] uppercase mb-2">Full Name</label>
                  <div className="relative">
                    <input value={name} onChange={(e) => { setName(e.target.value); if (error) setError(""); }} placeholder="Jane Doe" autoFocus className={`${inp} pl-11`} />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] text-xs font-medium">Aa</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-[0.12em] text-[#A3A3A3] uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]" />
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }} placeholder="you@example.com" className={`${inp} pl-11`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-[0.12em] text-[#A3A3A3] uppercase mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]" />
                    <div className="absolute left-11 top-1/2 -translate-y-1/2 text-[#666666] text-sm font-medium pointer-events-none">+91</div>
                    <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); if (error) setError(""); }} placeholder="9876543210" className={`${inp} pl-[4.5rem]`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={sending || !name.trim() || !email.trim() || !phone.trim()}
                    onClick={() => setMethod("email")}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#D4AF37]/25 text-[#D4AF37] hover:bg-[#D4AF37]/[0.08] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium cursor-pointer"
                  >
                    {sending && method === "email" ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    Send Email OTP
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !name.trim() || !email.trim() || !phone.trim()}
                    onClick={() => setMethod("phone")}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#F0D060]/25 text-[#F0D060] hover:bg-[#F0D060]/[0.08] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium cursor-pointer"
                  >
                    {sending && method === "phone" ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
                    Send SMS OTP
                  </button>
                </div>
              </form>
            </div>

            <p className="text-center text-[#666666] text-xs mt-5">
              We use this only to prevent abuse — no spam, ever.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}