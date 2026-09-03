export const runtime = "nodejs";

import { hospitalPanelAnalytics } from "@/lib/controllers/hospitalController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return hospitalPanelAnalytics(request);
}

export { handleOptions as OPTIONS };
