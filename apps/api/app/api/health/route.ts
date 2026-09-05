export const runtime = "nodejs";

import connectDB from "@/lib/db";
import { handleOptions, json, ok } from "@/lib/http";

export async function GET(request: Request) {
  try {
    await Promise.race([
      connectDB(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("db connection timed out")), 5000)
      ),
    ]);
    return ok({ status: "ok", db: "connected" }, request);
  } catch {
    return json(
      { success: false, status: "error", db: "disconnected" },
      503,
      request
    );
  }
}

export { handleOptions as OPTIONS };