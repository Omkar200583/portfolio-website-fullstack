import { getGroq } from "../config/groq.js";
import fs from "fs";
import { logger } from "../utils/logger.js";

const groq = getGroq();

// IMPORTANT: Groq does not use OpenAI's model names ("tts-1", "whisper-1").
// These are Groq's actual audio model identifiers as of mid-2026:
//   TTS  -> "playai-tts"          (voices like "Fritz-PlayAI", "Arista-PlayAI", etc.)
//   STT  -> "whisper-large-v3-turbo" (fast) or "whisper-large-v3" (most accurate)
const DEFAULT_VOICE = "Fritz-PlayAI";
const TTS_MODEL = "playai-tts";
const STT_MODEL = "whisper-large-v3-turbo";

/**
 * Text-to-Speech → returns an audio Buffer (wav).
 */
export const textToSpeech = async (text, { voice = DEFAULT_VOICE } = {}) => {
  try {
    const response = await groq.audio.speech.create({
      model: TTS_MODEL,
      voice,
      input: text,
      response_format: "wav",
    });
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    logger.error(`textToSpeech error: ${error.message}`);
    throw error;
  }
};

/**
 * Speech-to-Text → transcribes an audio file on disk and returns the transcript string.
 */
export const speechToText = async (filePath, { language = "en", prompt = "" } = {}) => {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: STT_MODEL,
      language,
      prompt,
      response_format: "json",
    });
    return transcription.text;
  } catch (error) {
    logger.error(`speechToText error: ${error.message}`);
    throw error;
  }
};

/**
 * Translate non-English audio to English text.
 */
export const translateAudio = async (filePath) => {
  try {
    const translation = await groq.audio.translations.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
    });
    return translation.text;
  } catch (error) {
    logger.error(`translateAudio error: ${error.message}`);
    throw error;
  }
};
