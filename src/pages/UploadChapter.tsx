import { useState, useEffect } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UploadChapter = () => {
  const [mangaId, setMangaId] = useState("");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterTitle, setChapterTitle] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !mangaId.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("mangaId", mangaId);
      formData.append("chapterNumber", String(chapterNumber));
      formData.append("title", chapterTitle);
      formData.append("pdf", pdfFile);

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
      const res = await fetch(`${API_BASE_URL}/manga/${mangaId}/chapters`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Chapter uploaded successfully!");
      setPdfFile(null);
      setChapterTitle("");
      setChapterNumber((n) => n + 1);
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
          Upload Chapter
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Manga ID */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Manga ID
            </label>
            <Input
              value={mangaId}
              onChange={(e) => setMangaId(e.target.value)}
              placeholder="Enter manga ID"
              required
              className="bg-card border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The ID of the manga this chapter belongs to
            </p>
          </div>

          {/* Chapter Number */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Chapter Number
            </label>
            <Input
              type="number"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(Number(e.target.value))}
              min={1}
              required
              className="bg-card border-border"
            />
          </div>

          {/* Chapter Title */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Chapter Title
            </label>
            <Input
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="e.g. The Beginning"
              className="bg-card border-border"
            />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Chapter PDF
            </label>
            {pdfFile ? (
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                <FileText className="h-8 w-8 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{pdfFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfFile(null)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed border-border bg-card hover:border-primary/50 cursor-pointer transition-colors">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Select PDF file</span>
                <span className="text-xs text-muted-foreground mt-1">PDF format only</span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <Button
            type="submit"
            disabled={!pdfFile || !mangaId.trim() || submitting}
            className="w-full gap-2"
          >
            <Upload className="h-4 w-4" />
            {submitting ? "Uploading..." : "Upload Chapter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadChapter;
