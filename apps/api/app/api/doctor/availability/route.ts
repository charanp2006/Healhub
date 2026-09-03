export const runtime = "nodejs";

import { getDoctorBlockedDates } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getDoctorBlockedDates(request);
}

export { handleOptions as OPTIONS };
