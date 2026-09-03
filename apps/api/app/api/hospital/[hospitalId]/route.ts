export const runtime = "nodejs";

import { getHospitalProfile } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hospitalId: string }> }
) {
  const { hospitalId } = await params;
  return getHospitalProfile(request, hospitalId);
}

export { handleOptions as OPTIONS };
