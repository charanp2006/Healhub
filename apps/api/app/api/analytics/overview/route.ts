export const runtime = "nodejs";

import { getOverviewStats } from "@/lib/controllers/analyticsController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getOverviewStats(request);
}

export { handleOptions as OPTIONS };
