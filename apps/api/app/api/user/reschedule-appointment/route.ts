export const runtime = "nodejs";

import { rescheduleAppointment } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return rescheduleAppointment(request);
}

export { handleOptions as OPTIONS };
