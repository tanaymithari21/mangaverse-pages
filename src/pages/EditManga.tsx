import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, ImagePlus, X, Trash2, GripVertical, Plus, Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadToCloudinary, uploadImagesToCloudinary } from "@/services/uploadToCloudinary";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dh5yuvk3k";

// ── Cloudinary helpers ──────────────────────────────────────────────────────

// Extract public_id from a Cloudinary URL e.g. https://res.cloudinary.com/.../v123/my_image.webp → my_image
const extractPublicId = (url: string): string | null => {
    try {
        const parts = url.split("/upload/");
        if (parts.length < 2) return null;
        const afterUpload = parts[1].replace(/^v\d+\//, ""); // remove version
        return afterUpload.replace(/\.[^/.]+$/, "");          // remove extension
    } catch { return null; }
};

const deleteFromCloudinary = async (url: string) => {
    const publicId = extractPublicId(url);
    if (!publicId) return;
    try {
        const sigRes = await fetch(`${API}/cloudinary/delete-signature?public_id=${encodeURIComponent(publicId)}`);
        const { timestamp, signature, api_key } = await sigRes.json();
        const form = new FormData();
        form.append("public_id", publicId);
        form.append("timestamp", timestamp);
        form.append("signature", signature);
        form.append("api_key", api_key);
        await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, { method: "POST", body: form });
    } catch (e) {
        console.warn("Cloudinary delete failed for", publicId, e);
    }
};

const deleteUrlsFromCloudinary = async (urls: string[]) => {
    await Promise.all(urls.filter(Boolean).map(deleteFromCloudinary));
};

// ── Types ───────────────────────────────────────────────────────────────────

interface PageItem {
    id?: number;
    imageUrl: string;
    isNew?: boolean;    // uploaded in this session
}

interface ChapterItem {
    id: number;
    number: number;
    title: string;
    pages: PageItem[];
    expanded: boolean;
    saving: boolean;
}

interface MangaData {
    id: number;
    title: string;
    author: string;
    description: string;
    year: number;
    status: "Ongoing" | "Completed";
    genres: string[];
    cover: string;
    chapters: ChapterItem[];
}

// ── Component ───────────────────────────────────────────────────────────────

