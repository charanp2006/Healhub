export const runtime = "nodejs";

import { appointmentsAdmin } from "@/lib/controllers/adminController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return appointmentsAdmin(request);
}

export { handleOptions as OPTIONS };
