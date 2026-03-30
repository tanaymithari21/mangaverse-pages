import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Check, X, AlertTriangle, Tag } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

interface Genre {
    id: number;
    name: string;
}

const GenreManager = () => {
    const navigate = useNavigate();
    const [genres, setGenres]         = useState<Genre[]>([]);
    const [loading, setLoading]       = useState(true);
    const [newName, setNewName]       = useState("");
    const [adding, setAdding]         = useState(false);
    const [editingId, setEditingId]   = useState<number | null>(null);
    const [editDraft, setEditDraft]   = useState("");
    const [confirmId, setConfirmId]   = useState<number | null>(null);
    const [savingId, setSavingId]     = useState<number | null>(null);
    const [toast, setToast]           = useState<{ msg: string; type: "info" | "error" } | null>(null);
    const addInputRef = useRef<HTMLInputElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);

    const showToast = (msg: string, type: "info" | "error" = "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        fetch(`${API}/api/genres/full`)
            .then(r => r.json())
            .then(setGenres)
            .catch(() => showToast("Failed to load genres"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (editingId !== null) setTimeout(() => editInputRef.current?.select(), 0);
    }, [editingId]);

    const handleAdd = async () => {
        const name = newName.trim();
        if (!name) return;
        setAdding(true);
        try {
            const res = await fetch(`${API}/api/genres`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) { showToast(await res.text()); return; }
            const created: Genre = await res.json();
            setGenres(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
            setNewName("");
            addInputRef.current?.focus();
        } catch { showToast("Failed to add genre"); }
        finally { setAdding(false); }
    };

    const saveEdit = async (id: number) => {
        const name = editDraft.trim();
        if (!name) return;
        setSavingId(id);
        try {
            const res = await fetch(`${API}/api/genres/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) { showToast(await res.text()); return; }
            const updated: Genre = await res.json();
            setGenres(prev => prev.map(g => g.id === id ? updated : g).sort((a, b) => a.name.localeCompare(b.name)));
            setEditingId(null);
        } catch { showToast("Failed to rename genre"); }
        finally { setSavingId(null); }
    };

    const handleDelete = async (id: number) => {
        setSavingId(id);
        try {
            const res = await fetch(`${API}/api/genres/${id}`, { method: "DELETE" });
            if (!res.ok) { showToast(await res.text()); return; }
            const data = await res.json();
            setGenres(prev => prev.filter(g => g.id !== id));
            setConfirmId(null);
            if (data.removedFromMangaCount > 0)
                showToast(`Removed from ${data.removedFromMangaCount} manga.`, "info");
        } catch { showToast("Failed to delete genre"); }
        finally { setSavingId(null); }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-2xl mx-auto px-4 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={15} /> Back
                    </button>
                    <div className="flex items-center gap-2">
                        <Tag size={18} className="text-primary" />
                        <h1 className="text-2xl font-black text-primary">Genre Manager</h1>
                    </div>
                </div>

                {/* Toast */}
                {toast && (
                    <div className={`mb-4 px-4 py-3 rounded-lg text-sm border flex items-center gap-2 ${
                        toast.type === "info"
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                            : "bg-destructive/10 border-destructive/30 text-destructive"
                    }`}>
                        {toast.type === "error" && <AlertTriangle size={13} />}
                        {toast.msg}
                    </div>
                )}

                {/* Add */}
                <div className="bg-card border border-border rounded-xl p-5 mb-6">
                    <h2 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-widest">Add Genre</h2>
                    <div className="flex gap-2">
                        <input
                            ref={addInputRef}
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
                            placeholder="e.g. Isekai"
                            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={adding || !newName.trim()}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <Plus size={14} />
                            {adding ? "Adding..." : "Add"}
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">All Genres</h2>
                        <span className="text-xs text-muted-foreground">{genres.length} total</span>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center text-muted-foreground text-sm">Loading...</div>
                    ) : genres.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground text-sm">No genres yet. Add one above.</div>
                    ) : (
                        <ul className="divide-y divide-border">
                            {genres.map(genre => (
                                <li key={genre.id} className="flex items-center gap-3 px-5 py-3 group hover:bg-secondary/40 transition-colors min-h-[52px]">
                                    {editingId === genre.id ? (
                                        <>
                                            <input
                                                ref={editInputRef}
                                                value={editDraft}
                                                onChange={e => setEditDraft(e.target.value)}
                                                onKeyDown={e => { if (e.key === "Enter") saveEdit(genre.id); if (e.key === "Escape") setEditingId(null); }}
                                                className="flex-1 px-2 py-1 rounded border border-primary bg-background text-sm text-foreground focus-visible:outline-none"
                                            />
                                            <button onClick={() => saveEdit(genre.id)} disabled={savingId === genre.id} className="p-1.5 rounded text-green-500 hover:bg-green-500/10 transition-colors disabled:opacity-40" title="Save">
                                                <Check size={14} />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Cancel">
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : confirmId === genre.id ? (
                                        <>
                                            <span className="flex-1 text-sm text-foreground">{genre.name}</span>
                                            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-1.5 flex-shrink-0">
                                                <AlertTriangle size={12} className="text-destructive flex-shrink-0" />
                                                <span className="text-xs text-destructive whitespace-nowrap">Remove from all manga?</span>
                                                <button onClick={() => handleDelete(genre.id)} disabled={savingId === genre.id} className="text-xs bg-destructive text-white px-2 py-0.5 rounded hover:bg-destructive/80 transition-colors disabled:opacity-40 whitespace-nowrap">
                                                    {savingId === genre.id ? "Deleting..." : "Yes, delete"}
                                                </button>
                                                <button onClick={() => setConfirmId(null)} className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap">Cancel</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-sm text-foreground">{genre.name}</span>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setEditingId(genre.id); setEditDraft(genre.name); setConfirmId(null); }} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Rename">
                                                    <Pencil size={13} />
                                                </button>
                                                <button onClick={() => { setConfirmId(genre.id); setEditingId(null); }} className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete">
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                    Deleting a genre removes it from all manga immediately.
                </p>
            </div>
        </div>
    );
};

export default GenreManager;
