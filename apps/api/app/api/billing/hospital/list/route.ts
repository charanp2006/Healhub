export const runtime = "nodejs";

import { getHospitalBillings } from "@/lib/controllers/billingController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getHospitalBillings(request);
}

export { handleOptions as OPTIONS };
