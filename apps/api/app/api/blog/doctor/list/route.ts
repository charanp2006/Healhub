export const runtime = "nodejs";

import { doctorListBlogs } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return doctorListBlogs(request);
}

export { handleOptions as OPTIONS };
