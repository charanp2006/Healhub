import { addDoctor } from "@/lib/controllers/adminController";
import { handleOptions } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return addDoctor(request);
}

export { handleOptions as OPTIONS };
