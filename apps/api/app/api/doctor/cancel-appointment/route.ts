export const runtime = "nodejs";

import { cancelDoctorAppointment } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return cancelDoctorAppointment(request);
}

export { handleOptions as OPTIONS };
