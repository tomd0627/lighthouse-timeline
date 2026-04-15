// Metric keys as a discriminated union — used as the single source of truth throughout the app
export type MetricKey = "LCP" | "CLS" | "INP" | "TTFB";

// Band classification
export type PerformanceBand = "good" | "needs-improvement" | "poor";

// A single month's histogram bucket from the CrUX API
export interface HistogramBucket {
  start: number;
  end?: number;
  density: number;
}

// Per-metric history record returned by the CrUX History API
export interface MetricHistory {
  histogramTimeseries: HistogramBucket[][];
  percentilesTimeseries: {
    p75s: Array<number | null>;
  };
}

// Raw CrUX History API response shape (fields we use)
export interface CrUXHistoryAPIResponse {
  record: {
    key: {
      url?: string;
      origin?: string;
    };
    metrics: Partial<{
      largest_contentful_paint: MetricHistory;
      cumulative_layout_shift: MetricHistory;
      interaction_to_next_paint: MetricHistory;
      first_byte: MetricHistory;
    }>;
    collectionPeriods: Array<{
      firstDate: { year: number; month: number; day: number };
      lastDate: { year: number; month: number; day: number };
    }>;
  };
}

// Normalized data point used in the app after processing the API response
export interface MetricDataPoint {
  date: string; // ISO "YYYY-MM-DD" (last day of collection period)
  p75: number;
  band: PerformanceBand;
  goodDensity: number;
  needsImprovementDensity: number;
  poorDensity: number;
}

export interface NormalizedMetricHistory {
  key: MetricKey;
  dataPoints: MetricDataPoint[];
}

// Final normalized shape passed to chart components
export interface CrUXHistoryData {
  url: string;
  metrics: Record<MetricKey, NormalizedMetricHistory>;
  collectionPeriods: string[]; // ISO date strings
}

// Incident shape (output of regression detection)
export interface Incident {
  date: string;
  metricKey: MetricKey;
  fromBand: PerformanceBand;
  toBand: PerformanceBand;
  type: "regression" | "improvement";
  p75Value: number;
}

// Manual user annotation
export interface UserAnnotation {
  id: string;
  date: string; // ISO "YYYY-MM-DD"
  label: string;
}

// API route request body
export interface CrUXRequestBody {
  url: string;
  compareUrl?: string;
}

// API route success response
export interface CrUXAPIRouteResponse {
  data: CrUXHistoryData;
  compareData?: CrUXHistoryData;
}

// API route error response
export interface CrUXAPIErrorResponse {
  error: string;
  code: "NO_DATA" | "INVALID_URL" | "API_ERROR" | "RATE_LIMITED";
}
