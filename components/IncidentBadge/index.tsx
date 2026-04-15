import { BAND_COLORS, BAND_LABELS } from "@/lib/constants";
import { formatMetricValue } from "@/lib/format";
import type { Incident } from "@/types/crux";

interface IncidentDotProps {
  incident: Incident;
  // Recharts injects these when used as a custom dot
  cx?: number;
  cy?: number;
}

/**
 * Rendered as an SVG element inside a Recharts chart.
 * Used as the `dot` prop on a <Line> component.
 */
export function IncidentDot({ incident, cx = 0, cy = 0 }: IncidentDotProps) {
  const isRegression = incident.type === "regression";
  const color = isRegression ? BAND_COLORS.poor : BAND_COLORS.good;
  const r = 6;

  return (
    <g aria-hidden="true">
      {/* Outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 3}
        fill={`${color}20`}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="2 2"
      />
      {/* Inner dot */}
      <circle cx={cx} cy={cy} r={r} fill={color} />
      {/* Symbol: ▲ regression / ▼ improvement */}
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fill="#060a14"
        fontSize={8}
        fontWeight="bold"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {isRegression ? "▲" : "▼"}
      </text>
    </g>
  );
}

/** Tooltip-style incident summary chip — used in the timeline chart tooltip. */
interface IncidentChipProps {
  incident: Incident;
}

export function IncidentChip({ incident }: IncidentChipProps) {
  const isRegression = incident.type === "regression";
  const color = isRegression ? BAND_COLORS.poor : BAND_COLORS.good;
  const value = formatMetricValue(incident.metricKey, incident.p75Value);

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
      role="status"
      aria-label={`${isRegression ? "Regression" : "Improvement"}: ${BAND_LABELS[incident.fromBand]} → ${BAND_LABELS[incident.toBand]} at ${value}`}
    >
      {isRegression ? "▲" : "▼"}
      {BAND_LABELS[incident.fromBand]} → {BAND_LABELS[incident.toBand]}
    </span>
  );
}
