export const runtime = "nodejs";

import { getBlogBySlug } from "@/lib/controllers/blogController";
import { handleOptions } from "@/lib/http";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return getBlogBySlug(request, slug);
}

export { handleOptions as OPTIONS };
