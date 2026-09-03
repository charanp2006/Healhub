export const runtime = "nodejs";

import { generateBilling } from "@/lib/controllers/billingController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return generateBilling(request);
}

export { handleOptions as OPTIONS };
