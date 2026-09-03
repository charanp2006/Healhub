export const runtime = "nodejs";

import { updateUserProfile } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return updateUserProfile(request);
}

export { handleOptions as OPTIONS };
