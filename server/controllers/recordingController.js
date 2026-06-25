import fs from "fs";
import Interview from "../models/Interview.js";
import { uploadToS3 } from "../services/cloudStorageService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";

// @desc    Upload the full recorded interview (audio+video) to cloud storage
// @route   POST /api/ai/interview/recording
// NOTE: requires a `recordingUrl: String` field on the Interview model.
export const uploadInterviewRecording = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!req.file) return sendError(res, "Recording file is required", 400);
    if (!sessionId) return sendError(res, "sessionId is required", 400);

    const interview = await Interview.findOne({ sessionId });
    if (!interview) return sendError(res, "Interview session not found", 404);

    const buffer = fs.readFileSync(req.file.path);
    const ext = req.file.mimetype.includes("mp4") ? "mp4" : "webm";
    const key = `interviews/${sessionId}/recording-${Date.now()}.${ext}`;

    const url = await uploadToS3(buffer, key, req.file.mimetype);

    interview.recordingUrl = url;
    await interview.save();

    fs.unlink(req.file.path, () => {});

    return sendSuccess(res, { url });
  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    logger.error(`uploadInterviewRecording error: ${error.message}`);
    return sendError(res, "Failed to upload recording", 500);
  }
};
