export const runtime = "nodejs";

import { loginUser } from "@/lib/controllers/userController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return loginUser(request);
}

export { handleOptions as OPTIONS };
