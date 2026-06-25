// ═══════════════════════════════════════════════════════════════
//  EDUCATION — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from 'react';

const Education = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-6">
      <h2 className="text-4xl font-display font-bold text-[#FFFFFF] mb-12 text-center">Education</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#171717] p-8 rounded-xl border-t-4 border-[#F0D060]">
          <h3 className="text-2xl font-bold text-[#FFFFFF]">B.S. Computer Science</h3>
          <p className="text-[#A3A3A3] mt-2">University of Technology</p>
          <p className="text-[#D4AF37] mt-4">2014 - 2018</p>
          <p className="text-[#666666] mt-4 text-sm">Specialized in Artificial Intelligence and Machine Learning algorithms.</p>
        </div>
        <div className="bg-[#171717] p-8 rounded-xl border-t-4 border-[#D4AF37]">
          <h3 className="text-2xl font-bold text-[#FFFFFF]">Full Stack Bootcamp</h3>
          <p className="text-[#A3A3A3] mt-2">Code Academy</p>
          <p className="text-[#D4AF37] mt-4">2018</p>
          <p className="text-[#666666] mt-4 text-sm">Intensive 6-month program focusing on MERN stack development.</p>
        </div>
      </div>
    </div>
  );
};

export default Education;