// ═══════════════════════════════════════════════════════════════
//  ANALYTICS CARD — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from 'react';
import { TrendingUp, Users, Eye } from 'lucide-react';

const AnalyticsCard = ({ title, value, change, icon }) => {
  return (
    <div className="bg-[#171717] border border-[#D4AF37]/10 p-6 rounded-xl flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all duration-300">
      <div>
        <p className="text-[#A3A3A3] text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-[#FFFFFF]">{value}</h3>
        <span className={`text-xs font-bold flex items-center gap-1 mt-2 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
          <TrendingUp className="w-3 h-3" /> {change}% this week
        </span>
      </div>
      <div className="p-3 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
  );
};

export default AnalyticsCard;