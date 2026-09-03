export const runtime = "nodejs";

import { getDoctorAppointments } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getDoctorAppointments(request);
}

export { handleOptions as OPTIONS };
