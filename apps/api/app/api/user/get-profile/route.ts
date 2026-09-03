export const runtime = "nodejs";

import { getUserProfile } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return getUserProfile(request);
}

export { handleOptions as OPTIONS };
