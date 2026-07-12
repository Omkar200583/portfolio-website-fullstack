// ─────────────────────────────────────────────────────────────────────────────
// AI Service — Production Mode (Connected to Backend)
// ─────────────────────────────────────────────────────────────────────────────

// ✅ FIXED: was a relative "/api" which only works if frontend + backend share
// a domain. Frontend is on Vercel, backend is on Render — different origins —
// so this now matches the same pattern used in analyticsService.js.
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "https://portfolio-backend-vh57.onrender.com/api";

// ─────────────────────────────────────────────────────────────────────────────
// CHAT AI
// ─────────────────────────────────────────────────────────────────────────────

export const chatAI = async (
  message,
  history = [],
  systemPrompt = ""
) => {
  try {
    const messagesPayload = [
      ...(history || []).map((m) => ({
        role: m.role,
        content: m.content || m.text,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const response = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        messages: messagesPayload,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || `API Error: ${response.status}`
      );
    }

    return {
      reply:
        data.data?.message?.content ||
        "Sorry, I couldn't generate a response.",
    };
  } catch (error) {
    console.error("[AIService] Chat Error:", error);

    throw new Error(
      error.message || "Unable to connect to AI server.",
      { cause: error }
    );
  }
};

// ─── AI TOOL: RESUME BUILDER ─────────────────────────────────────────────────
export const generateResume = async (details) => {
  try {
    const response = await fetch(`${API_BASE}/ai/resume/generate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return { resume: data.data.resume };
  } catch (error) {
    console.error("[AIService] Resume Error:", error);
    throw new Error(error.message, { cause: error });
  }
};

// ─── AI TOOL: RESUME ANALYZER ────────────────────────────────────────────────
export const analyzeResume = async (resumeText, targetRole) => {
  try {
    const response = await fetch(`${API_BASE}/ai/resume/analyze`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription: targetRole }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data.analysis;
  } catch (error) {
    console.error("[AIService] Analyze Error:", error);
    throw new Error(error.message, { cause: error });
  }
};

// ─── AI TOOL: MOCK INTERVIEW (Legacy widget) ─────────────────────────────────
export const interviewAI = async (question, answer) => {
  try {
    const response = await fetch(`${API_BASE}/ai/interview/answer`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, sessionId: question }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  } catch (error) {
    console.error("[AIService] Interview Error:", error);
    throw new Error(error.message);
  }
};

// ─── AI TOOL: CAREER GUIDE ──────────────────────────────────────────────────
export const careerGuideAI = async (goal) => {
  try {
    const response = await fetch(`${API_BASE}/ai/career/advice`, {
      method: "POST",
      credentials: "include",
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

// ─── ADMIN AI SERVICE ───────────────────────────────────────────────────────
export const aiService = {
  getStats: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("[AIService] No accessToken found in localStorage");
        return { success: false, message: "Not authenticated" };
      }

      const response = await fetch(`${API_BASE}/ai/stats`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[AIService] Stats Error:", error);
      return { success: false, message: error.message };
    }
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK INTERVIEW — LIVE SESSION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── START INTERVIEW SESSION ─────────────────────────────────────────────────
export const startInterviewSession = async (jobTitle, resumeText) => {
  const response = await fetch(`${API_BASE}/ai/interview/start`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobTitle,
      resume: resumeText || undefined,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

// ─── SUBMIT ANSWER ───────────────────────────────────────────────────────────
export const submitInterviewAnswer = async (sessionId, answer) => {
  const response = await fetch(`${API_BASE}/ai/interview/answer`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, answer }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

// ─── GET SUMMARY ─────────────────────────────────────────────────────────────
export const getInterviewSummaryAPI = async (sessionId) => {
  const response = await fetch(`${API_BASE}/ai/interview/summary/${sessionId}`, {
    credentials: "include",
  });
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

// ─── TEXT TO SPEECH ──────────────────────────────────────────────────────────
export const textToSpeechAPI = async (text) => {
  const response = await fetch(`${API_BASE}/ai/tts`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data.audioUrl;
};

// ─── SPEECH TO TEXT ──────────────────────────────────────────────────────────
export const transcribeAudioAPI = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await fetch(`${API_BASE}/ai/transcribe`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data.text;
};

// ─── UPLOAD RECORDING ────────────────────────────────────────────────────────
export const uploadInterviewRecordingAPI = async (sessionId, videoBlob) => {
  const formData = new FormData();
  formData.append("video", videoBlob, `interview-${sessionId}.webm`);

  const response = await fetch(`${API_BASE}/recordings/upload/${sessionId}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data.url;
};

export default chatAI;