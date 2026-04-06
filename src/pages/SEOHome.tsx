// SEOHome.tsx  →  route: /home  (or replace your existing /about with this)
// Drop-in React page. Uses react-helmet-async for <head> injection.
// Install: npm install react-helmet-async
// Wrap App with <HelmetProvider> from react-helmet-async.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  BookOpen, Star, Zap, Shield, Globe, TrendingUp,
  ChevronRight, Users, Library, Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";

// ── JSON-LD structured data ───────────────────────────────────────
const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MangaVerse",
  "url": "https://mangaverse-pages.vercel.app",
  "description": "Read manga online free. Thousands of manga series updated daily — action, romance, fantasy, and more.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://mangaverse-pages.vercel.app/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MangaVerse",
  "url": "https://mangaverse-pages.vercel.app",
  "logo": "https://mangaverse-pages.vercel.app/logo.png",
  "sameAs": []
};

const FEATURES = [
  {
    icon: <Zap size={22} />,
    title: "Instant Loading",
    desc: "Pages load in under a second. No buffering, no waiting — just reading.",
    color: "#f0943a",
  },
  {
    icon: <Library size={22} />,
    title: "Thousands of Series",
    desc: "From shonen classics to niche isekai — our library covers every genre.",
    color: "#e05c2a",
  },
  {
    icon: <Globe size={22} />,
    title: "No Account Needed",
    desc: "Open any manga and start reading immediately. Zero sign-up friction.",
    color: "#3b82f6",
  },
  {
    icon: <Shield size={22} />,
    title: "Ad-Light Experience",
    desc: "We keep ads minimal so they don't interrupt your reading flow.",
    color: "#a855f7",
  },
  {
    icon: <Clock size={22} />,
    title: "Daily Updates",
    desc: "New chapters added every day. Stay up-to-date with ongoing series.",
    color: "#22c55e",
  },
  {
    icon: <Users size={22} />,
    title: "All Devices",
    desc: "Optimised for mobile, tablet, and desktop. Read anywhere, anytime.",
    color: "#ec4899",
  },
];

const POPULAR_GENRES = [
  "Action", "Adventure", "Romance", "Fantasy", "Isekai",
  "Shounen", "Seinen", "Slice of Life", "Horror", "Comedy",
  "Mystery", "Supernatural", "Martial Arts", "Mecha", "Sports",
];

const FAQ = [
  {
    q: "Is MangaVerse free to use?",
    a: "Yes. MangaVerse is completely free. You can read any manga in our library without creating an account or paying a subscription fee.",
  },
  {
    q: "How often are new chapters added?",
    a: "We add new chapters daily. Popular ongoing series like One Piece and Jujutsu Kaisen are updated within hours of their official release.",
  },
  {
    q: "Can I read manga on my phone?",
    a: "Absolutely. MangaVerse is fully responsive and works great on any device — phone, tablet, or desktop. The reader even supports swipe navigation on touch screens.",
  },
  {
    q: "Do you have completed manga series?",
    a: "Yes. Our library includes both ongoing series and fully completed manga so you can binge read without waiting for new chapters.",
  },
  {
    q: "What genres are available?",
    a: "We cover all major genres including action, romance, fantasy, horror, slice of life, isekai, sports, mystery, and many more. Use the genre filter on the home page to browse.",
  },
  {
    q: "Does MangaVerse work without an account?",
    a: "Yes. No account is required. Simply visit the site, find a manga you like, and start reading immediately.",
  },
];

// JSON-LD for FAQ
const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a }
  }))
};

