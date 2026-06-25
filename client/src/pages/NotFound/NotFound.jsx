// ═══════════════════════════════════════════════════════════════
//  NOT FOUND — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#A3A3A3] to-[#0A0A0A] mb-4 select-none">404</h1>
      <h2 className="text-4xl font-bold text-[#FFFFFF] mb-6">System Failure</h2>
      <p className="text-[#A3A3A3] mb-10 max-w-md">The coordinates you are looking for do not exist in this sector.</p>
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#D4AF37] border border-[#D4AF37] px-6 py-3 rounded hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-all cursor-pointer">
        <Home className="w-5 h-5" /> Return to Base
      </button>
    </div>
  );
};

export default NotFound;