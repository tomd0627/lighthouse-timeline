// SERVER-ONLY — this module reads process.env.CRUX_API_KEY and must never
// be imported from client components. It is imported only from app/api/crux/route.ts.

import type {
  CrUXHistoryAPIResponse,
  CrUXHistoryData,
  MetricDataPoint,
  MetricKey,
  NormalizedMetricHistory,
} from "@/types/crux";
import { CRUX_METRIC_FIELD, METRIC_KEYS } from "./constants";
import { classifyBand } from "./thresholds";

const CRUX_HISTORY_ENDPOINT =
  "https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord";

export class CrUXError extends Error {
  constructor(
    public readonly code: "NO_DATA" | "INVALID_URL" | "API_ERROR" | "RATE_LIMITED",
    message: string,
  ) {
    super(message);
    this.name = "CrUXError";
  }
}

export async function fetchCrUXHistory(url: string): Promise<CrUXHistoryData> {
  const apiKey = process.env.CRUX_API_KEY;
  if (!apiKey) {
    throw new CrUXError("API_ERROR", "CRUX_API_KEY environment variable is not set");
  }

  const response = await fetch(`${CRUX_HISTORY_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new CrUXError(
      "NO_DATA",
      "No performance data found for this URL. CrUX only includes URLs with sufficient real-world traffic.",
    );
  }

  if (response.status === 429) {
    throw new CrUXError("RATE_LIMITED", "Too many requests. Please try again in a moment.");
  }

  if (!response.ok) {
    throw new CrUXError("API_ERROR", `CrUX API returned an unexpected error (${response.status}).`);
  }

  const raw: CrUXHistoryAPIResponse = await response.json();
  return normalizeCrUXResponse(url, raw);
}

function normalizeCrUXResponse(url: string, raw: CrUXHistoryAPIResponse): CrUXHistoryData {
  const { record } = raw;
  const periods = record.collectionPeriods ?? [];

  const collectionPeriods = periods.map((p) => {
    const { year, month, day } = p.lastDate;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  });

  const metrics = {} as Record<MetricKey, NormalizedMetricHistory>;

  for (const key of METRIC_KEYS) {
    const fieldName = CRUX_METRIC_FIELD[key];
    const rawMetric = record.metrics[fieldName as keyof typeof record.metrics];

    if (!rawMetric) {
      metrics[key] = { key, dataPoints: [] };
      continue;
    }

    const p75s = rawMetric.percentilesTimeseries.p75s;
    const dataPoints: MetricDataPoint[] = [];

    for (let i = 0; i < collectionPeriods.length; i++) {
      const p75Raw = p75s[i];
      if (p75Raw === null || p75Raw === undefined) continue;
      const p75 = Number(p75Raw);
      if (Number.isNaN(p75)) continue;

      const buckets = rawMetric.histogramTimeseries[i] ?? [];
      const goodDensity = buckets[0]?.density ?? 0;
      const needsImprovementDensity = buckets[1]?.density ?? 0;
      const poorDensity = buckets[2]?.density ?? 0;

      dataPoints.push({
        date: collectionPeriods[i],
        p75,
        band: classifyBand(key, p75),
        goodDensity,
        needsImprovementDensity,
        poorDensity,
      });
    }

    metrics[key] = { key, dataPoints };
  }

  return { url, metrics, collectionPeriods };
}
