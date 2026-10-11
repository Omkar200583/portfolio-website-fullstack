import React, { useEffect } from "react";
import { X } from "lucide-react";
import ResearchForm from "./ResearchForm";

const ResearchModal = ({ open, initialData, onSubmit, onCancel, loading }) => {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => e.key === "Escape" && onCancel?.();
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] bg-[#0c0c12] border border-white/[0.08] rounded-t-2xl sm:rounded-xl shadow-2xl overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0c0c12] border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">
            {initialData ? "Edit Publication" : "Add Publication"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <ResearchForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ResearchModal;
