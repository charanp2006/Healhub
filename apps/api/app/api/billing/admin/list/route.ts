export const runtime = "nodejs";

import { listBillings } from "@/lib/controllers/billingController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return listBillings(request);
}

export { handleOptions as OPTIONS };
