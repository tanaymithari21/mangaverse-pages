// AdCard.tsx
// Google AdSense placeholder — swap the inner div for your actual AdSense unit when ready.
// Fallback: shows Shiina Mayuri from Steins;Gate with "Tuturu~" when no ad loads.

import { useEffect, useRef, useState } from "react";

// ── ADD YOUR ADSENSE CREDENTIALS HERE ────────────────────────────────────────
const ADSENSE_CLIENT  = "";   // e.g. "ca-pub-XXXXXXXXXXXXXXXXX"
const ADSENSE_SLOT    = "";   // e.g. "1234567890"
// ─────────────────────────────────────────────────────────────────────────────

// Tuturu fallback image (Mayuri, Steins;Gate)
// Using a reliable public domain/fan-art source — replace with your own hosted image if preferred
const TUTURU_IMAGE = "https://i.imgur.com/7QsJ1bI.png";

interface AdCardProps {
    /** "grid" = MangaCard-sized vertical card (Index page)
     *  "reader" = full-width reader page ad */
    variant?: "grid" | "reader";
}

const AdCard = ({ variant = "grid" }: AdCardProps) => {
    const adRef = useRef<HTMLDivElement>(null);
    const [adFailed, setAdFailed] = useState(true); // default true until AdSense loads

    useEffect(() => {
        if (!ADSENSE_CLIENT || !ADSENSE_SLOT) {
            setAdFailed(true);
            return;
        }
        // Try to push the ad
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            // Give AdSense 2s to fill; if the ins element stays empty, show fallback
            const timer = setTimeout(() => {
                const ins = adRef.current?.querySelector("ins.adsbygoogle");
                const filled = ins?.getAttribute("data-ad-status") === "filled";
                setAdFailed(!filled);
            }, 2000);
            return () => clearTimeout(timer);
        } catch {
            setAdFailed(true);
        }
    }, []);

    if (variant === "grid") {
        return (
            <div className="relative overflow-hidden rounded-xl bg-card border border-border shadow-card"
                style={{ aspectRatio: "3/4" }}>
                {!adFailed && ADSENSE_CLIENT && ADSENSE_SLOT ? (
                    <div ref={adRef} style={{ width: "100%", height: "100%" }}>
                        <ins
                            className="adsbygoogle"
                            style={{ display: "block", width: "100%", height: "100%" }}
                            data-ad-client={ADSENSE_CLIENT}
                            data-ad-slot={ADSENSE_SLOT}
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        />
                    </div>
                ) : (
                    // Tuturu fallback
                    <div className="relative w-full h-full">
                        <img
                            src={TUTURU_IMAGE}
                            alt="Tuturu~"
                            className="w-full h-full object-cover"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                            <p className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-heading)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                                Tuturu~
                            </p>
                        </div>
                        {/* AD badge */}
                        <span className="absolute top-2 right-2 text-[9px] font-mono bg-black/70 text-white/50 px-1.5 py-0.5 rounded">
                            AD
                        </span>
                    </div>
                )}
            </div>
        );
    }

    // Reader variant — full viewport width, looks like a manga page
    return (
        <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", background: "#0d0d0d",
        }}>
            {!adFailed && ADSENSE_CLIENT && ADSENSE_SLOT ? (
                <div ref={adRef} style={{ width: "100%", maxWidth: 720, height: "100%" }}>
                    <ins
                        className="adsbygoogle"
                        style={{ display: "block", width: "100%", height: "100%" }}
                        data-ad-client={ADSENSE_CLIENT}
                        data-ad-slot={ADSENSE_SLOT}
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    />
                </div>
            ) : (
                <div style={{
                    width: "100%", maxWidth: 480,
                    maxHeight: "calc(100vh - 200px)",
                    position: "relative", borderRadius: 4, overflow: "hidden",
                }}>
                    <img
                        src={TUTURU_IMAGE}
                        alt="Tuturu~"
                        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                        onError={e => { (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"; }}
                    />
                    <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                        padding: "20px 16px 12px",
                        textAlign: "center",
                    }}>
                        <p style={{ color: "#fff", fontSize: 20, fontWeight: 700, fontFamily: "'Georgia', serif" }}>
                            Tuturu~
                        </p>
                    </div>
                </div>
            )}
            {/* AD corner badge */}
            <span style={{
                position: "absolute", top: 8, right: 8,
                fontSize: 9, fontFamily: "monospace",
                background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.4)",
                padding: "2px 6px", borderRadius: 3,
                letterSpacing: "0.08em",
            }}>
                AD
            </span>
        </div>
    );
};

export default AdCard;
