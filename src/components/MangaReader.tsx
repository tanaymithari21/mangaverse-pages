import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";

interface MangaReaderProps {
  pages: string[];
  title: string;
  onClose: () => void;
}

const MangaReader = ({ pages, title, onClose }: MangaReaderProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const goToPage = useCallback((direction: "next" | "prev") => {
    if (isFlipping) return;
    if (direction === "next" && currentPage >= pages.length - 1) return;
    if (direction === "prev" && currentPage <= 0) return;

    setFlipDirection(direction);
    setIsFlipping(true);

    setTimeout(() => {
      setCurrentPage((p) => direction === "next" ? p + 1 : p - 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 600);
  }, [isFlipping, currentPage, pages.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " ") goToPage("next");
    if (e.key === "ArrowLeft") goToPage("prev");
    if (e.key === "Escape") onClose();
  }, [goToPage, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-background flex flex-col ${fullscreen ? "" : ""}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      autoFocus
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Page {currentPage + 1} / {pages.length}
          </span>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Reader */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--gradient-dark)' }}>
        {/* Left arrow */}
        <button
          onClick={() => goToPage("prev")}
          disabled={currentPage === 0 || isFlipping}
          className="absolute left-4 z-10 p-2 rounded-full bg-card/60 backdrop-blur-sm border border-border text-foreground hover:bg-card transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Book */}
        <div className="book-container relative w-full max-w-2xl mx-auto" style={{ aspectRatio: '2/3' }}>
          {/* Current page */}
          <div
            className={`absolute inset-0 flex items-center justify-center p-4 ${
              isFlipping && flipDirection === "next" ? "page page-turning" : "page"
            }`}
          >
            <img
              src={pages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className="max-h-full max-w-full object-contain rounded-lg shadow-card"
            />
            {/* Page shadow effect during flip */}
            {isFlipping && <div className="page-shadow absolute inset-0 rounded-lg" />}
          </div>

          {/* Next page (visible during flip) */}
          {isFlipping && flipDirection === "next" && currentPage + 1 < pages.length && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={pages[currentPage + 1]}
                alt={`Page ${currentPage + 2}`}
                className="max-h-full max-w-full object-contain rounded-lg shadow-card"
              />
            </div>
          )}

          {/* Previous page peek during back flip */}
          {isFlipping && flipDirection === "prev" && currentPage > 0 && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={pages[currentPage - 1]}
                alt={`Page ${currentPage}`}
                className="max-h-full max-w-full object-contain rounded-lg shadow-card"
              />
            </div>
          )}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => goToPage("next")}
          disabled={currentPage >= pages.length - 1 || isFlipping}
          className="absolute right-4 z-10 p-2 rounded-full bg-card/60 backdrop-blur-sm border border-border text-foreground hover:bg-card transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Page progress bar */}
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-gradient-orange transition-all duration-500"
          style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default MangaReader;
