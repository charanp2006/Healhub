export const runtime = "nodejs";

import { hospitalGetDoctors } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return hospitalGetDoctors(request);
}

export { handleOptions as OPTIONS };
