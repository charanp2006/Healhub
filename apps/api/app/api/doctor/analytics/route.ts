export const runtime = "nodejs";

import { doctorAnalytics } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return doctorAnalytics(request);
}

export { handleOptions as OPTIONS };
