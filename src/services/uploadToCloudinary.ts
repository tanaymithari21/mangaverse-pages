// Fix: use env variable instead of hardcoded cloud name
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dh5yuvk3k";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MAX_SIZE_BYTES = 9.5 * 1024 * 1024; // 9.5MB — safe under Cloudinary's 10MB limit

/**
 * Compresses an image file using canvas if it exceeds MAX_SIZE_BYTES.
 * Tries quality 0.85 first, then 0.7, then 0.5 until it fits.
 */
const compressIfNeeded = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    if (file.size <= MAX_SIZE_BYTES) {
      resolve(file); // already small enough
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const tryQuality = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            if (blob.size <= MAX_SIZE_BYTES || quality <= 0.4) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              tryQuality(quality - 0.15); // reduce quality and try again
            }
          },
          "image/jpeg",
          quality
        );
      };

      tryQuality(0.85);
    };
    img.onerror = () => resolve(file); // fallback: upload as-is
    img.src = url;
  });
};

/**
 * Upload multiple image files to Cloudinary (used for chapter pages)
 */
export const uploadImagesToCloudinary = async (
  files: File[],
  title: string,
  onProgress?: (p: number) => void
): Promise<string[]> => {
  const urls: string[] = [];
  let uploadedBytes = 0;
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  for (let i = 0; i < files.length; i++) {
    const file = await compressIfNeeded(files[i]); // compress if over 9.5MB
    const fileName = `${title.replace(/\s+/g, "_")}_page_${i + 1}`;

    const sigRes = await fetch(
      `${API_BASE_URL}/cloudinary/signature?public_id=${encodeURIComponent(fileName)}`
    );
    if (!sigRes.ok) throw new Error("Failed to get Cloudinary signature");

    const { timestamp, signature, api_key } = await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("public_id", fileName);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("api_key", api_key);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Cloudinary upload failed");

    urls.push(data.secure_url);

    uploadedBytes += file.size;
    if (onProgress) onProgress((uploadedBytes / totalBytes) * 100);
  }

  return urls;
};

/**
 * Upload a single image to Cloudinary (used for manga cover)
 */
export const uploadToCloudinary = async (file: File, title: string) => {
  const compressed = await compressIfNeeded(file); // compress if over 9.5MB
  const fileName = `${title.replace(/\s+/g, "_")}_cover`;

  const sigRes = await fetch(
    `${API_BASE_URL}/cloudinary/signature?public_id=${encodeURIComponent(fileName)}`
  );
  if (!sigRes.ok) throw new Error("Failed to get Cloudinary signature");

  const { timestamp, signature, api_key } = await sigRes.json();

  const formData = new FormData();
  formData.append("file", compressed);
  formData.append("public_id", fileName);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("api_key", api_key);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return await res.json();
};
