export const runtime = "nodejs";

import { changeAvailability } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return changeAvailability(request);
}

export { handleOptions as OPTIONS };
