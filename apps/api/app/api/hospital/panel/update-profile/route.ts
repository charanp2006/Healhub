export const runtime = "nodejs";

import { updateHospitalProfile } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return updateHospitalProfile(request);
}

export { handleOptions as OPTIONS };
