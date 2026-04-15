"use client";

import {
  ComposedChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  BAND_COLORS,
  BAND_LABELS,
  CHART_HEIGHT,
  COMPARE_LINE_OPACITY,
  METRIC_COLORS,
  METRIC_LABELS,
  THRESHOLDS,
} from "@/lib/constants";
import { formatDateLabel, formatMetricValue } from "@/lib/format";
import { IncidentDot } from "@/components/IncidentBadge";
import type { Incident, MetricDataPoint, MetricKey, PerformanceBand, UserAnnotation } from "@/types/crux";

interface TimelineChartProps {
  metricKey: MetricKey;
  dataPoints: MetricDataPoint[];
  compareDataPoints?: MetricDataPoint[];
  incidents: Incident[];
  annotations: UserAnnotation[];
  prefersReducedMotion: boolean;
}

// Build a merged dataset so Recharts can render both lines on the same x-axis
function buildChartData(
  primary: MetricDataPoint[],
  compare: MetricDataPoint[] | undefined,
): Array<{ date: string; p75: number | null; compareP75: number | null; band: PerformanceBand }> {
  const dateSet = new Set<string>([
    ...primary.map((d) => d.date),
    ...(compare ?? []).map((d) => d.date),
  ]);
  const sorted = Array.from(dateSet).sort();
  const primaryMap = new Map(primary.map((d) => [d.date, d]));
  const compareMap = new Map((compare ?? []).map((d) => [d.date, d]));

  return sorted.map((date) => ({
    date,
    p75: primaryMap.get(date)?.p75 ?? null,
    compareP75: compareMap.get(date)?.p75 ?? null,
    band: primaryMap.get(date)?.band ?? "good",
  }));
}

// Determine a reasonable y-axis max: slightly above the highest value or poor threshold
function chartYMax(metricKey: MetricKey, dataPoints: MetricDataPoint[], compare?: MetricDataPoint[]): number {
  const all = [...dataPoints, ...(compare ?? [])].map((d) => d.p75);
  if (all.length === 0) return THRESHOLDS[metricKey].poor * 1.3;
  const dataMax = Math.max(...all);
  const poorThreshold = THRESHOLDS[metricKey].poor;
  return Math.max(dataMax, poorThreshold) * 1.15;
}

// Lean interface for the fields Recharts actually passes to a dot render function.
// We avoid importing DotProps from recharts because its SVG `points: string` conflicts
// with Recharts v3's internal `points: readonly DotPoint[]` on DotItemDotProps.
interface ChartDotProps {
  cx?: number;
  cy?: number;
  payload?: MetricDataPoint;
}

interface CustomDotRendererProps extends ChartDotProps {
  metricKey: MetricKey;
  incidents: Incident[];
}

function CustomDotRenderer(props: CustomDotRendererProps) {
  const { cx, cy, payload, metricKey, incidents } = props;
  if (cx === undefined || cy === undefined || !payload) return null;

  const incident = incidents.find(
    (inc) => inc.date === payload.date && inc.metricKey === metricKey,
  );

  if (incident) {
    return <IncidentDot incident={incident} cx={cx} cy={cy} />;
  }

  // Default small dot
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill={METRIC_COLORS[metricKey]}
      stroke="#060a14"
      strokeWidth={1.5}
    />
  );
}

interface TooltipPayloadEntry {
  name: string;
  value: number | null;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadEntry[];
  metricKey: MetricKey;
  incidents: Incident[];
  annotations: UserAnnotation[];
}

function CustomTooltip({
  active,
  label,
  payload,
  metricKey,
  incidents,
  annotations,
}: CustomTooltipProps) {
  if (!active || !payload?.length || !label) return null;

  const primaryEntry = payload.find((p) => p.dataKey === "p75");
  const compareEntry = payload.find((p) => p.dataKey === "compareP75");
  const primaryValue = primaryEntry?.value ?? null;
  const compareValue = compareEntry?.value ?? null;

  const incident = incidents.find(
    (inc) => inc.date === label && inc.metricKey === metricKey,
  );
  const annotation = annotations.find((a) => a.date === label);

  const metricColor = METRIC_COLORS[metricKey];

  return (
    <div
      className="bg-bg-raised border border-border rounded-xl p-3 text-xs shadow-lg min-w-[160px]"
      role="tooltip"
    >
      <p className="text-text-muted mb-2 font-medium">{formatDateLabel(label)}</p>

      {primaryValue !== null && (
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="text-text-muted">{METRIC_LABELS[metricKey]}</span>
          <span className="font-mono font-semibold" style={{ color: metricColor }}>
            {formatMetricValue(metricKey, primaryValue)}
          </span>
        </div>
      )}

      {compareValue !== null && (
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="text-text-muted">Compare</span>
          <span
            className="font-mono font-semibold"
            style={{ color: metricColor, opacity: COMPARE_LINE_OPACITY + 0.2 }}
          >
            {formatMetricValue(metricKey, compareValue)}
          </span>
        </div>
      )}

      {incident && (
        <div className="mt-2 pt-2 border-t border-border">
          <span
            className="text-xs font-medium"
            style={{ color: incident.type === "regression" ? BAND_COLORS.poor : BAND_COLORS.good }}
          >
            {incident.type === "regression" ? "▲ Regression" : "▼ Improvement"}:{" "}
            {BAND_LABELS[incident.fromBand]} → {BAND_LABELS[incident.toBand]}
          </span>
        </div>
      )}

      {annotation && (
        <div className="mt-2 pt-2 border-t border-border text-accent text-xs">
          📌 {annotation.label}
        </div>
      )}
    </div>
  );
}

