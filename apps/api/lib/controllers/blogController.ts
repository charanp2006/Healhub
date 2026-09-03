import blogModel from "../models/blogModel";
import doctorModel from "../models/doctorModel";
import hospitalModel from "../models/hospitalModel";
import { connectDB } from "../db";
import { json, bad } from "../http";
import { uploadImageToCloudinary, getFile, getField } from "../upload";
import { verifyDoctor, verifyHospital } from "../auth";

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function addBlog(request: Request): Promise<Response> {
  try {
    await connectDB();
    const formData = await request.formData();
    const title = getField(formData, "title");
    const content = getField(formData, "content");
    const excerpt = getField(formData, "excerpt");
    const category = getField(formData, "category");
    const tagsRaw = getField(formData, "tags");
    const author = getField(formData, "author");
    const isPublished = getField(formData, "isPublished");
    const hospitalId = getField(formData, "hospitalId");
    const doctorId = getField(formData, "doctorId");
    const imageFile = getFile(formData, "image");

    if (!title || !content) {
      return json({
        success: false,
        message: "Title and content are required",
      });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await blogModel.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    let imageUrl = "";
    if (imageFile) {
      imageUrl = (await uploadImageToCloudinary(imageFile)) || "";
    }

    const parsedTags = tagsRaw
      ? Array.isArray(tagsRaw)
        ? tagsRaw
        : JSON.parse(tagsRaw)
      : [];

    const published = isPublished === "true" || isPublished === "1";

    const blog = new blogModel({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 160),
      image: imageUrl,
      category: category || "Other",
      tags: parsedTags,
      author: author || "Admin",
      hospitalId: hospitalId || null,
      doctorId: doctorId || null,
      isPublished: published,
      publishedAt: published ? new Date() : null,
    });

    await blog.save();
    return json({ success: true, message: "Blog created", blog });
  } catch (error) {
    console.log("Error in addBlog:", error);
    return bad((error as Error).message);
  }
}

export async function updateBlog(request: Request): Promise<Response> {
  try {
    await connectDB();
    const formData = await request.formData();
    const blogId = getField(formData, "blogId");
    const title = getField(formData, "title");
    const content = getField(formData, "content");
    const excerpt = getField(formData, "excerpt");
    const category = getField(formData, "category");
    const tagsRaw = getField(formData, "tags");
    const author = getField(formData, "author");
    const isPublished = getField(formData, "isPublished");
    const hospitalId = getField(formData, "hospitalId");
    const doctorId = getField(formData, "doctorId");
    const imageFile = getFile(formData, "image");

    if (!blogId) {
      return json({ success: false, message: "Blog ID is required" });
    }

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return json({ success: false, message: "Blog not found" });
    }

    if (title) {
      blog.title = title;
      const baseSlug = slugify(title);
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await blogModel.findOne({ slug });
        if (!existing || existing._id.toString() === blogId) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      blog.slug = slug;
    }

    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (category) blog.category = category;
    if (author) blog.author = author;
    if (hospitalId) blog.hospitalId = hospitalId || null;
    if (doctorId) blog.doctorId = doctorId || null;

    if (tagsRaw) {
      blog.tags = Array.isArray(tagsRaw) ? tagsRaw : JSON.parse(tagsRaw);
    }

    if (imageFile) {
      blog.image = (await uploadImageToCloudinary(imageFile)) || blog.image;
    }

    if (isPublished) {
      const published = isPublished === "true" || isPublished === "1";
      if (published && !blog.isPublished) {
        blog.publishedAt = new Date();
      }
      blog.isPublished = published;
    }

    await blog.save();
    return json({ success: true, message: "Blog updated", blog });
  } catch (error) {
    console.log("Error in updateBlog:", error);
    return bad((error as Error).message);
  }
}

export async function deleteBlog(request: Request): Promise<Response> {
  try {
    await connectDB();
    const { blogId } = await request.json();
    if (!blogId) {
      return json({ success: false, message: "Blog ID is required" });
    }
    const blog = await blogModel.findByIdAndDelete(blogId);
    if (!blog) {
      return json({ success: false, message: "Blog not found" });
    }
    return json({ success: true, message: "Blog deleted" });
  } catch (error) {
    console.log("Error in deleteBlog:", error);
    return bad((error as Error).message);
  }
}

