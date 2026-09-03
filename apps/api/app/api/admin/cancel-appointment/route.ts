export const runtime = "nodejs";

import { appointmentCancel } from "@/lib/controllers/adminController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return appointmentCancel(request);
}

export { handleOptions as OPTIONS };