export default function TimelineChart({
  metricKey,
  dataPoints,
  compareDataPoints,
  incidents,
  annotations,
  prefersReducedMotion,
}: TimelineChartProps) {
  const chartData = buildChartData(dataPoints, compareDataPoints);
  const yMax = chartYMax(metricKey, dataPoints, compareDataPoints);
  const { good: goodThreshold, poor: poorThreshold } = THRESHOLDS[metricKey];
  const metricColor = METRIC_COLORS[metricKey];
  const hasCompare = (compareDataPoints?.length ?? 0) > 0;

  if (dataPoints.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-bg-surface border border-border text-text-subtle text-xs"
        style={{ height: CHART_HEIGHT }}
      >
        No data available for this metric
      </div>
    );
  }

  return (
    <div aria-hidden="true">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          {/* Threshold bands */}
          <ReferenceArea
            y1={0}
            y2={goodThreshold}
            fill={BAND_COLORS.good}
            fillOpacity={0.05}
            ifOverflow="hidden"
          />
          <ReferenceArea
            y1={goodThreshold}
            y2={poorThreshold}
            fill={BAND_COLORS["needs-improvement"]}
            fillOpacity={0.05}
            ifOverflow="hidden"
          />
          <ReferenceArea
            y1={poorThreshold}
            y2={yMax}
            fill={BAND_COLORS.poor}
            fillOpacity={0.05}
            ifOverflow="hidden"
          />

          {/* Threshold boundary lines */}
          <ReferenceLine
            y={goodThreshold}
            stroke={BAND_COLORS.good}
            strokeDasharray="3 4"
            strokeOpacity={0.4}
            strokeWidth={1}
          />
          <ReferenceLine
            y={poorThreshold}
            stroke={BAND_COLORS.poor}
            strokeDasharray="3 4"
            strokeOpacity={0.4}
            strokeWidth={1}
          />

          {/* User annotations */}
          {annotations.map((ann) => (
            <ReferenceLine
              key={ann.id}
              x={ann.date}
              stroke="rgba(34,211,238,0.45)"
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{
                value: ann.label.length > 12 ? `${ann.label.slice(0, 12)}…` : ann.label,
                fill: "#22d3ee",
                fontSize: 9,
                position: "top",
              }}
            />
          ))}

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tickFormatter={formatDateLabel}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={{ stroke: "rgba(34,211,238,0.1)" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v: number) => formatMetricValue(metricKey, v)}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={[0, yMax]}
            width={52}
          />

          <Tooltip
            content={
              <CustomTooltip
                metricKey={metricKey}
                incidents={incidents}
                annotations={annotations}
              />
            }
            cursor={{ stroke: "rgba(34,211,238,0.2)", strokeWidth: 1 }}
          />

          {/* Compare line (dashed, behind primary) */}
          {hasCompare && (
            <Line
              type="monotone"
              dataKey="compareP75"
              stroke={metricColor}
              strokeWidth={1.5}
              strokeOpacity={COMPARE_LINE_OPACITY}
              strokeDasharray="5 4"
              dot={false}
              activeDot={false}
              connectNulls
              isAnimationActive={false}
              name="Compare"
            />
          )}

          {/* Primary data line */}
          <Line
            type="monotone"
            dataKey="p75"
            stroke={metricColor}
            strokeWidth={2}
            dot={(dotProps: ChartDotProps) => (
              <CustomDotRenderer
                cx={dotProps.cx}
                cy={dotProps.cy}
                payload={dotProps.payload}
                metricKey={metricKey}
                incidents={incidents}
              />
            )}
            activeDot={{ r: 5, fill: metricColor, stroke: "#060a14", strokeWidth: 2 }}
            connectNulls
            isAnimationActive={!prefersReducedMotion}
            animationDuration={700}
            animationEasing="ease-out"
            name={METRIC_LABELS[metricKey]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
