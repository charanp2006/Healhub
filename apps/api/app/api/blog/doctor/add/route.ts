export const runtime = "nodejs";

import { doctorAddBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return doctorAddBlog(request);
}

export { handleOptions as OPTIONS };
