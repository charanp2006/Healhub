export const runtime = "nodejs";

import { validateHospitalBooking } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return validateHospitalBooking(request);
}

export { handleOptions as OPTIONS };
