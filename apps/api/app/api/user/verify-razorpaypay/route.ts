export const runtime = "nodejs";

import { verifyRazorpay } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return verifyRazorpay(request);
}

export { handleOptions as OPTIONS };
