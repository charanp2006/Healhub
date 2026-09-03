export const runtime = "nodejs";

import { listBlogs } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return listBlogs(request);
}

export { handleOptions as OPTIONS };
