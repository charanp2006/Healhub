export const runtime = "nodejs";

import { getRegisteredHospitals } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getRegisteredHospitals(request);
}

export { handleOptions as OPTIONS };
