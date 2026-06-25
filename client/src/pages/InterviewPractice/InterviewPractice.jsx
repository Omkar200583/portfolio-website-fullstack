// ═══════════════════════════════════════════════════════════════
//  INTERVIEW PRACTICE — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { ChevronRight, RotateCw } from 'lucide-react';

const InterviewPractice = () => {
  const [flipped, setFlipped] = useState(false);
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-6 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-display font-bold text-[#FFFFFF] mb-8 text-center">Interview Prep</h2>
      <div className="w-full max-w-2xl h-64 perspective-1000">
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${flipped ? 'rotate-y-180' : ''}`} onClick={() => setFlipped(!flipped)}>
          <div className="absolute w-full h-full bg-[#171717] border border-[#D4AF37]/15 rounded-xl p-8 flex flex-col items-center justify-center backface-hidden shadow-2xl">
            <span className="text-[#D4AF37] font-mono text-sm mb-4">QUESTION #1</span>
            <h3 className="text-2xl font-bold text-center text-[#FFFFFF]">Explain the concept of Virtual DOM in React.</h3>
            <div className="mt-8 text-[#666666] text-sm flex items-center gap-2">Click to reveal answer <ChevronRight className="w-4 h-4" /></div>
          </div>
          <div className="absolute w-full h-full bg-gradient-to-br from-[#171717] to-[#0A0A0A] border border-[#D4AF37]/30 rounded-xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <h4 className="text-[#D4AF37] font-bold mb-4">ANSWER</h4>
            <p className="text-[#A3A3A3] text-center leading-relaxed">The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React creates a VDOM in memory, does all the changes there, and then updates the browser DOM only where necessary, making it highly efficient.</p>
          </div>
        </div>
      </div>
      <button className="mt-12 text-[#A3A3A3] hover:text-[#FFFFFF] flex items-center gap-2 transition-colors cursor-pointer">
        <RotateCw className="w-5 h-5" /> Next Question
      </button>
    </div>
  );
};

export default InterviewPractice;