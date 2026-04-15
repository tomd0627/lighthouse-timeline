import { Globe, Info } from "lucide-react";

interface EmptyStateProps {
  url: string;
  message?: string;
}

export default function EmptyState({ url, message }: EmptyStateProps) {
  // Suggest the origin if the user passed a deep path
  let originSuggestion: string | null = null;
  try {
    const parsed = new URL(url);
    if (parsed.pathname !== "/" && parsed.pathname !== "") {
      originSuggestion = parsed.origin;
    }
  } catch {
    // ignore
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center gap-5 max-w-lg mx-auto">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-bg-surface border border-border">
        <Globe size={28} className="text-text-muted" strokeWidth={1.5} />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          No performance data found
        </h2>
        <p className="text-text-muted text-sm leading-relaxed">
          {message ??
            "The Chrome UX Report only includes URLs with sufficient real-world traffic from Chrome users."}
        </p>
      </div>

      <div className="w-full rounded-xl bg-bg-surface border border-border p-4 text-left flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wide">
          <Info size={13} />
          Why might this happen?
        </div>
        <ul className="text-text-muted text-sm leading-relaxed space-y-1.5 list-none pl-0">
          <li>• This URL may not receive enough Chrome user visits.</li>
          <li>• Deep paths often have less data than the site origin.</li>
          <li>• New or recently launched pages may not be indexed yet.</li>
        </ul>

        {originSuggestion && (
          <p className="text-sm text-text-muted mt-1">
            Try the site origin instead:{" "}
            <code className="font-mono text-accent bg-accent-muted px-1.5 py-0.5 rounded text-xs">
              {originSuggestion}
            </code>
          </p>
        )}
      </div>

      <a
        href="https://developer.chrome.com/docs/crux/about"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-text-subtle hover:text-accent underline underline-offset-2 transition-colors duration-150"
      >
        Learn more about CrUX data availability
      </a>
    </div>
  );
}
