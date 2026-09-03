export const runtime = "nodejs";

import { hospitalAddDoctor } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalAddDoctor(request);
}

export { handleOptions as OPTIONS };
