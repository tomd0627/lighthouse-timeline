"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import MetricPanel from "@/components/MetricPanel";
import { METRIC_KEYS } from "@/lib/constants";
import type {
  CrUXHistoryData,
  Incident,
  UserAnnotation,
} from "@/types/crux";

interface MetricGridProps {
  data: CrUXHistoryData;
  compareData?: CrUXHistoryData;
  incidents: Incident[];
  annotations: UserAnnotation[];
  prefersReducedMotion: boolean;
}

// Cubic bezier equivalent of "easeOut" — avoids string literal type narrowing issues
const EASE_OUT = [0.33, 1, 0.68, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT, delay: i * 0.07 },
  }),
};

const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export default function MetricGrid({
  data,
  compareData,
  incidents,
  annotations,
  prefersReducedMotion,
}: MetricGridProps) {
  const variants = prefersReducedMotion ? staticVariants : cardVariants;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      aria-label="Core Web Vitals panels"
    >
      {METRIC_KEYS.map((key, i) => (
        <motion.div
          key={key}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={variants}
          className="h-full"
        >
          <MetricPanel
            metricKey={key}
            data={data.metrics[key]}
            compareData={compareData?.metrics[key]}
            incidents={incidents}
            annotations={annotations}
            prefersReducedMotion={prefersReducedMotion}
          />
        </motion.div>
      ))}
    </div>
  );
}
