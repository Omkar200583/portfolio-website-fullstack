import React from 'react';

const variantStyles = {
  primary: 'bg-blue-subtle text-blue border-blue',
  warm: 'bg-warm-subtle text-warm border-warm',
  cream: 'bg-cream-subtle text-cream border-cream',
  light: 'bg-light-blue-subtle text-light-blue border-light-blue',
};

const ResearchBadge = ({ children, variant = 'primary', className = '' }) => {
  const variantClass = variantStyles[variant] || variantStyles.primary;

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2.5 py-1
        text-[10px] sm:text-[11px]
        font-medium tracking-wide uppercase
        rounded-full border
        transition-colors duration-200
        ${variantClass}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default ResearchBadge;