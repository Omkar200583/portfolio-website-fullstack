// ═══════════════════════════════════════════════════════════════
//  BLOG POST (Detail) — Premium Black & Gold Layout
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, Clock, ArrowLeft, Tag, Share2, Link2, ExternalLink, Globe, ChevronRight, Loader2, AlertCircle, BookOpen } from "lucide-react";
import blogService from "../../services/blogService";

const categoryColors = {
  "Frontend Development": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Backend Development": "bg-green-500/20 text-green-400 border-green-500/30",
  "Full Stack": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "DevOps": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "UI/UX Design": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Mobile Development": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Database": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Security": "bg-red-500/20 text-red-400 border-red-500/30",
  "Web Dev": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "React": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "AI": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "CSS": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Design": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "TypeScript": "bg-green-500/20 text-green-400 border-green-500/30",
};

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await blogService.getById(id);
        setPost(res.data?.data || res.data?.blog || res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Article not found");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split("\n");
    const elements = [];
    let inCodeBlock = false;
    let codeContent = "";
    let codeKey = 0;

    lines.forEach((line, index) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${codeKey++}`} className="relative my-6 rounded-xl overflow-hidden border border-[#D4AF37]/10 bg-[#0A0A0A]">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#171717]/80 border-b border-[#D4AF37]/10">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                <span className="ml-2 text-[10px] font-mono text-[#525252]">CODE</span>
              </div>
              <pre className="p-4 overflow-x-auto"><code className="text-sm text-green-400/90 font-mono leading-relaxed">{codeContent.trim()}</code></pre>
            </div>
          );
          codeContent = "";
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }
      if (inCodeBlock) { codeContent += line + "\n"; return; }

      if (line.startsWith("## ")) {
        elements.push(
          <div key={index} className="mt-12 mb-4 flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">{line.replace("## ", "")}</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
          </div>
        );
        return;
      }
      if (line.startsWith("### ")) {
        elements.push(<h3 key={index} className="text-xl font-bold text-[#F0D060] mt-8 mb-3 pl-2 border-l-2 border-[#D4AF37]">{line.replace("### ", "")}</h3>);
        return;
      }
      if (line.startsWith("- **")) {
        const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
        if (match) {
          elements.push(
            <li key={index} className="ml-6 text-[#A3A3A3] mb-3 list-disc marker:text-[#D4AF37]">
              <strong className="text-[#FFFFFF] font-semibold">{match[1]}</strong>: {match[2]}
            </li>
          );
          return;
        }
      }
      if (line.startsWith("- ")) {
        elements.push(<li key={index} className="ml-6 text-[#A3A3A3] mb-2 list-disc marker:text-[#D4AF37]/50">{line.replace("- ", "")}</li>);
        return;
      }
      if (line.trim() === "") { elements.push(<div key={index} className="h-4" />); return; }

      const processedLine = line
        .replace(/`([^`]+)`/g, '<code class="bg-[#171717] px-2 py-0.5 rounded text-[#F0D060] text-sm font-mono border border-[#D4AF37]/10">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#D4AF37] hover:text-[#F0D060] underline underline-offset-2 transition-colors">$1</a>');

      elements.push(
        <p key={index} className="text-[#D4D4D4] leading-[1.85] mb-5 text-[16px]" dangerouslySetInnerHTML={{ __html: processedLine }} />
      );
    });
    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-4">Article Not Found</h1>
          <p className="text-[#A3A3A3] mb-8">{error || "This article doesn't exist or has been moved."}</p>
          <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F0D060] text-[#0A0A0A] font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </motion.div>
      </div>
    );
  }

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
  });

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#FFFFFF] font-[Inter] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        @keyframes floatGlow { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -30px) scale(1.06); } }
        .glow-float { animation: floatGlow 14s ease-in-out infinite; }
        @keyframes floatGlow2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-24px, 24px) scale(1.04); } }
        .glow-float-2 { animation: floatGlow2 18s ease-in-out infinite; }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#111111] to-[#0A0A0A]" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#D4AF37]/[0.04] blur-[150px] glow-float pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#F0D060]/[0.03] blur-[140px] glow-float-2 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
        
        {/* Back Button & Breadcrumbs */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <button onClick={() => navigate("/blog")} className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#D4AF37] transition-all mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono tracking-wide">Back to Blog</span>
          </button>

          <nav className="flex items-center gap-2 text-xs text-[#525252] font-mono bg-[#171717]/50 w-fit px-4 py-2 rounded-full border border-[#D4AF37]/5">
            <Link to="/" className="hover:text-[#FFFFFF] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#333333]" />
            <Link to="/blog" className="hover:text-[#FFFFFF] transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3 text-[#333333]" />
            <span className="text-[#A3A3A3] truncate max-w-[200px]">{post.title}</span>
          </nav>
        </motion.div>

        {/* Main Content Card */}
        <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#171717]/30 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50">
          
          {/* Header Section */}
          <header className="p-8 md:p-12 border-b border-[#D4AF37]/10">
            {post.category && (
              <motion.div {...fadeUp(0.1)} className="mb-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border backdrop-blur-sm ${categoryColors[post.category] || "bg-[#D4AF37]/15 text-[#F0D060] border-[#D4AF37]/30"}`}>
                  <Tag className="w-3 h-3" />{post.category}
                </span>
              </motion.div>
            )}

            <motion.h1 {...fadeUp(0.2)} className="font-display text-3xl md:text-5xl font-bold text-[#FFFFFF] mb-6 leading-tight tracking-tight">
              {post.title}
            </motion.h1>

            {post.excerpt && (
              <motion.p {...fadeUp(0.3)} className="text-lg text-[#A3A3A3] mb-8 leading-relaxed border-l-2 border-[#D4AF37] pl-4 italic">
                {post.excerpt}
              </motion.p>
            )}

            <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#A3A3A3] font-mono">
              {post.author?.name && (
                <span className="flex items-center gap-2 bg-[#0A0A0A] px-3 py-1.5 rounded-lg border border-white/5">
                  {post.author?.avatar ? <img src={post.author.avatar} alt={post.author.name} className="w-5 h-5 rounded-full" /> : <User className="w-4 h-4 text-[#D4AF37]" />}
                  {post.author.name}
                </span>
              )}
              {post.createdAt && (
                <span className="flex items-center gap-2 text-[#888888]">
                  <Calendar className="w-4 h-4 text-[#D4AF37]/60" />
                  {new Date(post.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
              {post.readTime && <span className="flex items-center gap-2 text-[#888888]"><Clock className="w-4 h-4 text-[#D4AF37]/60" /> {post.readTime} min read</span>}
              {post.views !== undefined && <span className="flex items-center gap-2 text-[#666666]"><BookOpen className="w-4 h-4" /> {post.views} views</span>}
            </motion.div>
          </header>

          {/* Featured Image */}
          {post.thumbnail?.url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative border-b border-[#D4AF37]/10"
            >
              <img src={post.thumbnail.url} alt={post.title} className="w-full h-[300px] md:h-[450px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/30 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div 
            {...fadeUp(0.5)}
            className="px-8 md:px-16 py-12 md:py-16 min-h-[400px]"
          >
            <article className="prose-custom max-w-none">
              {renderContent(post.content)}
            </article>
          </motion.div>

          {/* Tags Section */}
          {post.tags && post.tags.length > 0 && (
            <motion.div {...fadeUp(0.2)} className="px-8 md:px-12 py-8 border-t border-[#D4AF37]/10">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-[#0A0A0A]/50 border border-[#D4AF37]/10 text-[#A3A3A3] text-xs font-mono hover:border-[#D4AF37]/40 hover:text-[#F0D060] hover:bg-[#D4AF37]/5 transition-all duration-300 cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share Section */}
          <motion.div {...fadeUp(0.3)} className="mx-8 md:mx-12 mb-8 p-5 bg-[#0A0A0A]/50 rounded-xl border border-[#D4AF37]/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[#A3A3A3] text-sm font-mono">Share this article</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyLink} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#171717]/80 border border-[#D4AF37]/10 text-[#A3A3A3] hover:text-[#FFFFFF] hover:border-[#D4AF37]/40 transition-all text-sm" title="Copy link">
                  <Link2 className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <button onClick={shareOnTwitter} className="p-2.5 rounded-lg bg-[#171717]/80 border border-[#D4AF37]/10 text-[#A3A3A3] hover:text-[#FFFFFF] hover:border-[#D4AF37]/40 transition-all" title="Share on Twitter">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")} className="p-2.5 rounded-lg bg-[#171717]/80 border border-[#D4AF37]/10 text-[#A3A3A3] hover:text-[#FFFFFF] hover:border-[#D4AF37]/40 transition-all" title="Share on LinkedIn">
                  <Globe className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#D4AF37]/10">
            <Link to="/blog" className="p-6 flex flex-col justify-center gap-1 hover:bg-[#D4AF37]/5 transition-colors group border-r border-[#D4AF37]/10">
              <span className="text-xs text-[#525252] font-mono flex items-center gap-1 group-hover:text-[#D4AF37] transition-colors">
                <ArrowLeft className="w-3 h-3" /> All Posts
              </span>
              <span className="text-[#FFFFFF] font-display font-bold group-hover:text-[#D4AF37] transition-colors">
                Back to Blog
              </span>
            </Link>
            <div className="p-6 flex flex-col justify-center gap-1 opacity-40 border-l border-[#D4AF37]/10">
              <span className="text-xs text-[#525252] font-mono flex items-center justify-end gap-1">
                Next Post <ArrowLeft className="w-3 h-3 rotate-180" />
              </span>
              <span className="text-[#666666] font-display font-bold text-right">Coming Soon</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogPost;