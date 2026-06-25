import AiOtp from "../models/AiOtp.js";
import AiLead from "../models/AiLead.js";
import crypto from "crypto";

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

async function sendEmailOtp(email, otp, name) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Portfolio AI", email: process.env.SENDER_EMAIL },
      to: [{ email, name }],
      subject: "Your AI Tools Verification Code",
      htmlContent: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0B0C10;border:1px solid rgba(255,255,255,0.1);border-radius:16px;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="display:inline-block;padding:12px;border-radius:12px;background:linear-gradient(135deg,#4AA8FF,#3FE0D0);font-size:24px;">✨</div>
            <h1 style="color:#fff;margin:16px 0 8px;font-size:22px;">Verify Your Identity</h1>
            <p style="color:#9AA4B2;font-size:14px;">Hi ${name}, use this code to access AI Tools:</p>
          </div>
          <div style="text-align:center;padding:24px;background:rgba(74,168,255,0.08);border:1px solid rgba(74,168,255,0.2);border-radius:12px;margin-bottom:24px;">
            <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#4AA8FF;font-family:monospace;">${otp}</span>
          </div>
          <p style="text-align:center;color:#5B6470;font-size:12px;">This code expires in 10 minutes.</p>
        </div>`,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `Brevo API error ${res.status}`);
  }

  console.log(`📧 Email OTP sent to ${email}: ${otp}`);
}

async function sendSmsOtp(phone, otp, name) {
  try {
    const twilio = await import("twilio");
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `[Portfolio AI] Hi ${name}, your verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });
    console.log(`📱 SMS OTP sent to +91${phone}: ${otp}`);
  } catch (err) {
    console.log(`📱 Twilio not configured — OTP ${otp} for +91${phone}`);
  }
}

export const sendOtp = async (req, res) => {
  try {
    const { name, email, phone, method } = req.body;
    if (!name || !email || !phone || !method)
      return res.status(400).json({ message: "Name, email, phone, and method are required." });
    if (!["email", "phone"].includes(method))
      return res.status(400).json({ message: "Method must be 'email' or 'phone'." });
    if (!/^[6-9]\d{9}$/.test(phone))
      return res.status(400).json({ message: "Enter a valid 10-digit phone number." });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await AiOtp.deleteMany({ email, verified: false });
    await AiOtp.create({ email, phone, name, otp, method, expiresAt });

    if (method === "email") {
      await sendEmailOtp(email, otp, name);
    } else {
      await sendSmsOtp(phone, otp, name);
    }

    res.json({ message: `OTP sent via ${method}` });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: err.message || "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, phone, otp, method } = req.body;
    if (!email || !phone || !otp)
      return res.status(400).json({ message: "Email, phone, and OTP are required." });

    const record = await AiOtp.findOne({
      email, phone, otp, method, verified: false, expiresAt: { $gt: new Date() },
    });
    if (!record)
      return res.status(400).json({ message: "Invalid or expired OTP." });

    record.verified = true;
    await record.save();

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const existing = await AiLead.findOne({ email, createdAt: { $gte: today } });
      if (!existing) {
        await AiLead.create({ name: record.name, email, phone, tool: "OTP Verified" });
      }
    } catch (e) {
      console.warn("Lead creation skipped:", e.message);
    }

    res.json({ message: "OTP verified successfully." });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: err.message || "Verification failed" });
  }
};