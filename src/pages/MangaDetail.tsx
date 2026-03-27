import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Star, BookOpen, ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import MangaReader from "@/components/MangaReader";
import { mangaList } from "@/data/manga";


const MangaDetail = () => {
  const { id } = useParams();
  const [readerOpen, setReaderOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const manga = mangaList.find((m) => m.id === id);

  if (!manga) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <BookOpen className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">Manga not found.</p>
          <Link to="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={manga.cover} alt="" className="h-full w-full object-cover opacity-15 blur-2xl scale-125" />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-dark)' }} />
      </div>

      <main className="container mx-auto px-4 -mt-32 relative z-10 pb-16">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover */}
          <div className="flex-shrink-0">
            <img
              src={manga.cover}
              alt={manga.title}
              className="w-56 md:w-64 rounded-xl shadow-card border border-border/50"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                {manga.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-4 w-4" />{manga.author}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{manga.year}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-bold text-foreground">{manga.rating}</span>
              </div>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />{manga.chapters.length} Chapters
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${manga.status === "Ongoing" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                {manga.status}
              </span>
            </div>

            <p className="text-secondary-foreground leading-relaxed max-w-2xl">
              {manga.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {manga.genres.map((g) => (
                <span key={g} className="genre-chip text-sm">{g}</span>
              ))}
            </div>

            <Button
              onClick={() => {
                setSelectedPdf(manga.chapters[0].pdfUrl); // open first chapter
                setReaderOpen(true);
              }}
              className="bg-gradient-orange shadow-glow hover:opacity-90 transition-opacity text-base px-8 py-3 h-auto"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Read Now
            </Button>
          </div>
        </div>

        {/* Chapters list */}
        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Chapters</h2>
          <div className="grid gap-2">
            {manga.chapters.slice(0, 20).map((ch) => (
              <button
                key={ch.number}
                onClick={() => {
                  setSelectedPdf(ch.pdfUrl);
                  setReaderOpen(true);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-secondary hover:border-primary/30 transition-all group"
              >
                <span className="text-sm font-medium text-foreground">
                  {ch.number}: {ch.title}
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  Read →
                </span>
              </button>
            ))}
          </div>
          {manga.chapters.length > 20 && (
            <p className="text-sm text-muted-foreground text-center">
              + {manga.chapters.length - 20} more chapters
            </p>
          )}
        </section>
      </main>

      {readerOpen && manga.chapters[0].pdfUrl && (
        <MangaReader
          pdfUrl={selectedPdf} // fallback for now
          title={manga.title}
          onClose={() => setReaderOpen(false)}
        />
      )}
    </div>
  );
};

export default MangaDetail;
