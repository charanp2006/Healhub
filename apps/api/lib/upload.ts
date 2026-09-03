import { getCloudinary } from "./cloudinary";

/**
 * Upload an image File (from FormData) to Cloudinary and return the secure URL.
 * Returns null when no file is provided.
 */
export async function uploadImageToCloudinary(
  file: File | null | undefined
): Promise<string | null> {
  if (!file) {
    return null;
  }
  const cloudinary = getCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<string | null>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || null);
        }
      }
    );
    uploadStream.end(buffer);
  });
  return result;
}

/**
 * Extract a named file field from FormData.
 */
export function getFile(formData: FormData, name: string): File | null {
  const value = formData.get(name);
  return value instanceof File ? value : null;
}

/**
 * Extract a string field from FormData with optional fallback.
 */
export function getField(
  formData: FormData,
  name: string,
  fallback = ""
): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : fallback;
}
