"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CompareToggle from "@/components/CompareToggle";
import EmptyState from "@/components/EmptyState";
import EventAnnotation from "@/components/EventAnnotation";
import LoadingTimeline from "@/components/LoadingTimeline";
import MetricGrid from "@/components/MetricGrid";
import URLInput from "@/components/URLInput";
import { usePrefersReducedMotion, useLocalAnnotations } from "@/lib/hooks";
import { detectIncidents } from "@/lib/incidents";
import { validateUrl } from "@/lib/format";
import type {
  CrUXAPIErrorResponse,
  CrUXAPIRouteResponse,
  CrUXHistoryData,
} from "@/types/crux";

type Status = "idle" | "loading" | "error" | "success";

const STORAGE_KEY = "lighthouse-timeline-annotations";

export default function TimelineDashboard() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { annotations, addAnnotation, removeAnnotation } =
    useLocalAnnotations(STORAGE_KEY);

  const [url, setUrl] = useState("");
  const [compareUrl, setCompareUrl] = useState("");
  const [isCompareMode, setIsCompareMode] = useState(false);

  const [urlError, setUrlError] = useState<string | null>(null);
  const [compareUrlError, setCompareUrlError] = useState<string | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<CrUXAPIErrorResponse["code"] | null>(null);

  const [data, setData] = useState<CrUXHistoryData | null>(null);
  const [compareData, setCompareData] = useState<CrUXHistoryData | null>(null);

  const incidents = useMemo(
    () => (data ? detectIncidents(data) : []),
    [data],
  );

  function handleToggleCompare() {
    setIsCompareMode((prev) => !prev);
    if (isCompareMode) {
      setCompareUrl("");
      setCompareUrlError(null);
      setCompareData(null);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate inputs
    const primaryErr = validateUrl(url);
    setUrlError(primaryErr);

    let compareErr: string | null = null;
    if (isCompareMode) {
      compareErr = validateUrl(compareUrl);
      setCompareUrlError(compareErr);
    }

    if (primaryErr || compareErr) return;

    setStatus("loading");
    setErrorMessage(null);
    setErrorCode(null);
    setData(null);
    setCompareData(null);

    try {
      const response = await fetch("/api/crux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          ...(isCompareMode && compareUrl ? { compareUrl } : {}),
        }),
      });

      const json: CrUXAPIRouteResponse | CrUXAPIErrorResponse = await response.json();

      if (!response.ok) {
        const err = json as CrUXAPIErrorResponse;
        setErrorMessage(err.error);
        setErrorCode(err.code);
        setStatus("error");
        return;
      }

      const result = json as CrUXAPIRouteResponse;
      setData(result.data);
      setCompareData(result.compareData ?? null);
      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setErrorCode("API_ERROR");
      setStatus("loading");
      setStatus("error");
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="flex flex-col gap-6">
      {/* Search form */}
      <div className="rounded-2xl bg-bg-surface border border-border p-5 flex flex-col gap-4">
        <URLInput
          id="primary-url"
          label="Enter a public URL"
          value={url}
          onChange={(v) => {
            setUrl(v);
            if (urlError) setUrlError(null);
          }}
          onSubmit={handleSubmit}
          error={urlError}
          disabled={isLoading}
        />
        <CompareToggle
          isCompareMode={isCompareMode}
          onToggle={handleToggleCompare}
          compareUrl={compareUrl}
          onCompareUrlChange={(v) => {
            setCompareUrl(v);
            if (compareUrlError) setCompareUrlError(null);
          }}
          compareError={compareUrlError}
          disabled={isLoading}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>

      {/* Status feedback — ARIA live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {status === "loading" && "Loading performance data…"}
        {status === "success" && data && `Loaded performance data for ${data.url}`}
        {status === "error" && errorMessage}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <LoadingTimeline />
          </motion.div>
        )}

        {status === "error" && errorMessage && (
          <motion.div
            key="error"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {errorCode === "NO_DATA" ? (
              <EmptyState url={url} message={errorMessage} />
            ) : (
              <div
                role="alert"
                className="rounded-2xl bg-bg-surface border border-band-poor/30 p-5 text-sm text-text-muted"
              >
                <p className="font-semibold text-band-poor mb-1">
                  {errorCode === "RATE_LIMITED" ? "Rate limited" : "Request failed"}
                </p>
                <p>{errorMessage}</p>
              </div>
            )}
          </motion.div>
        )}

        {status === "success" && data && (
          <motion.div
            key="success"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* URL header */}
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-text-subtle uppercase tracking-wide font-semibold">
                Analyzing
              </p>
              <p className="font-mono text-sm text-accent truncate">{data.url}</p>
              {compareData && (
                <>
                  <p className="text-xs text-text-subtle mt-0.5">vs.</p>
                  <p className="font-mono text-sm text-accent/55 truncate">
                    {compareData.url}
                  </p>
                </>
              )}
            </div>

            <MetricGrid
              data={data}
              compareData={compareData ?? undefined}
              incidents={incidents}
              annotations={annotations}
              prefersReducedMotion={prefersReducedMotion}
            />

            <EventAnnotation
              annotations={annotations}
              onAdd={addAnnotation}
              onRemove={removeAnnotation}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
