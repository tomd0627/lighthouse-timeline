// This module is safe to import from both server and client components.
// It has no server-only imports.

import type { MetricKey, PerformanceBand } from "@/types/crux";
import { THRESHOLDS } from "./constants";

export function classifyBand(metric: MetricKey, value: number): PerformanceBand {
  const { good, poor } = THRESHOLDS[metric];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

export function getBandBoundaries(metric: MetricKey): {
  goodMax: number;
  niMax: number;
} {
  const { good, poor } = THRESHOLDS[metric];
  return { goodMax: good, niMax: poor };
}
