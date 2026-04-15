import type {
  CrUXHistoryData,
  Incident,
  MetricKey,
  PerformanceBand,
} from "@/types/crux";
import { METRIC_KEYS } from "./constants";

// Band rank: higher = worse performance
const BAND_RANK: Record<PerformanceBand, number> = {
  good: 0,
  "needs-improvement": 1,
  poor: 2,
};

export function detectIncidents(data: CrUXHistoryData): Incident[] {
  const incidents: Incident[] = [];

  for (const key of METRIC_KEYS) {
    const { dataPoints } = data.metrics[key as MetricKey];
    if (dataPoints.length < 2) continue;

    for (let i = 1; i < dataPoints.length; i++) {
      const prev = dataPoints[i - 1];
      const curr = dataPoints[i];
      const prevRank = BAND_RANK[prev.band];
      const currRank = BAND_RANK[curr.band];

      if (currRank !== prevRank) {
        incidents.push({
          date: curr.date,
          metricKey: key as MetricKey,
          fromBand: prev.band,
          toBand: curr.band,
          type: currRank > prevRank ? "regression" : "improvement",
          p75Value: curr.p75,
        });
      }
    }
  }

  return incidents;
}
