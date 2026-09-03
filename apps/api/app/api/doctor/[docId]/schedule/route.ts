export const runtime = "nodejs";

import { getDoctorScheduleForBooking } from "@/lib/controllers/doctorController";
import { handleOptions } from "@/lib/http";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params;
  return getDoctorScheduleForBooking(request, docId);
}

export { handleOptions as OPTIONS };
