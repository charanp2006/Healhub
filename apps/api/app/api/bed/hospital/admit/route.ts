export const runtime = "nodejs";

import { hospitalAdmitPatient } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalAdmitPatient(request);
}

export { handleOptions as OPTIONS };
