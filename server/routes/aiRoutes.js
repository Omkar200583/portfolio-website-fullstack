import express from "express";
import {
  chat, chatStream,
  generateResume, analyzeResume,
  startInterview, answerInterview, getInterviewSummary,
  getCareerAdvice, generateRoadmap,
  getAIStats,
} from "../controllers/aiController.js";
import { speak, transcribe } from "../controllers/voiceController.js";
import { uploadInterviewRecording } from "../controllers/recordingController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";
import { uploadAudio, uploadRecording } from "../middleware/uploadAudio.js";
import rateLimit from "express-rate-limit";

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50,
  message: { success: false, message: "Too many AI requests. Please try again later." },
});

const router = express.Router();

// Chat
router.post("/chat", aiLimiter, optionalAuth, chat);
router.post("/chat/stream", aiLimiter, optionalAuth, chatStream);

// Resume
router.post("/resume/generate", aiLimiter, optionalAuth, generateResume);
router.post("/resume/analyze", aiLimiter, optionalAuth, uploadResume.single("resume"), analyzeResume);

// Mock Interview
router.post("/interview/start", aiLimiter, optionalAuth, startInterview);
router.post("/interview/answer", aiLimiter, optionalAuth, answerInterview);
router.get("/interview/:sessionId/summary", optionalAuth, getInterviewSummary);
router.post(
  "/interview/recording",
  aiLimiter,
  optionalAuth,
  uploadRecording.single("recording"),
  uploadInterviewRecording
);

// Voice (Groq TTS / STT)
router.post("/voice/speak", aiLimiter, optionalAuth, speak);
router.post("/voice/transcribe", aiLimiter, optionalAuth, uploadAudio.single("audio"), transcribe);

// Career Advisor
router.post("/career/advice", aiLimiter, optionalAuth, getCareerAdvice);
router.post("/career/roadmap", aiLimiter, optionalAuth, generateRoadmap);

// Admin
router.get("/stats", protect, adminOnly, getAIStats);

export default router;
