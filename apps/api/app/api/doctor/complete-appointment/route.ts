export const runtime = "nodejs";

import { completeDoctorAppointment } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return completeDoctorAppointment(request);
}

export { handleOptions as OPTIONS };
