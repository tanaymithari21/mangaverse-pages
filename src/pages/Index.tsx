import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BookOpen, TrendingUp, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import MangaCard from "@/components/MangaCard";
import FeaturedManga from "@/components/FeaturedManga";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const PAGE_SIZE = 10;

const Index = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [mangaList, setMangaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allGenres, setAllGenres] = useState<string[]>(["All"]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Debounce search input — wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when genre changes
  useEffect(() => {
    setPage(0);
  }, [selectedGenre]);

  // Fetch genres from DB via API
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/genres`)
      .then(res => {
        // API returns [{id, name}, ...] — extract just the name strings
        const names = res.data.map((g: any) => typeof g === "string" ? g : g.name);
        setAllGenres(["All", ...names]);
      })
      .catch(err => console.error("Failed to fetch genres:", err));
  }, []);

  // Fetch paginated manga whenever search/genre/page changes
  useEffect(() => {
    setLoading(true);

    const params: Record<string, any> = {
      page,
      size: PAGE_SIZE,
    };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (selectedGenre !== "All") params.genre = selectedGenre;

    axios.get(`${API_BASE_URL}/api/manga`, { params })
      .then(res => {
        const { content, totalPages, totalElements } = res.data;
        setMangaList(content.map((m: any) => ({
          ...m,
          cover: m.cover
        })));
        setTotalPages(totalPages);
        setTotalElements(totalElements);
      })
      .catch(err => console.error("Failed to fetch manga:", err))
      .finally(() => setLoading(false));
  }, [debouncedSearch, selectedGenre, page]);

  const featured = page === 0 && !debouncedSearch && selectedGenre === "All" && mangaList.length > 0
    ? mangaList[0]
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Hero */}
        <section className="text-center space-y-4 py-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Read Manga Online Free - <span className="text-gradient-orange">MangaVerse</span>
          </h1>

          <p className="text-muted-foreground max-w-md mx-auto">
            MangaVerse lets you read manga online for free. Discover popular manga like Naruto, One Piece, Attack on Titan and explore thousands of chapters updated regularly.
          </p>
        </section>
        <p className="sr-only">
          Read manga online free with MangaVerse. Browse latest manga chapters, trending series, and explore action, romance, and adventure manga.
        </p>

        {/* Search & Filter */}
        <section className="space-y-4">
          <div className="flex justify-center">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <GenreFilter selected={selectedGenre} onChange={setSelectedGenre} options={allGenres} />
        </section>

        {/* Featured — only on first page with no filters */}
        {featured && (
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
                {debouncedSearch ? "Results" : selectedGenre === "All" ? "Popular Manga" : selectedGenre}
              </h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {totalElements} title{totalElements !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-secondary animate-pulse" />
              ))}
            </div>
          ) : mangaList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {mangaList.map((manga) => (
                <MangaCard
                  key={manga.id}
                  manga={{
                    ...manga,
                    genres: manga.genres || [],
                    chaptersCount: manga.chaptersCount ?? 0,
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>

              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
