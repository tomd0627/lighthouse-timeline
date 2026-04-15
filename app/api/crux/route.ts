import { CrUXError, fetchCrUXHistory } from "@/lib/crux";
import { normalizeUrl, validateUrl } from "@/lib/format";
import type {
  CrUXAPIErrorResponse,
  CrUXAPIRouteResponse,
  CrUXRequestBody,
} from "@/types/crux";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: "Invalid request body.",
        code: "INVALID_URL",
      } satisfies CrUXAPIErrorResponse,
      { status: 400 },
    );
  }

  const { url, compareUrl } = body as CrUXRequestBody;

  const primaryError = validateUrl(url ?? "");
  if (primaryError) {
    return Response.json(
      { error: primaryError, code: "INVALID_URL" } satisfies CrUXAPIErrorResponse,
      { status: 400 },
    );
  }

  if (compareUrl !== undefined) {
    const compareError = validateUrl(compareUrl);
    if (compareError) {
      return Response.json(
        {
          error: `Compare URL: ${compareError}`,
          code: "INVALID_URL",
        } satisfies CrUXAPIErrorResponse,
        { status: 400 },
      );
    }
  }

  try {
    const normalizedPrimary = normalizeUrl(url);

    if (compareUrl) {
      const normalizedCompare = normalizeUrl(compareUrl);
      const [data, compareData] = await Promise.all([
        fetchCrUXHistory(normalizedPrimary),
        fetchCrUXHistory(normalizedCompare),
      ]);
      return Response.json({ data, compareData } satisfies CrUXAPIRouteResponse);
    }

    const data = await fetchCrUXHistory(normalizedPrimary);
    return Response.json({ data } satisfies CrUXAPIRouteResponse);
  } catch (err) {
    if (err instanceof CrUXError) {
      const status =
        err.code === "NO_DATA"
          ? 404
          : err.code === "RATE_LIMITED"
            ? 429
            : err.code === "INVALID_URL"
              ? 400
              : 500;
      return Response.json(
        { error: err.message, code: err.code } satisfies CrUXAPIErrorResponse,
        { status },
      );
    }
    console.error("[crux/route] Unexpected error:", err);
    return Response.json(
      {
        error: "An unexpected error occurred. Please try again.",
        code: "API_ERROR",
      } satisfies CrUXAPIErrorResponse,
      { status: 500 },
    );
  }
}
