// GenresGuide.tsx  →  route: /genres-guide
// Static SEO page about manga genres. Dense keyword-rich content for indexing.
// Uses react-helmet-async. No API calls — 100% static.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";

const GENRES_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete Guide to Manga Genres — MangaVerse",
  "description": "Everything you need to know about manga genres: action, romance, isekai, fantasy, horror, and more. Find your next favourite manga series by genre.",
  "image": "https://mangaverse-pages.vercel.app/og-genres.jpg",
  "author": { "@type": "Organization", "name": "MangaVerse" },
  "publisher": {
    "@type": "Organization",
    "name": "MangaVerse",
    "logo": { "@type": "ImageObject", "url": "https://mangaverse-pages.vercel.app/logo.png" }
  },
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString().split("T")[0],
  "mainEntityOfPage": "https://mangaverse-pages.vercel.app/genres-guide"
};

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mangaverse-pages.vercel.app/" },
    { "@type": "ListItem", "position": 2, "name": "Genres Guide", "item": "https://mangaverse-pages.vercel.app/genres-guide" }
  ]
};

interface GenreEntry {
  id: string;
  name: string;
  color: string;
  emoji: string;
  tagline: string;
  description: string;
  characteristics: string[];
  popularTitles: string[];
  readIfYouLike: string;
}

