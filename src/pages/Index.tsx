import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BookOpen, TrendingUp, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import MangaCard from "@/components/MangaCard";
import FeaturedManga from "@/components/FeaturedManga";
// import { uploadToCloudinary } from "@/services/uploadToCloudinary";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [mangaList, setMangaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allGenres, setAllGenres] = useState<string[]>([]);

  // Fetch manga from backend, then resolve local covers
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/manga`)
      .then(async (res) => {
        const list = res.data;

        setMangaList(
          list.map((m: any) => ({
            ...m,
            cover: m.cover || "/placeholder.svg",
          }))
        );

        setLoading(false);

        let all: string[] = [];
        res.data.forEach((m: any) => {
          if (m.genres && Array.isArray(m.genres)) {
            all = all.concat(m.genres);
          }
        });
        const uniqueGenres = [...new Set(all)];
        setAllGenres(["All", ...uniqueGenres]);
      })
      .catch((err) => {
        console.error("Failed to fetch manga:", err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return mangaList.filter((m) => {
      const matchesSearch =
        m.title?.toLowerCase().includes(search.toLowerCase()) ||
        m.author?.toLowerCase().includes(search.toLowerCase());
      const matchesGenre =
        selectedGenre === "All" || m.genres?.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });
  }, [search, selectedGenre, mangaList]);

  const featured = filtered.length > 0 ? filtered[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading manga...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Hero */}
        <section className="text-center space-y-4 py-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
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
          <GenreFilter selected={selectedGenre} onChange={setSelectedGenre} options={allGenres} />
        </section>

        {/* Featured */}
        {!search && selectedGenre === "All" && featured && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Featured</h2>
            </div>
            <FeaturedManga manga={featured} />
          </section>
        )}

        {/* Manga Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">
                {search ? "Results" : selectedGenre === "All" ? "Popular Manga" : selectedGenre}
              </h2>
            </div>
            <span className="text-sm text-muted-foreground">{filtered.length} titles</span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((manga) => (
                <MangaCard
                  key={manga.id}
                  manga={{
                    ...manga,
                    genres: manga.genres || [],
                    chapters: manga.chapters || [],
                  }}
                />
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
    </div>
  );
};

export default Index;
