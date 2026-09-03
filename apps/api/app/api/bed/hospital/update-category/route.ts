export const runtime = "nodejs";

import { hospitalUpdateRoomCategory } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalUpdateRoomCategory(request);
}

export { handleOptions as OPTIONS };
