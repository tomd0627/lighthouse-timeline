import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { BAND_COLORS, BAND_LABELS, METRIC_COLORS, METRIC_LABELS } from "@/lib/constants";
import { formatDelta, formatMetricValue } from "@/lib/format";
import type { MetricKey, PerformanceBand } from "@/types/crux";

interface MetricSummaryCardProps {
  metricKey: MetricKey;
  latestValue: number;
  previousValue: number | undefined;
  band: PerformanceBand;
}

export default function MetricSummaryCard({
  metricKey,
  latestValue,
  previousValue,
  band,
}: MetricSummaryCardProps) {
  const metricColor = METRIC_COLORS[metricKey];
  const bandColor = BAND_COLORS[band];
  const delta = previousValue !== undefined ? formatDelta(latestValue, previousValue) : null;
  const isImprovement =
    previousValue !== undefined &&
    (metricKey === "CLS"
      ? latestValue < previousValue
      : latestValue < previousValue);
  const isRegression =
    previousValue !== undefined &&
    (metricKey === "CLS"
      ? latestValue > previousValue
      : latestValue > previousValue);

  return (
    <div className="flex items-start justify-between gap-3">
      {/* Left: label + value */}
      <div className="min-w-0">
        <p className="text-xs text-text-muted font-medium mb-0.5 truncate">
          {METRIC_LABELS[metricKey]}
        </p>
        <span
          className="font-mono text-2xl font-semibold leading-none tabular-nums"
          style={{ color: metricColor }}
          aria-label={`${METRIC_LABELS[metricKey]} p75: ${formatMetricValue(metricKey, latestValue)}`}
        >
          {formatMetricValue(metricKey, latestValue)}
        </span>
        {delta && (
          <span
            className="ml-2 text-xs font-medium font-mono"
            style={{ color: isImprovement ? BAND_COLORS.good : isRegression ? BAND_COLORS.poor : "var(--color-text-subtle)" }}
          >
            {delta}
          </span>
        )}
      </div>

      {/* Right: trend icon + band pill */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        {/* Band pill */}
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            color: bandColor,
            background: `${bandColor}18`,
            border: `1px solid ${bandColor}30`,
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: bandColor }}
            aria-hidden="true"
          />
          {BAND_LABELS[band]}
        </span>

        {/* Trend icon */}
        {isImprovement ? (
          <TrendingDown
            size={14}
            style={{ color: BAND_COLORS.good }}
            aria-label="Improving"
          />
        ) : isRegression ? (
          <TrendingUp
            size={14}
            style={{ color: BAND_COLORS.poor }}
            aria-label="Regressing"
          />
        ) : previousValue !== undefined ? (
          <Minus size={14} className="text-text-subtle" aria-label="Stable" />
        ) : null}
      </div>
    </div>
  );
}
