import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditMangaSelect = () => {
    const [mangaId, setMangaId] = useState("");
    const navigate = useNavigate();

    const go = () => {
        const id = mangaId.trim();
        if (!id) return;
        navigate(`/edit-manga/${id}`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6">
                <Link to="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft size={14} /> Back to menu
                </Link>
                <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                        <Pencil size={20} className="text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-black text-foreground mb-1">Edit Manga</h1>
                    <p className="text-sm text-muted-foreground">Enter the manga ID to edit its details and chapters</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <div>
                        <label className="text-xs text-muted-foreground block mb-1.5">Manga ID</label>
                        <Input
                            type="number"
                            value={mangaId}
                            onChange={e => setMangaId(e.target.value)}
                            placeholder="e.g. 7"
                            className="bg-background border-border"
                            onKeyDown={e => e.key === "Enter" && go()}
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">
                            Find the ID in the manga URL: /manga/<span className="text-primary font-mono">7</span>
                        </p>
                    </div>
                    <Button onClick={go} disabled={!mangaId.trim()} className="w-full">
                        Open Editor
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditMangaSelect;