export async function adminListBlogs(request: Request): Promise<Response> {
  try {
    await connectDB();
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "12";
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const hospitalId = url.searchParams.get("hospitalId");
    const doctorId = url.searchParams.get("doctorId");

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10), 1), 50);
    const skipCount = (pageNumber - 1) * limitNumber;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: escapeRegExp(search), $options: "i" };
    if (hospitalId) filter.hospitalId = hospitalId;
    if (doctorId) filter.doctorId = doctorId;

    const blogs = await blogModel
      .find(filter)
      .populate("hospitalId", "name city image")
      .populate("doctorId", "name speciality image")
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limitNumber)
      .select("-content");

    const totalCount = await blogModel.countDocuments(filter);

    return json({
      success: true,
      blogs,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCount,
      },
    });
  } catch (error) {
    console.log("Error in adminListBlogs:", error);
    return bad((error as Error).message);
  }
}

export async function adminGetBlog(
  request: Request,
  blogId: string
): Promise<Response> {
  try {
    await connectDB();
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return json({ success: false, message: "Blog not found" });
    }
    return json({ success: true, blog });
  } catch (error) {
    console.log("Error in adminGetBlog:", error);
    return bad((error as Error).message);
  }
}

export async function listBlogs(request: Request): Promise<Response> {
  try {
    await connectDB();
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "9";
    const category = url.searchParams.get("category");
    const tag = url.searchParams.get("tag");
    const search = url.searchParams.get("search");
    const hospitalId = url.searchParams.get("hospitalId");

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10), 1), 30);
    const skipCount = (pageNumber - 1) * limitNumber;

    const filter: Record<string, unknown> = { isPublished: true };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) filter.title = { $regex: escapeRegExp(search), $options: "i" };
    if (hospitalId) filter.hospitalId = hospitalId;

    const blogs = await blogModel
      .find(filter)
      .populate("hospitalId", "name city image")
      .populate("doctorId", "name speciality image")
      .sort({ publishedAt: -1 })
      .skip(skipCount)
      .limit(limitNumber)
      .select("-content");

    const totalCount = await blogModel.countDocuments(filter);

    return json({
      success: true,
      blogs,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCount,
      },
    });
  } catch (error) {
    console.log("Error in listBlogs:", error);
    return bad((error as Error).message);
  }
}

export async function getBlogBySlug(
  request: Request,
  slug: string
): Promise<Response> {
  try {
    await connectDB();
    const blog = await blogModel
      .findOneAndUpdate(
        { slug, isPublished: true },
        { $inc: { views: 1 } },
        { new: true }
      )
      .populate("hospitalId", "name city image address")
      .populate("doctorId", "name speciality image");

    if (!blog) {
      return json({ success: false, message: "Blog not found" });
    }

    const related = await blogModel
      .find({ category: blog.category, isPublished: true, _id: { $ne: blog._id } })
      .populate("hospitalId", "name city image")
      .populate("doctorId", "name speciality image")
      .sort({ publishedAt: -1 })
      .limit(3)
      .select("-content");

    return json({ success: true, blog, related });
  } catch (error) {
    console.log("Error in getBlogBySlug:", error);
    return bad((error as Error).message);
  }
}

export async function doctorAddBlog(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const formData = await request.formData();
    const title = getField(formData, "title");
    const content = getField(formData, "content");
    const excerpt = getField(formData, "excerpt");
    const category = getField(formData, "category");
    const tagsRaw = getField(formData, "tags");
    const isPublished = getField(formData, "isPublished");
    const imageFile = getFile(formData, "image");

    if (!title || !content) {
      return json({
        success: false,
        message: "Title and content are required",
      });
    }

    const doctor = await doctorModel.findById(docId).select("name hospitalId");
    if (!doctor) {
      return json({ success: false, message: "Doctor not found" });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await blogModel.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    let imageUrl = "";
    if (imageFile) {
      imageUrl = (await uploadImageToCloudinary(imageFile)) || "";
    }

    const parsedTags = tagsRaw
      ? Array.isArray(tagsRaw)
        ? tagsRaw
        : JSON.parse(tagsRaw)
      : [];
    const published = isPublished === "true" || isPublished === "1";

    const blog = new blogModel({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 160),
      image: imageUrl,
      category: category || "Other",
      tags: parsedTags,
      author: doctor.name,
      hospitalId: doctor.hospitalId || null,
      doctorId: docId,
      isPublished: published,
      publishedAt: published ? new Date() : null,
    });

    await blog.save();
    return json({ success: true, message: "Blog created", blog });
  } catch (error) {
    console.log("Error in doctorAddBlog:", error);
    return bad((error as Error).message);
  }
}

