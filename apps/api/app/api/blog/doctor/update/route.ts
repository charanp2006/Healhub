export const runtime = "nodejs";

import { doctorUpdateBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return doctorUpdateBlog(request);
}

export { handleOptions as OPTIONS };
