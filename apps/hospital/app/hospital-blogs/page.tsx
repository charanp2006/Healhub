// @ts-nocheck
"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HospitalContext } from "@/src/context/HospitalContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { SkeletonCards } from "@healhub/ui";

const categories = [
  "All",
  "Health Tips",
  "Nutrition",
  "Mental Health",
  "Fitness",
  "Disease Awareness",
  "Medical News",
  "Hospital Updates",
  "Other",
];

const authorTypes = [
  { value: "", label: "All Authors" },
  { value: "hospital", label: "Hospital Posts" },
  { value: "doctor", label: "Doctor Posts" },
];

const HospitalBlogs = () => {
  const { hToken, backendURL: backendUrl } = useContext(HospitalContext);
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [authorType, setAuthorType] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 12 });
      if (category) params.append("category", category);
      if (search) params.append("search", search);
      if (authorType) params.append("authorType", authorType);

      const { data } = await axios.get(
        `${backendUrl}/api/blog/hospital/list?${params}`,
        { headers: { hToken } }
      );
      if (data.success) {
        setBlogs(data.blogs);
        setTotal(data.pagination.total);
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
    if (hToken) fetchBlogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hToken, page, category, authorType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/blog/hospital/delete`,
        { blogId },
        { headers: { hToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll w-full">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium">Blog Posts</h1>
        <button
          onClick={() => router.push("/hospital-add-blog")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 cursor-pointer"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-60 outline-primary"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 cursor-pointer"
          >
            Search
          </button>
        </form>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value === "All" ? "" : e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-primary"
        >
          {categories.map((c) => (
            <option key={c} value={c === "All" ? "" : c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={authorType}
          onChange={(e) => {
            setAuthorType(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-primary"
        >
          {authorTypes.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <SkeletonCards
          count={6}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        />
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No blog posts yet</p>
          <button
            onClick={() => router.push("/hospital-add-blog")}
            className="mt-3 text-primary text-sm hover:underline cursor-pointer"
          >
            Create your first post
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {blog.category}
                    </span>
                    {blog.isPublished ? (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                        <Eye size={10} /> Published
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                        <EyeOff size={10} /> Draft
                      </span>
                    )}
                    {blog.doctorId && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                        Dr. {blog.doctorId.name}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">{blog.author}</p>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center gap-2">
                    {!blog.doctorId && (
                      <button
                        onClick={() =>
                          router.push(
                            `/hospital-add-blog?edit=${blog._id}`
                          )
                        }
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                    )}
                    {!blog.doctorId && (
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {total > 12 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded text-sm cursor-pointer ${
                    page === i + 1
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HospitalBlogs;
