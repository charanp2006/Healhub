export const runtime = "nodejs";

import { cancelUserAppointment } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return cancelUserAppointment(request);
}

export { handleOptions as OPTIONS };
