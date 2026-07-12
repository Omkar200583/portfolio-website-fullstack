// ═══════════════════════════════════════════════════════════════
//  RESUME MODAL — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  bg: "#0A0A0A",
  card: "#171717",
  border: "rgba(212,175,55,0.15)",
  borderLight: "rgba(212,175,55,0.08)",
  fg: "#FFFFFF",
  muted: "#A3A3A3",
  accent: "#D4AF37",
  accentDim: "rgba(212,175,55,0.1)",
  tag: "#1A1A1A",
  green: "#5cb870",
  amber: "#F0D060",
};

const resumeData = {
  name: "Omkar Nilkanth Jadhav",
  title: "Full Stack Developer | Software Developer",
  location: "Pune, Maharashtra, India",
  phone: "+91 9359873623",
  email: "omkarjadhav415523@gmail.com",
  summary:
    "Results-driven Computer Science undergraduate and Full Stack Developer with hands-on experience building secure, scalable web applications using the MERN stack and PostgreSQL/MySQL. Delivered authentication systems (JWT, OAuth 2.0, Email OTP, bcrypt), RESTful APIs, and responsive UIs across two internships, completing 6+ full-stack and frontend projects.",
  skills: {
    Languages: ["JavaScript", "Java (Learning)", "SQL"],
    Frontend: ["HTML5", "CSS3", "Bootstrap", "Tailwind CSS", "React.js"],
    Backend: ["Node.js", "Express.js", "REST API Design"],
    Databases: ["PostgreSQL", "MySQL", "MongoDB", "Sequelize ORM"],
    Security: ["JWT", "OAuth 2.0", "bcrypt", "Email OTP", "Session Mgmt"],
    Tools: ["Git", "GitHub", "VS Code", "Postman"],
  },
  experience: [
    {
      company: "Athenura",
      role: "Full Stack Development Intern",
      dates: "Mar 2026 – Present",
      bullets: [
        "Engineered secure authentication using JWT & OAuth 2.0, reducing unauthorized access risk",
        "Implemented Email OTP verification and bcrypt password hashing for 100% of registered users",
        "Built and optimized session management workflows, improving login persistence",
        "Delivered full-stack features end-to-end in an Agile environment",
      ],
    },
    {
      company: "SkillEcted",
      role: "Full Stack Development Intern",
      dates: "Jun 2025 – Feb 2026",
      bullets: [
        "Developed 10+ responsive, cross-browser web pages using HTML5, CSS3, and JavaScript",
        "Designed and executed CRUD operations on MySQL databases",
        "Collaborated with 5-member team using Git/GitHub, reducing merge conflicts",
        "Performed systematic testing and debugging, reducing production defects",
      ],
    },
  ],
  projects: [
    {
      title: "Student Management System",
      type: "Full Stack",
      bullets: ["Role-based access control (admin, faculty, student) with Node.js, Express, PostgreSQL", "Normalized schemas with Sequelize ORM and secure RESTful APIs"],
    },
    {
      title: "Professional Portfolio Website",
      type: "Personal",
      bullets: ["Fully responsive portfolio with SEO optimization"],
    },
    {
      title: "E-Commerce Clones & API Integration",
      type: "Projects",
      bullets: ["Replicated Amazon/Myntra features with React.js", "Built To-Do app with third-party REST API integration"],
    },
  ],
  education: "B.Sc. Computer Science — Savitribai Phule Pune University",
  certs: [
    "Full Stack Web Development Internship Certification",
    "Citi Technology – Software Development Job Simulation (Forage)",
  ],
  achievements: [
    "Delivered 6+ full-stack and frontend projects",
    "Implemented JWT, OAuth 2.0, bcrypt, OTP across internships",
    "Active GitHub portfolio with consistent contributions",
  ],
};

