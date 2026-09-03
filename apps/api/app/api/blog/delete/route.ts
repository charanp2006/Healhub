export const runtime = "nodejs";

import { deleteBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function POST(request: Request) {
  return deleteBlog(request);
}

export { handleOptions as OPTIONS };
