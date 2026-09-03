export const runtime = "nodejs";

import { updateRoomCategory } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return updateRoomCategory(request);
}

export { handleOptions as OPTIONS };
