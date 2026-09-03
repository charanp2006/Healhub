export const runtime = "nodejs";

import { hospitalProfile } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return hospitalProfile(request);
}

export { handleOptions as OPTIONS };
