// HowToRead.tsx  →  route: /how-to-read
// Static SEO page — complete guide on reading manga online.
// Targets long-tail keywords like "how to read manga online", "manga reading order", etc.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  BookOpen, ChevronRight, Smartphone, Monitor, Keyboard,
  Eye, ArrowLeft, ArrowRight, RotateCcw, Maximize2
} from "lucide-react";
import Navbar from "@/components/Navbar";

const HOWTO_JSONLD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Read Manga Online on MangaVerse",
  "description": "Step-by-step guide to reading manga online on MangaVerse — from finding a series to navigating chapters and using the immersive reader.",
  "image": "https://mangaverse-pages.vercel.app/og-howto.jpg",
  "totalTime": "PT2M",
  "step": [
    { "@type": "HowToStep", "name": "Visit MangaVerse", "text": "Go to mangaverse-pages.vercel.app in any browser. No account or app download required.", "position": 1 },
    { "@type": "HowToStep", "name": "Find a Manga", "text": "Use the search bar or genre filters on the home page to browse the library.", "position": 2 },
    { "@type": "HowToStep", "name": "Open the Manga Page", "text": "Click any manga card to view its detail page with synopsis, chapters, and info.", "position": 3 },
    { "@type": "HowToStep", "name": "Select a Chapter", "text": "Click a chapter from the list or press Read Now to start from Chapter 1.", "position": 4 },
    { "@type": "HowToStep", "name": "Navigate Pages", "text": "Use arrow keys, swipe gestures, or on-screen buttons to move between pages.", "position": 5 },
  ]
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Read Manga Online — Complete Beginner's Guide",
  "description": "Complete guide to reading manga online on MangaVerse. Covers manga reading direction, panel order, reader controls, and tips for beginners.",
  "author": { "@type": "Organization", "name": "MangaVerse" },
  "publisher": { "@type": "Organization", "name": "MangaVerse" },
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString().split("T")[0],
};

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mangaverse-pages.vercel.app/" },
    { "@type": "ListItem", "position": 2, "name": "How to Read Manga", "item": "https://mangaverse-pages.vercel.app/how-to-read" }
  ]
};

const TIPS = [
  {
    icon: <Eye size={20} />,
    title: "Reading Direction Matters",
    desc: "Traditional Japanese manga reads right-to-left, top-to-bottom. Western comics are the opposite. MangaVerse has a RTL/LTR toggle in the reader so you can set whichever feels natural.",
    color: "#e05c2a",
  },
  {
    icon: <Keyboard size={20} />,
    title: "Use Keyboard Shortcuts",
    desc: "Arrow keys navigate pages. Left/Right arrows move between pages. F toggles fullscreen/immersive mode. Escape closes the reader.",
    color: "#3b82f6",
  },
  {
    icon: <Smartphone size={20} />,
    title: "Swipe on Mobile",
    desc: "On phones and tablets, swipe left or right to turn pages. The swipe threshold is 40px so accidental touches don't trigger page turns.",
    color: "#22c55e",
  },
  {
    icon: <Monitor size={20} />,
    title: "Two-Page Spread Mode",
    desc: "Enable 2P mode in the reader for a side-by-side two-page layout — ideal on large screens and perfect for reading double-spread panels correctly.",
    color: "#a855f7",
  },
  {
    icon: <Maximize2 size={20} />,
    title: "Immersive / Fullscreen Mode",
    desc: "Press F or click the fullscreen icon to hide all UI and read with the manga filling your entire screen. Press F again or tap the floating exit button to return.",
    color: "#f59e0b",
  },
  {
    icon: <RotateCcw size={20} />,
    title: "Start from Any Chapter",
    desc: "Caught up on a series? Click any chapter in the list to jump directly to it. No need to scroll through from Chapter 1 every time.",
    color: "#ec4899",
  },
];

