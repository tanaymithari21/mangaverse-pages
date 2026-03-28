const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,  // uncomment when auth is ready
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ---- Manga endpoints ----

export const mangaApi = {
  getAll: (params?: { search?: string; genre?: string; page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.genre && params.genre !== "All") query.set("genre", params.genre);
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    return request<any>(`/manga?${query.toString()}`);
  },

  getById: (id: string) => request<any>(`/manga/${id}`),

  getFeatured: () => request<any>(`/manga/featured`),

  getChapters: (mangaId: string) => request<any>(`/manga/${mangaId}/chapters`),

  getPages: (mangaId: string, chapterId: string) =>
    request<any>(`/manga/${mangaId}/chapters/${chapterId}/pages`),

  upload: (formData: FormData) =>
    fetch(`${API_BASE_URL}/manga`, { method: "POST", body: formData }).then((r) => {
      if (!r.ok) throw new Error("Upload failed");
      return r.json();
    }),

  uploadChapter: (mangaId: string, formData: FormData) =>
    fetch(`${API_BASE_URL}/manga/${mangaId}/chapters`, { method: "POST", body: formData }).then((r) => {
      if (!r.ok) throw new Error("Upload failed");
      return r.json();
    }),
};

// ---- Auth endpoints (for future use) ----

export const authApi = {
  login: (email: string, password: string) =>
    request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { username: string; email: string; password: string }) =>
    request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ---- User endpoints (for future use) ----

export const userApi = {
  getProfile: () => request<any>("/user/profile"),

  getFavorites: () => request<any>("/user/favorites"),

  addFavorite: (mangaId: string) =>
    request<any>(`/user/favorites/${mangaId}`, { method: "POST" }),

  removeFavorite: (mangaId: string) =>
    request<any>(`/user/favorites/${mangaId}`, { method: "DELETE" }),

  getReadingHistory: () => request<any>("/user/history"),

  updateReadProgress: (mangaId: string, chapterId: string, page: number) =>
    request<any>(`/user/history`, {
      method: "POST",
      body: JSON.stringify({ mangaId, chapterId, page }),
    }),
};

export default { mangaApi, authApi, userApi };
