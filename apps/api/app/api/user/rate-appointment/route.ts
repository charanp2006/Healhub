export const runtime = "nodejs";

import { rateAppointment } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return rateAppointment(request);
}

export { handleOptions as OPTIONS };
