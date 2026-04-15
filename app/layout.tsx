import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://lighthouse-timeline.netlify.app",
  ),
  title: "Lighthouse Timeline — Core Web Vitals History",
  description:
    "Visualize the historical Core Web Vitals performance of any public URL. Track LCP, CLS, INP, and TTFB over time with regressions flagged as incidents.",
  openGraph: {
    title: "Lighthouse Timeline",
    description:
      "Animated Core Web Vitals history for any URL — track LCP, CLS, INP, and TTFB with regression detection.",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lighthouse Timeline",
    description: "Animated Core Web Vitals history for any URL",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Inline blocking script — must run before first paint to avoid theme flash */}
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-bg-base text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-bg-surface focus:text-accent focus:border focus:border-accent"
        >
          Skip to main content
        </a>

        <header className="fixed top-0 inset-x-0 z-50 border-b border-border px-4 sm:px-6 py-3 flex items-center gap-2.5 bg-bg-base/95 backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            className="text-accent shrink-0"
            aria-hidden="true"
          >
            <path
              d="M12 3v4M9.5 5.5 12 3l2.5 2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 7h4l1 12H9L10 7Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="10"
              y="7"
              width="4"
              height="3"
              rx="0.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M7 19h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-semibold text-sm tracking-tight text-text-primary flex-1">
            Lighthouse Timeline
          </span>
          <ThemeToggle />
        </header>

        {/* pt-11 offsets the fixed header (py-3 + text-sm line-height + border ≈ 45px) */}
        <main className="pt-11" id="main-content">
          {children}
        </main>

        <footer className="border-t border-border px-4 py-3">
          <p className="flex flex-wrap justify-center items-center gap-x-1 gap-y-1 text-xs leading-relaxed text-text-subtle text-center">
            <span>Data from the</span>
            <a
              href="https://developer.chrome.com/docs/crux"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted underline underline-offset-2 hover:text-accent transition-colors duration-150"
            >
              Chrome UX Report
            </a>
            <span>· Real-world performance data from Chrome users</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
