export const runtime = "nodejs";

import { bookAppointment } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return bookAppointment(request);
}

export { handleOptions as OPTIONS };
