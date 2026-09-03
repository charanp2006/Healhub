export const runtime = "nodejs";

import { getDoctorPerformance } from "@/lib/controllers/analyticsController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getDoctorPerformance(request);
}

export { handleOptions as OPTIONS };
