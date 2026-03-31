import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, BookOpen, BookMarked } from "lucide-react";
import AdCard from "@/components/AdCard";

interface ImageReaderProps {
    images: string[];
    title?: string;
    onClose: () => void;
}

const btnBase: React.CSSProperties = {
    background: "none",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    color: "#888",
    cursor: "pointer",
    padding: "4px 10px",
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    letterSpacing: "0.05em",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
};

// ── Build virtual page list: insert AD slot every 8 real pages ────
// Returns array of {type: "page", realIndex} | {type: "ad", adIndex}
type VirtualPage = { type: "page"; realIndex: number } | { type: "ad"; adIndex: number };

const buildVirtualPages = (totalImages: number): VirtualPage[] => {
    const result: VirtualPage[] = [];
    let adCount = 0;
    for (let i = 0; i < totalImages; i++) {
        result.push({ type: "page", realIndex: i });
        // After every 8th real page (and not at the very end), insert an ad
        if ((i + 1) % 8 === 0 && i + 1 < totalImages) {
            result.push({ type: "ad", adIndex: adCount++ });
        }
    }
    return result;
};

// ── Page jump input ──────────────────────────────────────────────
const PageInput: React.FC<{
    currentRealIndex: number;
    total: number;
    hasPageB: boolean;
    pageBReal: number;
    goToReal: (i: number) => void;
}> = ({ currentRealIndex, total, hasPageB, pageBReal, goToReal }) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const startEdit = () => {
        setDraft(String(currentRealIndex + 1));
        setEditing(true);
        setTimeout(() => inputRef.current?.select(), 0);
    };

    const commit = () => {
        const n = parseInt(draft, 10);
        if (!isNaN(n) && n >= 1 && n <= total) goToReal(n - 1);
        setEditing(false);
    };

    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") setEditing(false);
        e.stopPropagation();
    };

    if (editing) return (
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "monospace", fontSize: 11, flexShrink: 0 }}>
            <input
                ref={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={onKey}
                style={{
                    width: 40, background: "#1a1a1a", border: "1px solid #e05c2a",
                    borderRadius: 4, color: "#fff", fontSize: 11, fontFamily: "monospace",
                    textAlign: "center", padding: "1px 4px", outline: "none",
                }}
            />
            <span style={{ color: "#444" }}>/ {String(total).padStart(2, "0")}</span>
        </span>
    );

    return (
        <span
            onClick={startEdit}
            title="Click to jump to page"
            style={{
                color: "#444", fontSize: 11, fontFamily: "monospace", flexShrink: 0,
                cursor: "text", borderBottom: "1px dotted #333", paddingBottom: 1,
                transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#aaa")}
            onMouseLeave={e => (e.currentTarget.style.color = "#444")}
        >
            {String(currentRealIndex + 1).padStart(2, "0")}
            {hasPageB ? `–${String(pageBReal + 1).padStart(2, "0")}` : ""}
            {" / "}{String(total).padStart(2, "0")}
        </span>
    );
};

// ── Draggable progress bar ────────────────────────────────────────
const DraggableBar: React.FC<{
    progress: number;
    rtl: boolean;
    totalReal: number;
    currentRealIndex: number;
    goToReal: (i: number) => void;
}> = ({ progress, rtl, totalReal, currentRealIndex, goToReal }) => {
    const barRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const [hoverPage, setHoverPage] = useState<number | null>(null);

    const posToPage = (clientX: number): number => {
        const rect = barRef.current!.getBoundingClientRect();
        let ratio = (clientX - rect.left) / rect.width;
        ratio = Math.max(0, Math.min(1, ratio));
        if (rtl) ratio = 1 - ratio;
        return Math.round(ratio * (totalReal - 1));
    };

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setDragging(true);
        goToReal(posToPage(e.clientX));
        const onMove = (ev: MouseEvent) => goToReal(posToPage(ev.clientX));
        const onUp = () => { setDragging(false); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    return (
        <div
            ref={barRef}
            onMouseDown={onMouseDown}
            onMouseMove={e => setHoverPage(posToPage(e.clientX))}
            onMouseLeave={() => setHoverPage(null)}
            style={{
                position: "relative", height: dragging ? 6 : 4,
                background: "#1a1a1a", flexShrink: 0,
                cursor: "pointer", transition: "height 0.15s",
            }}
        >
            <div style={{
                position: "absolute", top: 0, bottom: 0,
                left: rtl ? `${100 - progress}%` : 0,
                width: `${progress}%`,
                background: "linear-gradient(90deg, #e05c2a, #f0943a)",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", top: "50%",
                left: rtl ? `${100 - progress}%` : `${progress}%`,
                transform: "translate(-50%, -50%)",
                width: dragging ? 14 : 10, height: dragging ? 14 : 10,
                borderRadius: "50%", background: "#e05c2a", border: "2px solid #f0943a",
                pointerEvents: "none", transition: "width 0.15s, height 0.15s",
                boxShadow: "0 0 6px rgba(224,92,42,0.6)", zIndex: 3,
            }} />
            {hoverPage !== null && (
                <div style={{
                    position: "absolute", bottom: 10,
                    left: rtl
                        ? `${100 - (hoverPage / (totalReal - 1)) * 100}%`
                        : `${(hoverPage / (totalReal - 1)) * 100}%`,
                    transform: "translateX(-50%)",
                    background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 4,
                    padding: "2px 6px", fontSize: 10, color: "#aaa",
                    fontFamily: "monospace", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 10,
                }}>
                    p.{hoverPage + 1}
                </div>
            )}
        </div>
    );
};

// ── Main reader ───────────────────────────────────────────────────
const ImageReader: React.FC<ImageReaderProps> = ({ images, title, onClose }) => {
    const virtualPages = buildVirtualPages(images.length);

    const [vIndex, setVIndex] = useState(0);         // virtual index (includes ad slots)
    const [loaded, setLoaded] = useState<boolean[]>(new Array(images.length).fill(false));
    const [rtl, setRtl] = useState(false);
    const [twoPage, setTwoPage] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const step = twoPage ? 2 : 1;
    const currentVPage = virtualPages[vIndex];
    const isAdPage = currentVPage?.type === "ad";

    // Real page index for display/counter (only counts real pages)
    const currentRealIndex = currentVPage?.type === "page" ? currentVPage.realIndex : -1;

    // For 2-page: find next virtual page
    const nextVPage = virtualPages[vIndex + 1];
    const hasPageB = twoPage && !isAdPage && nextVPage?.type === "page";
    const pageBReal = hasPageB && nextVPage?.type === "page" ? nextVPage.realIndex : -1;

    const progress = images.length > 1
        ? (Math.max(0, currentRealIndex) / (images.length - 1)) * 100
        : 100;

    const isFirst = vIndex === 0;
    const isLast = vIndex >= virtualPages.length - step;

    const goToV = (idx: number) => {
        const clamped = Math.max(0, Math.min(virtualPages.length - 1, idx));
        setVIndex(clamped);
        containerRef.current?.scrollTo({ top: 0 });
    };

    // Jump to real page index — find corresponding virtual index
    const goToReal = (realIdx: number) => {
        const vi = virtualPages.findIndex(p => p.type === "page" && p.realIndex === realIdx);
        if (vi >= 0) goToV(vi);
    };

    const goNext = () => goToV(vIndex + step);
    const goPrev = () => goToV(vIndex - step);

    const onClickLeft  = () => rtl ? goNext() : goPrev();
    const onClickRight = () => rtl ? goPrev() : goNext();

    const markLoaded = (idx: number) => {
        setLoaded(prev => { const n = [...prev]; n[idx] = true; return n; });
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") rtl ? goPrev() : goNext();
            else if (e.key === "ArrowLeft") rtl ? goNext() : goPrev();
            else if (e.key === "ArrowDown") goNext();
            else if (e.key === "ArrowUp") goPrev();
            else if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [vIndex, rtl, step]);

    // Preload next real pages
    const preloadRealIdx = virtualPages
        .slice(vIndex + 1, vIndex + 4)
        .filter(p => p.type === "page")
        .map(p => (p as { type: "page"; realIndex: number }).realIndex);

    const renderRealPage = (realIdx: number, side: "left" | "right") => {
        if (realIdx < 0 || realIdx >= images.length) return null;
        return (
            <div style={{
                flex: 1, height: "100%",
                display: "flex", alignItems: "center",
                justifyContent: twoPage ? (side === "left" ? "flex-end" : "flex-start") : "center",
                minWidth: 0,
            }}>
                {!loaded[realIdx] && (
                    <div style={{
                        width: "80%", height: "60%", background: "#141414",
                        borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <span style={{ color: "#333", fontSize: 11, fontFamily: "monospace" }}>
                            Loading {realIdx + 1}...
                        </span>
                    </div>
                )}
                <img
                    key={realIdx}
                    src={images[realIdx]}
                    alt={`Page ${realIdx + 1}`}
                    onLoad={() => markLoaded(realIdx)}
                    style={{
                        display: loaded[realIdx] ? "block" : "none",
                        maxWidth: "100%", maxHeight: "100%",
                        width: "auto", height: "auto",
                        objectFit: "contain",
                        borderRadius: twoPage ? 0 : 2,
                        boxShadow: twoPage ? "none" : "0 8px 60px rgba(0,0,0,0.8)",
                    }}
                />
            </div>
        );
    };

    const leftRealPage  = rtl && twoPage ? pageBReal : currentRealIndex;
    const rightRealPage = rtl && twoPage ? currentRealIndex : pageBReal;

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#0a0a0a", display: "flex", flexDirection: "column",
            fontFamily: "'Georgia', serif",
        }}>

            {/* ── Top bar ── */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 12px", borderBottom: "1px solid #1e1e1e",
                background: "#0f0f0f", flexShrink: 0, gap: 6, minHeight: 44,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1, overflow: "hidden" }}>
                    <BookOpen size={14} color="#555" style={{ flexShrink: 0 }} />
                    {title && (
                        <span style={{
                            color: "#bbb", fontSize: 11, letterSpacing: "0.03em",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            maxWidth: "20vw",
                        }}>
                            {title}
                        </span>
                    )}
                    {/* Page counter — only shows real page count, ads not counted */}
                    {isAdPage ? (
                        <span style={{ color: "#444", fontSize: 11, fontFamily: "monospace", flexShrink: 0 }}>
                            — / {String(images.length).padStart(2, "0")}
                        </span>
                    ) : (
                        <PageInput
                            currentRealIndex={currentRealIndex}
                            total={images.length}
                            hasPageB={hasPageB}
                            pageBReal={pageBReal}
                            goToReal={goToReal}
                        />
                    )}
                    <span style={{
                        fontSize: 9, color: rtl ? "#e05c2a" : "#555",
                        fontFamily: "monospace", letterSpacing: "0.05em", flexShrink: 0,
                        border: `1px solid ${rtl ? "#3a1a0a" : "#252525"}`,
                        borderRadius: 3, padding: "1px 5px",
                        background: rtl ? "#1a0d06" : "transparent",
                        transition: "all 0.2s", whiteSpace: "nowrap",
                    }}>
                        {rtl ? "←JP" : "EN→"}
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <button
                        onClick={() => setTwoPage(v => !v)}
                        title={twoPage ? "Single page" : "Two-page spread"}
                        style={{ ...btnBase, padding: "3px 8px", fontSize: 10, borderColor: twoPage ? "#e05c2a" : "#2a2a2a", color: twoPage ? "#e05c2a" : "#666" }}
                    >
                        <BookMarked size={11} /><span>{twoPage ? "2P" : "1P"}</span>
                    </button>
                    <button
                        onClick={() => setRtl(v => !v)}
                        title={rtl ? "Switch to LTR" : "Switch to RTL"}
                        style={{ ...btnBase, padding: "3px 8px", fontSize: 10, borderColor: rtl ? "#e05c2a" : "#2a2a2a", color: rtl ? "#e05c2a" : "#666" }}
                    >
                        {rtl ? "←RL" : "LR→"}
                    </button>
                    <button
                        onClick={onClose}
                        style={{ ...btnBase, padding: "3px 8px", fontSize: 10 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#555"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#888"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"; }}
                    >
                        <X size={12} /><span>Close</span>
                    </button>
                </div>
            </div>

            {/* ── Page viewer ── */}
            <div
                ref={containerRef}
                style={{
                    flex: 1, overflow: "hidden", position: "relative",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "12px 16px",
                }}
            >
                {/* Click zones — disabled on ad pages */}
                {!isAdPage && (
                    <>
                        <div onClick={onClickLeft} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "28%", zIndex: 10, cursor: "default" }} />
                        <div onClick={onClickRight} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "28%", zIndex: 10, cursor: "default" }} />
                    </>
                )}

                {/* Pages container */}
                <div style={{
                    display: "flex", flexDirection: "row", gap: 0,
                    alignItems: "center", justifyContent: "center",
                    width: "100%", height: "100%",
                    maxHeight: "calc(100vh - 165px)",
                }}>
                    {isAdPage ? (
                        // Ad page — full viewer area
                        <AdCard variant="reader" />
                    ) : twoPage ? (
                        <>{renderRealPage(leftRealPage, "left")}{renderRealPage(rightRealPage, "right")}</>
                    ) : (
                        renderRealPage(currentRealIndex, "left")
                    )}
                </div>

                {/* Preload */}
                {preloadRealIdx.map(i => (
                    <img key={i} src={images[i]} alt="" onLoad={() => markLoaded(i)} style={{ display: "none" }} />
                ))}
            </div>

            {/* ── Progress label ── */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 20px", background: "#0f0f0f", flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.1em", fontFamily: "monospace" }}>
                    {rtl ? "END" : "START"}
                </span>
                <span style={{ fontSize: 10, color: "#555", letterSpacing: "0.06em", fontFamily: "monospace" }}>
                    {isAdPage ? "· ad ·" : (
                        <>
                            {Math.round(progress)}% read
                            {progress >= 80 && progress < 100 && <span style={{ color: "#e05c2a", marginLeft: 8 }}>· ending soon</span>}
                            {progress === 100 && <span style={{ color: "#4caf50", marginLeft: 8 }}>· complete</span>}
                        </>
                    )}
                </span>
                <span style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.1em", fontFamily: "monospace" }}>
                    {rtl ? "START" : "END"}
                </span>
            </div>

            {/* ── Progress bar ── */}
            <DraggableBar
                progress={progress}
                rtl={rtl}
                totalReal={images.length}
                currentRealIndex={Math.max(0, currentRealIndex)}
                goToReal={goToReal}
            />

            {/* ── Bottom nav ── */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 12, padding: "12px 20px",
                borderTop: "1px solid #1a1a1a", background: "#0f0f0f", flexShrink: 0,
            }}>
                {(() => {
                    const isAction = rtl;
                    const fn = rtl ? goNext : goPrev;
                    const disabled = rtl ? isLast : isFirst;
                    const label = rtl ? "Next" : "Prev";
                    return (
                        <button onClick={fn} disabled={disabled} style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "8px 20px",
                            background: disabled ? "#111" : isAction ? "#e05c2a" : "#1c1c1c",
                            border: "1px solid", borderColor: disabled ? "#1a1a1a" : isAction ? "#e05c2a" : "#2e2e2e",
                            borderRadius: 6, color: disabled ? "#2a2a2a" : isAction ? "#fff" : "#aaa",
                            cursor: disabled ? "not-allowed" : "pointer",
                            fontSize: 13, letterSpacing: "0.04em", transition: "all 0.15s", fontWeight: isAction ? 500 : 400,
                        }}
                            onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLButtonElement).style.background = isAction ? "#c94f20" : "#252525"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; } }}
                            onMouseLeave={e => { if (!disabled) { (e.currentTarget as HTMLButtonElement).style.background = isAction ? "#e05c2a" : "#1c1c1c"; (e.currentTarget as HTMLButtonElement).style.color = disabled ? "#2a2a2a" : isAction ? "#fff" : "#aaa"; } }}
                        >
                            <ChevronLeft size={15} />{label}
                        </button>
                    );
                })()}

                {/* Page dots — skip ad slots */}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {virtualPages.slice(Math.max(0, vIndex - 3), Math.min(virtualPages.length, vIndex + 4))
                        .map((vp, i) => {
                            const vi = Math.max(0, vIndex - 3) + i;
                            const isAd = vp.type === "ad";
                            return (
                                <button key={vi} onClick={() => goToV(vi)} style={{
                                    width: vi === vIndex ? 24 : 8, height: 8, borderRadius: 4,
                                    background: isAd ? "#2a2010" : vi === vIndex ? "#e05c2a" : vi < vIndex ? "#3a3a3a" : "#222",
                                    border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s",
                                }} />
                            );
                        })}
                </div>

                {(() => {
                    const isAction = !rtl;
                    const fn = rtl ? goPrev : goNext;
                    const disabled = rtl ? isFirst : isLast;
                    const label = rtl ? "Prev" : "Next";
                    return (
                        <button onClick={fn} disabled={disabled} style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "8px 20px",
                            background: disabled ? "#111" : isAction ? "#e05c2a" : "#1c1c1c",
                            border: "1px solid", borderColor: disabled ? "#1a1a1a" : isAction ? "#e05c2a" : "#2e2e2e",
                            borderRadius: 6, color: disabled ? "#2a2a2a" : isAction ? "#fff" : "#aaa",
                            cursor: disabled ? "not-allowed" : "pointer",
                            fontSize: 13, letterSpacing: "0.04em", transition: "all 0.15s", fontWeight: isAction ? 500 : 400,
                        }}
                            onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLButtonElement).style.background = isAction ? "#c94f20" : "#252525"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; } }}
                            onMouseLeave={e => { if (!disabled) { (e.currentTarget as HTMLButtonElement).style.background = isAction ? "#e05c2a" : "#1c1c1c"; (e.currentTarget as HTMLButtonElement).style.color = disabled ? "#2a2a2a" : isAction ? "#fff" : "#aaa"; } }}
                        >
                            {label}<ChevronRight size={15} />
                        </button>
                    );
                })()}
            </div>
        </div>
    );
};

export default ImageReader;
