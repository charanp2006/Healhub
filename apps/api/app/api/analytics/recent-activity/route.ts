export const runtime = "nodejs";

import { getRecentActivity } from "@/lib/controllers/analyticsController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getRecentActivity(request);
}

export { handleOptions as OPTIONS };
