export const runtime = "nodejs";

import { listHospitals } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return listHospitals(request);
}

export { handleOptions as OPTIONS };
