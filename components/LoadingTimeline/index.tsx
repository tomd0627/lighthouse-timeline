export default function LoadingTimeline() {
  return (
    <div
      role="status"
      aria-label="Loading performance data"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {(["LCP", "CLS", "INP", "TTFB"] as const).map((key) => (
        <div
          key={key}
          className="rounded-2xl bg-bg-surface border border-border p-4 flex flex-col gap-3"
        >
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="skeleton-shimmer h-4 w-40 rounded-md" />
            <div className="skeleton-shimmer h-6 w-16 rounded-full" />
          </div>
          {/* Value row */}
          <div className="skeleton-shimmer h-8 w-24 rounded-md" />
          {/* Chart area */}
          <div className="skeleton-shimmer rounded-xl" style={{ height: 180 }} />
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
