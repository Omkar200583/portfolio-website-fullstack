// ═══════════════════════════════════════════════════════════════
//  SECTION TITLE — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from 'react';

const SectionTitle = ({ children }) => {
  return (
    <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#A3A3A3] mb-12 relative inline-block">
      {children}
      <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#F0D060]"></span>
    </h2>
  );
};

export default SectionTitle;