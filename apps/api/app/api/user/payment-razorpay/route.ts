export const runtime = "nodejs";

import { paymentRazorpay } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return paymentRazorpay(request);
}

export { handleOptions as OPTIONS };
