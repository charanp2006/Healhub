export const runtime = "nodejs";

import { hospitalGetAllocationHistory } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalGetAllocationHistory(request);
}

export { handleOptions as OPTIONS };
