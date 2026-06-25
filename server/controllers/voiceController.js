import fs from "fs";
import { textToSpeech, speechToText } from "../services/speechService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";

// @desc    Convert text to speech, streamed back as audio/wav
// @route   POST /api/ai/voice/speak
export const speak = async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text || !text.trim()) return sendError(res, "Text is required", 400);

    const audioBuffer = await textToSpeech(text, { voice });
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Length", audioBuffer.length);
    return res.send(audioBuffer);
  } catch (error) {
    logger.error(`voice/speak error: ${error.message}`);
    return sendError(res, "Failed to generate speech", 500);
  }
};

// @desc    Transcribe an uploaded spoken-answer clip
// @route   POST /api/ai/voice/transcribe
export const transcribe = async (req, res) => {
  try {
    if (!req.file) return sendError(res, "Audio file is required", 400);

    const text = await speechToText(req.file.path);
    fs.unlink(req.file.path, () => {});

    return sendSuccess(res, { text });
  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    logger.error(`voice/transcribe error: ${error.message}`);
    return sendError(res, "Failed to transcribe audio", 500);
  }
};
