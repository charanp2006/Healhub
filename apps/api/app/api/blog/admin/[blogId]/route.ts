export const runtime = "nodejs";

import { adminGetBlog } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  const { blogId } = await params;
  return adminGetBlog(request, blogId);
}

export { handleOptions as OPTIONS };