export async function doctorUpdateBlog(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const formData = await request.formData();
    const blogId = getField(formData, "blogId");
    const title = getField(formData, "title");
    const content = getField(formData, "content");
    const excerpt = getField(formData, "excerpt");
    const category = getField(formData, "category");
    const tagsRaw = getField(formData, "tags");
    const isPublished = getField(formData, "isPublished");
    const imageFile = getFile(formData, "image");

    if (!blogId)
      return json({ success: false, message: "Blog ID is required" });

    const blog = await blogModel.findById(blogId);
    if (!blog) return json({ success: false, message: "Blog not found" });
    if (blog.doctorId?.toString() !== docId) {
      return json({ success: false, message: "Unauthorized" });
    }

    if (title) {
      blog.title = title;
      const baseSlug = slugify(title);
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await blogModel.findOne({ slug });
        if (!existing || existing._id.toString() === blogId) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      blog.slug = slug;
    }

    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (category) blog.category = category;
    if (tagsRaw) blog.tags = Array.isArray(tagsRaw) ? tagsRaw : JSON.parse(tagsRaw);

    if (imageFile) {
      blog.image = (await uploadImageToCloudinary(imageFile)) || blog.image;
    }

    if (isPublished) {
      const published = isPublished === "true" || isPublished === "1";
      if (published && !blog.isPublished) blog.publishedAt = new Date();
      blog.isPublished = published;
    }

    await blog.save();
    return json({ success: true, message: "Blog updated", blog });
  } catch (error) {
    console.log("Error in doctorUpdateBlog:", error);
    return bad((error as Error).message);
  }
}

export async function doctorDeleteBlog(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const { blogId } = await request.json();
    if (!blogId)
      return json({ success: false, message: "Blog ID is required" });

    const blog = await blogModel.findById(blogId);
    if (!blog) return json({ success: false, message: "Blog not found" });
    if (blog.doctorId?.toString() !== docId) {
      return json({ success: false, message: "Unauthorized" });
    }

    await blogModel.findByIdAndDelete(blogId);
    return json({ success: true, message: "Blog deleted" });
  } catch (error) {
    console.log("Error in doctorDeleteBlog:", error);
    return bad((error as Error).message);
  }
}

export async function doctorListBlogs(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "12";
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10), 1), 50);
    const skipCount = (pageNumber - 1) * limitNumber;

    const filter: Record<string, unknown> = { doctorId: docId };
    if (category) filter.category = category;
    if (search) filter.title = { $regex: escapeRegExp(search), $options: "i" };

    const blogs = await blogModel
      .find(filter)
      .populate("hospitalId", "name city image")
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limitNumber)
      .select("-content");

    const totalCount = await blogModel.countDocuments(filter);

    return json({
      success: true,
      blogs,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCount,
      },
    });
  } catch (error) {
    console.log("Error in doctorListBlogs:", error);
    return bad((error as Error).message);
  }
}

export async function doctorGetBlog(
  request: Request,
  blogId: string
): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const blog = await blogModel.findById(blogId);
    if (!blog) return json({ success: false, message: "Blog not found" });
    if (blog.doctorId?.toString() !== docId) {
      return json({ success: false, message: "Unauthorized" });
    }
    return json({ success: true, blog });
  } catch (error) {
    console.log("Error in doctorGetBlog:", error);
    return bad((error as Error).message);
  }
}

export async function hospitalAddBlog(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) return bad(auth.message);
    const hospitalId = auth.hospitalId!;

    const formData = await request.formData();
    const title = getField(formData, "title");
    const content = getField(formData, "content");
    const excerpt = getField(formData, "excerpt");
    const category = getField(formData, "category");
    const tagsRaw = getField(formData, "tags");
    const isPublished = getField(formData, "isPublished");
    const imageFile = getFile(formData, "image");

    if (!title || !content) {
      return json({
        success: false,
        message: "Title and content are required",
      });
    }

    const hospital = await hospitalModel.findById(hospitalId).select("name");
    if (!hospital) {
      return json({ success: false, message: "Hospital not found" });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await blogModel.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    let imageUrl = "";
    if (imageFile) {
      imageUrl = (await uploadImageToCloudinary(imageFile)) || "";
    }

    const parsedTags = tagsRaw
      ? Array.isArray(tagsRaw)
        ? tagsRaw
        : JSON.parse(tagsRaw)
      : [];
    const published = isPublished === "true" || isPublished === "1";

    const blog = new blogModel({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 160),
      image: imageUrl,
      category: category || "Other",
      tags: parsedTags,
      author: hospital.name,
      hospitalId,
      doctorId: null,
      isPublished: published,
      publishedAt: published ? new Date() : null,
    });

    await blog.save();
    return json({ success: true, message: "Blog created", blog });
  } catch (error) {
    console.log("Error in hospitalAddBlog:", error);
    return bad((error as Error).message);
  }
}

