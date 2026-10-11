import React from 'react';

const ResearchEmptyState = ({ title = 'No Research Papers', message = 'Research papers will appear here once published.' }) => {
  return (
    <div
      className="
        flex flex-col items-center justify-center
        w-full
        px-6 py-12 sm:py-16 md:py-24
        text-center
        rounded-2xl md:rounded-3xl
        glass
        border-default
        fade-in
      "
      style={{ minHeight: '40vh' }}
    >
      {/* Icon */}
      <div
        className="
          flex items-center justify-center
          w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20
          mb-4 sm:mb-6
          rounded-full
          bg-blue-subtle
          border border-blue
          glow-blue
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>

      <h3
        className="
          text-lg sm:text-xl md:text-2xl
          font-bold
          text-primary
          mb-2 sm:mb-3
        "
      >
        {title}
      </h3>

      <p
        className="
          text-sm sm:text-base
          text-muted
          max-w-sm sm:max-w-md
        "
      >
        {message}
      </p>
    </div>
  );
};

export default ResearchEmptyState;