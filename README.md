# Lighthouse Timeline

Visualize the historical Core Web Vitals performance of any public URL. Enter a domain, watch LCP, CLS, INP, and TTFB animate across a 12–24 month timeline, and see performance regressions flagged automatically as incidents.

Powered by the [Chrome UX Report (CrUX) History API](https://developer.chrome.com/docs/crux/history-api/) — real field data collected from Chrome users worldwide, completely free.

---

## Features

- **Historical timeline** — monthly p75 Core Web Vitals going back up to 24 months
- **Threshold bands** — Good / Needs Improvement / Poor reference zones on every chart
- **Incident detection** — regressions and improvements automatically flagged on the chart
- **Compare mode** — overlay two URLs' performance histories side by side
- **Event annotations** — mark your own deployment dates directly on the timeline (persisted in localStorage)
- **Accessible** — screen-reader data tables behind every chart, ARIA live regions, keyboard navigation throughout

---

## Tech Stack

| Layer      | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19                |
| Language   | TypeScript (strict mode)                          |
| Styling    | Tailwind CSS v4 (CSS-first config)                |
| Charts     | Recharts + Framer Motion                          |
| Icons      | Lucide React                                      |
| Data       | CrUX History API (free Google Cloud API key)      |
| Deployment | Netlify (server-side runtime for API route proxy) |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/tomd0627/lighthouse-timeline.git
cd lighthouse-timeline
npm install
```

### 2. Get a CrUX API key (free)

The CrUX History API requires a Google API key. The free tier is more than sufficient for personal use.

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create or select a project
3. Navigate to **APIs & Services → Library**
4. Search for **"Chrome UX Report API"** and enable it
5. Go to **APIs & Services → Credentials → Create Credentials → API Key**
6. Copy the key (no billing required for portfolio-level usage)

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your key:

```
CRUX_API_KEY=your_api_key_here
```

The API key is **never** sent to the client — it is read server-side only in `app/api/crux/route.ts`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Test with:** `https://web.dev` — high-traffic site with guaranteed CrUX data.

---

## Deploying to Netlify

1. Push the repo to GitHub
2. Connect to Netlify (Import project → select repo)
3. Set the environment variable in Netlify:
   - **Site Settings → Environment Variables**
   - Key: `CRUX_API_KEY` / Value: your Google API key
4. Deploy

The app uses Next.js server-side route handlers, so the Netlify Next.js plugin handles the runtime automatically — no special configuration needed.

---

## Architecture Notes

### API proxy pattern

The CrUX API key lives exclusively on the server. The client posts to `/api/crux` with a URL; the Next.js route handler validates the input, calls the CrUX History API server-side, normalizes the response, and returns typed JSON. The `CRUX_API_KEY` environment variable is never prefixed `NEXT_PUBLIC_`.

### CrUX data limitations

- CrUX only includes URLs with sufficient real-world Chrome user traffic (typically 1,000+ monthly visits)
- Data is updated monthly; the API returns up to 24 months of history
- Some URLs will return a 404 from the CrUX API — the app handles this with an `EmptyState` component and suggests trying the site origin instead of a deep path

### Incident detection

For each metric, the app iterates monthly data points and flags a **regression** when the p75 value crosses into a worse performance band (Good → Needs Improvement, or Needs Improvement → Poor). An **improvement** is flagged when the inverse happens. These appear as annotated dots on the chart.

---

## Project Structure

```
app/
  api/crux/route.ts    ← Server-side CrUX API proxy (API key lives here)
  layout.tsx           ← HTML shell, metadata, fonts
  page.tsx             ← Server Component page shell
  globals.css          ← Tailwind v4 design tokens + base styles
components/
  TimelineDashboard/   ← Root client orchestrator, owns all state
  MetricGrid/          ← 2×2 responsive grid with entry animations
  MetricPanel/         ← Card: summary + chart + sr-only data table
  TimelineChart/       ← Recharts ComposedChart with threshold bands
  URLInput/            ← Validated URL input field
  CompareToggle/       ← Toggle for compare mode + second URL input
  EventAnnotation/     ← User annotation form + list
  LoadingTimeline/     ← Shimmer skeleton loading state
  EmptyState/          ← No-data guidance component
  MetricSummaryCard/   ← Latest p75 value with trend arrow
  IncidentBadge/       ← Regression/improvement SVG dot + chip
lib/
  constants.ts         ← CWV thresholds, metric colors, labels
  crux.ts              ← CrUX API client (server-only)
  thresholds.ts        ← Band classification helpers
  incidents.ts         ← Regression detection algorithm
  format.ts            ← Formatters + URL validation
  hooks.ts             ← usePrefersReducedMotion, useLocalAnnotations
types/
  crux.ts              ← All TypeScript interfaces
```

---

## Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |
