export const runtime = "nodejs";

import { hospitalAddBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return hospitalAddBlog(request);
}

export { handleOptions as OPTIONS };
