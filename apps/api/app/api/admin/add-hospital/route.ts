export const runtime = "nodejs";

import { addHospital } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return addHospital(request);
}

export { handleOptions as OPTIONS };
