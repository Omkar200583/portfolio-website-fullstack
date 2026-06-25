import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String, required: true, unique: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    type: {
      type: String,
      enum: ["technical", "behavioral", "mixed"],
      default: "mixed",
    },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
    questions: [
      {
        question: String,
        answer: String,
        feedback: String,
        score: {
          type: Number,
          min: 0,
          max: 10,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    summary: String,
    strengths: [String],
    improvements: [String],
    tokensUsed: {
      type: Number,
      default: 0,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

const Interview =
  mongoose.models.Interview ||
  mongoose.model("Interview", interviewSchema);

export default Interview;