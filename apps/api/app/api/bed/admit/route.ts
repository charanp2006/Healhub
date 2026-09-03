export const runtime = "nodejs";

import { admitPatient } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return admitPatient(request);
}

export { handleOptions as OPTIONS };
