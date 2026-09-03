export const runtime = "nodejs";

import { getSpecialityStats } from "@/lib/controllers/analyticsController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getSpecialityStats(request);
}

export { handleOptions as OPTIONS };
