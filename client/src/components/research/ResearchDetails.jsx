import React, { useEffect } from 'react';
import ResearchBadge from './ResearchBadge';

const ResearchDetails = ({ research, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!research) return null;

  const {
    title,
    authors = [],
    publisher,
    journal,
    conference,
    publicationDate,
    abstract,
    category,
    keywords = [],
    methodologies = [],
    doi,
    manuscriptId,
    paperUrl,
    certificateUrl,
    publisherUrl,
    thumbnail,
  } = research;

  const formattedDate = publicationDate
    ? new Date(publicationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const renderAuthors = (authorList) => {
    return authorList.map((author, idx) => {
      const isMe = /omkar/i.test(String(author));
      return (
        <span
          key={idx}
          className={isMe ? 'text-warm font-semibold' : 'text-muted'}
        >
          {author}
          {idx < authorList.length - 1 ? ', ' : ''}
        </span>
      );
    });
  };

  const openExternal = (url) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-end sm:items-center
        justify-center
        p-0 sm:p-4 md:p-6
        fade-in
      "
      style={{ background: 'var(--overlay)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full
          max-w-3xl
          max-h-[95vh] sm:max-h-[90vh]
          bg-secondary
          border border-[var(--border-hover)]
          rounded-t-3xl sm:rounded-2xl md:rounded-3xl
          shadow-lg
          overflow-y-auto
          no-scrollbar
          slide-up
        "
      >
        {/* Sticky header */}
        <div
          className="
            sticky top-0 z-10
            flex items-center justify-between
            px-4 sm:px-6 md:px-8
            py-3 sm:py-4
            bg-secondary
            border-b border-[var(--border)]
            backdrop-blur
          "
        >
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-dim uppercase tracking-wide">
              Research Paper
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="
              p-2
              rounded-lg
              text-muted
              hover:text-warm
              hover:bg-warm-subtle
              transition-colors
            "
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5">
            {category && <ResearchBadge variant="primary">{category}</ResearchBadge>}
            {doi && <ResearchBadge variant="cream">DOI Available</ResearchBadge>}
            {manuscriptId && <ResearchBadge variant="light">{manuscriptId}</ResearchBadge>}
          </div>

          {/* Title */}
          <h2
            className="
              text-xl sm:text-2xl md:text-3xl
              font-bold
              text-primary
              leading-tight
              mb-4 sm:mb-5
            "
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
          >
            {title}
          </h2>

          {/* Meta info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {/* Authors */}
            {authors.length > 0 && (
              <div className="p-3 sm:p-4 rounded-lg bg-blue-subtle border border-blue">
                <p className="text-[10px] uppercase tracking-wide text-dim mb-1">Authors</p>
                <p className="text-sm" style={{ wordBreak: 'break-word' }}>
                  {renderAuthors(authors)}
                </p>
              </div>
            )}

            {/* Publisher */}
            {(publisher || journal || conference) && (
              <div className="p-3 sm:p-4 rounded-lg bg-warm-subtle border border-warm">
                <p className="text-[10px] uppercase tracking-wide text-dim mb-1">
                  {publisher ? 'Publisher' : journal ? 'Journal' : 'Conference'}
                </p>
                <p className="text-sm text-cream">{publisher || journal || conference}</p>
              </div>
            )}

            {/* Date */}
            {formattedDate && (
              <div className="p-3 sm:p-4 rounded-lg bg-cream-subtle border border-cream">
                <p className="text-[10px] uppercase tracking-wide text-dim mb-1">Publication Date</p>
                <p className="text-sm text-cream">{formattedDate}</p>
              </div>
            )}

            {/* DOI */}
            {doi && (
              <div className="p-3 sm:p-4 rounded-lg bg-light-blue-subtle border border-light-blue">
                <p className="text-[10px] uppercase tracking-wide text-dim mb-1">DOI</p>
                <p
                  className="text-sm text-light-blue"
                  style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}
                >
                  {doi}
                </p>
              </div>
            )}
          </div>

          {/* Abstract */}
          {abstract && (
            <div className="mb-5 sm:mb-6">
              <h3 className="text-sm sm:text-base font-semibold text-warm uppercase tracking-wide mb-2 sm:mb-3">
                Abstract
              </h3>
              <p
                className="
                  text-sm sm:text-base
                  text-muted
                  leading-relaxed
                  whitespace-pre-wrap
                "
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              >
                {abstract}
              </p>
            </div>
          )}

          {/* Methodologies */}
          {methodologies.length > 0 && (
            <div className="mb-5 sm:mb-6">
              <h3 className="text-sm sm:text-base font-semibold text-warm uppercase tracking-wide mb-2 sm:mb-3">
                Methodologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {methodologies.map((method, idx) => (
                  <span
                    key={idx}
                    className="
                      inline-block
                      px-3 py-1
                      text-xs
                      bg-light-blue-subtle
                      text-light-blue
                      border border-light-blue
                      rounded-full
                    "
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="mb-5 sm:mb-6">
              <h3 className="text-sm sm:text-base font-semibold text-warm uppercase tracking-wide mb-2 sm:mb-3">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="
                      inline-block
                      px-2.5 py-1
                      text-[11px]
                      bg-blue-subtle
                      text-blue
                      border border-blue
                      rounded
                    "
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-5 border-t border-[var(--border)]">
            {paperUrl && (
              <button
                type="button"
                onClick={() => openExternal(paperUrl)}
                className="
                  btn-primary
                  flex-1 sm:flex-initial
                  flex items-center justify-center gap-2
                  text-sm
                  py-2.5
                "
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                View Paper
              </button>
            )}
            {certificateUrl && (
              <button
                type="button"
                onClick={() => openExternal(certificateUrl)}
                className="
                  btn-secondary
                  flex-1 sm:flex-initial
                  flex items-center justify-center gap-2
                  text-sm
                  py-2.5
                "
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Certificate
              </button>
            )}
            {publisherUrl && (
              <button
                type="button"
                onClick={() => openExternal(publisherUrl)}
                className="
                  btn-warm
                  flex-1 sm:flex-initial
                  flex items-center justify-center gap-2
                  text-sm
                  py-2.5
                "
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5m5 0v5" />
                </svg>
                Publisher
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchDetails;