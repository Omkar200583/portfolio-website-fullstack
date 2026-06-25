// ═══════════════════════════════════════════════════════════════
//  CAREER GUIDE — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from 'react';

const CareerGuide = () => {
  const steps = [
    { title: "Step 1: Fundamentals", desc: "Master HTML, CSS, and JavaScript. Build simple static sites." },
    { title: "Step 2: Frameworks", desc: "Learn React, Vue, or Angular. Understand State Management (Redux/Context)." },
    { title: "Step 3: Backend", desc: "Node.js, Express, and databases (SQL/Mongo)." },
    { title: "Step 4: Deployment & DevOps", desc: "Docker, CI/CD pipelines, and Cloud platforms (AWS/Vercel)." },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-6">
      <h2 className="text-4xl font-display font-bold text-[#FFFFFF] mb-12 text-center">Career Roadmap</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="border-l-2 border-[#D4AF37]/15 pl-6 py-2 hover:border-[#F0D060] transition-colors group">
            <h3 className="text-xl font-bold text-[#FFFFFF] group-hover:text-[#F0D060] transition-colors">{step.title}</h3>
            <p className="text-[#A3A3A3] mt-1">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerGuide;