export const runtime = "nodejs";

import { doctorProfile } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return doctorProfile(request);
}

export { handleOptions as OPTIONS };
