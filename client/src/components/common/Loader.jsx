// ═══════════════════════════════════════════════════════════════
//  LOADER — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
      <motion.div 
        className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loader;