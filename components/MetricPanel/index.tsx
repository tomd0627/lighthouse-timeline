import MetricSummaryCard from "@/components/MetricSummaryCard";
import TimelineChart from "@/components/TimelineChart";
import { METRIC_LABELS } from "@/lib/constants";
import { formatDateLabel, formatMetricValue } from "@/lib/format";
import type {
  Incident,
  MetricKey,
  NormalizedMetricHistory,
  UserAnnotation,
} from "@/types/crux";

interface MetricPanelProps {
  metricKey: MetricKey;
  data: NormalizedMetricHistory;
  compareData?: NormalizedMetricHistory;
  incidents: Incident[];
  annotations: UserAnnotation[];
  prefersReducedMotion: boolean;
}

export default function MetricPanel({
  metricKey,
  data,
  compareData,
  incidents,
  annotations,
  prefersReducedMotion,
}: MetricPanelProps) {
  const { dataPoints } = data;
  const latestPoint = dataPoints.at(-1);
  const previousPoint = dataPoints.at(-2);
  const metricIncidents = incidents.filter((inc) => inc.metricKey === metricKey);

  return (
    <article
      className="rounded-2xl bg-bg-surface border border-border p-5 flex flex-col gap-4 h-full"
      aria-label={`${METRIC_LABELS[metricKey]} performance panel`}
    >
      {latestPoint ? (
        <MetricSummaryCard
          metricKey={metricKey}
          latestValue={latestPoint.p75}
          previousValue={previousPoint?.p75}
          band={latestPoint.band}
        />
      ) : (
        <p className="text-sm text-text-muted">
          {METRIC_LABELS[metricKey]} — no data
        </p>
      )}

      <TimelineChart
        metricKey={metricKey}
        dataPoints={dataPoints}
        compareDataPoints={compareData?.dataPoints}
        incidents={metricIncidents}
        annotations={annotations}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Screen-reader accessible data table */}
      {dataPoints.length > 0 && (
        <table className="sr-only" aria-label={`${METRIC_LABELS[metricKey]} data table`}>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">P75 Value</th>
              <th scope="col">Performance</th>
            </tr>
          </thead>
          <tbody>
            {dataPoints.map((point) => (
              <tr key={point.date}>
                <td>{formatDateLabel(point.date)}</td>
                <td>{formatMetricValue(metricKey, point.p75)}</td>
                <td>{point.band}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Incident summary for screen readers */}
      {metricIncidents.length > 0 && (
        <ul className="sr-only" aria-label={`${METRIC_LABELS[metricKey]} incidents`}>
          {metricIncidents.map((inc) => (
            <li key={`${inc.date}-${inc.metricKey}`}>
              {formatDateLabel(inc.date)}: {inc.type} —{" "}
              {inc.fromBand} to {inc.toBand}
              {" "}({formatMetricValue(metricKey, inc.p75Value)})
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
