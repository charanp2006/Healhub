export const runtime = "nodejs";

import { hospitalAddRoomCategory } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalAddRoomCategory(request);
}

export { handleOptions as OPTIONS };
