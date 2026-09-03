// @ts-nocheck
"use client";

import React, { Suspense, useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HospitalContext } from "@/src/context/HospitalContext";
import axios from "axios";
import { toast } from "react-toastify";
import { ImagePlus, X, Loader2 } from "lucide-react";

const categories = [
  "Health Tips",
  "Nutrition",
  "Mental Health",
  "Fitness",
  "Disease Awareness",
  "Medical News",
  "Hospital Updates",
  "Other",
];

const HospitalAddBlogContent = () => {
  const { hToken, backendURL: backendUrl } = useContext(HospitalContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Other");
  const [tagsInput, setTagsInput] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [blogImg, setBlogImg] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editId && hToken) {
      (async () => {
        try {
          const { data } = await axios.get(
            `${backendUrl}/api/blog/hospital/${editId}`,
            { headers: { hToken } }
          );
          if (data.success) {
            const b = data.blog;
            setTitle(b.title);
            setContent(b.content);
            setExcerpt(b.excerpt || "");
            setCategory(b.category || "Other");
            setTagsInput(b.tags?.join(", ") || "");
            setIsPublished(b.isPublished);
            setExistingImage(b.image || "");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      })();
    }
  }, [editId, hToken]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim())
      return toast.error("Title and content are required");

    setLoading(true);
    try {
      const formData = new FormData();
      if (editId) formData.append("blogId", editId);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("excerpt", excerpt);
      formData.append("category", category);
      formData.append(
        "tags",
        JSON.stringify(
          tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );
      formData.append("isPublished", isPublished);
      if (blogImg) formData.append("image", blogImg);

      const url = editId
        ? `${backendUrl}/api/blog/hospital/update`
        : `${backendUrl}/api/blog/hospital/add`;
      const { data } = await axios.post(url, formData, {
        headers: { hToken },
      });

      if (data.success) {
        toast.success(data.message);
        router.push("/hospital-blogs");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">
        {editId ? "Edit Blog Post" : "Create Blog Post"}
      </p>

      <div className="bg-white px-8 py-8 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="mb-6">
          <p className="text-gray-500 mb-2">Cover Image</p>
          <label
            htmlFor="hosp-blog-img"
            className="cursor-pointer inline-block"
          >
            {blogImg ? (
              <div className="relative">
                <img
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                  src={URL.createObjectURL(blogImg)}
                  alt=""
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setBlogImg(null);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : existingImage ? (
              <img
                className="w-full max-w-md h-48 object-cover rounded-lg border"
                src={existingImage}
                alt=""
              />
            ) : (
              <div className="w-full max-w-md h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary transition-colors">
                <ImagePlus size={32} className="mb-2" />
                <p className="text-sm">Click to upload cover image</p>
              </div>
            )}
          </label>
          <input
            onChange={(e) => setBlogImg(e.target.files[0])}
            type="file"
            id="hosp-blog-img"
            hidden
            accept="image/*"
          />
        </div>

        <div className="flex flex-col gap-4 text-gray-500">
          <div>
            <p>Title</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded px-3 py-2 w-full mt-1 outline-primary"
              required
            />
          </div>
          <div>
            <p>Content</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="border rounded px-3 py-2 w-full mt-1 outline-primary"
              required
            />
          </div>
          <div>
            <p>
              Excerpt <span className="text-xs">(optional)</span>
            </p>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="border rounded px-3 py-2 w-full mt-1 outline-primary"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <p>Category</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded px-3 py-2 w-full mt-1 outline-primary"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <p>
                Tags <span className="text-xs">(comma separated)</span>
              </p>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="border rounded px-3 py-2 w-full mt-1 outline-primary"
                placeholder="health, tips, wellness"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hosp-publish"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <label htmlFor="hosp-publish">Publish immediately</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-primary text-white px-8 py-2.5 rounded-full hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {editId ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
};

const HospitalAddBlog = () => {
  return (
    <Suspense fallback={null}>
      <HospitalAddBlogContent />
    </Suspense>
  );
};

export default HospitalAddBlog;
