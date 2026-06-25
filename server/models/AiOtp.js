import mongoose from "mongoose";

const aiOtpSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    method: { type: String, required: true },
    verified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// ✅ No hooks here either
export default mongoose.model("AiOtp", aiOtpSchema);