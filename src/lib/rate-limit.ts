/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Protects the public, unauthenticated /api/score-lead endpoint from spam and
 * OpenAI-cost abuse. NOTE: this is per-process — on a multi-instance/serverless
 * deploy each instance has its own window, so it's a first line of defence, not
 * a hard global cap. For production-grade limiting back it with Redis/Upstash.
 */
type Stamps = number[];
const buckets = new Map<string, Stamps>();

export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    buckets.set(key, recent);
    const retryAfterSec = Math.max(
      1,
      Math.ceil((windowMs - (now - recent[0])) / 1000)
    );
    return { ok: false, retryAfterSec };
  }

  recent.push(now);
  buckets.set(key, recent);

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      const live = v.filter((t) => now - t < windowMs);
      if (live.length === 0) buckets.delete(k);
      else buckets.set(k, live);
    }
  }

  return { ok: true, retryAfterSec: 0 };
}

/** Best-effort client IP from proxy headers. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