const GENRES: GenreEntry[] = [
  {
    id: "action",
    name: "Action",
    color: "#e05c2a",
    emoji: "⚔️",
    tagline: "High-octane battles and relentless thrills",
    description: "Action manga is the backbone of the medium. Defined by fast-paced combat sequences, escalating power levels, and protagonists who overcome impossible odds through sheer determination and growing strength. Action manga popularised anime worldwide and continues to dominate global readership. Stories typically follow a hero — often starting weak — who trains, fights, loses, and ultimately triumphs against increasingly powerful enemies.",
    characteristics: [
      "Fast-paced fight scenes with dynamic panel composition",
      "Clear power-level progression for characters",
      "Rivals and mentors who push the hero forward",
      "High stakes — often involving world-threatening villains",
      "Tournament arcs and power-up moments",
    ],
    popularTitles: ["Dragon Ball", "Naruto", "One Piece", "Demon Slayer", "My Hero Academia", "Bleach", "Jujutsu Kaisen", "Black Clover"],
    readIfYouLike: "Adrenaline, underdogs becoming legends, and satisfying villain defeats.",
  },
  {
    id: "romance",
    name: "Romance",
    color: "#ec4899",
    emoji: "💕",
    tagline: "Heartbeats, misunderstandings, and perfect confessions",
    description: "Romance manga explores the spectrum of human connection — from the nervous excitement of a first crush to long-term relationships navigating real-world challenges. What makes manga romance unique is its emotional granularity: entire chapters can be devoted to a single glance, a held hand, or an almost-said sentence. Readers experience emotions through beautifully expressive art that captures every blush and racing heartbeat.",
    characteristics: [
      "Slow-burn tension that rewards patient readers",
      "Misunderstandings and near-confessions that drive chapters",
      "Detailed character facial expressions and body language",
      "School settings or slice-of-life backdrops",
      "Rival love interests creating satisfying triangles",
    ],
    popularTitles: ["Kaguya-sama: Love is War", "Horimiya", "Your Lie in April", "Fruits Basket", "Ao Haru Ride", "Toradora", "Rent-a-Girlfriend"],
    readIfYouLike: "Emotional rollercoasters, witty banter, and 'finally!' moments.",
  },
  {
    id: "isekai",
    name: "Isekai",
    color: "#8b5cf6",
    emoji: "🌀",
    tagline: "Transported to another world, reborn with a purpose",
    description: "Isekai — literally 'another world' in Japanese — is one of the fastest-growing manga genres of the last decade. The premise: an ordinary person (usually from modern Japan) is transported, reincarnated, or summoned into a fantasy world — often with special powers or foreknowledge. The genre lets readers escape vicariously, building kingdoms, mastering magic, and becoming heroes in richly constructed alternate realities.",
    characteristics: [
      "Protagonist transported, reincarnated, or summoned to a new world",
      "RPG-style mechanics: levels, skills, stats",
      "World-building with magic systems and fantasy races",
      "Overpowered protagonists (often referred to as 'OP MCs')",
      "Harem elements frequently included (but not required)",
    ],
    popularTitles: ["Overlord", "Re:Zero", "That Time I Got Reincarnated as a Slime", "Konosuba", "The Rising of the Shield Hero", "Sword Art Online", "No Game No Life"],
    readIfYouLike: "Fantasy escapism, RPG mechanics, and watching a hero build an empire from scratch.",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    color: "#06b6d4",
    emoji: "🐉",
    tagline: "Worlds beyond imagination, magic beyond reason",
    description: "Fantasy manga builds entire worlds from scratch — with unique magic systems, mythical creatures, ancient prophecies, and political intrigue. Unlike isekai, fantasy manga often follows characters native to these worlds, providing rich lore without the 'outsider perspective' framing. The best fantasy manga rivals Western epic fantasy in scope and depth, with multi-volume story arcs that pay off years of plot threads.",
    characteristics: [
      "Original world-building with internal logic",
      "Magic systems with rules and costs",
      "Epic quests and world-scale conflicts",
      "Non-human races: elves, dwarves, demons, gods",
      "Political intrigue and kingdom-building",
    ],
    popularTitles: ["Berserk", "Fullmetal Alchemist", "Magi", "Vinland Saga", "Made in Abyss", "The Ancient Magus' Bride", "Witch Hat Atelier"],
    readIfYouLike: "Epic lore, complex magic, and stories that feel like entire civilisations.",
  },
  {
    id: "seinen",
    name: "Seinen",
    color: "#374151",
    emoji: "🖤",
    tagline: "Mature stories for adult readers",
    description: "Seinen manga targets adult male readers (ages 18–40) and is characterised by more complex narratives, morally ambiguous characters, graphic violence, and mature themes that younger-targeted manga avoids. Seinen doesn't mean 'dark' by default — it simply means the storytelling is allowed more nuance, more time, and more willingness to explore uncomfortable truths about humanity.",
    characteristics: [
      "Morally grey protagonists and antagonists",
      "Slower, more contemplative pacing",
      "Graphic violence and adult situations",
      "Psychological depth and philosophical themes",
      "More realistic character motivations",
    ],
    popularTitles: ["Berserk", "Vagabond", "Oyasumi Punpun", "Vinland Saga", "Monster", "Gantz", "Tokyo Ghoul", "Dorohedoro"],
    readIfYouLike: "Stories that treat you like an adult and don't shy away from hard truths.",
  },
  {
    id: "slice-of-life",
    name: "Slice of Life",
    color: "#22c55e",
    emoji: "☕",
    tagline: "The beauty hiding in everyday moments",
    description: "Slice of life manga finds drama and beauty in ordinary moments — a conversation over coffee, a quiet afternoon, the rhythm of daily routines. With no world-ending stakes, slice of life connects through pure emotional truth. It's the genre that makes you feel warm and nostalgic for experiences you may not have even had. Often combined with other genres like romance or comedy, it functions as the emotional glue that makes characters feel real.",
    characteristics: [
      "Low or no external conflict — internal character focus",
      "Gentle, episodic structure",
      "Detailed, atmospheric backgrounds and settings",
      "Strong found-family or friendship dynamics",
      "Cosy, bittersweet, or quietly profound emotional tone",
    ],
    popularTitles: ["Yotsuba&!", "March Comes in Like a Lion", "A Silent Voice", "Barakamon", "Non Non Biyori", "Flying Witch", "Silver Spoon"],
    readIfYouLike: "Comfort, authenticity, and stories where the small stuff matters most.",
  },
  {
    id: "horror",
    name: "Horror",
    color: "#dc2626",
    emoji: "👁️",
    tagline: "Fear distilled into ink and shadow",
    description: "Horror manga leverages the visual medium uniquely — grotesque creature designs, expertly timed reveals, and use of negative space create dread that prose can rarely match. Japanese horror manga has a distinct flavour: psychological horror, body horror, cosmic horror, and social horror all feature heavily. The best horror manga doesn't just frighten — it unsettles, leaving images burned into memory long after the last page.",
    characteristics: [
      "Atmospheric tension built across multiple pages",
      "Grotesque creature design and body horror",
      "Psychological horror and unreliable narrators",
      "Sudden tonal shifts from mundane to terrifying",
      "Dark themes: death, loss, corruption, and existential dread",
    ],
    popularTitles: ["Uzumaki", "Berserk", "Parasyte", "Junji Ito Collection", "Tokyo Ghoul", "Attack on Titan", "Chainsaw Man"],
    readIfYouLike: "Being genuinely disturbed, unforgettable imagery, and stories that stay with you.",
  },
  {
    id: "comedy",
    name: "Comedy",
    color: "#f59e0b",
    emoji: "😂",
    tagline: "Perfectly timed panels and absurd situations",
    description: "Comedy manga uses the visual medium brilliantly — exaggerated expressions, comedic timing across panels, and running gags that build over dozens of chapters. Japanese comedy manga ranges from rapid-fire absurdist humour (gag manga) to slow-burn situational comedy where jokes evolve from carefully established character dynamics. Comedy is also a genre that crosses freely into romance, action, and slice of life.",
    characteristics: [
      "Expressive chibi-style art in comedic moments",
      "Recurring gags and callbacks across chapters",
      "Tsukkomi/boke dynamic (straight man/fool)",
      "Fourth-wall breaks and meta-humour",
      "Character-driven situational comedy",
    ],
    popularTitles: ["Kaguya-sama: Love is War", "Gintama", "Konosuba", "Grand Blue Dreaming", "Assassination Classroom", "One Punch Man", "The Disastrous Life of Saiki K."],
    readIfYouLike: "Laughing out loud, comedic timing, and characters who feel like old friends.",
  },
];

