export const runtime = "nodejs";

import { hospitalLogin } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalLogin(request);
}

export { handleOptions as OPTIONS };
