export const runtime = "nodejs";

import { getStats } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getStats(request);
}

export { handleOptions as OPTIONS };
