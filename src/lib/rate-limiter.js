const cache = new Map();

/**
 * Very lightweight in-memory rate limiter.
 * Ideal for standalone Node.js servers.
 *
 * @param {string} key - Unique key (e.g., client IP + endpoint path)
 * @param {number} limit - Maximum allowed requests in the window
 * @param {number} windowMs - Time window in milliseconds (e.g., 60000 for 1 minute)
 * @returns {Promise<{allowed: boolean, remaining: number, resetTime: number}>}
 */
export async function rateLimit(key, limit = 5, windowMs = 60 * 1000) {
  const now = Date.now();
  const record = cache.get(key);

  if (!record) {
    const resetTime = now + windowMs;
    cache.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { allowed: true, remaining: limit - 1, resetTime: record.resetTime };
  }

  record.count++;
  const remaining = Math.max(0, limit - record.count);
  const allowed = record.count <= limit;

  return { allowed, remaining, resetTime: record.resetTime };
}

// Memory cleanup every 10 minutes to prevent leaks
if (typeof setInterval !== "undefined") {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (now > v.resetTime) {
        cache.delete(k);
      }
    }
  }, 10 * 60 * 1000);
  if (interval.unref) {
    interval.unref();
  }
}
