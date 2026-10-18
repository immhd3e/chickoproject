const hits = new Map<string, { n: number; reset: number }>();

// true یعنی اجازه دارد، false یعنی از حد گذشته
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();

  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  }

  const h = hits.get(key);
  if (!h || h.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  h.n += 1;
  return h.n <= max;
}

export const getIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";