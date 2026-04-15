import type { MetricKey, PerformanceBand } from "@/types/crux";

export const THRESHOLDS: Record<MetricKey, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 }, // milliseconds
  CLS: { good: 0.1, poor: 0.25 }, // score (unitless)
  INP: { good: 200, poor: 500 }, // milliseconds
  TTFB: { good: 800, poor: 1800 }, // milliseconds
};

export const METRIC_LABELS: Record<MetricKey, string> = {
  LCP: "Largest Contentful Paint",
  CLS: "Cumulative Layout Shift",
  INP: "Interaction to Next Paint",
  TTFB: "Time to First Byte",
};

export const METRIC_ABBREVIATIONS: Record<MetricKey, string> = {
  LCP: "LCP",
  CLS: "CLS",
  INP: "INP",
  TTFB: "TTFB",
};

export const METRIC_UNITS: Record<MetricKey, string> = {
  LCP: "ms",
  CLS: "",
  INP: "ms",
  TTFB: "ms",
};

export const METRIC_DESCRIPTIONS: Record<MetricKey, string> = {
  LCP: "Time until the largest content element is rendered",
  CLS: "Visual stability — how much layout shifts unexpectedly",
  INP: "Responsiveness — delay from user interaction to response",
  TTFB: "Time until the first byte of the response is received",
};

export const METRIC_COLORS: Record<MetricKey, string> = {
  LCP: "#38bdf8",
  CLS: "#a78bfa",
  INP: "#fb923c",
  TTFB: "#34d399",
};

export const BAND_COLORS: Record<PerformanceBand, string> = {
  good: "#4ade80",
  "needs-improvement": "#fbbf24",
  poor: "#f87171",
};

export const BAND_LABELS: Record<PerformanceBand, string> = {
  good: "Good",
  "needs-improvement": "Needs Improvement",
  poor: "Poor",
};

// CrUX API field names mapped to our MetricKey
export const CRUX_METRIC_FIELD: Record<MetricKey, string> = {
  LCP: "largest_contentful_paint",
  CLS: "cumulative_layout_shift",
  INP: "interaction_to_next_paint",
  TTFB: "first_byte",
};

export const METRIC_KEYS: MetricKey[] = ["LCP", "CLS", "INP", "TTFB"];

export const URL_MAX_LENGTH = 2048;
export const COMPARE_LINE_OPACITY = 0.55;
export const ANNOTATION_MAX_LABEL_LENGTH = 80;
export const CHART_HEIGHT = 180;
