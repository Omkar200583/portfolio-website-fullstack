import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    page: { type: String },
    referrer: { type: String },
    userAgent: { type: String },
    ipAddress: { type: String },
    country: { type: String },
    city: { type: String },
    sessionId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ event: 1, timestamp: -1 });

export default mongoose.model("Analytics", analyticsSchema);