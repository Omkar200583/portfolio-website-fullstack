
// ═══════════════════════════════════════════════════════════════
//  RESUME (Full Page) — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef } from "react";

const C = {
  bg: "#0A0A0A",
  card: "#171717",
  cardH: "#1E1E1E",
  border: "rgba(212,175,55,0.12)",
  fg: "#FFFFFF",
  muted: "#A3A3A3",
  accent: "#D4AF37",
  accentDim: "rgba(212,175,55,0.1)",
  accentGlow: "rgba(212,175,55,0.25)",
  tag: "#1A1A1A",
  tagText: "#A3A3A3",
  green: "#5cb870",
};

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function useCounter(target, duration = 1500) {
  const [val, setVal] = useState(0);
  const [run, setRun] = useState(false);
  const start = () => setRun(true);
  useEffect(() => {
    if (!run) return;
    let frame; const t0 = performance.now();
    const step = (now) => { const p = Math.min((now - t0) / duration, 1); const ease = 1 - Math.pow(1 - p, 3); setVal(Math.round(ease * target)); if (p < 1) frame = requestAnimationFrame(step); };
    frame = requestAnimationFrame(step); return () => cancelAnimationFrame(frame);
  }, [run, target, duration]);
  return [val, start];
}

function SkillBar({ label, pct, delay, visible }) {
  const [w, setW] = useState(0);
  useEffect(() => { if (!visible) return; const t = setTimeout(() => setW(pct), delay); return () => clearTimeout(t); }, [visible, pct, delay]);
  return (
    <div style={S.skillRow}>
      <span style={S.skillLabel}>{label}</span>
      <div style={S.skillTrack}><div style={{ ...S.skillFill, width: `${w}%`, transition: "width 1s cubic-bezier(.22,1,.36,1)" }} /></div>
      <span style={S.skillPct}>{pct}%</span>
    </div>
  );
}

function Heading({ icon, text }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ ...S.heading, opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all .55s cubic-bezier(.22,1,.36,1)" }}>
      <span style={S.headingIcon}>{icon}</span><h2 style={S.headingText}>{text}</h2><div style={S.headingLine} />
    </div>
  );
}

function TimelineItem({ company, role, dates, bullets, idx }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ ...S.tlItem, opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-30px)", transition: `all .65s cubic-bezier(.22,1,.36,1) ${idx * 0.1}s` }}>
      <div style={S.tlDot} /><div style={S.tlCard}>
        <span style={S.tlDate}>{dates}</span><h3 style={S.tlRole}>{role}</h3>
        <p style={S.tlCompany}><i className="fa-solid fa-building" style={{ marginRight: 6, color: C.accent, fontSize: 12 }} />{company}</p>
        <ul style={S.tlBullets}>{bullets.map((b, i) => <li key={i} style={S.tlBullet}>{b}</li>)}</ul>
      </div>
    </div>
  );
}

function ProjectCard({ title, type, bullets, idx }) {
  const [ref, vis] = useReveal();
  const [hover, setHover] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...S.projCard, borderColor: hover ? C.accent : C.border, boxShadow: hover ? `0 8px 32px ${C.accentDim}` : "none", transform: vis ? "translateY(0)" : "translateY(24px)", opacity: vis ? 1 : 0, transition: `all .5s cubic-bezier(.22,1,.36,1) ${idx * 0.08}s` }}
    >
      <span style={S.projType}>{type}</span><h3 style={S.projTitle}>{title}</h3>
      <ul style={S.projBullets}>{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
    </div>
  );
}

function Stat({ num, label, suffix = "" }) {
  const [ref, vis] = useReveal();
  const [val, start] = useCounter(num);
  return (
    <div ref={ref} onMouseEnter={start} style={{ ...S.stat, opacity: vis ? 1 : 0, transform: vis ? "scale(1)" : "scale(.85)", transition: "all .5s cubic-bezier(.22,1,.36,1)" }}>
      <span style={S.statNum}>{val}{suffix}</span><span style={S.statLabel}>{label}</span>
    </div>
  );
}

