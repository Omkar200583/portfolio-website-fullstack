import jsPDF from "jspdf";

// ─── Color Palette (matches your dark theme, mapped to print-friendly) ───
const COLORS = {
  primary: [74, 168, 255],     // #4AA8FF
  secondary: [63, 224, 208],   // #3FE0D0
  accent: [242, 166, 90],      // #F2A65A
  text: [35, 39, 46],          // Dark text for white bg
  muted: [100, 110, 125],      // #646E7D
  lightBg: [245, 247, 250],    // Light section bg
  white: [255, 255, 255],
  border: [220, 225, 235],
  headerBg: [20, 24, 32],      // Dark header
  skillBg: [232, 243, 255],    // Light blue bg for skill pills
  skillBorder: [74, 168, 255],
};

// ─── Helper: safe text wrapping ───
function wrapText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line) => {
    if (y > 275) {
      doc.addPage();
      y = 25;
    }
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

// ─── Helper: draw section header with colored bar ───
function drawSectionHeader(doc, title, color, y) {
  if (y > 260) {
    doc.addPage();
    y = 25;
  }

  // Colored left bar
  doc.setFillColor(...color);
  doc.roundedRect(20, y - 4, 3, 14, 1, 1, "F");

  // Title text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.text);
  doc.text(title.toUpperCase(), 28, y + 6);

  // Underline
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(20, y + 14, 190, y + 14);

  return y + 22;
}

// ─── Helper: draw a skill pill ───
function drawSkillPills(doc, skills, y, maxWidth = 170) {
  if (!skills?.length) return y;

  let x = 28;
  let rowY = y;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  skills.forEach((skill) => {
    const textWidth = doc.getTextWidth(skill) + 10;

    // Wrap to next line if pill doesn't fit
    if (x + textWidth > 20 + maxWidth) {
      x = 28;
      rowY += 14;
    }

    // Page break check
    if (rowY > 275) {
      doc.addPage();
      rowY = 25;
    }

    // Pill background
    doc.setFillColor(...COLORS.skillBg);
    doc.roundedRect(x, rowY - 5, textWidth, 12, 2, 2, "F");

    // Pill border
    doc.setDrawColor(...COLORS.skillBorder);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, rowY - 5, textWidth, 12, 2, 2, "S");

    // Pill text
    doc.setTextColor(...COLORS.primary);
    doc.text(skill, x + 5, rowY + 3);

    x += textWidth + 5;
  });

  return rowY + 18;
}

// ─── Helper: draw bullet list ───
function drawBulletList(doc, items, y, bulletColor) {
  if (!items?.length) return y;

  doc.setFontSize(10);
  items.forEach((item) => {
    if (y > 275) {
      doc.addPage();
      y = 25;
    }

    // Bullet dot
    doc.setFillColor(...(bulletColor || COLORS.primary));
    doc.circle(27, y - 1, 1.5, "F");

    // Text
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.text);
    y = wrapText(doc, item, 33, y, 157, 5.5);
    y += 4;
  });

  return y;
}

// ─── Helper: draw roadmap step ───
function drawRoadmapStep(doc, step, index, y) {
  if (y > 260) {
    doc.addPage();
    y = 25;
  }

  // Number circle
  doc.setFillColor(...COLORS.primary);
  doc.circle(27, y, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.white);
  doc.text(String(index + 1), 24.5, y + 3.5, { align: "center" });

  // Vertical line to next step
  if (y + 30 < 275) {
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(27, y + 7, 27, y + 30);
  }

  // Step title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.text);
  doc.text(step.step, 40, y + 1);

  // Step detail
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.muted);
  y = wrapText(doc, step.detail, 40, y + 8, 150, 5);

  return y + 14;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export function generateCareerPDF(data, goal) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;

  // ── PAGE 1: HEADER ──

  // Dark header background
  doc.setFillColor(...COLORS.headerBg);
  doc.rect(0, 0, pageWidth, 52, "F");

  // Gradient accent bar at top
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 3, "F");

  // Secondary accent thin line
  doc.setFillColor(...COLORS.secondary);
  doc.rect(0, 3, pageWidth * 0.4, 0.8, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...COLORS.white);
  doc.text("Career Roadmap", 20, 26);

  // Goal subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.secondary);
  doc.text(goal || "Career Development Plan", 20, 38);

  // Date stamp
  doc.setFontSize(8);
  doc.setTextColor(150, 155, 165);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on ${dateStr}`, 20, 47);

  // "AI Powered" badge top-right
  doc.setFillColor(74, 168, 255, 0.2);
  doc.roundedRect(155, 32, 38, 14, 3, 3, "F");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.secondary);
  doc.text("AI POWERED", 174, 40, { align: "center" });

  let y = 65;

  // ── REQUIRED SKILLS ──
  y = drawSectionHeader(doc, "Required Skills", COLORS.primary, y);
  y = drawSkillPills(doc, data.requiredSkills, y);
  y += 4;

  // ── TIMELINE ──
  y = drawSectionHeader(doc, "Timeline", COLORS.secondary, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.text);

  // Timeline card background
  const timelineLines = doc.splitTextToSize(data.timeline || "Not specified", 160);
  const cardHeight = timelineLines.length * 5.5 + 10;
  doc.setFillColor(...COLORS.lightBg);
  doc.roundedRect(20, y - 4, 170, cardHeight, 3, 3, "F");
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.2);
  doc.roundedRect(20, y - 4, 170, cardHeight, 3, 3, "S");
  doc.setTextColor(...COLORS.text);
  timelineLines.forEach((line) => {
    doc.text(line, 28, y + 2);
    y += 5.5;
  });
  y += 12;

  // ── JOB ROLES ──
  y = drawSectionHeader(doc, "Target Job Roles", COLORS.primary, y);
  y = drawBulletList(doc, data.jobRoles, y, COLORS.primary);
  y += 6;

  // ── LEARNING ROADMAP ──
  if (data.roadmap?.length) {
    y = drawSectionHeader(doc, "Learning Roadmap", COLORS.secondary, y);
    data.roadmap.forEach((step, idx) => {
      y = drawRoadmapStep(doc, step, idx, y);
    });
    y += 6;
  }

  // ── PROJECTS TO BUILD ──
  if (data.projects?.length) {
    y = drawSectionHeader(doc, "Projects to Build", COLORS.secondary, y);
    y = drawBulletList(doc, data.projects, y, COLORS.secondary);
    y += 6;
  }

  // ── TIPS FOR SUCCESS ──
  if (data.tips?.length) {
    y = drawSectionHeader(doc, "Tips for Success", COLORS.accent, y);
    y = drawBulletList(doc, data.tips, y, COLORS.accent);
    y += 6;
  }

  // ── FOOTER ON ALL PAGES ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(20, 287, 190, 287);

    // Footer text
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text("Generated by Career Guide AI — Portfolio", 20, 292);
    doc.text(`Page ${i} of ${totalPages}`, 190, 292, { align: "right" });
  }

  // ── SAVE ──
  const safeName = (goal || "career-roadmap")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .substring(0, 40);

  doc.save(`${safeName}.pdf`);
}