const READING_ORDERS = [
  {
    title: "Right-to-Left (RTL) — Japanese Traditional",
    desc: "Most manga published in Japan is read right-to-left. This means you open the book from what Western readers would consider the back, and panels flow from right to left, top to bottom. Within each panel, speech bubbles also typically flow right-to-left.",
    example: "Naruto, One Piece, Demon Slayer, Jujutsu Kaisen — essentially all Weekly Shonen Jump titles",
  },
  {
    title: "Left-to-Right (LTR) — Western or OEL Manga",
    desc: "Some manga published specifically for Western markets — as well as Original English Language (OEL) manga — are formatted left-to-right to match the reading direction Western audiences are used to. Some translated works also 'flip' the original Japanese art to LTR.",
    example: "Some localised editions, Korean manhwa, and webtoons often use LTR formatting",
  },
];

const BEGINNERS_MISTAKES = [
  {
    mistake: "Reading panels out of order",
    fix: "In RTL manga, scan each page from top-right to bottom-left. Within a panel, read bubbles from top-right downward. When in doubt, the story context will tell you if you've gone wrong.",
  },
  {
    mistake: "Skipping volumes to 'catch up' faster",
    fix: "Manga paces its emotional beats and reveals deliberately. Skipping volumes often means missing character development that makes later moments hit harder. It's better to read at a steady pace than rush.",
  },
  {
    mistake: "Only reading the most famous series",
    fix: "The most popular manga are popular for a reason — but the medium's true diversity lives in lesser-known titles. Explore genre filters to find hidden gems that match your specific interests.",
  },
  {
    mistake: "Not using the immersive reader",
    fix: "The MangaVerse fullscreen/immersive mode hides all UI and maximises the reading area. If you haven't tried it, press F or tap the fullscreen button — it transforms the experience.",
  },
  {
    mistake: "Giving up after one chapter",
    fix: "Many manga take 3–5 chapters to find their footing. The first chapter is often a world-building and character introduction chapter. Give series at least 3 chapters before deciding if it's for you.",
  },
];