const SEOHome = () => {
  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>MangaVerse — Read Manga Online Free | Thousands of Series</title>
        <meta name="description" content="Read manga online free on MangaVerse. Browse thousands of manga series — action, romance, fantasy, isekai and more. Updated daily, no account required." />
        <meta name="keywords" content="read manga online, free manga, manga reader, online manga, manga series, anime manga, read manga free, mangaverse" />
        <link rel="canonical" href="https://mangaverse-pages.vercel.app/home" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MangaVerse — Read Manga Online Free" />
        <meta property="og:description" content="Browse thousands of manga series for free. Daily updates, no account required." />
        <meta property="og:url" content="https://mangaverse-pages.vercel.app/home" />
        <meta property="og:site_name" content="MangaVerse" />
        <meta property="og:image" content="https://mangaverse-pages.vercel.app/og-home.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MangaVerse — Read Manga Online Free" />
        <meta name="twitter:description" content="Browse thousands of manga series for free. Daily updates, no account required." />
        <meta name="twitter:image" content="https://mangaverse-pages.vercel.app/og-home.jpg" />

        {/* Structured data */}
        <script type="application/ld+json">{JSON.stringify(WEBSITE_JSONLD)}</script>
        <script type="application/ld+json">{JSON.stringify(ORG_JSONLD)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_JSONLD)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-24 px-4">
          {/* Background glow */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(224,92,42,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-2">
              <TrendingUp size={12} /> Updated daily with new chapters
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
              Read Manga{" "}
              <span style={{ background: "linear-gradient(135deg, #e05c2a, #f0943a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Online Free
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              MangaVerse gives you free access to thousands of manga series — from timeless
              shonen epics to the freshest isekai. No account, no subscription, just manga.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "linear-gradient(135deg, #e05c2a, #f0943a)", color: "#fff", boxShadow: "0 0 20px rgba(224,92,42,0.4)" }}
              >
                <BookOpen size={16} /> Browse Manga Library
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-border bg-card text-foreground hover:border-primary/40 transition-all"
              >
                Learn More <ChevronRight size={14} />
              </Link>
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
              {[
                { val: "10,000+", label: "Manga Series" },
                { val: "500K+",   label: "Chapters Available" },
                { val: "Free",    label: "Always & Forever" },
                { val: "Daily",   label: "New Updates" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-foreground">{s.val}</div>
                  <div className="text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What is MangaVerse ── */}
        <section className="py-16 px-4 border-t border-border/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-6">What is MangaVerse?</h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                <p>
                  <strong className="text-foreground">MangaVerse</strong> is a free online manga reading platform
                  built for fans who want a fast, clean, and distraction-free experience.
                  Whether you're catching up on One Piece, discovering a new romance series,
                  or binge-reading a completed fantasy epic — MangaVerse has you covered.
                </p>
                <p>
                  Our library spans every major genre: action, adventure, romance, horror,
                  slice of life, isekai, sports, mystery, and more. New titles and chapters
                  are added every single day so the library keeps growing.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Unlike other manga sites, MangaVerse is designed with the reader first.
                  The immersive reader mode hides all UI chrome so the only thing on your
                  screen is the manga. Navigation is keyboard-friendly, touch-friendly, and
                  works on any screen size.
                </p>
                <p>
                  Reading is completely <strong className="text-foreground">free</strong> with
                  no account required. Just open the site, pick a manga, and start reading.
                  It really is that simple.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-16 px-4 bg-card/30 border-y border-border/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">Why Choose MangaVerse?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need from a manga reader — nothing you don't.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(f => (
                <div key={f.title} className="bg-card border border-border rounded-xl p-5 space-y-3 hover:border-primary/30 transition-colors">
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: `${f.color}18`,
                    color: f.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Popular Genres ── */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-3">Explore by Genre</h2>
            <p className="text-muted-foreground mb-8">
              From high-octane battle manga to heartwarming slice-of-life stories — every taste is covered.
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_GENRES.map(g => (
                <Link
                  key={g}
                  to={`/?genre=${encodeURIComponent(g)}`}
                  className="px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  {g}
                </Link>
              ))}
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-base">Action & Adventure</h3>
                <p>Epic battles, power systems, and heroes who push beyond their limits. Perfect for fans of Dragon Ball, Naruto, and Demon Slayer.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-base">Romance & Drama</h3>
                <p>Slow burns, misunderstandings, and heartfelt confessions. The romance genre on MangaVerse covers everything from school life to mature drama.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-base">Fantasy & Isekai</h3>
                <p>Portal worlds, magic systems, and reincarnation stories. The most popular genre on the platform with hundreds of series.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How to Read ── */}
        <section className="py-16 px-4 bg-card/30 border-y border-border/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black mb-3">How to Read Manga on MangaVerse</h2>
            <p className="text-muted-foreground mb-8">Getting started takes about 10 seconds.</p>

            <ol className="space-y-5">
              {[
                { n: "1", title: "Visit the Library", desc: 'Go to the home page and browse the full manga catalog. Use the search bar to find a specific title or filter by genre using the chips below the search.' },
                { n: "2", title: "Select a Manga", desc: 'Click any manga card to open its detail page. You\'ll see the cover, synopsis, author, rating, and a list of all available chapters.' },
                { n: "3", title: "Pick a Chapter", desc: 'Click any chapter from the list — or hit "Read Now" to jump straight to Chapter 1. The reader opens immediately.' },
                { n: "4", title: "Navigate & Enjoy", desc: 'Use arrow keys, swipe gestures, or the on-screen buttons to turn pages. Press F or click the fullscreen icon for an immersive experience.' },
              ].map(step => (
                <li key={step.n} className="flex gap-5">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-black"
                    style={{ background: "linear-gradient(135deg,#e05c2a,#f0943a)", color: "#fff" }}>
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-8">Everything you want to know about MangaVerse.</p>

            <div className="space-y-4">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group bg-card border border-border rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-sm text-foreground hover:text-primary transition-colors list-none">
                    {q}
                    <ChevronRight size={15} className="text-muted-foreground transition-transform group-open:rotate-90 flex-shrink-0 ml-3" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-4 text-center border-t border-border/50">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <Star className="h-5 w-5 fill-primary text-primary" />
              <Star className="h-5 w-5 fill-primary text-primary" />
              <Star className="h-5 w-5 fill-primary text-primary" />
              <Star className="h-5 w-5 fill-primary text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black">
              Start Reading Manga Free Today
            </h2>
            <p className="text-muted-foreground">
              No account. No payment. No waiting. Thousands of manga series, one click away.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all"
              style={{ background: "linear-gradient(135deg, #e05c2a, #f0943a)", color: "#fff", boxShadow: "0 0 30px rgba(224,92,42,0.35)" }}
            >
              <BookOpen size={16} /> Browse the Full Library
            </Link>
          </div>
        </section>

        {/* ── Footer nav ── */}
        <footer className="border-t border-border/50 py-8 px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <span className="font-mono font-bold text-foreground">MangaVerse</span>
            <div className="flex gap-5">
              <Link to="/" className="hover:text-foreground transition-colors">Library</Link>
              <Link to="/home" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/genres-guide" className="hover:text-foreground transition-colors">Genres Guide</Link>
              <Link to="/how-to-read" className="hover:text-foreground transition-colors">How to Read</Link>
            </div>
            <span>© {new Date().getFullYear()} MangaVerse. Free manga for everyone.</span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SEOHome;
