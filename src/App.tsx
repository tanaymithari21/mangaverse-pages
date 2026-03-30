import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import MangaDetail from "./pages/MangaDetail.tsx";
import UploadManga from "./pages/UploadManga.tsx";
import EditManga from "./pages/EditManga.tsx";
// import EditMangaSelect from "./pages/EditMangaSelect.tsx";
import UploadChapter from "./pages/UploadChapter.tsx";
import AdminMenu from "./pages/AdminMenu.tsx";
import GenreManager from "./pages/GenreManager.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/manga/:id" element={<MangaDetail />} />
          <Route path="/upload-manga" element={<UploadManga />} />
          <Route path="/upload-chapter" element={<UploadChapter />} />
          <Route path="/edit-manga/:id" element={<EditManga />} />
          {/* <Route path="/edit-manga-select" element={<EditMangaSelect />} /> */}
          <Route path="/genres" element={<GenreManager />} />
          <Route path="/menu" element={<AdminMenu />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
