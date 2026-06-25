import Groq from "groq-sdk";

let groq = null;

export function getGroq() {
  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️ GROQ_API_KEY missing");
    return null;
  }

  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    console.log("✅ Groq client initialized");
  }

  return groq;
}

export default getGroq;