export default function ResumeModal({ isOpen, onClose }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={S.backdrop}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            style={S.modal}
          >
            {/* Header */}
            <div style={S.header}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={S.hIcon}>📄</div>
                <div>
                  <div style={S.hTitle}>Resume Preview</div>
                  <div style={S.hSub}>Omkar Jadhav — Full Stack Developer</div>
                </div>
              </div>
              <div style={S.hActions}>
              <a
 href="/resume/Omkar_Jadhav_Resume.pdf"
 download="Omkar_Jadhav_Resume.pdf"
 style={S.dlBtn}
 onClick={(e)=>e.stopPropagation()}
>
                  ⬇ Download PDF
                </a>
                <a
 href="/resume/Omkar_Jadhav_Resume.pdf"
 target="_blank"
 rel="noopener noreferrer"
 style={S.viewBtn}
 onClick={(e)=>e.stopPropagation()}
>
                  ↗ Full Page
                </a>
                <button onClick={onClose} style={S.closeBtn} aria-label="Close">✕</button>
              </div>
            </div>

            {/* Body */}
            <div style={S.body}>
              <div style={S.nameBlock}>
                <h1 style={S.name}>
                  {resumeData.name.split(" ").slice(0, -1).join(" ")}{" "}
                  <span style={{ color: C.accent }}>{resumeData.name.split(" ").slice(-1)}</span>
                </h1>
                <p style={S.roleText}>{resumeData.title}</p>
                <div style={S.contactRow}>
                  <span>📍 {resumeData.location}</span>
                  <span>📞 {resumeData.phone}</span>
                  <span>✉ {resumeData.email}</span>
                </div>
              </div>

              <Section icon="📝" title="Summary">
                <p style={S.text}>{resumeData.summary}</p>
              </Section>

              <Section icon="⚙" title="Technical Skills">
                <div style={S.skillsGrid}>
                  {Object.entries(resumeData.skills).map(([cat, items]) => (
                    <div key={cat}>
                      <div style={S.catLabel}>{cat}</div>
                      <div style={S.tagWrap}>
                        {items.map((s) => <span key={s} style={S.tag}>{s}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section icon="💼" title="Experience">
                <div style={S.tlWrap}>
                  {resumeData.experience.map((exp, i) => (
                    <div key={exp.company} style={S.tlItem}>
                      <div style={S.tlDot} />
                      {i < resumeData.experience.length - 1 && <div style={S.tlLine} />}
                      <div style={S.tlCard}>
                        <div style={S.tlDate}>{exp.dates}</div>
                        <div style={S.tlRole}>{exp.role}</div>
                        <div style={S.tlCompany}>🏢 {exp.company}</div>
                        <ul style={S.bullets}>
                          {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section icon="🚀" title="Projects">
                <div style={S.projGrid}>
                  {resumeData.projects.map((p) => (
                    <div key={p.title} style={S.projCard}>
                      <div style={S.projType}>{p.type}</div>
                      <div style={S.projTitle}>{p.title}</div>
                      <ul style={S.bullets}>
                        {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>

              <Section icon="🎓" title="Education">
                <div style={S.eduCard}>🎓 {resumeData.education}</div>
              </Section>

              <div style={S.bottomGrid}>
                <Section icon="🏆" title="Certifications">
                  {resumeData.certs.map((c) => (
                    <div key={c} style={S.listItem}><span style={{ color: C.accent, marginRight: 8 }}>◆</span>{c}</div>
                  ))}
                </Section>
                <Section icon="⭐" title="Achievements">
                  {resumeData.achievements.map((a) => (
                    <div key={a} style={S.listItem}><span style={{ color: C.amber, marginRight: 8 }}>★</span>{a}</div>
                  ))}
                </Section>
              </div>

              <div style={{ height: 24 }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ icon, title, children }) {
  return (
    <div style={S.section}>
      <div style={S.sectionHead}>
        <span style={S.sectionIcon}>{icon}</span>
        <h3 style={S.sectionTitle}>{title}</h3>
        <div style={S.sectionLine} />
      </div>
      {children}
    </div>
  );
}

const S = {
  backdrop: {
    position: "fixed", inset: 0, zIndex: 9999,
    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
  },
  modal: {
    width: "100%", maxWidth: 780, maxHeight: "90vh",
    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
    overflow: "hidden", display: "flex", flexDirection: "column",
    boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 20px", background: C.card, borderBottom: `1px solid ${C.border}`,
    flexShrink: 0, gap: 12, flexWrap: "wrap",
  },
  hIcon: { width: 36, height: 36, borderRadius: 8, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 },
  hTitle: { fontSize: 14, fontWeight: 600, color: C.fg },
  hSub: { fontSize: 11, color: C.muted, marginTop: 1 },
  hActions: { display: "flex", alignItems: "center", gap: 8 },
  dlBtn: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 16px", borderRadius: 8, background: C.accent, color: "#0A0A0A",
    fontSize: 12, fontWeight: 600, textDecoration: "none", cursor: "pointer",
  },
  viewBtn: {
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "8px 14px", borderRadius: 8, background: C.accentDim, color: C.accent,
    fontSize: 12, fontWeight: 600, textDecoration: "none",
    border: `1px solid rgba(212,175,55,0.2)`, cursor: "pointer",
  },
  closeBtn: {
    width: 34, height: 34, borderRadius: 8, background: "transparent",
    border: `1px solid ${C.border}`, color: C.muted, fontSize: 16,
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  body: { flex: 1, overflowY: "auto", padding: "28px 24px", scrollbarWidth: "thin", scrollbarColor: `${C.border} transparent` },
  nameBlock: { textAlign: "center", marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${C.border}` },
  name: { fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 32, margin: "0 0 8px", lineHeight: 1.1, color: C.fg },
  roleText: { fontSize: 13, color: C.muted, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 16px" },
  contactRow: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 20px", fontSize: 12, color: C.muted },
  section: { marginBottom: 24 },
  sectionHead: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 },
  sectionIcon: { width: 28, height: 28, borderRadius: 6, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: C.fg, margin: 0, whiteSpace: "nowrap" },
  sectionLine: { flex: 1, height: 1, background: `linear-gradient(90deg, ${C.border}, transparent)` },
  text: { fontSize: 13, color: C.muted, lineHeight: 1.75, margin: 0 },
  skillsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  catLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: C.accent, fontWeight: 600, marginBottom: 6 },
  tagWrap: { display: "flex", flexWrap: "wrap", gap: 5 },
  tag: { background: C.tag, color: C.muted, padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 500, border: `1px solid ${C.borderLight}` },
  tlWrap: { paddingLeft: 16, position: "relative" },
  tlItem: { position: "relative", marginBottom: 4 },
  tlDot: { position: "absolute", left: -4, top: 6, width: 10, height: 10, borderRadius: "50%", background: C.accent, border: `2px solid ${C.bg}`, zIndex: 2 },
  tlLine: { position: "absolute", left: 0, top: 18, bottom: -16, width: 2, background: C.border },
  tlCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 },
  tlDate: { display: "inline-block", background: C.accentDim, color: C.accent, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, marginBottom: 8 },
  tlRole: { fontSize: 14, fontWeight: 700, color: C.fg, marginBottom: 2 },
  tlCompany: { fontSize: 12, color: C.muted, marginBottom: 10 },
  bullets: { paddingLeft: 14, margin: 0, listStyle: "disc", color: C.muted, fontSize: 12, lineHeight: 1.7 },
  projGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  projCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" },
  projType: { display: "inline-block", background: "rgba(92,184,112,0.1)", color: C.green, fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 },
  projTitle: { fontSize: 13, fontWeight: 700, color: C.fg, marginBottom: 8, lineHeight: 1.3 },
  eduCard: { display: "flex", alignItems: "center", gap: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.muted },
  bottomGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  listItem: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 8 },
};