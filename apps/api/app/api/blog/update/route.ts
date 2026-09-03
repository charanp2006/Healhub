export const runtime = "nodejs";

import { updateBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return updateBlog(request);
}

export { handleOptions as OPTIONS };
