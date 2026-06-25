import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["unread", "read", "replied", "archived"], default: "unread" },
    ipAddress: { type: String },
    userAgent: { type: String },
    repliedAt: { type: Date },
    replyMessage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);