import multer from "multer";
import os from "os";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, os.tmpdir()),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".webm";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

// Short spoken-answer clips sent for transcription (Groq's STT limit is 25MB)
export const uploadAudio = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

// Full interview session recordings (audio+video), allow a larger limit
export const uploadRecording = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
});
