import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const ResearchDeleteDialog = ({ open, paper, onConfirm, onCancel, loading = false }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => e.key === "Escape" && onCancel?.();
      document.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEsc);
      };
    }
  }, [open, onCancel]);

  if (!open || !paper) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#0c0c12] border border-red-500/20 rounded-xl shadow-2xl p-5"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>

        <h3 className="text-sm font-bold text-white text-center mb-2">
          Delete Research Paper?
        </h3>
        <p className="text-xs text-gray-400 text-center mb-5">
          Are you sure you want to delete{" "}
          <span className="text-red-400 font-medium" style={{ wordBreak: "break-word" }}>
            "{paper.title}"
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <X className="w-3.5 h-3.5" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchDeleteDialog;