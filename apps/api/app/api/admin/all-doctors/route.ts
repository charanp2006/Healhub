export const runtime = "nodejs";

import { allDoctors } from "@/lib/controllers/adminController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return allDoctors(request);
}

export { handleOptions as OPTIONS };
