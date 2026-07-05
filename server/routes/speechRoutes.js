import express from "express";
import multer from "multer";
import { textToSpeech, speechToText } from "../services/speechService.js";
import { optionalAuth } from "../middleware/authMiddleware.js";
import { aiLimiter } from "../middleware/rateLimitMiddleware.js";
import { sendError } from "../utils/response.js";

const router = express.Router();
const upload = multer({ dest: "uploads/audio/", limits: { fileSize: 25 * 1024 * 1024 } });

// @desc    Text → Speech  (returns mp3 binary)
// @route   POST /api/speech/tts
router.post("/tts", aiLimiter, optionalAuth, async (req, res) => {
  try {
    const { text, voice = "nova", speed = 1.0 } = req.body;
    if (!text) return sendError(res, "Text is required", 400);
    if (text.length > 4096) return sendError(res, "Text too long (max 4096 chars)", 400);

    const buffer = await textToSpeech(text, { voice, speed });
    res.set({ "Content-Type": "audio/mpeg", "Content-Length": buffer.length });
    res.send(buffer);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

// @desc    Speech → Text  (upload audio file)
// @route   POST /api/speech/stt
router.post("/stt", aiLimiter, optionalAuth, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return sendError(res, "Audio file is required", 400);
    const { language = "en" } = req.body;
    const transcript = await speechToText(req.file.path, { language });
    res.json({ success: true, transcript });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

export default router;