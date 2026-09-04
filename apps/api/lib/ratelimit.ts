/**
 * In-memory sliding-window rate limiting for the login endpoints.
 *
 * Two complementary buckets per role + identity:
 *  - account: failed attempts per normalized (email), hits first so a single
 *    account can't be brute-forced from many IPs,
 *  - IP:     all attempts per (role + client IP), hits second so a single
 *    client can't spray many accounts.
 *
 * State lives in the API process — correct for a single instance. If the API
 * is ever scaled out the buckets must move to a shared store (Redis, or a
 * Mongo TTL collection). See docs/mongodb-connection-disconnects.md §5.
 */

export type LoginRole = "user" | "admin" | "doctor" | "hospital";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ACCOUNT_FAILURES = 5; // failed logins for one account / window
const MAX_IP_ATTEMPTS = 40; // all login attempts from one IP / window
const SWEEP_MS = 5 * 60 * 1000; // trim dead buckets every 5 minutes

const failuresByAccount = new Map<string, number[]>();
const attemptsByIp = new Map<string, number[]>();

function prune(timestamps: number[], now: number): number {
  const cutoff = now - WINDOW_MS;
  let start = 0;
  while (start < timestamps.length && timestamps[start] <= cutoff) start++;
  if (start > 0) timestamps.splice(0, start);
  return timestamps.length;
}

function retryAfter(timestamps: number[], now: number): number {
  return Math.max(1, Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000));
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export interface LoginRateGate {
  role: LoginRole;
  email: string;
  ip: string;
}

export type LoginRateResult = { blocked: boolean; retryAfterSeconds: number };

export function checkLoginRateGate(opts: LoginRateGate): LoginRateResult {
  const now = Date.now();
  const accountKey = `fail:${opts.role}:${opts.email.trim().toLowerCase()}`;
  const ipKey = `ip:${opts.role}:${opts.ip}`;

  const account = failuresByAccount.get(accountKey);
  if (account && prune(account, now) >= MAX_ACCOUNT_FAILURES) {
    return { blocked: true, retryAfterSeconds: retryAfter(account, now) };
  }
  const ip = attemptsByIp.get(ipKey);
  if (ip && prune(ip, now) >= MAX_IP_ATTEMPTS) {
    return { blocked: true, retryAfterSeconds: retryAfter(ip, now) };
  }
  return { blocked: false, retryAfterSeconds: 0 };
}

export function recordLoginAttempt(
  opts: LoginRateGate & { ok: boolean }
): void {
  const now = Date.now();
  const accountKey = `fail:${opts.role}:${opts.email.trim().toLowerCase()}`;
  const ipKey = `ip:${opts.role}:${opts.ip}`;

  const ipBucket = attemptsByIp.get(ipKey) ?? [];
  ipBucket.push(now);
  attemptsByIp.set(ipKey, ipBucket);

  if (opts.ok) {
    failuresByAccount.delete(accountKey);
    return;
  }
  const accountBucket = failuresByAccount.get(accountKey) ?? [];
  accountBucket.push(now);
  failuresByAccount.set(accountKey, accountBucket);
}

let sweepStarted = false;
function startSweep(): void {
  if (sweepStarted) return;
  sweepStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of failuresByAccount) {
      if (prune(bucket, now) === 0) failuresByAccount.delete(key);
    }
    for (const [key, bucket] of attemptsByIp) {
      if (prune(bucket, now) === 0) attemptsByIp.delete(key);
    }
  }, SWEEP_MS).unref();
}
startSweep();