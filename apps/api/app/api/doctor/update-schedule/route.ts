export const runtime = "nodejs";

import { updateDoctorSchedule } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return updateDoctorSchedule(request);
}

export { handleOptions as OPTIONS };
