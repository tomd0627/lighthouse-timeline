"use client";

import { GitCompare, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import URLInput from "@/components/URLInput";

interface CompareToggleProps {
  isCompareMode: boolean;
  onToggle: () => void;
  compareUrl: string;
  onCompareUrlChange: (value: string) => void;
  compareError?: string | null;
  disabled?: boolean;
  prefersReducedMotion: boolean;
}

export default function CompareToggle({
  isCompareMode,
  onToggle,
  compareUrl,
  onCompareUrlChange,
  compareError,
  disabled,
  prefersReducedMotion,
}: CompareToggleProps) {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={isCompareMode}
        className={[
          "self-start flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors duration-150 cursor-pointer",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          isCompareMode
            ? "bg-accent-muted border-accent text-accent"
            : "bg-bg-surface border-border text-text-muted hover:border-accent hover:text-accent",
        ].join(" ")}
      >
        {isCompareMode ? (
          <X size={13} aria-hidden="true" />
        ) : (
          <GitCompare size={13} aria-hidden="true" />
        )}
        {isCompareMode ? "Remove comparison" : "Compare with another URL"}
      </button>

      <AnimatePresence>
        {isCompareMode && (
          <motion.div
            key="compare-input"
            initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <URLInput
              id="compare-url"
              label="Compare URL"
              value={compareUrl}
              onChange={onCompareUrlChange}
              error={compareError}
              disabled={disabled}
              standalone
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