export default function Resume() {
  const [printMode, setPrintMode] = useState(false);
  const handlePrint = () => { setPrintMode(true); setTimeout(() => window.print(), 250); setTimeout(() => setPrintMode(false), 800); };

  const skillCategories = { Languages: ["JavaScript", "Java (Learning)", "SQL"], Frontend: ["HTML5", "CSS3", "Bootstrap", "Tailwind CSS", "Responsive Design", "React.js"], Backend: ["Node.js", "Express.js", "REST API Design"], Databases: ["PostgreSQL", "MySQL", "MongoDB", "Sequelize ORM"], Security: ["JWT", "OAuth 2.0", "bcrypt", "Email OTP", "Session Management"], Tools: ["Git", "GitHub", "VS Code", "Postman"] };
  const skillBars = [ { label: "JavaScript / React", pct: 78 }, { label: "Node.js / Express", pct: 82 }, { label: "SQL & PostgreSQL", pct: 75 }, { label: "REST API Design", pct: 85 }, { label: "Security (JWT / OAuth)", pct: 80 }, { label: "Git & Workflow", pct: 72 } ];
  const experience = [
    { company: "Athenura", role: "Full Stack Development Intern", dates: "Mar 2026 – Present", bullets: ["Engineered a secure authentication system using JWT and OAuth 2.0, reducing unauthorized access risk", "Implemented Email OTP verification and bcrypt password hashing for 100% of registered users", "Built and optimized session management workflows, improving login persistence", "Delivered full-stack features end-to-end in an Agile development environment"] },
    { company: "SkillEcted", role: "Full Stack Development Intern", dates: "Jun 2025 – Feb 2026", bullets: ["Developed 10+ responsive, cross-browser web pages using HTML5, CSS3, and JavaScript", "Designed and executed CRUD operations on MySQL databases", "Collaborated with a 5-member team using Git/GitHub, reducing merge conflicts", "Performed systematic testing and debugging, reducing production defects"] },
  ];
  const projects = [
    { title: "Student Management System", type: "Full Stack Web Application", bullets: ["Built role-based access control supporting 3 user roles using Node.js, Express.js, and PostgreSQL", "Designed normalized database schemas with Sequelize ORM and secure RESTful APIs"] },
    { title: "Professional Portfolio Website", type: "Personal Project", bullets: ["Designed and developed a fully responsive personal portfolio with SEO optimization"] },
    { title: "E-Commerce Clones & API Integration", type: "Amazon, Myntra, To-Do App", bullets: ["Replicated core e-commerce features using React.js and modern CSS frameworks", "Built a full-featured To-Do application with third-party REST API integration"] },
  ];
  const certs = ["Full Stack Web Development Internship Certification", "Citi Technology – Software Development Job Simulation (Forage)"];
  const achievements = ["Delivered 6+ full-stack and frontend projects spanning authentication systems and e-commerce platforms", "Implemented industry-standard security practices (JWT, OAuth 2.0, bcrypt, OTP) across internship projects"];

  return (
    <div style={printMode ? S.printWrap : S.wrap}>
      <div style={S.topBar}><div style={S.topBarInner}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><i className="fa-solid fa-file-lines" style={{ color: C.accent }} /><span style={S.topBarTitle}>My Resume</span></div>
        <button onClick={handlePrint} style={S.printBtn}><i className="fa-solid fa-print" style={{ marginRight: 6 }} /> Print / Save PDF</button>
      </div></div>

      <div style={S.hero}><div style={S.heroGlow} /><div style={S.heroGrid} /><div style={S.heroContent}>
        <h1 style={S.heroName}>Omkar Nilkanth <span style={{ color: C.accent }}>Jadhav</span></h1>
        <p style={S.heroTitle}>Full Stack Developer &nbsp;|&nbsp; Software Developer</p>
        <div style={S.heroMeta}>
          <span><i className="fa-solid fa-location-dot" style={{ color: C.accent, marginRight: 5 }} />Pune, Maharashtra, India</span>
          <span><i className="fa-solid fa-phone" style={{ color: C.accent, marginRight: 5 }} />+91 9359873623</span>
          <span><i className="fa-solid fa-envelope" style={{ color: C.accent, marginRight: 5 }} />omkarjadhav415523@gmail.com</span>
        </div>
        <div style={S.heroLinks}>
          <a href="https://linkedin.com/in/omkar-jadhav-6915052a1" target="_blank" rel="noopener noreferrer" style={S.heroLinkBtn}><i className="fa-brands fa-linkedin-in" /> LinkedIn</a>
          <a href="https://github.com/Omkar200583" target="_blank" rel="noopener noreferrer" style={S.heroLinkBtn}><i className="fa-brands fa-github" /> GitHub</a>
        </div>
      </div></div>

      <div style={S.statsBar}>
        <Stat num={6} suffix="+" label="Projects Delivered" /><Stat num={2} suffix="" label="Internships" />
        <Stat num={10} suffix="+" label="Web Pages Built" /><Stat num={100} suffix="%" label="Users Secured" />
      </div>

      <section style={S.section}><Heading icon={<i className="fa-solid fa-user-tie" />} text="Professional Summary" />
        <div style={S.summaryCard}>
          <p style={S.summaryText}>Results-driven Computer Science undergraduate and Full Stack Developer with hands-on experience building secure, scalable web applications using the MERN stack and PostgreSQL/MySQL. Delivered authentication systems (JWT, OAuth 2.0, Email OTP, bcrypt), RESTful APIs, and responsive UIs across two internships, completing 6+ full-stack and frontend projects.</p>
          <div style={S.summaryHL}><i className="fa-solid fa-bullseye" style={{ color: C.accent, fontSize: 16, marginRight: 10, marginTop: 2 }} /><span>Seeking <strong>Full Stack Developer</strong>, <strong>Software Developer</strong>, or <strong>Backend Developer</strong> roles to deliver measurable business impact.</span></div>
        </div>
      </section>

      <section style={S.section}><Heading icon={<i className="fa-solid fa-layer-group" />} text="Technical Skills" />
        <div style={S.skillsGrid}>
          <div style={S.skillTagsCol}>{Object.entries(skillCategories).map(([cat, items]) => (
            <div key={cat}><h4 style={S.skillCatTitle}>{cat}</h4><div style={S.skillTagWrap}>{items.map((s) => <span key={s} style={S.skillTag}>{s}</span>)}</div></div>
          ))}</div>
          <div style={S.skillBarsCol}>{skillBars.map((s, i) => { const [ref, vis] = useReveal(); return <div key={s.label} ref={ref}><SkillBar label={s.label} pct={s.pct} delay={i * 100} visible={vis} /></div>; })}</div>
        </div>
      </section>

      <section style={S.section}><Heading icon={<i className="fa-solid fa-briefcase" />} text="Internship Experience" />
        <div style={S.tlContainer}><div style={S.tlLine} />{experience.map((exp, i) => <TimelineItem key={exp.company} {...exp} idx={i} />)}</div>
      </section>

      <section style={S.section}><Heading icon={<i className="fa-solid fa-diagram-project" />} text="Projects" />
        <div style={S.projGrid}>{projects.map((p, i) => <ProjectCard key={p.title} {...p} idx={i} />)}</div>
      </section>

      <section style={S.section}><Heading icon={<i className="fa-solid fa-graduation-cap" />} text="Education" />
        <div style={S.eduCard}><div style={S.eduIcon}><i className="fa-solid fa-university" /></div><div><h3 style={S.eduDegree}>B.Sc. Computer Science</h3><p style={S.eduSchool}>Savitribai Phule Pune University</p></div></div>
      </section>

      <section style={S.section}><div style={S.twoCol}>
        <div><Heading icon={<i className="fa-solid fa-certificate" />} text="Certifications" /><div style={S.itemList}>{certs.map((c) => <div key={c} style={S.itemCard}><i className="fa-solid fa-award" style={{ color: C.accent, marginRight: 10, marginTop: 2 }} /><span>{c}</span></div>)}</div></div>
        <div><Heading icon={<i className="fa-solid fa-trophy" />} text="Achievements" /><div style={S.itemList}>{achievements.map((a) => <div key={a} style={S.itemCard}><i className="fa-solid fa-star" style={{ color: C.accent, marginRight: 10, marginTop: 2 }} /><span>{a}</span></div>)}</div></div>
      </div></section>

      <div style={{ height: 60 }} />
      <style>{injectedCSS}</style>
    </div>
  );
}

