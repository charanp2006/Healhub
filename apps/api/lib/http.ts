const CORS_ORIGINS = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export function corsHeaders(): Record<string, string> {
  const origins = CORS_ORIGINS.length ? CORS_ORIGINS : ["*"];
  return {
    "Access-Control-Allow-Origin": origins.length === 1 ? origins[0] : origins.join(", "),
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, token, atoken, dtoken, htoken",
    "Access-Control-Allow-Credentials": "true",
  };
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}

export function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export function ok(data: Record<string, unknown>): Response {
  return json({ success: true, ...data });
}

export function bad(message: string): Response {
  return json({ success: false, message });
}

export async function parseJson<T = Record<string, unknown>>(
  request: Request
): Promise<T> {
  return (await request.json()) as T;
}
