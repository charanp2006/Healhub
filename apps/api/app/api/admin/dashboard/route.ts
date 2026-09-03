export const runtime = "nodejs";

import { adminDashboard } from "@/lib/controllers/adminController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return adminDashboard(request);
}

export { handleOptions as OPTIONS };
