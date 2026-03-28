import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { genres } from "@/data/manga";
import { fileStorage } from "@/services/fileStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const UploadManga = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState<"Ongoing" | "Completed">("Ongoing");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleGenre = (genre: string) => {
    if (genre === "All") return;
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile || !title.trim()) return;

    setSubmitting(true);
    try {
      // Send only metadata to backend
      const res = await fetch(`${API_BASE_URL}/manga`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          description,
          year,
          status,
          genres: selectedGenres,
        }),
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      // Save cover file to IndexedDB
      await fileStorage.saveCover(String(data.id), coverFile);

      alert("Manga uploaded successfully!");
      navigate(`/manga/${data.id}`);
    } catch (err) {
      alert("Upload failed. Make sure the backend is running.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1
          className="text-3xl font-bold mb-8 text-primary"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Upload Manga
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover upload */}
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
            <p className="text-xs text-muted-foreground mt-2">Cover is saved locally in your browser</p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Manga title" required className="bg-card border-border" />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Author</label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" className="bg-card border-border" />
          </div>

          {/* Description */}
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedGenres.includes(genre)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={!coverFile || !title.trim() || submitting} className="w-full gap-2">
            <Upload className="h-4 w-4" />
            {submitting ? "Uploading..." : "Upload Manga"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadManga;
