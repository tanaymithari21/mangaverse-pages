// UploadManga.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { genres } from "@/data/manga";
import { uploadToCloudinary, uploadImagesToCloudinary } from "@/services/uploadToCloudinary";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const UploadManga = () => {
  const navigate = useNavigate();

  // Manga info
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState<"Ongoing" | "Completed">("Ongoing");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Files
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pageFiles, setPageFiles] = useState<File[]>([]);
  const [pagePreviews, setPagePreviews] = useState<string[]>([]);

  // Uploading state
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Toggle genres
  const toggleGenre = (genre: string) => {
    if (genre === "All") return;
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Handle cover image selection
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // Handle page images selection
  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setPageFiles(files);
    setPagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile || !title.trim() || !pageFiles.length) {
      alert("Please add cover and at least one page.");
      return;
    }

    setSubmitting(true);
    setProgress(0);

    try {
      // 1️⃣ Upload cover
      const coverRes = await uploadToCloudinary(coverFile, title);
      const coverUrl = coverRes.secure_url;

      // 2️⃣ Upload pages
      const pageUrls = await uploadImagesToCloudinary(pageFiles, title, (p) => setProgress(p));

      // 3️⃣ Send to backend
      const body = {
        title,
        author,
        description,
        year,
        status,
        genres: selectedGenres,
        cover: coverUrl,
        pages: pageUrls, // Array of image URLs
      };

      const res = await fetch(`${API_BASE_URL}/manga`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to upload manga");

      const data = await res.json();
      alert("Manga uploaded successfully!");
      navigate(`/manga/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console for details.");
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-primary" style={{ fontFamily: "var(--font-heading)" }}>
          Upload Manga
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Cover Image
            </label>
            <div className="flex items-start gap-4">
              {coverPreview ? (
                <div className="relative w-40 h-56 rounded-lg overflow-hidden border border-border">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-foreground hover:bg-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-40 h-56 rounded-lg border-2 border-dashed border-border bg-card hover:border-primary/50 cursor-pointer transition-colors">
                  <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Select Cover</span>
                  <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Pages */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Pages
            </label>
            <label className="flex flex-wrap gap-2 p-2 rounded-lg border-2 border-dashed border-border bg-card hover:border-primary/50 cursor-pointer transition-colors">
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Select Pages (multiple)</span>
              <input type="file" accept="image/*" multiple onChange={handlePagesChange} className="hidden" />
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {pagePreviews.map((src, idx) => (
                <div key={idx} className="relative w-24 h-32 rounded overflow-hidden border border-border">
                  <img src={src} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = pageFiles.filter((_, i) => i !== idx);
                      const newPreviews = pagePreviews.filter((_, i) => i !== idx);
                      setPageFiles(newFiles);
                      setPagePreviews(newPreviews);
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-foreground hover:bg-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Title, Author, Description */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Manga title" required className="bg-card border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Author</label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" className="bg-card border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Manga description..."
              rows={4}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* Year & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Year</label>
              <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-card border-border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Ongoing" | "Completed")}
                className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Genres</label>
            <div className="flex flex-wrap gap-2">
              {genres.filter((g) => g !== "All").map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedGenres.includes(genre)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Button & Progress */}
          <div>
            <Button type="submit" disabled={!coverFile || !pageFiles.length || !title.trim() || submitting} className="w-full gap-2">
              <Upload className="h-4 w-4" />
              {submitting ? `Uploading... ${progress.toFixed(0)}%` : "Upload Manga"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadManga;