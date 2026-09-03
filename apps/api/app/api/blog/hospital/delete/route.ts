export const runtime = "nodejs";

import { hospitalDeleteBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalDeleteBlog(request);
}

export { handleOptions as OPTIONS };
