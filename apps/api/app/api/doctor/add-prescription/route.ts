export const runtime = "nodejs";

import { addPrescription } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return addPrescription(request);
}

export { handleOptions as OPTIONS };