const EditManga = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [manga, setManga]           = useState<MangaData | null>(null);
    const [allGenres, setAllGenres]   = useState<string[]>([]);
    const [loading, setLoading]       = useState(true);
    const [saving, setSaving]         = useState(false);
    const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
    const [newCoverPreview, setNewCoverPreview] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [dragOver, setDragOver]     = useState<{ chapterId: number; overIdx: number } | null>(null);
    const [dragPage, setDragPage]     = useState<{ chapterId: number; pageIdx: number } | null>(null);

    // Fetch manga + genres
    useEffect(() => {
        if (!id) return;
        Promise.all([
            fetch(`${API}/api/manga/${id}`).then(r => r.json()),
            fetch(`${API}/api/genres`).then(r => r.json()),
        ]).then(([mangaData, genres]) => {
            setManga({
                ...mangaData,
                chapters: (mangaData.chapters || []).map((ch: any) => ({
                    id: ch.id,
                    number: ch.number,
                    title: ch.title,
                    pages: (ch.pages || []).map((p: any) => ({ id: p.id, imageUrl: p.imageUrl })),
                    expanded: false,
                    saving: false,
                })).sort((a: ChapterItem, b: ChapterItem) => a.number - b.number),
            });
            setAllGenres(genres);
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, [id]);

    if (loading || !manga) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
        </div>
    );

    // ── Manga field helpers ────────────────────────────────────────
    const setField = (key: keyof MangaData, val: any) =>
        setManga(m => m ? { ...m, [key]: val } : m);

    const toggleGenre = (g: string) =>
        setManga(m => m ? {
            ...m,
            genres: m.genres.includes(g) ? m.genres.filter(x => x !== g) : [...m.genres, g]
        } : m);

    // ── Save manga details ─────────────────────────────────────────
    const saveManga = async () => {
        setSaving(true);
        try {
            let coverUrl = manga.cover;
            let oldCoverUrl: string | null = null;

            if (newCoverFile) {
                oldCoverUrl = manga.cover; // will delete after successful upload
                const res = await uploadToCloudinary(newCoverFile, manga.title);
                coverUrl = res.secure_url;
            }

            const res = await fetch(`${API}/api/manga/${manga.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...manga, cover: coverUrl }),
            });
            if (!res.ok) throw new Error(await res.text());

            // Delete old cover from Cloudinary after successful save
            if (oldCoverUrl && oldCoverUrl !== coverUrl) {
                await deleteFromCloudinary(oldCoverUrl);
            }

            setManga(m => m ? { ...m, cover: coverUrl } : m);
            setNewCoverFile(null);
            setNewCoverPreview(null);
            alert("✅ Manga details saved!");
        } catch (e) {
            alert("❌ Save failed: " + e);
        } finally {
            setSaving(false);
        }
    };

    // ── Delete whole manga ─────────────────────────────────────────
    const deleteManga = async () => {
        try {
            const res = await fetch(`${API}/api/manga/${manga.id}`, { method: "DELETE" });
            const data = await res.json();
            // Clean up all images from Cloudinary
            await deleteUrlsFromCloudinary(data.cloudinaryUrls || []);
            alert("✅ Manga deleted.");
            navigate("/");
        } catch (e) {
            alert("❌ Delete failed: " + e);
        }
    };

    // ── Chapter helpers ───────────────────────────────────────────
    const updateChapter = (chapterId: number, key: keyof ChapterItem, val: any) =>
        setManga(m => m ? {
            ...m,
            chapters: m.chapters.map(ch => ch.id === chapterId ? { ...ch, [key]: val } : ch)
        } : m);

    const removePageFromChapter = (chapterId: number, pageIdx: number) =>
        setManga(m => m ? {
            ...m,
            chapters: m.chapters.map(ch =>
                ch.id === chapterId
                    ? { ...ch, pages: ch.pages.filter((_, i) => i !== pageIdx) }
                    : ch
            )
        } : m);

    const addPagesToChapter = async (chapterId: number, files: File[]) => {
        const chapter = manga.chapters.find(c => c.id === chapterId);
        if (!chapter) return;
        updateChapter(chapterId, "saving", true);
        try {
            const urls = await uploadImagesToCloudinary(files, `ch${chapter.number}`, undefined);
            const newPages: PageItem[] = urls.map(url => ({ imageUrl: url, isNew: true }));
            updateChapter(chapterId, "pages", [...chapter.pages, ...newPages]);
            updateChapter(chapterId, "saving", false);
        } catch (e) {
            alert("Upload failed: " + e);
            updateChapter(chapterId, "saving", false);
        }
    };

    const saveChapter = async (chapter: ChapterItem) => {
        updateChapter(chapter.id, "saving", true);
        try {
            const res = await fetch(`${API}/api/manga/${manga.id}/chapters/${chapter.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: chapter.id,
                    number: chapter.number,
                    title: chapter.title,
                    pages: chapter.pages.map((p, i) => ({
                        id: p.id,
                        pageNumber: i + 1,
                        imageUrl: p.imageUrl,
                    })),
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            alert(`✅ Chapter ${chapter.number} saved!`);
        } catch (e) {
            alert("❌ Chapter save failed: " + e);
        } finally {
            updateChapter(chapter.id, "saving", false);
        }
    };

    const deleteChapter = async (chapter: ChapterItem) => {
        if (!confirm(`Delete Chapter ${chapter.number}: "${chapter.title}"? This cannot be undone.`)) return;
        try {
            const res = await fetch(`${API}/api/manga/${manga.id}/chapters/${chapter.id}`, { method: "DELETE" });
            const data = await res.json();
            await deleteUrlsFromCloudinary(data.cloudinaryUrls || []);
            setManga(m => m ? { ...m, chapters: m.chapters.filter(c => c.id !== chapter.id) } : m);
            alert(`✅ Chapter ${chapter.number} deleted.`);
        } catch (e) {
            alert("❌ Chapter delete failed: " + e);
        }
    };

    // ── Drag-to-reorder pages ─────────────────────────────────────
    const onDragStart = (chapterId: number, pageIdx: number) =>
        setDragPage({ chapterId, pageIdx });

    const onDragOver = (e: React.DragEvent, chapterId: number, overIdx: number) => {
        e.preventDefault();
        setDragOver({ chapterId, overIdx });
    };

    const onDrop = (chapterId: number, overIdx: number) => {
        if (!dragPage || dragPage.chapterId !== chapterId) return;
        const chapter = manga.chapters.find(c => c.id === chapterId);
        if (!chapter) return;
        const pages = [...chapter.pages];
        const [moved] = pages.splice(dragPage.pageIdx, 1);
        pages.splice(overIdx, 0, moved);
        updateChapter(chapterId, "pages", pages);
        setDragPage(null);
        setDragOver(null);
    };

    // ── Render ────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(`/manga/${manga.id}`)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={15} /> Back to manga
                    </button>
                    <h1 className="text-2xl font-black text-primary">Edit Manga</h1>
                </div>

                {/* ── MANGA DETAILS ── */}
                <section className="bg-card border border-border rounded-xl p-6 space-y-5 mb-8">
                    <h2 className="text-lg font-bold">Manga Details</h2>

                    {/* Cover */}
                    <div className="flex gap-6 items-start">
                        <div className="relative w-36 h-52 flex-shrink-0">
                            <img
                                src={newCoverPreview || manga.cover}
                                alt="Cover"
                                className="w-full h-full object-cover rounded-lg border border-border"
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg cursor-pointer">
                                <ImagePlus size={20} className="text-white" />
                                <input type="file" accept="image/*" className="hidden"
                                    onChange={e => {
                                        const f = e.target.files?.[0];
                                        if (!f) return;
                                        setNewCoverFile(f);
                                        setNewCoverPreview(URL.createObjectURL(f));
                                    }} />
                            </label>
                            {newCoverPreview && (
                                <button
                                    onClick={() => { setNewCoverFile(null); setNewCoverPreview(null); }}
                                    className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                                    <Input value={manga.title} onChange={e => setField("title", e.target.value)} className="bg-background border-border" />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Author</label>
                                    <Input value={manga.author} onChange={e => setField("author", e.target.value)} className="bg-background border-border" />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Year</label>
                                    <Input type="number" value={manga.year} onChange={e => setField("year", Number(e.target.value))} className="bg-background border-border" />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                                    <select
                                        value={manga.status}
                                        onChange={e => setField("status", e.target.value)}
                                        className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                                <textarea
                                    value={manga.description}
                                    onChange={e => setField("description", e.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Genres */}
                    <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Genres</label>
                        <div className="flex flex-wrap gap-2">
                            {allGenres.map(g => (
                                <button key={g} type="button" onClick={() => toggleGenre(g)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                        manga.genres.includes(g)
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    }`}>
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save + Delete */}
                    <div className="flex justify-between items-center pt-2">
                        <Button onClick={saveManga} disabled={saving} className="gap-2">
                            <Save size={14} /> {saving ? "Saving..." : "Save Details"}
                        </Button>
                        {!confirmDelete ? (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors"
                            >
                                <Trash2 size={14} /> Delete Manga
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2">
                                <AlertTriangle size={14} className="text-destructive" />
                                <span className="text-sm text-destructive">Delete everything?</span>
                                <button onClick={deleteManga} className="text-xs bg-destructive text-white px-3 py-1 rounded font-medium hover:bg-destructive/80 transition-colors">
                                    Yes, delete
                                </button>
                                <button onClick={() => setConfirmDelete(false)} className="text-xs text-muted-foreground hover:text-foreground">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── CHAPTERS ── */}
                <section className="space-y-3">
                    <h2 className="text-lg font-bold">Chapters ({manga.chapters.length})</h2>

                    {manga.chapters.length === 0 && (
                        <p className="text-sm text-muted-foreground py-4">No chapters yet. Use Upload Chapter to add some.</p>
                    )}

                    {manga.chapters.map(chapter => (
                        <div key={chapter.id} className="bg-card border border-border rounded-xl overflow-hidden">

                            {/* Chapter header row */}
                            <div className="flex items-center gap-3 px-4 py-3">
                                <button
                                    onClick={() => updateChapter(chapter.id, "expanded", !chapter.expanded)}
                                    className="flex-1 flex items-center gap-3 text-left"
                                >
                                    <span className="text-xs font-mono text-muted-foreground w-8">
                                        Ch.{chapter.number}
                                    </span>
                                    <span className="text-sm font-medium text-foreground flex-1">
                                        {chapter.title || "Untitled"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {chapter.pages.length} pages
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {chapter.expanded ? "▲" : "▼"}
                                    </span>
                                </button>
                                <button
                                    onClick={() => deleteChapter(chapter)}
                                    title="Delete chapter"
                                    className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            {/* Expanded chapter editor */}
                            {chapter.expanded && (
                                <div className="border-t border-border px-4 py-4 space-y-4">
                                    {/* Chapter meta */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Chapter number</label>
                                            <Input
                                                type="number"
                                                value={chapter.number}
                                                onChange={e => updateChapter(chapter.id, "number", Number(e.target.value))}
                                                className="bg-background border-border h-8 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                                            <Input
                                                value={chapter.title}
                                                onChange={e => updateChapter(chapter.id, "title", e.target.value)}
                                                className="bg-background border-border h-8 text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Pages grid */}
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-2 block">
                                            Pages — drag to reorder
                                        </label>
                                        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2">
                                            {chapter.pages.map((page, idx) => (
                                                <div
                                                    key={idx}
                                                    draggable
                                                    onDragStart={() => onDragStart(chapter.id, idx)}
                                                    onDragOver={e => onDragOver(e, chapter.id, idx)}
                                                    onDrop={() => onDrop(chapter.id, idx)}
                                                    onDragEnd={() => { setDragPage(null); setDragOver(null); }}
                                                    className={`relative group aspect-[3/4] rounded border overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
                                                        dragOver?.chapterId === chapter.id && dragOver?.overIdx === idx
                                                            ? "border-primary ring-1 ring-primary scale-95"
                                                            : "border-border"
                                                    } ${page.isNew ? "ring-1 ring-green-500/50" : ""}`}
                                                >
                                                    <img src={page.imageUrl} alt={`p${idx + 1}`} className="w-full h-full object-cover" />
                                                    {/* Page number */}
                                                    <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-black/60 text-white py-0.5">
                                                        {idx + 1}
                                                    </span>
                                                    {/* Drag handle */}
                                                    <div className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <GripVertical size={10} className="text-white drop-shadow" />
                                                    </div>
                                                    {/* Remove button */}
                                                    <button
                                                        onClick={() => removePageFromChapter(chapter.id, idx)}
                                                        className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 rounded-full p-0.5 hover:bg-red-600"
                                                    >
                                                        <X size={9} className="text-white" />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Add pages button */}
                                            <label className="aspect-[3/4] rounded border-2 border-dashed border-border bg-background flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                                                <Plus size={16} className="text-muted-foreground mb-1" />
                                                <span className="text-[9px] text-muted-foreground">Add</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={e => {
                                                        const files = Array.from(e.target.files || []);
                                                        if (files.length) addPagesToChapter(chapter.id, files);
                                                        e.target.value = "";
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Save chapter button */}
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => saveChapter(chapter)}
                                            disabled={chapter.saving}
                                            size="sm"
                                            className="gap-2"
                                        >
                                            <Save size={13} />
                                            {chapter.saving ? "Saving..." : "Save Chapter"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default EditManga;
