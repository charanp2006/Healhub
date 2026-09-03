export const runtime = "nodejs";

import { getUserAppointments } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getUserAppointments(request);
}

export { handleOptions as OPTIONS };
