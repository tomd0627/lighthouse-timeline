"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // In production, pipe to your error monitoring service (e.g. Sentry) here
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-bg-surface border border-border">
        <AlertTriangle size={26} className="text-band-poor" strokeWidth={1.5} />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Something went wrong
        </h2>
        <p className="text-text-muted max-w-sm text-sm leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-surface border border-border text-accent hover:bg-accent-hover transition-colors duration-150 text-sm font-medium cursor-pointer"
      >
        <RefreshCw size={15} />
        Try again
      </button>
    </div>
  );
}
