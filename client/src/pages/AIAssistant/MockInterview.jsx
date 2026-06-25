import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Square,
  Loader2,
  Sparkles,
  Download,
  CheckCircle2,
  MessageCircle,
  Video as VideoIcon,
  Upload,
  CloudUpload,
  AlertCircle,
  SkipForward,
  RotateCcw,
} from "lucide-react";
import {
  startInterviewSession,
  submitInterviewAnswer,
  getInterviewSummaryAPI,
  textToSpeechAPI,
  transcribeAudioAPI,
  uploadInterviewRecordingAPI,
} from "../../services/aiService";

/* ─── tiny score block used in the finished screen ─── */
function ScoreBlock({ label, value, color }) {
  const barColor =
    color === "blue"
      ? "from-[#4AA8FF] to-[#4AA8FF]/40"
      : color === "teal"
      ? "from-[#3FE0D0] to-[#3FE0D0]/40"
      : "from-[#A78BFA] to-[#A78BFA]/40";

  return (
    <div className="rounded-xl border border-white/10 bg-[#0B0C10] p-4 text-center relative overflow-hidden">
      <div
        className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${barColor}`}
      />
      <p className="font-display text-2xl font-bold text-white">
        {value ?? "—"}
      </p>
      <p className="text-xs text-[#9AA4B2] uppercase tracking-wide mt-1">
        {label}
      </p>
    </div>
  );
}

/* ─── single feedback entry ─── */
function FeedbackItem({ index, question, answer, feedback }) {
  return (
    <div className="pb-5 border-b border-white/5 last:border-0 last:pb-0">
      <p className="text-sm font-semibold text-white mb-1">
        Q{index + 1}. {question}
      </p>
      <p className="text-sm text-[#9AA4B2] mb-2 leading-relaxed">{answer}</p>
      <p className="text-sm text-[#7FC8FF] italic leading-relaxed">
        {feedback}
      </p>
    </div>
  );
}

/* ─── progress dots ─── */
function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center gap-1.5 justify-center mb-4">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`block w-2 h-2 rounded-full transition-all duration-300 ${
            i < current
              ? "bg-[#3FE0D0]"
              : i === current - 1
              ? "bg-[#4AA8FF] scale-125"
              : "bg-white/15"
          }`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function MockInterviewLive() {
  /* ── stage: setup → live → finished ── */
  const [stage, setStage] = useState("setup");

  /* ── setup fields ── */
  const [jobTitle, setJobTitle] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  /* ── live-interview state ── */
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [feedbackLog, setFeedbackLog] = useState([]);
  const [speaking, setSpeaking] = useState(false);

  const [answerText, setAnswerText] = useState("");
  const [recordingAnswer, setRecordingAnswer] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  /* ── finished state ── */
  const [summary, setSummary] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [cloudUrl, setCloudUrl] = useState(null);
  const [uploadingRecording, setUploadingRecording] = useState(false);

  /* ── refs ── */
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const sessionRecorderRef = useRef(null);
  const sessionChunksRef = useRef([]);
  const answerRecorderRef = useRef(null);
  const answerChunksRef = useRef([]);
  const audioRef = useRef(null);
  const setupFormRef = useRef(null);

  /* cleanup on unmount */
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioRef.current?.pause();
    };
  }, []);

  /* ── file upload handler ── */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target.result);
    reader.readAsText(file);
  }, []);

  /* ── text-to-speech ── */
  const playQuestion = useCallback(async (text) => {
    try {
      /* stop any previous speech */
      audioRef.current?.pause();
      setSpeaking(true);

      const url = await textToSpeechAPI(text);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch {
      setSpeaking(false);
    }
  }, []);

  /* ── start session ── */
  const startSession = async (e) => {
    e?.preventDefault();

    const trimmed = jobTitle.trim();
    if (!trimmed) {
      setError("Please enter the role you're interviewing for.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      /* 1. acquire camera + mic */
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      /* 2. create backend session */
      const { sessionId: sid, question: firstQ, totalQuestions: total } =
        await startInterviewSession(trimmed, resumeText);

      setSessionId(sid);
      setQuestion(firstQ);
      setQuestionNumber(1);
      setTotalQuestions(total ?? 5);

      /* 3. start full-session video recording */
      sessionChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) sessionChunksRef.current.push(ev.data);
      };
      recorder.start(1000);
      sessionRecorderRef.current = recorder;

      /* 4. transition */
      setStage("live");
      playQuestion(firstQ);
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Camera/microphone access was denied — please allow it and try again.");
      } else if (err.name === "NotFoundError") {
        setError("No camera or microphone detected. Please connect a device and retry.");
      } else {
        setError(err.message || "Couldn't start the interview. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── answer recording ── */
  const startAnswerRecording = useCallback(() => {
    if (!streamRef.current) return;
    answerChunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorder.ondataavailable = (ev) => {
      if (ev.data.size > 0) answerChunksRef.current.push(ev.data);
    };
    recorder.start();
    answerRecorderRef.current = recorder;
    setRecordingAnswer(true);
  }, []);

  const stopAnswerRecording = useCallback(
    () =>
      new Promise((resolve) => {
        const recorder = answerRecorderRef.current;
        if (!recorder || recorder.state === "inactive") return resolve(null);
        recorder.onstop = () =>
          resolve(
            new Blob(answerChunksRef.current, { type: "audio/webm" })
          );
        recorder.stop();
        setRecordingAnswer(false);
      }),
    []
  );

  const handleStopAndTranscribe = async () => {
    setTranscribing(true);
    setError("");
    try {
      const blob = await stopAnswerRecording();
      if (blob && blob.size > 0) {
        const text = await transcribeAudioAPI(blob);
        setAnswerText((prev) =>
          prev ? `${prev.trim()} ${text}` : text
        );
      }
    } catch {
      setError("Couldn't transcribe that clip — you can type or edit your answer below.");
    } finally {
      setTranscribing(false);
    }
  };

  /* ── finish interview ── */
  const finishInterview = async (sid) => {
    /* stop session recorder */
    const recorder = sessionRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      await new Promise((resolve) => {
        recorder.onstop = resolve;
        recorder.stop();
      });
    }
    /* stop camera */
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioRef.current?.pause();

    /* build download blob */
    const fullBlob = new Blob(sessionChunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(fullBlob);
    setRecordingUrl(url);

    /* upload to cloud (non-fatal) */
    setUploadingRecording(true);
    try {
      const cloud = await uploadInterviewRecordingAPI(sid, fullBlob);
      setCloudUrl(cloud);
    } catch {
      /* local download still works */
    } finally {
      setUploadingRecording(false);
    }

    /* get summary (non-fatal) */
    try {
      const data = await getInterviewSummaryAPI(sid);
      setSummary(data);
    } catch {
      /* report stays empty */
    }

    setStage("finished");
  };

  /* ── submit answer ── */
  const submitAnswer = async () => {
    const trimmed = answerText.trim();
    if (!trimmed) {
      setError("Please record or type an answer before submitting.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const result = await submitInterviewAnswer(sessionId, trimmed);
      setFeedbackLog((prev) => [
        ...prev,
        { question, answer: trimmed, feedback: result.feedback },
      ]);
      setAnswerText("");

      if (result.isComplete) {
        await finishInterview(sessionId);
      } else {
        setQuestion(result.nextQuestion);
        setQuestionNumber(result.questionNumber ?? questionNumber + 1);
        if (result.totalQuestions) setTotalQuestions(result.totalQuestions);
        playQuestion(result.nextQuestion);
      }
    } catch (err) {
      setError(err.message || "Something went wrong submitting your answer.");
    } finally {
      setLoading(false);
    }
  };

  /* ── skip question (submit empty, let AI move on) ── */
  const skipQuestion = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await submitInterviewAnswer(
        sessionId,
        "[Skipped — no answer provided]"
      );
      setFeedbackLog((prev) => [
        ...prev,
        { question, answer: "[Skipped]", feedback: result.feedback },
      ]);
      setAnswerText("");

      if (result.isComplete) {
        await finishInterview(sessionId);
      } else {
        setQuestion(result.nextQuestion);
        setQuestionNumber(result.questionNumber ?? questionNumber + 1);
        playQuestion(result.nextQuestion);
      }
    } catch (err) {
      setError(err.message || "Couldn't skip the question.");
    } finally {
      setLoading(false);
    }
  };

  /* ── reset everything ── */
  const resetInterview = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioRef.current?.pause();
    if (recordingUrl) URL.revokeObjectURL(recordingUrl);

    setStage("setup");
    setSessionId(null);
    setQuestion("");
    setQuestionNumber(1);
    setTotalQuestions(5);
    setFeedbackLog([]);
    setSpeaking(false);
    setAnswerText("");
    setRecordingAnswer(false);
    setTranscribing(false);
    setSummary(null);
    setRecordingUrl(null);
    setCloudUrl(null);
    setUploadingRecording(false);
    setError("");
    setLoading(false);
  };

  /* ═════════════ RENDER ═════════════ */
  return (
    <section className="relative w-full min-h-screen bg-[#0B0C10] text-[#E6E8EB] py-24 px-4 sm:px-6 font-[Inter] overflow-hidden">
      {/* ── ambient blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-48 -left-36 w-[600px] h-[600px] rounded-full bg-[#4AA8FF]/10 blur-[140px] animate-[blobA_22s_ease-in-out_infinite]" />
        <div className="absolute -bottom-48 -right-36 w-[500px] h-[500px] rounded-full bg-[#3FE0D0]/10 blur-[140px] animate-[blobB_26s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-3/5 w-[300px] h-[300px] rounded-full bg-[#8B5CF6]/8 blur-[120px] animate-[blobC_18s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        @keyframes pulseRing { 0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.45); } 50% { box-shadow: 0 0 0 10px rgba(239,68,68,0); } }
        .recording-pulse { animation: pulseRing 1.5s infinite; }
        @keyframes blobA { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(60px,80px) scale(1.08)} 70%{transform:translate(-30px,40px) scale(.95)} }
        @keyframes blobB { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-50px,-70px) scale(1.05)} 65%{transform:translate(40px,-30px) scale(.92)} }
        @keyframes blobC { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-80px,50px) scale(1.12)} }
      `}</style>

      <div className="relative z-10 container mx-auto max-w-4xl">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white leading-tight">
            Live Mock{" "}
            <span className="bg-gradient-to-r from-[#4AA8FF] to-[#3FE0D0] bg-clip-text text-transparent">
              Interview
            </span>
          </h1>
          <p className="mt-3 text-[#9AA4B2] text-base max-w-xl mx-auto leading-relaxed">
            Speak your answers, get AI questions tailored to your resume, and
            download the full recording at the end.
          </p>
        </motion.div>

        {/* ════════════════════════════════════════
            SETUP STAGE
            ════════════════════════════════════════ */}
        {stage === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl"
          >
            <form ref={setupFormRef} onSubmit={startSession} className="space-y-5">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-medium tracking-[0.12em] text-[#9AA4B2] uppercase mb-2">
                  Role You're Interviewing For
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. Full Stack Developer"
                  autoFocus
                  className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all"
                />
              </div>

              {/* Resume */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium tracking-[0.12em] text-[#9AA4B2] uppercase">
                    Resume (optional, tailors the questions)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-mono text-[#7FC8FF] hover:text-[#3FE0D0] cursor-pointer transition-colors">
                    <Upload size={13} />
                    {fileName ? fileName : "Upload .txt"}
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  rows={6}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none resize-none font-mono leading-relaxed transition-all"
                />
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-sm text-red-400"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10] font-display font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 hover:shadow-[0_0_30px_rgba(74,168,255,0.25)] transition-shadow duration-300"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <VideoIcon size={18} />
                )}
                {loading ? "Starting..." : "Start Interview (enables camera + mic)"}
              </button>
              <p className="text-xs text-[#5B6470] text-center">
                Your browser will ask for camera and microphone permission.
              </p>
            </form>
          </motion.div>
        )}

        {/* ════════════════════════════════════════
            LIVE STAGE
            ════════════════════════════════════════ */}
        {stage === "live" && (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* progress dots */}
            <ProgressDots current={questionNumber} total={totalQuestions} />

            <div className="grid sm:grid-cols-2 gap-6">
              {/* ── Video Panel ── */}
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black relative aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* recording badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white">
                  <span className="w-2 h-2 rounded-full bg-red-500 recording-pulse" />
                  Recording session
                </div>
                {/* question counter badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white font-medium">
                  {questionNumber} / {totalQuestions}
                </div>
              </div>

              {/* ── Question + Answer Panel ── */}
              <div className="rounded-2xl p-5 sm:p-6 border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col gap-3">
                {/* question */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#9AA4B2] mb-1.5">
                    Question {questionNumber}
                  </p>
                  <p className="text-base text-white leading-relaxed">
                    {question}
                    {speaking && (
                      <span className="text-[#3FE0D0] text-xs ml-1.5 inline-flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3FE0D0] animate-pulse" />
                        speaking...
                      </span>
                    )}
                  </p>
                </div>

                {/* answer textarea */}
                <textarea
                  rows={5}
                  value={answerText}
                  onChange={(e) => {
                    setAnswerText(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Your transcribed answer will appear here — you can also type or edit it directly."
                  className="flex-1 w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none resize-none leading-relaxed transition-all"
                />

                {/* error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1.5 text-xs text-red-400"
                  >
                    <AlertCircle size={12} /> {error}
                  </motion.p>
                )}

                {/* action buttons */}
                <div className="flex items-center gap-2">
                  {!recordingAnswer ? (
                    <button
                      type="button"
                      onClick={startAnswerRecording}
                      disabled={transcribing || loading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-[#E6E8EB] hover:border-[#4AA8FF]/40 hover:bg-white/[0.03] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                    >
                      <Mic size={15} /> Record Answer
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopAndTranscribe}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 hover:bg-red-500/25 transition-all text-sm"
                    >
                      <Square size={15} /> Stop & Transcribe
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={submitAnswer}
                    disabled={loading || recordingAnswer || transcribing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(74,168,255,0.2)] transition-all text-sm"
                  >
                    {loading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Sparkles size={15} />
                    )}
                    Submit Answer
                  </button>
                </div>

                {/* skip + status row */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={skipQuestion}
                    disabled={loading || recordingAnswer || transcribing}
                    className="flex items-center gap-1.5 text-xs text-[#5B6470] hover:text-[#9AA4B2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <SkipForward size={12} /> Skip question
                  </button>
                  {transcribing && (
                    <span className="flex items-center gap-1.5 text-xs text-[#9AA4B2]">
                      <Loader2 size={12} className="animate-spin" />
                      Transcribing your answer...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════
            FINISHED STAGE
            ════════════════════════════════════════ */}
        {stage === "finished" && (
          <AnimatePresence>
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* ── Recording Download Card ── */}
              <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-1">
                    Interview Recording
                  </h3>
                  <p className="text-sm text-[#9AA4B2] flex items-center gap-2">
                    {uploadingRecording ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Uploading
                        to cloud storage...
                      </>
                    ) : cloudUrl ? (
                      <>
                        <CloudUpload
                          size={14}
                          className="text-[#3FE0D0]"
                        />{" "}
                        Saved to cloud storage
                      </>
                    ) : (
                      "Cloud upload unavailable — local download still works."
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {recordingUrl && (
                    <a
                      href={recordingUrl}
                      download={`interview-${sessionId}.webm`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10] font-semibold text-sm hover:shadow-[0_0_20px_rgba(74,168,255,0.2)] transition-shadow"
                    >
                      <Download size={16} /> Download Recording
                    </a>
                  )}
                </div>
              </div>

              {/* ── Performance Report ── */}
              {summary && (
                <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                  <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      className="text-[#3FE0D0]"
                    />{" "}
                    Performance Report
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    <ScoreBlock
                      label="Overall"
                      value={summary.overallScore}
                      color="blue"
                    />
                    <ScoreBlock
                      label="Technical"
                      value={summary.technicalScore}
                      color="teal"
                    />
                    <ScoreBlock
                      label="Communication"
                      value={summary.communicationScore}
                      color="purple"
                    />
                  </div>
                  <p className="text-sm text-[#9AA4B2] leading-relaxed mb-4">
                    {summary.summary}
                  </p>
                  {summary.improvements?.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-[#9AA4B2] mb-2 font-medium">
                        Areas for Improvement
                      </p>
                      <ul className="space-y-1.5">
                        {summary.improvements.map((imp, i) => (
                          <li
                            key={i}
                            className="text-sm text-[#9AA4B2] pl-3 border-l-2 border-[#4AA8FF]/30 leading-relaxed"
                          >
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ── Question-by-Question Feedback ── */}
              {feedbackLog.length > 0 && (
                <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                  <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MessageCircle
                      size={18}
                      className="text-[#4AA8FF]"
                    />{" "}
                    Question-by-Question Feedback
                  </h3>
                  <div className="space-y-5">
                    {feedbackLog.map((item, i) => (
                      <FeedbackItem
                        key={i}
                        index={i}
                        question={item.question}
                        answer={item.answer}
                        feedback={item.feedback}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Restart Button ── */}
              <div className="flex justify-center pt-2 pb-8">
                <button
                  type="button"
                  onClick={resetInterview}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-[#9AA4B2] hover:text-white hover:border-white/25 hover:bg-white/[0.03] transition-all text-sm font-medium"
                >
                  <RotateCcw size={15} /> Start a New Interview
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}