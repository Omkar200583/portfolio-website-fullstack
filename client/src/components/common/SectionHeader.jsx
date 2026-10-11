import React from "react";
import ScrollReveal from "../../animations/ScrollReveal";

/**
 * Shared section heading: badge (drops in) -> title (slides in from the left)
 * -> description (rises). Headings animate before their content.
 */
export default function SectionHeader({
  badge,
  title,
  accent,
  description,
  align = "center",
  className = "",
}) {
  const center = align === "center";

  return (
    <div
      className={`mb-10 sm:mb-14 ${center ? "text-center" : ""} ${className}`}
    >
      <ScrollReveal
        direction="down"
        className={center ? "flex justify-center" : ""}
      >
        <span className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-[var(--border)] bg-blue-subtle px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted sm:text-xs sm:tracking-[0.18em]">
          <span className="flash-dot shrink-0" aria-hidden="true" />
          {badge}
        </span>
      </ScrollReveal>

      <ScrollReveal direction="left" delay={0.08}>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          {title}
          {accent && (
            <>
              {" "}
              <span className="text-shimmer">{accent}</span>
            </>
          )}
        </h2>
      </ScrollReveal>

      {description && (
        <ScrollReveal direction="up" delay={0.16}>
          <p
            className={`mt-4 max-w-2xl text-base text-muted sm:text-lg ${
              center ? "mx-auto" : ""
            }`}
          >
            {description}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}