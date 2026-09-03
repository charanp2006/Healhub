export const runtime = "nodejs";

import { registerUser } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return registerUser(request);
}

export { handleOptions as OPTIONS };
