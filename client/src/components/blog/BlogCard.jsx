// ═══════════════════════════════════════════════════════════════
//  BLOG CARD — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const BlogCard = ({ title, excerpt, date, readTime }) => {
  return (
    <div className="group cursor-pointer">
      <div className="h-48 bg-[#171717] rounded-xl mb-4 overflow-hidden relative border border-[#D4AF37]/8">
        <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="flex items-center gap-4 text-xs text-[#666666] mb-2 font-mono">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readTime}</span>
      </div>
      <h3 className="text-2xl font-bold text-[#FFFFFF] mb-2 group-hover:text-[#F0D060] transition-colors">{title}</h3>
      <p className="text-[#A3A3A3] line-clamp-2">{excerpt}</p>
    </div>
  );
};

export default BlogCard;