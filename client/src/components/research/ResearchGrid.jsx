import React from 'react';
import ResearchCard from './ResearchCard';
import ResearchEmptyState from './ResearchEmptyState';

const ResearchGrid = ({ papers = [], onOpen, loading = false }) => {
  if (loading) {
    return (
      <div
        className="
          grid
          grid-cols-1 md:grid-cols-2 lg:grid-cols-3
          gap-4 sm:gap-5 md:gap-6
          w-full
        "
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="
              w-full h-80
              rounded-xl md:rounded-2xl
              bg-[var(--card-bg)]
              border border-[var(--card-border)]
              animate-pulse
            "
          />
        ))}
      </div>
    );
  }

  if (!papers.length) {
    return <ResearchEmptyState />;
  }

  return (
    <div
      className="
        grid
        grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        gap-4 sm:gap-5 md:gap-6
        w-full
      "
    >
      {papers.map((paper, idx) => (
        <div
          key={paper._id || paper.id || idx}
          className="fade-in"
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          <ResearchCard research={paper} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
};

export default ResearchGrid;