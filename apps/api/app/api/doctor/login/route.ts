export const runtime = "nodejs";

import { doctorLogin } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return doctorLogin(request);
}

export { handleOptions as OPTIONS };
