import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, ImagePlus, X, Trash2, FileText, Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { genres } from "@/data/manga";

interface ChapterInfo {
  id: string;
  number: number;
  title: string;
  pdfUrl: string;
}

interface MangaDetails {
  id: string;
  title: string;
  author: string;
  description: string;
  year: number;
  rating: number;
  status: "Ongoing" | "Completed";
  genres: string[];
  cover: string;
  chapters: ChapterInfo[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const EditManga = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(2024);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<"Ongoing" | "Completed">("Ongoing");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // New chapter upload
  const [newChapterNumber, setNewChapterNumber] = useState(1);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterPdf, setNewChapterPdf] = useState<File | null>(null);
  const [uploadingChapter, setUploadingChapter] = useState(false);

  useEffect(() => {
    fetchManga();
  }, [id]);

  const fetchManga = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/manga/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data: MangaDetails = await res.json();
      setTitle(data.title);
      setAuthor(data.author);
      setDescription(data.description);
      setYear(data.year);
      setRating(data.rating);
      setStatus(data.status);
      setSelectedGenres(data.genres);
      setExistingCover(data.cover);
      setCoverPreview(data.cover);
      setChapters(data.chapters || []);
      setNewChapterNumber((data.chapters?.length || 0) + 1);
    } catch (err) {
      console.error("Failed to fetch manga:", err);
      alert("Failed to load manga. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genre: string) => {
    if (genre === "All") return;
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("description", description);
      formData.append("year", String(year));
      formData.append("rating", String(rating));
      formData.append("status", status);
      formData.append("genres", JSON.stringify(selectedGenres));
      if (newCoverFile) {
        formData.append("cover", newCoverFile);
      }

      const res = await fetch(`${API_BASE_URL}/manga/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Manga updated successfully!");
    } catch (err) {
      alert("Save failed. Make sure the backend is running.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteManga = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/manga/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      alert("Manga deleted.");
      navigate("/");
    } catch (err) {
      alert("Delete failed. Make sure the backend is running.");
      console.error(err);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Delete this chapter?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/manga/${id}/chapters/${chapterId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setChapters((prev) => prev.filter((c) => c.id !== chapterId));
    } catch (err) {
      alert("Delete failed. Make sure the backend is running.");
      console.error(err);
    }
  };

  const handleUploadChapter = async () => {
    if (!newChapterPdf) return;
    setUploadingChapter(true);
    try {
      const formData = new FormData();
      formData.append("chapterNumber", String(newChapterNumber));
      formData.append("title", newChapterTitle);
      formData.append("pdf", newChapterPdf);

      const res = await fetch(`${API_BASE_URL}/manga/${id}/chapters`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setChapters((prev) => [...prev, data]);
      setNewChapterPdf(null);
      setNewChapterTitle("");
      setNewChapterNumber((n) => n + 1);
      alert("Chapter uploaded!");
    } catch (err) {
      alert("Upload failed. Make sure the backend is running.");
      console.error(err);
    } finally {
      setUploadingChapter(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading manga...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1
          className="text-3xl font-bold mb-8 text-primary"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Edit Manga
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Cover */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Cover Image
            </label>
            <div className="flex items-start gap-4">
              {coverPreview ? (
                <div className="relative w-40 h-56 rounded-lg overflow-hidden border border-border">
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setNewCoverFile(null);
                      setCoverPreview(existingCover);
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-foreground hover:bg-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-40 h-56 rounded-lg border-2 border-dashed border-border bg-card flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No cover</span>
                </div>
              )}
              <label className="flex flex-col items-center justify-center px-4 py-3 rounded-lg border border-border bg-card hover:border-primary/50 cursor-pointer transition-colors">
                <ImagePlus className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Change Cover</span>
                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-card border-border" required />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Author</label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="bg-card border-border" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* Year, Rating, Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Year</label>
              <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-card border-border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Rating</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-card border-border"
              />
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

          <Button type="submit" disabled={saving} className="w-full gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>

        {/* Chapters Section */}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Chapters
          </h2>

          {chapters.length === 0 ? (
            <p className="text-sm text-muted-foreground mb-6">No chapters yet.</p>
          ) : (
            <div className="space-y-2 mb-6">
              {chapters.map((ch) => (
                <div key={ch.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Ch. {ch.number}{ch.title ? ` — ${ch.title}` : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteChapter(ch.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload new chapter inline */}
          <div className="p-4 rounded-lg border border-dashed border-border bg-card/50 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Add New Chapter</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Chapter #</label>
                <Input
                  type="number"
                  min={1}
                  value={newChapterNumber}
                  onChange={(e) => setNewChapterNumber(Number(e.target.value))}
                  className="bg-card border-border"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Title</label>
                <Input
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="Chapter title"
                  className="bg-card border-border"
                />
              </div>
            </div>
            {newChapterPdf ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground truncate flex-1">{newChapterPdf.name}</span>
                <button
                  onClick={() => setNewChapterPdf(null)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
                <FileText className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Select PDF</span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setNewChapterPdf(f);
                  }}
                  className="hidden"
                />
              </label>
            )}
            <Button
              type="button"
              onClick={handleUploadChapter}
              disabled={!newChapterPdf || uploadingChapter}
              className="w-full gap-2"
              variant="secondary"
            >
              <Upload className="h-4 w-4" />
              {uploadingChapter ? "Uploading..." : "Upload Chapter"}
            </Button>
          </div>
        </div>

        {/* Delete Manga */}
        <div className="mt-12 border-t border-border pt-8">
          {!showDeleteConfirm ? (
            <Button
              type="button"
              variant="destructive"
              className="w-full gap-2"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Manga
            </Button>
          ) : (
            <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5 space-y-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-semibold">This will permanently delete the manga and all its chapters.</span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeleteManga}
                >
                  Yes, Delete
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditManga;
