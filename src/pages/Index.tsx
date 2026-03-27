import { useState, useMemo } from "react";
import { BookOpen, TrendingUp, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import MangaCard from "@/components/MangaCard";
import FeaturedManga from "@/components/FeaturedManga";
import { mangaList } from "@/data/manga";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const filtered = useMemo(() => {
    return mangaList.filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.author.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = selectedGenre === "All" || m.genres.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });
  }, [search, selectedGenre]);

  const featured = mangaList[3]; // Dragon's Crown

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Hero */}
        <section className="text-center space-y-4 py-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome to <span className="text-gradient-orange">MangaVerse</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Discover, read, and immerse yourself in thousands of manga stories.
          </p>
        </section>

        {/* Search & Filter */}
        <section className="space-y-4">
          <div className="flex justify-center">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <GenreFilter selected={selectedGenre} onChange={setSelectedGenre} />
        </section>

        {/* Featured */}
        {!search && selectedGenre === "All" && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Featured</h2>
            </div>
            <FeaturedManga manga={featured} />
          </section>
        )}

        {/* Manga Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {search ? "Results" : selectedGenre === "All" ? "Popular Manga" : selectedGenre}
              </h2>
            </div>
            <span className="text-sm text-muted-foreground">{filtered.length} titles</span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-3">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No manga found. Try a different search or genre.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 <span className="text-gradient-orange font-semibold">MangaVerse</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
