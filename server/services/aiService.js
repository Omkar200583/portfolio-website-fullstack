// ─────────────────────────────────────────────────────────────────────────────
// AI Service — Production Mode (Connected to Backend)
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = "/api";

// ─── CHAT AI ─────────────────────────────────────────────────────────────────
export const chatAI = async (message, history = []) => {
  try {
    const messagesPayload = [
      ...(history || []).map((m) => ({
        role: m.role,
        content: m.text || m.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messagesPayload,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      reply: data.data?.message?.content || "Sorry, I couldn't generate a response.",
    };
  } catch (error) {
    console.error("[AIService] Error:", error);
    throw new Error(error.message || "Failed to get AI response.");
  }
};

// ─── AI TOOL: RESUME BUILDER ─────────────────────────────────────────────────
export const generateResume = async (details) => {
  try {
    const response = await fetch(`${API_BASE}/ai/resume/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return { resume: data.data.resume };
  } catch (error) {
    console.error("[AIService] Resume Error:", error);
    throw new Error(error.message);
  }
};

// ─── AI TOOL: RESUME ANALYZER ────────────────────────────────────────────────
export const analyzeResume = async (resumeText, targetRole) => {
  try {
    const response = await fetch(`${API_BASE}/ai/resume/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription: targetRole }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data.analysis;
  } catch (error) {
    console.error("[AIService] Analyze Error:", error);
    throw new Error(error.message);
  }
};

// ─── AI TOOL: MOCK INTERVIEW (LIVE) ──────────────────────────────────────────
export const startInterviewSession = async (jobTitle, resumeText, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}/ai/interview/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, resumeText, ...options }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data; // { sessionId, question, interviewId }
  } catch (error) {
    console.error("[AIService] Start Interview Error:", error);
    throw new Error(error.message);
  }
};

export const submitInterviewAnswer = async (sessionId, answer) => {
  try {
    const response = await fetch(`${API_BASE}/ai/interview/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, answer }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data; // { feedback, nextQuestion, isComplete, questionNumber }
  } catch (error) {
    console.error("[AIService] Submit Answer Error:", error);
    throw new Error(error.message);
  }
};

export const getInterviewSummaryAPI = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE}/ai/interview/${sessionId}/summary`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  } catch (error) {
    console.error("[AIService] Interview Summary Error:", error);
    throw new Error(error.message);
  }
};

// ─── VOICE: TTS / STT ────────────────────────────────────────────────────────
export const textToSpeechAPI = async (text, voice) => {
  const response = await fetch(`${API_BASE}/ai/voice/speak`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
  });
  if (!response.ok) throw new Error("Failed to generate speech");
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const transcribeAudioAPI = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "answer.webm");

  const response = await fetch(`${API_BASE}/ai/voice/transcribe`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data.text;
};

// ─── INTERVIEW RECORDING UPLOAD ──────────────────────────────────────────────
export const uploadInterviewRecordingAPI = async (sessionId, recordingBlob) => {
  const formData = new FormData();
  formData.append("sessionId", sessionId);
  formData.append("recording", recordingBlob, `interview-${sessionId}.webm`);

  const response = await fetch(`${API_BASE}/ai/interview/recording`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data.url;
};

// ─── AI TOOL: CAREER GUIDE ──────────────────────────────────────────────────
export const careerGuideAI = async (goal) => {
  try {
    const response = await fetch(`${API_BASE}/ai/career/advice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: goal }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  } catch (error) {
    console.error("[AIService] Career Error:", error);
    throw new Error(error.message);
  }
};

// ─── PAGE VIEW TRACKER ──────────────────────────────────────────────────────
export const trackPageView = (path) => {
  console.log("[Analytics] Page view:", path);
};

// ─── ADMIN AI SERVICE ───────────────────────────────────────────────────────
export const aiService = {
  getStats: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/ai/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[AIService] Stats Error:", error);
      return { success: false };
    }
  },
};

export default chatAI;
