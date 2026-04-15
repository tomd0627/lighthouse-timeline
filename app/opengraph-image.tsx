import { ImageResponse } from "next/og";

export const alt = "Lighthouse Timeline — Core Web Vitals History";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#060a14",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Metric color bars (decorative) */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 40,
            position: "relative",
          }}
        >
          {(
            [
              ["LCP", "#38bdf8", 80],
              ["CLS", "#a78bfa", 50],
              ["INP", "#fb923c", 65],
              ["TTFB", "#34d399", 45],
            ] as const
          ).map(([label, color, height]) => (
            <div
              key={label}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  width: 32,
                  height,
                  borderRadius: 4,
                  background: color,
                  opacity: 0.7,
                }}
              />
              <span style={{ color, fontSize: 13, fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Icon + Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "#0d1420",
              border: "1.5px solid #22d3ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 26 }}>🏔</span>
          </div>
          <span
            style={{
              color: "#f0f6ff",
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Lighthouse Timeline
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            color: "#94a3b8",
            fontSize: 22,
            margin: 0,
            position: "relative",
          }}
        >
          Core Web Vitals history for any public URL
        </p>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          {["LCP · Largest Contentful Paint", "CLS · Layout Shift", "INP · Interaction", "TTFB · First Byte"].map(
            (label) => (
              <span
                key={label}
                style={{
                  color: "#64748b",
                  fontSize: 14,
                  padding: "6px 14px",
                  background: "rgba(34,211,238,0.06)",
                  borderRadius: 999,
                  border: "1px solid rgba(34,211,238,0.15)",
                }}
              >
                {label}
              </span>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
