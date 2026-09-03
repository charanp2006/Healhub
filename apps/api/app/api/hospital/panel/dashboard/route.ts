export const runtime = "nodejs";

import { hospitalDashboard } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return hospitalDashboard(request);
}

export { handleOptions as OPTIONS };
