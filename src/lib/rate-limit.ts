const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 10,
};

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG,
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, retryAfterMs: 0 };
}

export function rateLimitLogin(ip: string) {
  return checkRateLimit(`login:${ip}`, { windowMs: 15 * 60 * 1000, maxRequests: 5 });
}

export function rateLimitPasswordReset(ip: string) {
  return checkRateLimit(`pwdreset:${ip}`, { windowMs: 60 * 60 * 1000, maxRequests: 3 });
}

export function rateLimitRegister(ip: string) {
  return checkRateLimit(`register:${ip}`, { windowMs: 60 * 60 * 1000, maxRequests: 3 });
}
