export const runtime = "nodejs";

import { doctorDeleteBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return doctorDeleteBlog(request);
}

export { handleOptions as OPTIONS };
