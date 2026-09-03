export const runtime = "nodejs";

import { hospitalGenerateBilling } from "@/lib/controllers/billingController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalGenerateBilling(request);
}

export { handleOptions as OPTIONS };
