import dynamic from "next/dynamic";
import LoadingTimeline from "@/components/LoadingTimeline";

const TimelineDashboard = dynamic(
  () => import("@/components/TimelineDashboard"),
  { loading: () => <LoadingTimeline /> },
);

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 pb-4 md:pt-10 md:pb-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-2">
          Core Web Vitals Timeline
        </h1>
        <p className="text-text-muted max-w-2xl text-sm leading-relaxed">
          Enter any public URL to visualize its historical{" "}
          <abbr title="Largest Contentful Paint">LCP</abbr>,{" "}
          <abbr title="Cumulative Layout Shift">CLS</abbr>,{" "}
          <abbr title="Interaction to Next Paint">INP</abbr>, and{" "}
          <abbr title="Time to First Byte">TTFB</abbr> performance — powered by
          real Chrome user data. Performance regressions are automatically flagged
          as incidents on the timeline.
        </p>
      </div>

      <TimelineDashboard />
    </div>
  );
}
