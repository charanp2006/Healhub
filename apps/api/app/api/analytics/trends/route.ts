export const runtime = "nodejs";

import { getAppointmentTrends } from "@/lib/controllers/analyticsController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getAppointmentTrends(request);
}

export { handleOptions as OPTIONS };
