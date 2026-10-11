import React, { useState, useEffect, useCallback } from "react";
import ResearchGrid from "../../components/research/ResearchGrid";
import ResearchDetails from "../../components/research/ResearchDetails";
import { getResearch } from "../../services/researchService";

const Research = () => {
const [papers, setPapers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selected, setSelected] = useState(null);

const fetchPapers = useCallback(async () => {
try {
setLoading(true);
setError(null);


  const response = await getResearch();

  let data = [];

  if (Array.isArray(response)) {
    data = response;
  } else if (Array.isArray(response?.data)) {
    data = response.data;
  } else if (Array.isArray(response?.papers)) {
    data = response.papers;
  } else if (Array.isArray(response?.results)) {
    data = response.results;
  }

  const publishedPapers = data.filter((paper) => {
    const status = String(paper.status || "").toLowerCase();

    return (
      status === "published" &&
      paper.isVisible !== false &&
      paper.isPublished !== false
    );
  });

  setPapers(publishedPapers);
} catch (err) {
  console.error("Failed to fetch research publications:", err);
  setError(err.message || "Failed to load research papers");
  setPapers([]);
} finally {
  setLoading(false);
}


}, []);

useEffect(() => {
fetchPapers();
}, [fetchPapers]);

const researchAreas = new Set(
papers.map((paper) => paper.category).filter(Boolean)
).size;

const doiCount = papers.filter((paper) => paper.doi).length;

return ( <section
   id="research"
   className="
     relative
     w-full
     min-h-screen
     px-4 sm:px-6 md:px-8 lg:px-12
     py-12 sm:py-16 md:py-20 lg:py-24
   "
 > <div className="max-w-7xl mx-auto"> <header className="mb-8 sm:mb-12 md:mb-16 text-center sm:text-left"> <div className="inline-flex items-center gap-2 mb-3 sm:mb-4"> <span className="w-2 h-2 rounded-full bg-blue glow-pulse" />


        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-dim">
          Academic Work
        </span>
      </div>

      <>
      <h1
        className="
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl
          font-bold
          text-primary
          leading-tight
          mb-3 sm:mb-4
        "
      >
        Research & <span className="text-warm">Publications</span>
      </h1>

      <p
        className="
          text-sm sm:text-base md:text-lg
          text-muted
          max-w-2xl
          leading-relaxed
          mx-auto sm:mx-0
        "
      >
        A collection of my academic research papers, publications, and
        contributions to AI, machine learning, and emerging technologies.
      </p>
      </>

      {!loading && !error && papers.length > 0 && (
        <div
          className="
            flex flex-wrap items-center justify-center sm:justify-start
            gap-3 sm:gap-4 md:gap-6
            mt-6 sm:mt-8
            px-4 sm:px-5
            py-3 sm:py-4
            glass
            border-default
            rounded-xl md:rounded-2xl
          "
        >
          <div className="text-center sm:text-left">
            <p className="text-xl sm:text-2xl font-bold text-warm">
              {papers.length}
            </p>

            <p className="text-[10px] sm:text-xs text-dim uppercase tracking-wide">
              Published Publications
            </p>
          </div>

          <div className="hidden sm:block w-px h-10 bg-[var(--border)]" />

          <div className="text-center sm:text-left">
            <p className="text-xl sm:text-2xl font-bold text-blue">
              {researchAreas}
            </p>

            <p className="text-[10px] sm:text-xs text-dim uppercase tracking-wide">
              Research Areas
            </p>
          </div>

          <div className="hidden sm:block w-px h-10 bg-[var(--border)]" />

          <div className="text-center sm:text-left">
            <p className="text-xl sm:text-2xl font-bold text-cream">
              {doiCount}
            </p>

            <p className="text-[10px] sm:text-xs text-dim uppercase tracking-wide">
              DOI Available
            </p>
          </div>
        </div>
      )}
    </header>

    {error && (
      <div className="p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl bg-cream-subtle border border-cream text-cream text-sm sm:text-base mb-6 sm:mb-8">
        <p className="font-semibold mb-1">
          Unable to load research publications
        </p>

        <p className="text-xs sm:text-sm opacity-80">{error}</p>

        <button
          type="button"
          onClick={fetchPapers}
          disabled={loading}
          className="btn-warm mt-3 text-xs px-3 py-2 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Try Again"}
        </button>
      </div>
    )}

    <ResearchGrid
      papers={papers}
      onOpen={setSelected}
      loading={loading}
    />
  </div>

  {selected && (
    <ResearchDetails
      research={selected}
      onClose={() => setSelected(null)}
    />
  )}
</section>


);
};

export default Research;
