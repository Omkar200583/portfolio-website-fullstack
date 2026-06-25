// ═══════════════════════════════════════════════════════════════
//  BLOG (List) — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Loader2, BookOpen } from "lucide-react";
import blogService from "../../services/blogService";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await blogService.getAll({ status: "published", limit: 20 });
        setPosts(res.data?.data || res.data?.blogs || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Couldn't load articles right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section id="blog" className="relative w-full overflow-hidden bg-[#0A0A0A] text-[#FFFFFF] py-24 px-4 sm:px-6 font-[Inter]">
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

      <div className="relative z-10 container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#A3A3A3] uppercase mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            Writing
          </span>
          <h2 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF]">
            Latest{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C847] to-[#F0D060] bg-clip-text text-transparent">
              Articles
            </span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
          </div>
        ) : error ? (
          <p className="text-center text-red-400 text-sm py-16">{error}</p>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-[#A3A3A3] py-24">
            <BookOpen size={32} className="text-[#666666]" />
            <p className="text-sm">No articles published yet — check back soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, i) => (
              <motion.article key={post._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Link
                  to={`/blog/${post._id}`}
                  className="group block rounded-2xl border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl p-6 transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.15)]"
                >
                  <div className="flex items-center gap-4 text-xs text-[#A3A3A3] mb-3 font-mono">
                    {post.createdAt && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(post.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    )}
                    {post.category && (
                      <span className="text-[#F0D060] bg-[#D4AF37]/[0.08] px-2 py-0.5 rounded-full border border-[#D4AF37]/15">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF] mb-2 transition-colors duration-300 group-hover:text-[#D4AF37]">
                    {post.title}
                  </h3>
                  {post.excerpt && <p className="text-sm text-[#A3A3A3] leading-relaxed mb-4">{post.excerpt}</p>}
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FFFFFF] group-hover:text-[#F0D060] transition-colors">
                    Read more <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}