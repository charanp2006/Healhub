export const runtime = "nodejs";

import { doctorList } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return doctorList(request);
}

export { handleOptions as OPTIONS };
