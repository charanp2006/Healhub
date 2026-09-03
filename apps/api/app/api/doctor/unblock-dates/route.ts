export const runtime = "nodejs";

import { removeBlockedDates } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return removeBlockedDates(request);
}

export { handleOptions as OPTIONS };
