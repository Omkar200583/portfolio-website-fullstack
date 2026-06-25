import mongoose from "mongoose";

const aiLeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    tool: { type: String, default: "General" },
  },
  { timestamps: true }
);

export default mongoose.models.AiLead || mongoose.model("AiLead", aiLeadSchema);