const S = {
  wrap: { background: C.bg, color: C.fg, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, minHeight: "100vh" },
  printWrap: { background: "#fff", color: "#111", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 },
  topBar: { background: C.card, borderBottom: `1px solid ${C.border}`, padding: "14px 0", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(10px)" },
  topBarInner: { maxWidth: 960, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  topBarTitle: { fontSize: 15, fontWeight: 600 },
  printBtn: { background: C.accentDim, color: C.accent, border: `1px solid rgba(212,175,55,0.3)`, borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", transition: "all .25s" },
  hero: { position: "relative", padding: "64px 24px 48px", textAlign: "center", overflow: "hidden" },
  heroGlow: { position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)", top: -200, left: "50%", transform: "translateX(-50%)", filter: "blur(50px)", pointerEvents: "none" },
  heroGrid: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" },
  heroContent: { position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto" },
  heroName: { fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(34px, 5.5vw, 58px)", lineHeight: 1.08, margin: "0 0 12px", letterSpacing: "-0.5px", animation: "rFadeUp .7s ease both" },
  heroTitle: { fontSize: "clamp(13px, 2vw, 16px)", color: C.muted, fontWeight: 400, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 28px", animation: "rFadeUp .7s ease .1s both" },
  heroMeta: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 24px", fontSize: 13, color: C.muted, marginBottom: 28, animation: "rFadeUp .7s ease .2s both" },
  heroLinks: { display: "flex", justifyContent: "center", gap: 12, animation: "rFadeUp .7s ease .3s both" },
  heroLinkBtn: { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", border: `1px solid ${C.border}`, color: C.fg, background: C.card, transition: "all .25s" },
  statsBar: { display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap", padding: "36px 24px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: "rgba(23,23,23,0.5)" },
  stat: { textAlign: "center", minWidth: 110, cursor: "default" },
  statNum: { display: "block", fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 36, color: C.accent, lineHeight: 1.1 },
  statLabel: { display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 500, marginTop: 4 },
  section: { maxWidth: 960, margin: "0 auto", padding: "56px 24px" },
  heading: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 },
  headingIcon: { width: 36, height: 36, borderRadius: 8, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontSize: 14, flexShrink: 0 },
  headingText: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, margin: 0, whiteSpace: "nowrap" },
  headingLine: { flex: 1, height: 1, background: `linear-gradient(90deg, ${C.border}, transparent)`, marginLeft: 8 },
  summaryCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "28px 32px" },
  summaryText: { fontSize: 14.5, color: C.muted, margin: 0, lineHeight: 1.85 },
  summaryHL: { display: "flex", alignItems: "flex-start", marginTop: 20, padding: "14px 18px", background: C.accentDim, borderRadius: 8, fontSize: 13.5, color: C.fg, lineHeight: 1.65 },
  skillsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 },
  skillTagsCol: { display: "flex", flexDirection: "column", gap: 18 },
  skillCatTitle: { fontSize: 11, textTransform: "uppercase", letterSpacing: "1.5px", color: C.accent, fontWeight: 600, marginBottom: 8 },
  skillTagWrap: { display: "flex", flexWrap: "wrap", gap: 6 },
  skillTag: { background: C.tag, color: C.tagText, padding: "5px 12px", borderRadius: 6, fontSize: 12.5, fontWeight: 500, border: `1px solid ${C.border}`, transition: "all .25s" },
  skillBarsCol: { display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" },
  skillRow: { display: "flex", alignItems: "center", gap: 12 },
  skillLabel: { width: 180, fontSize: 12.5, color: C.muted, fontWeight: 500, flexShrink: 0, textAlign: "right" },
  skillTrack: { flex: 1, height: 7, background: C.tag, borderRadius: 4, overflow: "hidden" },
  skillFill: { height: "100%", background: `linear-gradient(90deg, ${C.accent}, #F0D060)`, borderRadius: 4 },
  skillPct: { width: 36, fontSize: 12, color: C.muted, textAlign: "left", fontWeight: 500 },
  tlContainer: { position: "relative", paddingLeft: 36 },
  tlLine: { position: "absolute", left: 13, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${C.accent}, ${C.border})`, borderRadius: 2 },
  tlItem: { position: "relative", marginBottom: 32 },
  tlDot: { position: "absolute", left: -29, top: 22, width: 12, height: 12, borderRadius: "50%", background: C.accent, border: `3px solid ${C.bg}`, boxShadow: `0 0 0 3px ${C.accentDim}`, zIndex: 2 },
  tlCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px" },
  tlDate: { display: "inline-block", background: C.accentDim, color: C.accent, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 5, marginBottom: 10, letterSpacing: "0.3px" },
  tlRole: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, margin: "0 0 4px" },
  tlCompany: { fontSize: 13, color: C.muted, margin: "0 0 14px", fontWeight: 500, display: "flex", alignItems: "center" },
  tlBullets: { paddingLeft: 16, margin: 0 },
  tlBullet: { fontSize: 13, color: C.muted, marginBottom: 6, lineHeight: 1.7 },
  projGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  projCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 24px 20px", transition: "all .3s ease", cursor: "default" },
  projType: { display: "inline-block", background: "rgba(92,184,112,0.1)", color: C.green, fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 5, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 },
  projTitle: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, margin: "0 0 12px", lineHeight: 1.3 },
  projBullets: { paddingLeft: 14, margin: 0 },
  eduCard: { display: "flex", alignItems: "center", gap: 20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px" },
  eduIcon: { width: 48, height: 48, borderRadius: 12, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontSize: 20, flexShrink: 0 },
  eduDegree: { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, margin: "0 0 2px" },
  eduSchool: { color: C.muted, fontSize: 13, margin: 0 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 },
  itemList: { display: "flex", flexDirection: "column", gap: 10 },
  itemCard: { display: "flex", alignItems: "flex-start", fontSize: 13, color: C.muted, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 18px", lineHeight: 1.6 },
};

const injectedCSS = `
  @keyframes rFadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
  a:hover { color: #D4AF37 !important; }
  .projCard:hover { transform: translateY(-3px) !important; }
  .heroLinkBtn:hover { border-color: #D4AF37 !important; color: #D4AF37 !important; }
  .skillTag:hover { background: rgba(212,175,55,0.12) !important; border-color: rgba(212,175,55,0.3) !important; color: #D4AF37 !important; }
  .printBtn:hover { background: rgba(212,175,55,0.22) !important; }
  li::marker { color: #D4AF37; }
  @media (max-width: 768px) {
    .skillsGrid, .twoCol { grid-template-columns: 1fr !important; }
    .skillRow { flex-direction: column; align-items: flex-start; gap: 4px; }
    .skillLabel { width: auto !important; text-align: left; }
    .skillPct { display: none; }
    .heroMeta { flex-direction: column; align-items: center; }
    .projGrid { grid-template-columns: 1fr; }
    .section { padding: 40px 16px; }
    .statsBar { gap: 20px; }
  }
  @media print {
    .topBar { display: none !important; }
    body { background: #fff !important; color: #111 !important; }
    .wrap, .printWrap { background: #fff !important; color: #111 !important; }
    .hero { padding: 20px 0 16px !important; }
    .heroGlow, .heroGrid { display: none !important; }
    .heroName { color: #111 !important; font-size: 32px !important; }
    .heroTitle, .heroMeta { color: #444 !important; }
    section { break-inside: avoid; page-break-inside: avoid; }
    .summaryCard, .tlCard, .projCard, .eduCard, .itemCard { background: #f8f8f8 !important; border-color: #ddd !important; color: #222 !important; }
    .summaryText, .tlBullet, .itemCard, li { color: #333 !important; }
    .headingText { color: #111 !important; }
    .statNum { color: #B8960D !important; }
    .skillFill { background: #B8960D !important; }
    .tlDot { background: #B8960D !important; border-color: #fff !important; }
    .tlLine { background: #ccc !important; }
    .skillTag { background: #eee !important; color: #333 !important; border-color: #ccc !important; }
    .projType { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .summaryHL { background: #fdf6e3 !important; color: #333 !important; }
    a { color: #B8960D !important; text-decoration: underline !important; }
    .heroLinkBtn { border: none !important; background: none !important; padding: 4px 8px !important; }
  }
`;