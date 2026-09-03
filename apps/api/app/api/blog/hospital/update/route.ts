export const runtime = "nodejs";

import { hospitalUpdateBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalUpdateBlog(request);
}

export { handleOptions as OPTIONS };
