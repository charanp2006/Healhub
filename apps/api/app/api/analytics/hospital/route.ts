export const runtime = "nodejs";

import { getHospitalAnalytics } from "@/lib/controllers/analyticsController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getHospitalAnalytics(request);
}

export { handleOptions as OPTIONS };
