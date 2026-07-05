const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

export function getRateLimitHeaders(key: string, maxRequests: number = 5) {
  const record = rateLimitStore.get(key);
  if (!record) {
    return {
      "X-RateLimit-Limit": String(maxRequests),
      "X-RateLimit-Remaining": String(maxRequests),
      "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + 60),
    };
  }
  return {
    "X-RateLimit-Limit": String(maxRequests),
    "X-RateLimit-Remaining": String(Math.max(0, maxRequests - record.count)),
    "X-RateLimit-Reset": String(Math.ceil(record.resetTime / 1000)),
  };
}
