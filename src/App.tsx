// ── App.tsx — add these 3 new routes ─────────────────────────────
// Replace your existing App.tsx with this, or just copy the 3 new Route lines.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";      // ← ADD THIS IMPORT
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import MangaDetail from "./pages/MangaDetail.tsx";
import UploadManga from "./pages/UploadManga.tsx";
import EditManga from "./pages/EditManga.tsx";
import EditMangaSelect from "./pages/EditMangaSelect.tsx";
import UploadChapter from "./pages/UploadChapter.tsx";
import AdminMenu from "./pages/AdminMenu.tsx";
import GenreManager from "./pages/GenreManager.tsx";
import NotFound from "./pages/NotFound.tsx";

// ── NEW SEO pages ────────────────────────────────────────────────
import About from "./pages/About.tsx";
import SEOHome from "./pages/SEOHome.tsx";
import GenresGuide from "./pages/GenresGuide.tsx";
import HowToRead from "./pages/HowToRead.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>                                         {/* ← WRAP with HelmetProvider */}
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Existing routes */}
            <Route path="/home" element={<Index />} />
            <Route path="/manga/:id" element={<MangaDetail />} />
            <Route path="/upload-manga" element={<UploadManga />} />
            <Route path="/upload-chapter" element={<UploadChapter />} />
            <Route path="/edit-manga/:id" element={<EditManga />} />
            <Route path="/admin/edit-manga" element={<EditMangaSelect />} />
            <Route path="/genres" element={<GenreManager />} />
            <Route path="/admin" element={<AdminMenu />} />

            {/* ── NEW SEO routes ── */}
            <Route path="/about" element={<About />} />
            <Route path="/" element={<SEOHome />} />
            <Route path="/genres-guide" element={<GenresGuide />} />
            <Route path="/how-to-read" element={<HowToRead />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;


// ────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS
// ────────────────────────────────────────────────────────────────
//
// 1. Install react-helmet-async:
//    npm install react-helmet-async
//
// 2. Place these files in src/pages/:
//    - SEOHome.tsx      → /home
//    - GenresGuide.tsx  → /genres-guide
//    - HowToRead.tsx    → /how-to-read
//
// 3. Update App.tsx (this file) with the new routes above.
//
// 4. Add sitemap.xml (see sitemap.xml file) to your /public folder.
//
// 5. Add robots.txt to /public (see robots.txt file).
//
// 6. Update the canonical URLs in each page to match your actual domain.
//    Search for "mangaverse-pages.vercel.app" and replace with your domain.
//
// 7. Submit sitemap to Google Search Console:
//    https://search.google.com/search-console
//    → Sitemaps → Add: https://yourdomain.com/sitemap.xml
//
// ────────────────────────────────────────────────────────────────
