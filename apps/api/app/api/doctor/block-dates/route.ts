export const runtime = "nodejs";

import { addBlockedDates } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return addBlockedDates(request);
}

export { handleOptions as OPTIONS };
