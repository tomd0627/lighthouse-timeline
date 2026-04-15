import type { MetricKey } from "@/types/crux";
import { METRIC_UNITS, URL_MAX_LENGTH } from "./constants";

export function formatMetricValue(key: MetricKey, value: number): string {
  if (key === "CLS") {
    return value.toFixed(3);
  }
  const unit = METRIC_UNITS[key];
  return `${Math.round(value)}${unit}`;
}

export function formatMetricValueShort(key: MetricKey, value: number): string {
  if (key === "CLS") {
    return value.toFixed(3);
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}s`;
  }
  return `${Math.round(value)}ms`;
}

export function formatDateLabel(isoDate: string): string {
  const [year, month] = isoDate.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export function formatFullDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDelta(current: number, previous: number): string {
  if (previous === 0) return "";
  const pct = ((current - previous) / previous) * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

/** Returns null if valid, otherwise an error message string. */
export function validateUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return "Please enter a URL.";
  if (trimmed.length > URL_MAX_LENGTH)
    return `URL is too long (max ${URL_MAX_LENGTH} characters).`;
  try {
    const withScheme = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "URL must use http or https.";
    }
    if (!parsed.hostname || parsed.hostname === "localhost") {
      return "Please enter a public URL (not localhost).";
    }
    return null;
  } catch {
    return "Please enter a valid URL (e.g. https://example.com).";
  }
}

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}