export async function hospitalUpdateBlog(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) return bad(auth.message);
    const hospitalId = auth.hospitalId!;

    const formData = await request.formData();
    const blogId = getField(formData, "blogId");
    const title = getField(formData, "title");
    const content = getField(formData, "content");
    const excerpt = getField(formData, "excerpt");
    const category = getField(formData, "category");
    const tagsRaw = getField(formData, "tags");
    const isPublished = getField(formData, "isPublished");
    const imageFile = getFile(formData, "image");

    if (!blogId)
      return json({ success: false, message: "Blog ID is required" });

    const blog = await blogModel.findById(blogId);
    if (!blog) return json({ success: false, message: "Blog not found" });
    if (blog.hospitalId?.toString() !== hospitalId) {
      return json({ success: false, message: "Unauthorized" });
    }

    if (title) {
      blog.title = title;
      const baseSlug = slugify(title);
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await blogModel.findOne({ slug });
        if (!existing || existing._id.toString() === blogId) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      blog.slug = slug;
    }

    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (category) blog.category = category;
    if (tagsRaw) blog.tags = Array.isArray(tagsRaw) ? tagsRaw : JSON.parse(tagsRaw);

    if (imageFile) {
      blog.image = (await uploadImageToCloudinary(imageFile)) || blog.image;
    }

    if (isPublished) {
      const published = isPublished === "true" || isPublished === "1";
      if (published && !blog.isPublished) blog.publishedAt = new Date();
      blog.isPublished = published;
    }

    await blog.save();
    return json({ success: true, message: "Blog updated", blog });
  } catch (error) {
    console.log("Error in hospitalUpdateBlog:", error);
    return bad((error as Error).message);
  }
}

export async function hospitalDeleteBlog(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) return bad(auth.message);
    const hospitalId = auth.hospitalId!;

    const { blogId } = await request.json();
    if (!blogId)
      return json({ success: false, message: "Blog ID is required" });

    const blog = await blogModel.findById(blogId);
    if (!blog) return json({ success: false, message: "Blog not found" });
    if (blog.hospitalId?.toString() !== hospitalId) {
      return json({ success: false, message: "Unauthorized" });
    }

    await blogModel.findByIdAndDelete(blogId);
    return json({ success: true, message: "Blog deleted" });
  } catch (error) {
    console.log("Error in hospitalDeleteBlog:", error);
    return bad((error as Error).message);
  }
}

export async function hospitalListBlogs(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) return bad(auth.message);
    const hospitalId = auth.hospitalId!;

    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "12";
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const authorType = url.searchParams.get("authorType");

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10), 1), 50);
    const skipCount = (pageNumber - 1) * limitNumber;

    const filter: Record<string, unknown> = { hospitalId };
    if (category) filter.category = category;
    if (search) filter.title = { $regex: escapeRegExp(search), $options: "i" };
    if (authorType === "hospital") filter.doctorId = null;
    if (authorType === "doctor") filter.doctorId = { $ne: null };

    const blogs = await blogModel
      .find(filter)
      .populate("doctorId", "name speciality image")
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limitNumber)
      .select("-content");

    const totalCount = await blogModel.countDocuments(filter);

    return json({
      success: true,
      blogs,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCount,
      },
    });
  } catch (error) {
    console.log("Error in hospitalListBlogs:", error);
    return bad((error as Error).message);
  }
}

export async function hospitalGetBlog(
  request: Request,
  blogId: string
): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) return bad(auth.message);
    const hospitalId = auth.hospitalId!;

    const blog = await blogModel.findById(blogId);
    if (!blog) return json({ success: false, message: "Blog not found" });
    if (blog.hospitalId?.toString() !== hospitalId) {
      return json({ success: false, message: "Unauthorized" });
    }
    return json({ success: true, blog });
  } catch (error) {
    console.log("Error in hospitalGetBlog:", error);
    return bad((error as Error).message);
  }
}
