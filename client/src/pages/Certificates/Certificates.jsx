// ═══════════════════════════════════════════════════════════════
//  CERTIFICATES, OFFERS & LOR (API) — Bulletproof Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, X, CheckCircle2, Loader2, FileText, Filter } from "lucide-react";
import { certificateService } from "../../services/certificateService";

const FILTERS = [
  { id: "all", label: "All Documents" },
  { id: "certificate", label: "Certificates" },
  { id: "offer_letter", label: "Offer Letters" },
  { id: "experience_letter", label: "Exp. Letters (LOR)" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await certificateService.getAll();
        // Safely extract array, filtering out any null/undefined values
        const raw = res.data?.data || res.data?.certificates || res.data || [];
        const cleanData = Array.isArray(raw) ? raw.filter(Boolean) : [];
        setCertificates(cleanData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Couldn't load documents right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const filteredDocs = activeFilter === "all" 
    ? certificates 
    : certificates.filter(doc => (doc.type || "certificate") === activeFilter);

  // Safely determine document type styling (defaults to Certificate if type is missing)
  const getDocMeta = (type) => {
    const safeType = type || "certificate"; // FIX: Fallback if backend doesn't send type
    switch (safeType) {
      case "offer_letter":
        return { label: "Offer Letter", icon: FileText, color: "text-[#F0D060] border-[#D4AF37]/20 bg-[#D4AF37]/10" };
      case "experience_letter":
        return { label: "Exp. Letter", icon: FileText, color: "text-[#E8C847] border-[#E8C847]/20 bg-[#E8C847]/10" };
      default:
        return { label: "Certificate", icon: Award, color: "text-[#A3A3A3] border-white/10 bg-white/5" };
    }
  };

  return (
    <section id="certificates" className="relative w-full overflow-hidden bg-[#0A0A0A] text-[#FFFFFF] py-24 px-4 sm:px-6 font-[Inter]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        @keyframes floatGlow { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -30px) scale(1.06); } }
        .glow-float { animation: floatGlow 14s ease-in-out infinite; }
        @keyframes floatGlow2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-24px, 24px) scale(1.04); } }
        .glow-float-2 { animation: floatGlow2 18s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0D0D0D]" />
      <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#D4AF37]/[0.06] blur-[140px] glow-float" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#F0D060]/[0.04] blur-[130px] glow-float-2" />

      <div className="relative z-10 container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#A3A3A3] uppercase mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            Credentials
          </span>
          <h2 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF]">
            Certificates &amp;{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C847] to-[#F0D060] bg-clip-text text-transparent">Documents</span>
          </h2>
          <p className="mt-4 text-[#A3A3A3] text-base sm:text-lg max-w-2xl mx-auto">Verified credentials, offer letters, and experience letters.</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-14 p-1.5 bg-[#111111] rounded-2xl border border-[#222222] w-fit mx-auto"
        >
          <Filter size={14} className="text-[#525252] ml-3 mr-1" />
          {FILTERS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeFilter === tab.id
                  ? "bg-[#D4AF37]/15 text-[#F0D060] shadow-sm border border-[#D4AF37]/20"
                  : "text-[#666666] hover:text-[#AAAAAA] hover:bg-[#1A1A1A] border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* States */}
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>
        ) : error ? (
          <p className="text-center text-red-400 text-sm py-16">{error}</p>
        ) : filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-[#A3A3A3] py-24">
            <Award size={32} className="text-[#333333]" />
            <p className="text-sm">No documents found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {filteredDocs.map((doc, idx) => {
              const meta = getDocMeta(doc.type);
              const DocIcon = meta.icon;

              return (
                <motion.div 
                  key={doc._id || idx} 
                  custom={idx} 
                  variants={cardVariants} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-80px" }} 
                  whileHover={{ y: -8 }} 
                  onClick={() => setSelected(doc)}
                  className="group relative rounded-2xl border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.2)]"
                >
                  {/* Image Area */}
                  <div className="relative h-40 sm:h-44 overflow-hidden bg-[#0A0A0A]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent z-10" />
                    {doc.image?.url ? (
                      <div className="w-full h-full bg-cover bg-center opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500" style={{ backgroundImage: `url('${doc.image.url}')` }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#222222]">
                        <DocIcon size={48} />
                      </div>
                    )}
                    
                    {/* Floating Type Badge */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                      <div className="w-11 h-11 rounded-full bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#D4AF37]/25 flex items-center justify-center shadow-lg">
                        <DocIcon size={18} className="text-[#D4AF37]" />
                      </div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {doc.issueDate && (
                      <span className="text-xs font-mono tracking-[0.12em] text-[#F0D060] uppercase mb-2 block">
                        Issued: {new Date(doc.issueDate).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                      </span>
                    )}
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF] mb-1 transition-colors duration-300 group-hover:text-[#D4AF37] line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-[#A3A3A3] mb-5 line-clamp-1">{doc.issuer}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FFFFFF] group-hover:text-[#F0D060] transition-colors">
                      View details <ExternalLink size={14} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.25 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm" 
            onClick={() => setSelected(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.96, y: 10 }} 
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl border border-[#D4AF37]/10 bg-[#171717] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 border border-[#D4AF37]/10 text-[#FFFFFF] hover:text-[#F0D060] hover:border-[#F0D060]/40 transition-colors" aria-label="Close">
                <X size={18} />
              </button>

              {selected.image?.url && (
                <div className="relative h-48 sm:h-56 overflow-hidden bg-[#0A0A0A]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent z-10" />
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${selected.image.url}')` }} />
                </div>
              )}

              <div className="p-6 sm:p-8">
                {(() => {
                  const meta = getDocMeta(selected.type);
                  const DocIcon = meta.icon;
                  return (
                    <div className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.12em] px-3 py-1.5 rounded-full border mb-4 ${meta.color}`}>
                      <DocIcon size={12} />
                      Verified {meta.label}
                      {selected.issueDate ? ` · ${new Date(selected.issueDate).toLocaleDateString(undefined, { year: "numeric", month: "long" })}` : ""}
                    </div>
                  );
                })()}

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF] mb-1">{selected.title}</h3>
                <p className="text-sm sm:text-base text-[#A3A3A3] mb-6">{selected.issuer}</p>
                
                {selected.credentialUrl && (
                  <motion.a 
                    href={selected.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ scale: 1.04 }} 
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex px-5 py-3 rounded-xl bg-[#D4AF37] text-[#0A0A0A] font-display font-semibold text-sm items-center gap-2 hover:shadow-[0_0_28px_rgba(212,175,55,0.35)] transition-shadow duration-300"
                  >
                    <ExternalLink size={16} /> View Document
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}