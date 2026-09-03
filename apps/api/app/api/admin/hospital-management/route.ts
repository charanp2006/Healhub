export const runtime = "nodejs";

import { hospitalManagement } from "@/lib/controllers/adminController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return hospitalManagement(request);
}

export { handleOptions as OPTIONS };
