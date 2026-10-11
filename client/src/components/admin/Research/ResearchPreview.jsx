import React, { useEffect } from "react";
import { X, ExternalLink, FileText, BookOpen, Globe, Building2 } from "lucide-react";
import { StatusBadge, TypeBadge } from "./ResearchTable";

const Meta = ({ label, children, accent }) => (
  <div className="p-3 rounded-lg bg-[#08080c] border border-white/[0.06]">
    <p className="text-[10px] uppercase tracking-wide text-gray-600 mb-1">{label}</p>
    <p
      className={`text-[13px] ${accent ? "text-cyan-400" : "text-gray-300"}`}
      style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
    >
      {children}
    </p>
  </div>
);

const Section = ({ title, children }) =>
  children ? (
    <div className="mb-5">
      <h3 className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wide mb-2">{title}</h3>
      <p
        className="text-[13px] text-gray-400 leading-relaxed whitespace-pre-wrap"
        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
      >
        {children}
      </p>
    </div>
  ) : null;

const Chips = ({ title, items, hash }) =>
  items?.length ? (
    <div className="mb-5">
      <h3 className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wide mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <span
            key={i}
            className="inline-block px-2.5 py-1 text-[11px] bg-white/[0.04] text-gray-300 border border-white/[0.06] rounded-full"
          >
            {hash ? "#" : ""}
            {it}
          </span>
        ))}
      </div>
    </div>
  ) : null;

const LinkBtn = ({ url, icon: Icon, children, primary }) =>
  url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
        primary
          ? "font-semibold text-black bg-gradient-to-r from-cyan-400 to-cyan-500 hover:opacity-90"
          : "text-gray-300 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08]"
      }`}
    >
      <Icon className="w-3.5 h-3.5" /> {children}
    </a>
  ) : null;

const ResearchPreview = ({ data, onClose }) => {
  useEffect(() => {
    if (!data) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [data, onClose]);

  if (!data) return null;
  const isChapter = data.type === "book-chapter";
  const mainUrl = isChapter ? data.chapterUrl : data.paperUrl;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] bg-[#0c0c12] border border-white/[0.08] rounded-t-2xl sm:rounded-xl shadow-2xl overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0c0c12] border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">Preview</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {data.thumbnail && (
            <img
              src={data.thumbnail}
              alt={data.title}
              className="w-full max-h-64 object-cover rounded-lg border border-white/[0.06] mb-4"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <TypeBadge type={data.type} />
            <StatusBadge status={data.status} />
            {data.featured && (
              <span className="px-2 py-0.5 text-[10px] font-medium uppercase rounded-full border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                Featured
              </span>
            )}
            {!data.visible && (
              <span className="px-2 py-0.5 text-[10px] font-medium uppercase rounded-full border bg-gray-500/10 text-gray-400 border-gray-500/20">
                Hidden
              </span>
            )}
          </div>

          <h2
            className="text-lg sm:text-xl font-bold text-white leading-tight mb-2"
            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
          >
            {data.title}
          </h2>

          {data.shortDescription && (
            <p className="text-[13px] text-gray-400 mb-4">{data.shortDescription}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {data.authors?.length > 0 && (
              <Meta label="Authors">
                {data.authors.map((a, i) => (
                  <span key={i} className={/omkar/i.test(String(a)) ? "text-cyan-400 font-medium" : ""}>
                    {a}
                    {i < data.authors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </Meta>
            )}
            {data.supervisor && <Meta label="Supervisor">{data.supervisor}</Meta>}
            {data.publication && <Meta label="Publication">{data.publication}</Meta>}
            {data.publisher && <Meta label="Publisher">{data.publisher}</Meta>}
            {data.year && <Meta label="Year">{data.year}</Meta>}
            {data.registrationId && <Meta label="Registration ID">{data.registrationId}</Meta>}
            {isChapter && data.bookTitle && <Meta label="Book">{data.bookTitle}</Meta>}
            {isChapter && data.chapterNumber && <Meta label="Chapter">{data.chapterNumber}</Meta>}
            {isChapter && data.isbn && <Meta label="ISBN">{data.isbn}</Meta>}
            {data.doi && (
              <Meta label="DOI" accent>
                {data.doi}
              </Meta>
            )}
          </div>

          <Section title="Abstract">{data.abstract}</Section>
          <Section title="Research Problem">{data.researchProblem}</Section>
          <Section title="Methodology">{data.methodology}</Section>
          <Section title="Findings">{data.findings}</Section>
          <Section title="Chapter Content">{data.chapterContent}</Section>

          <Chips title="Research Area" items={data.researchArea} />
          <Chips title="Technologies" items={data.technologies} />
          <Chips title="Keywords" items={data.keywords} hash />

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
            <LinkBtn url={data.pdfUrl} icon={FileText} primary>
              View PDF
            </LinkBtn>
            <LinkBtn url={mainUrl} icon={ExternalLink} primary={!data.pdfUrl}>
              {isChapter ? "Open Chapter" : "Open Paper"}
            </LinkBtn>
            <LinkBtn url={data.publicationUrl} icon={BookOpen}>
              Publication
            </LinkBtn>
            <LinkBtn url={data.publisherUrl} icon={Building2}>
              Publisher
            </LinkBtn>
            {data.doi && (
              <LinkBtn url={`https://doi.org/${data.doi}`} icon={Globe}>
                DOI
              </LinkBtn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPreview;
