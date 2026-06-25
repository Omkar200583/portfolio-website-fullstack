// ═══════════════════════════════════════════════════════════════
//  CERTIFICATE CARD — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from 'react';
import { Award } from 'lucide-react';

const CertificateCard = ({ title, issuer }) => {
  return (
    <div className="bg-gradient-to-br from-[#171717] to-[#0A0A0A] p-6 rounded-xl border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <Award className="text-[#D4AF37] w-8 h-8" />
        <span className="text-xs text-[#A3A3A3] border border-[#D4AF37]/15 px-2 py-1 rounded">Verified</span>
      </div>
      <h3 className="text-xl font-bold text-[#FFFFFF] mb-1 group-hover:text-[#D4AF37] transition-colors">{title}</h3>
      <p className="text-[#A3A3A3] text-sm">{issuer}</p>
    </div>
  );
};

export default CertificateCard;