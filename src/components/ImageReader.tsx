import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, BookOpen, BookMarked } from "lucide-react";

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

const ImageReader: React.FC<ImageReaderProps> = ({ images, title, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loaded, setLoaded] = useState<boolean[]>(new Array(images.length).fill(false));
    const [rtl, setRtl] = useState(false);       // false=LTR western, true=RTL japanese
    const [twoPage, setTwoPage] = useState(false); // false=single, true=spread

    const containerRef = useRef<HTMLDivElement>(null);

    const step = twoPage ? 2 : 1;
    const pageA = currentIndex;
    const pageB = currentIndex + 1;
    const hasPageB = twoPage && pageB < images.length;
    const progress = images.length > 1 ? (currentIndex / (images.length - 1)) * 100 : 100;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex >= images.length - step;

    const goTo = (idx: number) => {
        const clamped = Math.max(0, Math.min(images.length - 1, idx));
        setCurrentIndex(clamped);
    };

    const goNext = () => goTo(currentIndex + step);
    const goPrev = () => goTo(currentIndex - step);

    // In RTL: left click = next (story goes right→left so left side is newer)
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
    }, [currentIndex, rtl, step]);

    // Preload next pages
    const preloadIdx = [currentIndex + step, currentIndex + step + 1].filter(i => i < images.length);

    const renderPage = (idx: number, shadow: "left" | "right") => {
        if (idx >= images.length || idx < 0) return null;
        return (
            <div style={{
                flex: 1, height: "100%",
                display: "flex", alignItems: "center",
                justifyContent: twoPage ? (shadow === "left" ? "flex-end" : "flex-start") : "center",
                minWidth: 0,
            }}>
                {!loaded[idx] && (
                    <div style={{
                        width: "80%", height: "60%", background: "#141414",
                        borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <span style={{ color: "#333", fontSize: 11, fontFamily: "monospace" }}>
                            Loading {idx + 1}...
                        </span>
                    </div>
                )}
                <img
                    key={idx}
                    src={images[idx]}
                    alt={`Page ${idx + 1}`}
                    onLoad={() => markLoaded(idx)}
                    style={{
                        display: loaded[idx] ? "block" : "none",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        borderRadius: twoPage ? 0 : 2,
                        boxShadow: twoPage ? "none" : "0 8px 60px rgba(0,0,0,0.8)",
                    }}
                />
            </div>
        );
    };

    // In RTL 2-page mode: right page = current (earlier), left page = current+1 (later)
    const leftPage  = rtl && twoPage ? pageB : pageA;
    const rightPage = rtl && twoPage ? pageA : pageB;

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#0a0a0a", display: "flex", flexDirection: "column",
            fontFamily: "'Georgia', serif",
        }}>

            {/* ── Top bar ── */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 16px", borderBottom: "1px solid #1e1e1e",
                background: "#0f0f0f", flexShrink: 0, gap: 8,
            }}>
                {/* Left: icon + title + page */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, overflow: "hidden" }}>
                    <BookOpen size={15} color="#555" style={{ flexShrink: 0 }} />
                    {title && (
                        <span style={{
                            color: "#bbb", fontSize: 12, letterSpacing: "0.04em",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                            {title}
                        </span>
                    )}
                    <span style={{ color: "#444", fontSize: 11, fontFamily: "monospace", flexShrink: 0 }}>
                        {String(pageA + 1).padStart(2, "0")}
                        {hasPageB ? `–${String(pageB + 1).padStart(2, "0")}` : ""}
                        {" / "}{String(images.length).padStart(2, "0")}
                    </span>
                    {/* Reading direction indicator — always visible, changes with mode */}
                    <span style={{
                        fontSize: 10,
                        color: rtl ? "#e05c2a" : "#666",
                        fontFamily: "monospace",
                        letterSpacing: "0.07em",
                        flexShrink: 0,
                        border: `1px solid ${rtl ? "#3a1a0a" : "#222"}`,
                        borderRadius: 4,
                        padding: "2px 7px",
                        background: rtl ? "#1a0d06" : "transparent",
                        transition: "all 0.2s",
                    }}>
                        {rtl ? "← Japanese mode · right to left" : "Western mode · left to right →"}
                    </span>
                </div>

                {/* Right: toggles + close */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

                    {/* 1-page / 2-page */}
                    <button
                        onClick={() => setTwoPage(v => !v)}
                        title={twoPage ? "Single page mode" : "Two-page spread"}
                        style={{ ...btnBase, borderColor: twoPage ? "#e05c2a" : "#2a2a2a", color: twoPage ? "#e05c2a" : "#888" }}
                    >
                        <BookMarked size={12} />
                        {twoPage ? "2-Page" : "1-Page"}
                    </button>

                    {/* LTR / RTL */}
                    <button
                        onClick={() => setRtl(v => !v)}
                        title={rtl ? "Switch to Left→Right" : "Switch to Right→Left (Japanese)"}
                        style={{ ...btnBase, borderColor: rtl ? "#e05c2a" : "#2a2a2a", color: rtl ? "#e05c2a" : "#888" }}
                    >
                        {rtl ? "← R→L" : "L→R →"}
                    </button>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        style={btnBase}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#555"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#888"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"; }}
                    >
                        <X size={13} /> Close
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
                {/* Click zones */}
                <div onClick={onClickLeft} style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: "28%",
                    zIndex: 10, cursor: (rtl ? isLast : isFirst) ? "default" : "w-resize",
                }} />
                <div onClick={onClickRight} style={{
                    position: "absolute", right: 0, top: 0, bottom: 0, width: "28%",
                    zIndex: 10, cursor: (rtl ? isFirst : isLast) ? "default" : "e-resize",
                }} />



                {/* Pages container */}
                <div style={{
                    display: "flex", flexDirection: "row", gap: 0,
                    alignItems: "center", justifyContent: "center",
                    width: "100%", height: "100%",
                    maxHeight: "calc(100vh - 165px)",
                    padding: twoPage ? "0" : undefined,
                }}>
                    {twoPage
                        ? <>{renderPage(leftPage, "left")}{renderPage(rightPage, "right")}</>
                        : renderPage(pageA, "left")
                    }
                </div>

                {/* Preload hidden */}
                {preloadIdx.map(i => (
                    <img key={i} src={images[i]} alt="" onLoad={() => markLoaded(i)} style={{ display: "none" }} />
                ))}
            </div>

            {/* ── Progress label ── */}
            <div style={{
                display: "flex", justifyContent: "space-between",
                padding: "4px 20px", background: "#0f0f0f", flexShrink: 0,
            }}>
                <span style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.1em", fontFamily: "monospace" }}>
                    {rtl ? "END" : "START"}
                </span>
                <span style={{ fontSize: 10, color: "#555", letterSpacing: "0.06em", fontFamily: "monospace" }}>
                    {Math.round(progress)}% read
                    {progress >= 80 && progress < 100 && <span style={{ color: "#e05c2a", marginLeft: 8 }}>· ending soon</span>}
                    {progress === 100 && <span style={{ color: "#4caf50", marginLeft: 8 }}>· complete</span>}
                </span>
                <span style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.1em", fontFamily: "monospace" }}>
                    {rtl ? "START" : "END"}
                </span>
            </div>

            {/* ── Progress bar ── */}
            <div style={{ position: "relative", height: 3, background: "#1a1a1a", flexShrink: 0 }}>
                <div style={{
                    height: "100%", width: `${progress}%`,
                    background: "linear-gradient(90deg, #e05c2a, #f0943a)",
                    transition: "width 0.3s ease",
                    borderRadius: rtl ? "2px 0 0 2px" : "0 2px 2px 0",
                    // In RTL: anchor bar to the right side
                    marginLeft: rtl ? "auto" : undefined,
                    position: rtl ? "absolute" : undefined,
                    right: rtl ? 0 : undefined,
                    top: rtl ? 0 : undefined,
                    bottom: rtl ? 0 : undefined,
                }} />
                {images.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)} title={`Page ${i + 1}`} style={{
                        position: "absolute", top: "50%",
                        // In RTL: dot positions are mirrored
                        left: rtl
                            ? `${100 - (i / (images.length - 1)) * 100}%`
                            : `${(i / (images.length - 1)) * 100}%`,
                        transform: "translate(-50%, -50%)",
                        width: i === currentIndex ? 8 : 4, height: i === currentIndex ? 8 : 4,
                        borderRadius: "50%",
                        background: i <= currentIndex ? "#f0943a" : "#333",
                        border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s", zIndex: 2,
                    }} />
                ))}
            </div>

            {/* ── Bottom nav ── */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 12, padding: "12px 20px",
                borderTop: "1px solid #1a1a1a", background: "#0f0f0f", flexShrink: 0,
            }}>
                {/*
                  In LTR: Left button = Prev (go back),  Right button = Next (go forward) — highlighted orange
                  In RTL: Left button = Next (go forward) — highlighted orange, Right button = Prev (go back)
                  So the highlighted "action" button is always on the natural reading-direction side.
                */}

                {/* LEFT button */}
                {(() => {
                    const isAction = rtl; // in RTL, left = Next (the main action)
                    const fn       = rtl ? goNext : goPrev;
                    const disabled = rtl ? isLast : isFirst;
                    const label    = rtl ? "Next" : "Prev";
                    const arrow    = rtl ? <ChevronLeft size={15} /> : <ChevronLeft size={15} />;
                    return (
                        <button
                            onClick={fn}
                            disabled={disabled}
                            style={{
                                display: "flex", alignItems: "center", gap: 6, padding: "8px 20px",
                                background: disabled ? "#111" : isAction ? "#e05c2a" : "#1c1c1c",
                                border: "1px solid",
                                borderColor: disabled ? "#1a1a1a" : isAction ? "#e05c2a" : "#2e2e2e",
                                borderRadius: 6,
                                color: disabled ? "#2a2a2a" : isAction ? "#fff" : "#aaa",
                                cursor: disabled ? "not-allowed" : "pointer",
                                fontSize: 13, letterSpacing: "0.04em", transition: "all 0.15s", fontWeight: isAction ? 500 : 400,
                            }}
                            onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = isAction ? "#c94f20" : "#252525"; (e.currentTarget as HTMLButtonElement).style.color = disabled ? "#2a2a2a" : "#fff"; }}
                            onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = isAction ? "#e05c2a" : "#1c1c1c"; (e.currentTarget as HTMLButtonElement).style.color = disabled ? "#2a2a2a" : isAction ? "#fff" : "#aaa"; }}
                        >
                            {arrow}{label}
                        </button>
                    );
                })()}

                {/* Page dots */}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {images.slice(Math.max(0, currentIndex - 3), Math.min(images.length, currentIndex + 4))
                        .map((_, i) => {
                            const idx = Math.max(0, currentIndex - 3) + i;
                            return (
                                <button key={idx} onClick={() => goTo(idx)} style={{
                                    width: idx === currentIndex ? 24 : 8, height: 8, borderRadius: 4,
                                    background: idx === currentIndex ? "#e05c2a" : idx < currentIndex ? "#3a3a3a" : "#222",
                                    border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s",
                                }} />
                            );
                        })}
                </div>

                {/* RIGHT button */}
                {(() => {
                    const isAction = !rtl; // in LTR, right = Next (the main action)
                    const fn       = rtl ? goPrev : goNext;
                    const disabled = rtl ? isFirst : isLast;
                    const label    = rtl ? "Prev" : "Next";
                    const arrow    = rtl ? <ChevronRight size={15} /> : <ChevronRight size={15} />;
                    return (
                        <button
                            onClick={fn}
                            disabled={disabled}
                            style={{
                                display: "flex", alignItems: "center", gap: 6, padding: "8px 20px",
                                background: disabled ? "#111" : isAction ? "#e05c2a" : "#1c1c1c",
                                border: "1px solid",
                                borderColor: disabled ? "#1a1a1a" : isAction ? "#e05c2a" : "#2e2e2e",
                                borderRadius: 6,
                                color: disabled ? "#2a2a2a" : isAction ? "#fff" : "#aaa",
                                cursor: disabled ? "not-allowed" : "pointer",
                                fontSize: 13, letterSpacing: "0.04em", transition: "all 0.15s", fontWeight: isAction ? 500 : 400,
                            }}
                            onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = isAction ? "#c94f20" : "#252525"; (e.currentTarget as HTMLButtonElement).style.color = disabled ? "#2a2a2a" : "#fff"; }}
                            onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = isAction ? "#e05c2a" : "#1c1c1c"; (e.currentTarget as HTMLButtonElement).style.color = disabled ? "#2a2a2a" : isAction ? "#fff" : "#aaa"; }}
                        >
                            {label}{arrow}
                        </button>
                    );
                })()}
            </div>
        </div>
    );
};

export default ImageReader;
