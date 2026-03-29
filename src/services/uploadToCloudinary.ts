const CLOUD_NAME = "dh5yuvk3k";
const API_BASE_URL = "http://localhost:8080";

const MAX_CHUNK_SIZE = 9 * 1024 * 1024; // 9MB (safe under 10MB limit)

/**
 * Upload PDF by splitting into multiple smaller files
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
    const file = files[i];
    const fileName = `${title.replace(/\s+/g, "_")}_page_${i + 1}`;

    const sigRes = await fetch(
      `${API_BASE_URL}/cloudinary/signature?public_id=${fileName}`
    );
    if (!sigRes.ok) throw new Error("Failed to get signature");

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
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");

    urls.push(data.secure_url);

    uploadedBytes += file.size;
    if (onProgress) onProgress((uploadedBytes / totalBytes) * 100);
  }

  return urls;
};
export const uploadToCloudinary = async (file: File, title: string) => {
  const fileName = `${title.replace(/\s+/g, "_")}_cover`;

  const sigRes = await fetch(
    `${API_BASE_URL}/cloudinary/signature?public_id=${fileName}`
  );

  const { timestamp, signature, api_key } = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("public_id", fileName);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("api_key", api_key);
  // formData.append("resource_type", "raw");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Upload failed");

  return await res.json();
};