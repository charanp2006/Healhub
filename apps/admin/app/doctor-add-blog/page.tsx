// @ts-nocheck
"use client";
import { Suspense, useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { DoctorContext } from "@/src/context/DoctorContext";
import { assets } from "@/src/assets/assets";
import { ImagePlus, X } from "lucide-react";

const categories = ["Health Tips","Nutrition","Mental Health","Fitness","Disease Awareness","Medical News","Hospital Updates","Other"];

function DoctorAddBlogContent() {
  const { backendURL, dToken } = useContext(DoctorContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Other");
  const [tagsInput, setTagsInput] = useState("");
  const [author, setAuthor] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [blogImg, setBlogImg] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editId && dToken) {
      (async () => {
        try {
          const { data } = await axios.get(`${backendURL}/api/blog/doctor/${editId}`, { headers: { dToken } });
          if (data.success) {
            const b = data.blog;
            setTitle(b.title); setContent(b.content); setExcerpt(b.excerpt || ""); setCategory(b.category || "Other");
            setTagsInput(b.tags?.join(", ") || ""); setAuthor(b.author || ""); setIsPublished(b.isPublished);
            setExistingImage(b.image || "");
          } else { toast.error(data.message); }
        } catch (error) { toast.error(error.message); }
      })();
    }
  }, [editId, dToken]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return toast.error("Title and content are required");
    setLoading(true);
    try {
      const formData = new FormData();
      if (editId) formData.append("blogId", editId);
      formData.append("title", title); formData.append("content", content); formData.append("excerpt", excerpt);
      formData.append("category", category);
      formData.append("tags", JSON.stringify(tagsInput.split(",").map((t) => t.trim()).filter(Boolean)));
      formData.append("author", author); formData.append("isPublished", isPublished);
      if (blogImg) formData.append("image", blogImg);
      const url = editId ? `${backendURL}/api/blog/update` : `${backendURL}/api/blog/add`;
      const { data } = await axios.post(url, formData, { headers: { dToken } });
      if (data.success) {
        toast.success(data.message);
        if (!editId) {
          setTitle(""); setContent(""); setExcerpt(""); setCategory("Other"); setTagsInput(""); setAuthor("");
          setIsPublished(false); setBlogImg(null); setExistingImage("");
        }
      } else { toast.error(data.message); }
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">{editId ? "Edit Blog Post" : "Create Blog Post"}</p>
      <div className="bg-white px-8 py-8 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="mb-6">
          <p className="text-gray-500 mb-2">Cover Image</p>
          <label htmlFor="blog-img" className="cursor-pointer inline-block">
            {blogImg ? (
              <div className="relative">
                <img className="w-full max-w-md h-48 object-cover rounded-lg border border-border-light" src={URL.createObjectURL(blogImg)} alt="Preview" />
                <button type="button" onClick={(e) => { e.preventDefault(); setBlogImg(null); }} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer"><X size={14} /></button>
              </div>
            ) : existingImage ? (
              <img className="w-full max-w-md h-48 object-cover rounded-lg border border-border-light" src={existingImage} alt="Current" />
            ) : (
              <div className="w-full max-w-md h-48 border-2 border-dashed border-border-light rounded-lg flex flex-col items-center justify-center text-text-secondaryLight hover:border-primary transition-colors">
                <ImagePlus size={32} className="mb-2" /><p className="text-sm">Click to upload cover image</p>
              </div>
            )}
          </label>
          <input onChange={(e) => setBlogImg(e.target.files[0])} type="file" id="blog-img" hidden accept="image/*" />
        </div>
        <div className="flex flex-col lg:flex-row items-start text-gray-500 gap-10">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1"><p>Title</p><input value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded px-3 py-2" type="text" placeholder="Blog post title" required /></div>
            <div className="flex-1 flex flex-col gap-1"><p>Category</p><select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-3 py-2">{categories.map((c) => (<option key={c} value={c}>{c}</option>))}</select></div>
            <div className="flex-1 flex flex-col gap-1"><p>Author</p><input value={author} onChange={(e) => setAuthor(e.target.value)} className="border rounded px-3 py-2" type="text" placeholder="Author name" /></div>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1"><p>Tags (comma separated)</p><input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="border rounded px-3 py-2" type="text" placeholder="health, wellness, tips" /></div>
            <div className="flex-1 flex flex-col gap-1"><p>Excerpt (optional)</p><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="border rounded px-3 py-2" placeholder="Brief summary (auto-generated if empty)" rows={3} /></div>
            <div className="flex items-center gap-6 text-sm mt-2"><label className="flex items-center gap-2"><input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />Publish immediately</label></div>
          </div>
        </div>
        <div className="text-gray-500 mt-6"><p className="mb-2">Content</p><textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 pt-2 border rounded" placeholder="Write your blog post content here..." rows={12} required /></div>
        <div className="flex gap-3 mt-4">
          <button type="submit" disabled={loading} className="bg-primary px-10 py-3 text-white rounded-full cursor-pointer hover:bg-primary-hover transition-colors disabled:opacity-50">{loading ? "Saving..." : editId ? "Update post" : "Create post"}</button>
          {editId && <button type="button" onClick={() => router.push("/doctor-blogs")} className="px-10 py-3 border border-border-light rounded-full cursor-pointer hover:bg-primary-soft transition-colors">Cancel</button>}
        </div>
      </div>
    </form>
  );
}

export default function DoctorAddBlog() {
  return (
    <Suspense fallback={null}>
      <DoctorAddBlogContent />
    </Suspense>
  );
}
