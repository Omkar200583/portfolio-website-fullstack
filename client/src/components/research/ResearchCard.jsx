import React, { useState } from 'react';
import ResearchBadge from './ResearchBadge';

const ResearchCard = ({ research, onOpen }) => {
  const [expanded, setExpanded] = useState(false);

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
    paperUrl,
    certificateUrl,
    publisherUrl,
    thumbnail,
    status,
  } = research;

  // Highlight current author (assumed to be "Omkar Jadhav")
  const renderAuthors = (authorList) => {
    return authorList.map((author, idx) => {
      const isMe = /omkar/i.test(String(author));
      return (
        <span key={idx} className={isMe ? 'text-warm font-semibold' : 'text-muted'}>
          {author}
          {idx < authorList.length - 1 ? ', ' : ''}
        </span>
      );
    });
  };

  const formattedDate = publicationDate
    ? new Date(publicationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const publisherInfo = publisher || journal || conference;

  const handleViewPaper = (e) => {
    e.stopPropagation();
    if (paperUrl) window.open(paperUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewCertificate = (e) => {
    e.stopPropagation();
    if (certificateUrl) window.open(certificateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewPublisher = (e) => {
    e.stopPropagation();
    if (publisherUrl) window.open(publisherUrl, '_blank', 'noopener,noreferrer');
  };

  const openDetails = () => {
    if (onOpen) onOpen(research);
  };

  return (
    <article
      onClick={openDetails}
      className="
        group
        relative
        w-full
        flex flex-col
        p-5 sm:p-6
        rounded-xl md:rounded-2xl
        bg-[var(--card-bg)]
        border border-[var(--card-border)]
        cursor-pointer
        transition-all duration-300 ease-out
        hover:bg-[var(--card-hover-bg)]
        hover:border-[var(--card-hover-border)]
        hover:-translate-y-1
        hover:shadow-lg
        fade-in
      "
    >
      {/* Top row: Category + Status badge */}
      <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
        {category && <ResearchBadge variant="primary">{category}</ResearchBadge>}
        {status === 'published' && (
          <ResearchBadge variant="warm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-warm glow-warm" />
            Published
          </ResearchBadge>
        )}
        {doi && <ResearchBadge variant="cream">DOI</ResearchBadge>}
      </div>

      {/* Title */}
      <h3
        className="
          text-base sm:text-lg md:text-xl
          font-bold
          text-primary
          leading-snug
          mb-2 sm:mb-3
          group-hover:text-warm
          transition-colors duration-200
        "
        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
      >
        {title}
      </h3>

      {/* Authors */}
      {authors.length > 0 && (
        <p className="text-xs sm:text-sm mb-2 sm:mb-3" style={{ wordBreak: 'break-word' }}>
          <span className="text-dim">Authors: </span>
          {renderAuthors(authors)}
        </p>
      )}

      {/* Publisher info */}
      {publisherInfo && (
        <p className="text-xs sm:text-sm text-muted mb-2 sm:mb-3">
          <span className="text-dim">Published in: </span>
          <span className="text-cream">{publisherInfo}</span>
        </p>
      )}

      {/* Date */}
      {formattedDate && (
        <p className="text-xs text-dim mb-3 sm:mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block w-3 h-3 mr-1 -mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          {formattedDate}
        </p>
      )}

      {/* Abstract */}
      {abstract && (
        <div className="mb-4 sm:mb-5">
          <p
            className={`
              text-xs sm:text-sm
              text-muted
              leading-relaxed
              transition-all duration-300
              ${expanded ? '' : 'line-clamp-3 sm:line-clamp-2'}
            `}
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
          >
            {abstract}
          </p>
          {abstract.length > 150 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="text-xs text-blue mt-2 hover:text-warm transition-colors"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Methodologies */}
      {methodologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
          {methodologies.slice(0, 4).map((method, idx) => (
            <span
              key={idx}
              className="
                inline-block
                px-2 py-0.5
                text-[10px] sm:text-[11px]
                bg-light-blue-subtle
                text-light-blue
                border border-light-blue
                rounded
                transition-colors
              "
            >
              {method}
            </span>
          ))}
          {methodologies.length > 4 && (
            <span className="text-[10px] sm:text-[11px] text-dim">
              +{methodologies.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-auto pt-3 sm:pt-4 border-t border-[var(--border)]">
        {/* Desktop: inline buttons */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {paperUrl && (
            <button
              type="button"
              onClick={handleViewPaper}
              className="
                btn-primary
                text-xs
                px-3 py-1.5
                flex items-center gap-1.5
              "
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              View Paper
            </button>
          )}
          {certificateUrl && (
            <button
              type="button"
              onClick={handleViewCertificate}
              className="
                btn-secondary
                text-xs
                px-3 py-1.5
                flex items-center gap-1.5
              "
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Certificate
            </button>
          )}
          {publisherUrl && (
            <button
              type="button"
              onClick={handleViewPublisher}
              className="
                btn-ghost
                text-xs
                px-3 py-1.5
                flex items-center gap-1.5
              "
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5m5 0v5" />
              </svg>
              Publisher
            </button>
          )}
        </div>

        {/* Mobile: stacked full-width buttons */}
        <div className="flex flex-col gap-2 sm:hidden">
          {paperUrl && (
            <button
              type="button"
              onClick={handleViewPaper}
              className="btn-primary text-xs px-3 py-2 flex items-center justify-center gap-1.5 w-full"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              View Paper
            </button>
          )}
          {certificateUrl && (
            <button
              type="button"
              onClick={handleViewCertificate}
              className="btn-secondary text-xs px-3 py-2 flex items-center justify-center gap-1.5 w-full"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Certificate
            </button>
          )}
          {publisherUrl && (
            <button
              type="button"
              onClick={handleViewPublisher}
              className="btn-ghost text-xs px-3 py-2 flex items-center justify-center gap-1.5 w-full"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5m5 0v5" />
              </svg>
              View Publication
            </button>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className="
          absolute inset-0
          rounded-xl md:rounded-2xl
          pointer-events-none
          opacity-0
          group-hover:opacity-100
          transition-opacity duration-300
          shadow-accent
        "
      />
    </article>
  );
};

export default ResearchCard;