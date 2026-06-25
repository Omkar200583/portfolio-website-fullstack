// controllers/aiController.js

import { getGroq } from "../config/groq.js";
import User from "../models/User.js";
import Interview from "../models/Interview.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";
import { v4 as uuidv4 } from "uuid";
import { analyzeResumeText } from "../services/resumeAnalyzerService.js";

const groq = getGroq();
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// ─── Helper: call Groq and return parsed JSON ─────────────────────────────────
const groqJSON = async (messages) => {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 2000,
    temperature: 0.3,
    messages,
  });
  const raw = completion.choices[0].message.content.trim();
  const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(clean);
};

// ─── Helper: track token usage ───────────────────────────────────────────────
const trackUsage = async (userId, tokensUsed) => {
  if (!userId) return;
  await User.findByIdAndUpdate(userId, {
    $inc: {
      "aiUsage.totalTokens": tokensUsed,
      "aiUsage.totalRequests": 1,
      "aiUsage.monthlyTokens": tokensUsed,
    },
  });
};

// ─── CHAT ASSISTANT ──────────────────────────────────────────────────────────
export const chat = async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    const system = systemPrompt || `You are an AI assistant for a developer portfolio. 
    You help visitors learn about the developer's skills, projects, experience, and answer questions about web development, AI, and technology.
    Be concise, helpful, and professional.`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: "system", content: system }, ...messages],
    });

    const reply = completion.choices[0].message;
    const tokensUsed = completion.usage.total_tokens;
    await trackUsage(req.user?._id, tokensUsed);
    return sendSuccess(res, { message: reply, tokensUsed });
  } catch (error) {
    logger.error(`AI Chat error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

// ─── STREAM CHAT ─────────────────────────────────────────────────────────────
export const chatStream = async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const system = systemPrompt || "You are a helpful AI assistant for a developer portfolio.";
    const stream = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 1000,
      stream: true,
      messages: [{ role: "system", content: system }, ...messages],
    });

    let totalTokens = 0;
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) {
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
        totalTokens += 1;
      }
    }

    await trackUsage(req.user?._id, totalTokens);
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    logger.error(`Chat stream error: ${error.message}`);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

// ─── RESUME GENERATOR ────────────────────────────────────────────────────────
export const generateResume = async (req, res) => {
  try {
    const { personalInfo, skills, experience, projects, education, targetRole, tone = "professional" } = req.body;

    const prompt = `Generate a professional ATS-optimized resume for the following person targeting the role of "${targetRole}".

Personal Info: ${JSON.stringify(personalInfo)}
Skills: ${skills?.join(", ")}
Experience: ${JSON.stringify(experience)}
Projects: ${JSON.stringify(projects)}
Education: ${JSON.stringify(education)}
Tone: ${tone}

Generate:
1. A powerful professional summary (3-4 sentences)
2. Optimized bullet points for each experience
3. Highlighted project descriptions
4. Key skills categorized
5. ATS keywords for the target role

IMPORTANT: Return ONLY valid JSON with this exact structure, no markdown, no code fences:
{"summary":"...","experience":[{"role":"...","company":"...","bullets":["..."]}],"projects":[{"name":"...","description":"..."}],"skills":{"technical":[],"tools":[],"soft":[]},"keywords":["..."]}`;

    const result = await groqJSON([
      { role: "system", content: "You are an expert resume writer and career coach. Return ONLY valid JSON, no markdown, no explanation." },
      { role: "user", content: prompt },
    ]);

    await trackUsage(req.user?._id, 2000);
    return sendSuccess(res, { resume: result, tokensUsed: 2000 });
  } catch (error) {
    logger.error(`Resume generate error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

// ─── RESUME ANALYZER ─────────────────────────────────────────────────────────
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    let text = resumeText;
    if (req.file) {
      text = await analyzeResumeText(req.file.path);
    }
    if (!text) return sendError(res, "Resume text or file required", 400);

    const prompt = `Analyze this resume${jobDescription ? " against the provided job description" : ""}:

RESUME:
 ${text.substring(0, 4000)}

 ${jobDescription ? `JOB DESCRIPTION:\n${jobDescription.substring(0, 2000)}` : ""}

IMPORTANT: Return ONLY valid JSON with this exact structure, no markdown, no code fences:
{
  "atsScore": 85,
  "overallScore": 80,
  "sections": {"present": ["Summary","Experience","Skills","Education"],"missing": []},
  "strengths": ["..."],
  "weaknesses": ["..."],
  "keywords": {"found": ["React","Node.js"],"missing": ["Docker"],"recommended": ["GraphQL"]},
  "suggestions": ["..."],
  "formatting": {"score": 85,"issues": []},
  "readability": {"score": 80,"feedback": "..."}${jobDescription ? `,"matchScore": 75,"matchFeedback":"..."` : ""}
}`;

    const analysis = await groqJSON([
      { role: "system", content: "You are an expert ATS resume analyzer and career coach. Return ONLY valid JSON, no markdown, no explanation. Analyze thoroughly and be specific." },
      { role: "user", content: prompt },
    ]);

    await trackUsage(req.user?._id, 2000);
    return sendSuccess(res, { analysis, tokensUsed: 2000 });
  } catch (error) {
    logger.error(`Resume analyze error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

// ─── MOCK INTERVIEW: START ───────────────────────────────────────────────────
export const startInterview = async (req, res) => {
  try {
    const { jobTitle, jobDescription, resumeText, difficulty = "medium", type = "mixed" } = req.body;

    // ✅ SAFETY GUARD — fail fast with clear message
    if (!jobTitle || !jobTitle.trim()) {
      return sendError(res, "jobTitle is required", 400);
    }

    const sessionId = uuidv4();
    const prompt = `You are conducting a ${difficulty} ${type} interview for the role of "${jobTitle}".
 ${jobDescription ? `Job Description: ${jobDescription}` : ""}
 ${resumeText ? `Candidate Resume:\n${resumeText.substring(0, 3000)}\n\nTailor your questions to this candidate's actual background, skills, and projects.` : ""}

Start with a warm welcome and ask the first interview question. Keep it conversational but professional.
For technical questions, be specific. For behavioral questions, use STAR method guidance.`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 500,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: "Start the interview." },
      ],
    });

    const firstQuestion = completion.choices[0].message.content;
    const interview = await Interview.create({
      userId: req.user?._id,
      sessionId,
      jobTitle: jobTitle.trim(),
      jobDescription,
      resumeText,
      difficulty,
      type,
      questions: [{ question: firstQuestion, timestamp: new Date() }],
    });

    await trackUsage(req.user?._id, completion.usage.total_tokens);
    return sendSuccess(res, { sessionId, question: firstQuestion, interviewId: interview._id }, "Interview started", 201);
  } catch (error) {
    logger.error(`Start interview error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

// ─── MOCK INTERVIEW: ANSWER ──────────────────────────────────────────────────
export const answerInterview = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;
    const interview = await Interview.findOne({ sessionId });
    if (!interview) return sendError(res, "Interview session not found", 404);
    if (interview.status === "completed") return sendError(res, "Interview already completed", 400);

    const history = interview.questions.map((q) => [
      { role: "assistant", content: q.question },
      ...(q.answer ? [{ role: "user", content: q.answer }] : []),
    ]).flat();

    const systemPrompt = `You are interviewing for "${interview.jobTitle}".
    ${interview.resumeText ? `Candidate resume context:\n${interview.resumeText.substring(0, 2000)}\n` : ""}
    You have asked ${interview.questions.length} question(s) so far.
    ${interview.questions.length >= 8 ? "This should be the last question or wrap up." : "Continue with the next question."}
    
    After the candidate's answer:
    1. Give brief constructive feedback on their answer (1-2 sentences)
    2. Either ask the next question OR if 8+ questions have been asked, say "Thank you for your time. The interview is now complete."
    
    IMPORTANT: Return ONLY valid JSON, no markdown, no code fences:
    {"feedback":"...","nextQuestion":"..." or null,"isComplete":false}`;

    const result = await groqJSON([
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: answer },
    ]);

    const lastQ = interview.questions[interview.questions.length - 1];
    lastQ.answer = answer;
    lastQ.feedback = result.feedback;

    if (result.nextQuestion && !result.isComplete) {
      interview.questions.push({ question: result.nextQuestion, timestamp: new Date() });
    }

    if (result.isComplete) {
      interview.status = "completed";
      interview.completedAt = new Date();
      interview.totalQuestions = interview.questions.length;
    }

    interview.tokensUsed = (interview.tokensUsed || 0) + 600;
    await interview.save();
    await trackUsage(req.user?._id, 600);

    return sendSuccess(res, {
      feedback: result.feedback,
      nextQuestion: result.nextQuestion,
      isComplete: result.isComplete,
      questionNumber: interview.questions.length,
    });
  } catch (error) {
    logger.error(`Answer interview error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

// ─── MOCK INTERVIEW: SUMMARY ─────────────────────────────────────────────────
export const getInterviewSummary = async (req, res) => {
  try {
    const interview = await Interview.findOne({ sessionId: req.params.sessionId });
    if (!interview) return sendError(res, "Interview not found", 404);

    if (interview.summary) return sendSuccess(res, interview);

    const qa = interview.questions
      .filter((q) => q.answer)
      .map((q) => `Q: ${q.question}\nA: ${q.answer}`)
      .join("\n\n");

    const result = await groqJSON([
      {
        role: "system",
        content: `Analyze this mock interview for "${interview.jobTitle}" and provide a comprehensive evaluation.
        IMPORTANT: Return ONLY valid JSON, no markdown, no code fences:
        {"overallScore":85,"summary":"...","strengths":["..."],"improvements":["..."],"technicalScore":80,"communicationScore":85,"problemSolvingScore":75,"recommendation":"..."}`,
      },
      { role: "user", content: qa },
    ]);

    Object.assign(interview, result);
    await interview.save();
    await trackUsage(req.user?._id, 1000);

    return sendSuccess(res, interview);
  } catch (error) {
    logger.error(`Interview summary error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

// ─── CAREER ADVISOR ──────────────────────────────────────────────────────────
// @desc    Generate a structured career roadmap from a goal
// @route   POST /api/ai/career/advice
export const getCareerAdvice = async (req, res) => {
  try {
    const { question, currentRole, skills, experience } = req.body;
    if (!question || !question.trim()) {
      return sendError(res, "A career goal is required", 400);
    }

    const result = await groqJSON([
      {
        role: "system",
        content:
          "You are an expert career advisor with 20+ years of experience in the tech industry. Return ONLY valid JSON, no markdown, no explanation.",
      },
      {
        role: "user",
        content: `Create a practical, realistic career roadmap for this goal: "${question}".
${currentRole ? `Current role: ${currentRole}` : ""}
${skills?.length ? `Current skills: ${skills.join(", ")}` : ""}
${experience ? `Years of experience: ${experience}` : ""}

IMPORTANT: Return ONLY valid JSON with this exact structure, no markdown, no code fences:
{
  "requiredSkills": ["skill1", "skill2", "..."],
  "timeline": "a short paragraph estimating total time needed and major phases, like a timetable in prose",
  "jobRoles": ["role title 1", "role title 2", "..."],
  "roadmap": [
    {"step": "short step title", "detail": "1-2 sentence explanation of what to do in this step"}
  ],
  "projects": ["project idea 1 with a one-line description", "..."],
  "tips": ["practical tip 1", "..."]
}

Make the roadmap 5-8 sequential, genuinely actionable steps.`,
      },
    ]);

    await trackUsage(req.user?._id, 1500);
    return sendSuccess(res, result);
  } catch (error) {
    logger.error(`Career advice error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

// ─── CAREER ROADMAP ──────────────────────────────────────────────────────────
export const generateRoadmap = async (req, res) => {
  try {
    const { currentRole, targetRole, timeframe, skills } = req.body;

    const result = await groqJSON([
      { role: "system", content: "You are a career roadmap expert. Return ONLY valid JSON, no markdown, no explanation." },
      {
        role: "user",
        content: `Create a detailed career roadmap from "${currentRole}" to "${targetRole}" within ${timeframe || "12 months"}.
Current skills: ${skills?.join(", ")}

IMPORTANT: Return ONLY valid JSON with this exact structure, no markdown, no code fences:
{"title":"...","overview":"...","milestones":[{"month":1,"title":"...","tasks":["..."],"skills":["..."],"resources":["..."]}],"totalDuration":"...","keySkills":["..."],"estimatedSalaryIncrease":"..."}`,
      },
    ]);

    await trackUsage(req.user?._id, 2000);
    return sendSuccess(res, { roadmap: result, tokensUsed: 2000 });
  } catch (error) {
    logger.error(`Roadmap error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

// ─── AI USAGE STATS ──────────────────────────────────────────────────────────
export const getAIStats = async (req, res) => {
  try {
    const users = await User.find({}, "name email aiUsage").sort({ "aiUsage.totalTokens": -1 });
    const total = users.reduce((acc, u) => ({
      tokens: acc.tokens + (u.aiUsage?.totalTokens || 0),
      requests: acc.requests + (u.aiUsage?.totalRequests || 0),
    }), { tokens: 0, requests: 0 });

    const interviews = await Interview.countDocuments();
    const completedInterviews = await Interview.countDocuments({ status: "completed" });

    return sendSuccess(res, { total, users, interviews: { total: interviews, completed: completedInterviews } });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};