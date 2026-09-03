export const runtime = "nodejs";

import { dischargePatient } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return dischargePatient(request);
}

export { handleOptions as OPTIONS };
