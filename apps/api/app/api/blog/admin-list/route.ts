export const runtime = "nodejs";

import { adminListBlogs } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return adminListBlogs(request);
}

export { handleOptions as OPTIONS };
