export const runtime = "nodejs";

import { addBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return addBlog(request);
}

export { handleOptions as OPTIONS };
