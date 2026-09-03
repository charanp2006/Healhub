export const runtime = "nodejs";

import { addRoomCategory } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return addRoomCategory(request);
}

export { handleOptions as OPTIONS };
