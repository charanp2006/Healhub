export const runtime = "nodejs";

import { updateDoctorProfile } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return updateDoctorProfile(request);
}

export { handleOptions as OPTIONS };