const HowToRead = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>How to Read Manga Online — Beginner's Guide | MangaVerse</title>
        <meta name="description" content="Complete beginner's guide to reading manga online. Learn manga reading direction (right-to-left vs left-to-right), panel order, reader controls, keyboard shortcuts, and tips for new readers." />
        <meta name="keywords" content="how to read manga, manga reading direction, manga online guide, read manga right to left, manga panel order, manga beginner guide, manga reader tips" />
        <link rel="canonical" href="https://mangaverse-pages.vercel.app/how-to-read" />

        <meta property="og:type" content="article" />
        <meta property="og:title" content="How to Read Manga Online — Beginner's Guide | MangaVerse" />
        <meta property="og:description" content="Everything a beginner needs to know about reading manga online — reading direction, panel order, reader controls, and pro tips." />
        <meta property="og:url" content="https://mangaverse-pages.vercel.app/how-to-read" />
        <meta property="og:image" content="https://mangaverse-pages.vercel.app/og-howto.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Read Manga Online — Beginner's Guide | MangaVerse" />
        <meta name="twitter:description" content="Everything a beginner needs to know about reading manga online." />

        <script type="application/ld+json">{JSON.stringify(HOWTO_JSONLD)}</script>
        <script type="application/ld+json">{JSON.stringify(ARTICLE_JSONLD)}</script>
        <script type="application/ld+json">{JSON.stringify(BREADCRUMB_JSONLD)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        {/* Hero */}
        <section className="py-16 px-4 text-center border-b border-border/50">
          <div className="max-w-3xl mx-auto space-y-4">
            <nav className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={10} />
              <span className="text-foreground">How to Read Manga</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              How to Read{" "}
              <span style={{ background: "linear-gradient(135deg,#e05c2a,#f0943a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Manga Online
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              New to manga? Never quite understood the reading direction? Or just want to get
              the most out of the MangaVerse reader? This guide covers everything.
            </p>
          </div>
        </section>

        <main className="max-w-4xl mx-auto px-4 py-12 space-y-20">

          {/* Step-by-step */}
          <section>
            <h2 className="text-2xl font-black mb-2">Getting Started in 5 Steps</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Reading manga on MangaVerse takes about 30 seconds to set up — and costs exactly nothing.
            </p>

            <ol className="space-y-6">
              {[
                {
                  n: "01", title: "Open MangaVerse",
                  desc: "Visit the site in any browser — Chrome, Safari, Firefox, Edge. No app download required. The site works on any device.",
                  detail: "MangaVerse is fully browser-based. Bookmarking the site on your phone's home screen gives you an app-like experience without taking up storage.",
                },
                {
                  n: "02", title: "Find a Manga",
                  desc: "Use the search bar at the top of the home page to find a specific title, or browse the genre filter chips to explore by category.",
                  detail: "Try searching for a manga you've heard of — like 'One Piece', 'Demon Slayer', or 'Attack on Titan' — to start with a familiar title.",
                },
                {
                  n: "03", title: "Open the Manga Detail Page",
                  desc: "Click any manga card in the grid to open its full detail page — you'll see the title, cover, author, year, rating, synopsis, genres, and the full chapter list.",
                  detail: "The detail page also shows how many chapters are available and whether the series is still ongoing or completed.",
                },
                {
                  n: "04", title: "Start Reading",
                  desc: "Hit 'Read Now' to jump straight to Chapter 1, or click any specific chapter from the list below to jump to a particular point in the story.",
                  detail: "Returning to a series? The chapter list makes it easy to jump back to exactly where you left off.",
                },
                {
                  n: "05", title: "Navigate the Reader",
                  desc: "Use arrow keys on keyboard, swipe gestures on touch screens, or click the left/right zones of the screen to turn pages. Press F for fullscreen mode.",
                  detail: "Bookmark the chapter URL in your browser to easily return to where you left off between sessions.",
                },
              ].map((step, i) => (
                <li key={step.n} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm"
                      style={{ background: i === 0 ? "linear-gradient(135deg,#e05c2a,#f0943a)" : undefined, color: i === 0 ? "#fff" : undefined, border: i !== 0 ? "2px solid #2a2a2a" : undefined }}>
                      {step.n}
                    </div>
                  </div>
                  <div className="pb-6">
                    <h3 className="font-bold text-foreground text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-3">{step.desc}</p>
                    <div className="bg-card border border-border/50 rounded-lg px-4 py-3 text-xs text-muted-foreground">
                      💡 <strong className="text-foreground">Tip:</strong> {step.detail}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Reading direction */}
          <section>
            <h2 className="text-2xl font-black mb-2">Manga Reading Direction Explained</h2>
            <p className="text-muted-foreground text-sm mb-8">
              The biggest stumbling block for manga newcomers — and it's simpler than it looks.
            </p>

            <div className="space-y-6">
              {READING_ORDERS.map(order => (
                <div key={order.title} className="bg-card border border-border rounded-xl p-6 space-y-3">
                  <h3 className="font-bold text-foreground text-base">{order.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{order.desc}</p>
                  <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
                    <strong className="text-foreground">Examples:</strong> {order.example}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-4">How to Read a Manga Page (RTL)</h3>
              <p className="text-sm text-muted-foreground mb-5">
                When reading right-to-left manga, panels flow from top-right across the page:
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-4 text-center text-sm font-bold">
                {[
                  { n: "②", bg: "#1a1a2e" },
                  { n: "①", bg: "#1a2a1e" },
                  { n: "④", bg: "#2a1a1a" },
                  { n: "③", bg: "#1a1a2e" },
                ].map((p, i) => (
                  <div key={i} className="h-20 rounded-xl border border-border flex items-center justify-center text-2xl text-foreground"
                    style={{ background: p.bg }}>
                    {p.n}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span>Right → Left reading direction</span>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2 italic">
                Speech bubbles within each panel also flow right-to-left, top-to-bottom.
              </p>
            </div>
          </section>

          {/* Reader features */}
          <section>
            <h2 className="text-2xl font-black mb-2">MangaVerse Reader Features</h2>
            <p className="text-muted-foreground text-sm mb-8">Make the most of every feature the reader offers.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {TIPS.map(tip => (
                <div key={tip.title} className="bg-card border border-border rounded-xl p-5 space-y-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div style={{ color: tip.color, background: `${tip.color}18`, width: 38, height: 38, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {tip.icon}
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{tip.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>

            {/* Keyboard shortcuts */}
            <div className="mt-8 bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Keyboard size={14} className="text-primary" /> Keyboard Shortcuts
                </h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { key: "→ Right Arrow", action: "Next page (LTR) / Previous page (RTL)" },
                    { key: "← Left Arrow", action: "Previous page (LTR) / Next page (RTL)" },
                    { key: "↓ Down Arrow", action: "Always go to next page" },
                    { key: "↑ Up Arrow", action: "Always go to previous page" },
                    { key: "F", action: "Toggle fullscreen / immersive mode" },
                    { key: "Escape", action: "Close the reader" },
                    { key: "Click page counter", action: "Jump directly to any page number" },
                  ].map((row, i) => (
                    <tr key={row.key} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                      <td className="px-5 py-3 font-mono text-xs text-primary w-44">{row.key}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Common mistakes */}
          <section>
            <h2 className="text-2xl font-black mb-2">Common Beginner Mistakes</h2>
            <p className="text-muted-foreground text-sm mb-8">Everyone makes these when they first start reading manga.</p>

            <div className="space-y-4">
              {BEGINNERS_MISTAKES.map(({ mistake, fix }) => (
                <div key={mistake} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-destructive/5">
                    <span className="text-destructive text-xs font-bold uppercase tracking-wider">Mistake:</span>
                    <span className="text-sm font-semibold text-foreground">{mistake}</span>
                  </div>
                  <div className="px-5 py-3 flex items-start gap-3">
                    <span className="text-green-500 text-xs font-bold uppercase tracking-wider mt-0.5 flex-shrink-0">Fix:</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Starter recommendations */}
          <section>
            <h2 className="text-2xl font-black mb-2">What Should I Read First?</h2>
            <p className="text-muted-foreground text-sm mb-8">Recommendations based on what you already enjoy.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { like: "Superhero movies", start: "My Hero Academia, One Punch Man", genre: "Action" },
                { like: "Fantasy novels", start: "Fullmetal Alchemist, Berserk, Magi", genre: "Fantasy" },
                { like: "Video games (RPGs)", start: "That Time I Got Reincarnated as a Slime, Overlord", genre: "Isekai" },
                { like: "Thrillers and mysteries", start: "Death Note, Monster, Moriarty the Patriot", genre: "Mystery" },
                { like: "Romantic comedies", start: "Kaguya-sama, Horimiya, Toradora", genre: "Romance" },
                { like: "Emotional dramas", start: "A Silent Voice, March Comes in Like a Lion", genre: "Slice of Life" },
                { like: "Horror movies", start: "Uzumaki, Parasyte, Junji Ito Collection", genre: "Horror" },
                { like: "Short funny content", start: "The Disastrous Life of Saiki K., Assassination Classroom", genre: "Comedy" },
              ].map(rec => (
                <div key={rec.like} className="bg-card border border-border rounded-xl p-4 space-y-2 hover:border-primary/30 transition-colors">
                  <p className="text-xs text-muted-foreground">If you like {rec.like}…</p>
                  <p className="text-xs text-muted-foreground">Start with: <span className="text-primary font-semibold">{rec.start}</span></p>
                  <Link to={`/?genre=${rec.genre}`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Browse more {rec.genre} <ChevronRight size={10} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* CTA */}
        <section className="py-16 px-4 text-center border-t border-border/50">
          <div className="max-w-xl mx-auto space-y-5">
            <h2 className="text-2xl font-black">You're Ready. Start Reading.</h2>
            <p className="text-muted-foreground text-sm">
              MangaVerse has thousands of series waiting — free, instant, no account needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg,#e05c2a,#f0943a)", color: "#fff" }}>
                <BookOpen size={15} /> Browse the Library
              </Link>
              <Link to="/genres-guide"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm border border-border bg-card text-foreground hover:border-primary/40 transition-all">
                Explore Genres <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HowToRead;
