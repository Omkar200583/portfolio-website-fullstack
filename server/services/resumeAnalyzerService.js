import fs from "fs";
import { logger } from "../utils/logger.js";

export const analyzeResumeText = async (filePath) => {
  try {
    // Dynamically import pdf-parse
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    logger.error(`PDF parse error: ${error.message}`);
    // Return empty string if parsing fails
    return "";
  }
};