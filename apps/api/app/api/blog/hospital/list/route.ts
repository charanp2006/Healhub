export const runtime = "nodejs";

import { hospitalListBlogs } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function GET(request: Request) {
  return hospitalListBlogs(request);
}

export { handleOptions as OPTIONS };
