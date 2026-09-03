export const runtime = "nodejs";

import { doctorDashboard } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return doctorDashboard(request);
}

export { handleOptions as OPTIONS };