const GenresGuide = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Manga Genres Explained — Complete Guide | MangaVerse</title>
        <meta name="description" content="Complete guide to manga genres: action, romance, isekai, fantasy, horror, slice of life, seinen, and comedy. Find your perfect genre and discover popular manga series." />
        <meta name="keywords" content="manga genres, types of manga, action manga, romance manga, isekai manga, fantasy manga, horror manga, slice of life manga, seinen manga, best manga by genre" />
        <link rel="canonical" href="https://mangaverse-pages.vercel.app/genres-guide" />

        <meta property="og:type" content="article" />
        <meta property="og:title" content="Manga Genres Explained — Complete Guide | MangaVerse" />
        <meta property="og:description" content="Your complete guide to manga genres. Discover what makes each genre unique and find the perfect series to read next." />
        <meta property="og:url" content="https://mangaverse-pages.vercel.app/genres-guide" />
        <meta property="og:image" content="https://mangaverse-pages.vercel.app/og-genres.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Manga Genres Explained — Complete Guide | MangaVerse" />
        <meta name="twitter:description" content="Your complete guide to manga genres. Discover what makes each genre unique and find the perfect series to read next." />

        <script type="application/ld+json">{JSON.stringify(GENRES_JSONLD)}</script>
        <script type="application/ld+json">{JSON.stringify(BREADCRUMB_JSONLD)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        {/* Hero */}
        <section className="py-16 px-4 text-center border-b border-border/50">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={10} />
              <span className="text-foreground">Genres Guide</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              Manga{" "}
              <span style={{ background: "linear-gradient(135deg,#e05c2a,#f0943a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Genres
              </span>{" "}
              Explained
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              New to manga and don't know where to start? Already a fan looking for your next series?
              This guide breaks down every major manga genre so you can find exactly what you're after.
            </p>

            {/* Quick jump */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {GENRES.map(g => (
                <a key={g.id} href={`#${g.id}`}
                  className="px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                  {g.emoji} {g.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Genre articles */}
        <main className="max-w-4xl mx-auto px-4 py-12 space-y-20">
          {GENRES.map((genre, idx) => (
            <article key={genre.id} id={genre.id} className="scroll-mt-8">
              {/* Genre header */}
              <div className="flex items-start gap-5 mb-6">
                <div className="text-4xl flex-shrink-0 mt-1">{genre.emoji}</div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-black text-foreground">{genre.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: `${genre.color}20`, color: genre.color }}>
                      #{idx + 1} Popular
                    </span>
                  </div>
                  <p className="text-sm font-medium italic" style={{ color: genre.color }}>
                    {genre.tagline}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-5 gap-8">
                {/* Main description */}
                <div className="md:col-span-3 space-y-5">
                  <p className="text-muted-foreground leading-relaxed">{genre.description}</p>

                  {/* Characteristics */}
                  <div>
                    <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider">
                      Key Characteristics
                    </h3>
                    <ul className="space-y-2">
                      {genre.characteristics.map(c => (
                        <li key={c} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                            style={{ background: genre.color }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm text-muted-foreground italic border-l-2 pl-4"
                    style={{ borderColor: genre.color }}>
                    <strong className="text-foreground not-italic">Read this genre if you like:</strong>{" "}
                    {genre.readIfYouLike}
                  </p>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-2 space-y-5">
                  {/* Popular titles */}
                  <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">
                      Popular {genre.name} Manga
                    </h3>
                    <ul className="space-y-2">
                      {genre.popularTitles.map(t => (
                        <li key={t} className="flex items-center gap-2">
                          <BookOpen size={11} style={{ color: genre.color, flexShrink: 0 }} />
                          <Link to={`/?search=${encodeURIComponent(t)}`}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            {t}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Browse CTA */}
                  <Link
                    to={`/?genre=${encodeURIComponent(genre.name)}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: `${genre.color}15`, borderColor: `${genre.color}40`, color: genre.color }}
                  >
                    Browse {genre.name} Manga
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>

              {idx < GENRES.length - 1 && (
                <div className="mt-16 border-b border-border/40" />
              )}
            </article>
          ))}
        </main>

        {/* Summary comparison table */}
        <section className="py-16 px-4 bg-card/30 border-y border-border/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black mb-8">Quick Genre Comparison</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card/80">
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Genre</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Mood</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Pacing</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Audience</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { genre: "Action", mood: "Exciting, intense", pacing: "Fast", audience: "All ages" },
                    { genre: "Romance", mood: "Warm, emotional", pacing: "Slow-burn", audience: "Teens & adults" },
                    { genre: "Isekai", mood: "Escapist, fun", pacing: "Medium", audience: "Teens & adults" },
                    { genre: "Fantasy", mood: "Epic, immersive", pacing: "Medium–slow", audience: "Teens & adults" },
                    { genre: "Seinen", mood: "Mature, complex", pacing: "Slow", audience: "Adults (18+)" },
                    { genre: "Slice of Life", mood: "Cosy, reflective", pacing: "Very slow", audience: "All ages" },
                    { genre: "Horror", mood: "Tense, disturbing", pacing: "Varies", audience: "Adults (18+)" },
                    { genre: "Comedy", mood: "Lighthearted, fun", pacing: "Fast", audience: "All ages" },
                  ].map((row, i) => (
                    <tr key={row.genre} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${i % 2 === 0 ? "" : "bg-card/30"}`}>
                      <td className="px-4 py-3 font-semibold text-foreground">{row.genre}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.mood}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.pacing}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.audience}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <h2 className="text-2xl font-black">Ready to Start Reading?</h2>
            <p className="text-muted-foreground text-sm">
              Now you know the genres — find your next manga on MangaVerse. Free, instant, no account required.
            </p>
            <Link to="/"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm"
              style={{ background: "linear-gradient(135deg,#e05c2a,#f0943a)", color: "#fff" }}>
              <BookOpen size={15} /> Go to the Library
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default GenresGuide;
