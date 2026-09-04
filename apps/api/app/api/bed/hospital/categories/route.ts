export const runtime = "nodejs";

import { hospitalGetRoomCategories } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return hospitalGetRoomCategories(request);
}

export { handleOptions as OPTIONS };
