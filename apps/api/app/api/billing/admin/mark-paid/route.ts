export const runtime = "nodejs";

import { markBillingPaid } from "@/lib/controllers/billingController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return markBillingPaid(request);
}

export { handleOptions as OPTIONS };
