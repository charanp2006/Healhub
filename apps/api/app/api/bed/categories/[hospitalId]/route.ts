export const runtime = "nodejs";

import { getRoomCategories } from "@/lib/controllers/bedController";
import { handleOptions } from "@/lib/http";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hospitalId: string }> }
) {
  const { hospitalId } = await params;
  return getRoomCategories(request, hospitalId);
}

export { handleOptions as OPTIONS };
