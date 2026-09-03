export const runtime = "nodejs";

import { hospitalDischargePatient } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalDischargePatient(request);
}

export { handleOptions as OPTIONS };
