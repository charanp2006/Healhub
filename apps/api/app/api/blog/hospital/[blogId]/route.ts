export const runtime = "nodejs";

import { hospitalGetBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  const { blogId } = await params;
  return hospitalGetBlog(request, blogId);
}

export { handleOptions as OPTIONS };
