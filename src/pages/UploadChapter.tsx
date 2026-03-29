import { useState } from "react";
import { Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImagesToCloudinary } from "@/services/uploadToCloudinary";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const UploadChapter = () => {
    const [mangaId, setMangaId] = useState("");
    const [chapterNumber, setChapterNumber] = useState(1);
    const [chapterTitle, setChapterTitle] = useState("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const images = files.filter(f => f.type.startsWith("image/"));
        setImageFiles(images);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mangaId.trim() || imageFiles.length === 0) return;

        setSubmitting(true);
        setProgress(0);
        setUploadedUrls([]);

        try {
            const urls = await uploadImagesToCloudinary(imageFiles, chapterTitle, setProgress);
            setUploadedUrls(urls);

            // Save to backend
            const res = await fetch(`${API_BASE_URL}/manga/${mangaId}/chapters`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    number: chapterNumber,
                    title: chapterTitle,
                    imageUrls: urls, // ✅ new field
                }),
            });

            if (!res.ok) throw new Error("Backend save failed");

            alert("✅ Chapter uploaded successfully!");
            setImageFiles([]);
            setProgress(0);
        } catch (err) {
            console.error(err);
            alert("❌ Upload failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-primary">
                    Upload Chapter
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Manga ID */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Manga ID</label>
                        <input
                            type="text"
                            value={mangaId}
                            onChange={(e) => setMangaId(e.target.value)}
                            placeholder="Enter manga ID"
                            required
                            className="w-full px-3 py-2 rounded-lg border bg-card border-border"
                        />
                    </div>

                    {/* Chapter Number */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Chapter Number</label>
                        <input
                            type="number"
                            value={chapterNumber}
                            onChange={(e) => setChapterNumber(Number(e.target.value))}
                            min={1}
                            required
                            className="w-full px-3 py-2 rounded-lg border bg-card border-border"
                        />
                    </div>

                    {/* Chapter Title */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Chapter Title</label>
                        <input
                            type="text"
                            value={chapterTitle}
                            onChange={(e) => setChapterTitle(e.target.value)}
                            placeholder="e.g. The Beginning"
                            className="w-full px-3 py-2 rounded-lg border bg-card border-border"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Chapter Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFilesChange}
                            className="block w-full text-sm text-muted-foreground"
                        />
                        {imageFiles.length > 0 && (
                            <div className="mt-2 grid grid-cols-4 gap-2">
                                {imageFiles.map((file, idx) => (
                                    <div key={idx} className="relative w-full h-24 border border-border rounded overflow-hidden">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {submitting && (
                        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {/* Uploaded URLs */}
                    {uploadedUrls.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-sm font-medium text-muted-foreground mb-2">Uploaded Images:</h2>
                            <div className="flex flex-wrap gap-2">
                                {uploadedUrls.map((url, idx) => (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                                        <img src={url} alt={`Page ${idx + 1}`} className="w-20 h-28 object-cover rounded border" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <Button type="submit" disabled={imageFiles.length === 0 || !mangaId.trim() || submitting} className="w-full gap-2">
                        <Upload className="h-4 w-4" />
                        {submitting ? "Uploading..." : "Upload Chapter"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default UploadChapter;