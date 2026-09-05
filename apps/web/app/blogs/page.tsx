// @ts-nocheck
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "@/src/context/AppContext";
import {
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Tag,
  BookOpen,
  Search,
} from "lucide-react";
import { SkeletonCards } from "@healhub/ui";

const categories = [
  "Health Tips",
  "Nutrition",
  "Mental Health",
  "Fitness",
  "Disease Awareness",
  "Medical News",
  "Hospital & Clinic Updates",
  "Other",
];

const Blogs = () => {
  const { backendURL } = useContext(AppContext);
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const LIMIT = 9;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const fetchBlogs = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pageNum);
      params.set("limit", LIMIT);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (activeCategory) params.set("category", activeCategory);

      const { data } = await axios.get(
        `${backendURL}/api/blog/list?${params.toString()}`
      );

      if (data.success) {
        setBlogs(data.blogs || []);
        setTotalCount(data.pagination?.total || 0);
        setPage(data.pagination?.page || 1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* ─── Header ──────────────────────────────────── */}
      <div className="text-center my-10">
        <p className="text-3xl font-medium text-text-primary">
          Health & Wellness Blog
        </p>
        <p className="text-text-secondary mt-2 max-w-lg mx-auto">
          Expert articles, tips, and insights to help you live a healthier life.
        </p>
      </div>

      {/* ─── Search + Categories ─────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full border border-border rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${!activeCategory ? "bg-primary text-white" : "border border-border text-text-secondary hover:bg-primary-soft"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory((prev) => (prev === cat ? "" : cat))
              }
              className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${activeCategory === cat ? "bg-primary text-white" : "border border-border text-text-secondary hover:bg-primary-soft"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Results ─────────────────────────────────── */}
      {loading ? (
        <SkeletonCards
          count={6}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        />
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-text-secondary">
          <BookOpen size={48} className="mb-3 opacity-40" />
          <p className="text-lg">No articles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => router.push(`/blog/${blog.slug}`)}
              className="border border-border rounded-xl overflow-hidden bg-background-card cursor-pointer hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="h-48 bg-primary-soft overflow-hidden">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30">
                    <BookOpen size={48} />
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                {/* Category badge */}
                <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-primary-soft text-primary font-medium mb-3">
                  {blog.category}
                </span>

                <h3 className="text-text-primary font-medium text-lg leading-snug line-clamp-2 mb-2">
                  {blog.title}
                </h3>

                <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                  {blog.excerpt}
                </p>

                {/* Meta row */}
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {formatDate(blog.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {blog.views || 0} views
                  </span>
                </div>

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {blog.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-0.5 text-[11px] text-text-secondary"
                      >
                        <Tag size={10} /> {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Pagination ──────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10 mb-4">
          <button
            disabled={page <= 1}
            onClick={() => fetchBlogs(page - 1)}
            className="flex items-center gap-1 px-4 py-2 text-sm border border-border rounded-full disabled:opacity-40 cursor-pointer hover:bg-primary-soft transition-colors"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-sm text-text-secondary">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => fetchBlogs(page + 1)}
            className="flex items-center gap-1 px-4 py-2 text-sm border border-border rounded-full disabled:opacity-40 cursor-pointer hover:bg-primary-soft transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Blogs;
