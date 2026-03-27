import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

// ✅ VITE SAFE FIX
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
interface MangaReaderProps {
  pdfUrl: string; // 👈 instead of pages
  title: string;
  onClose: () => void;
}

const MangaReader = ({ pdfUrl, title, onClose }: MangaReaderProps) => {
  const [currentPage, setCurrentPage] = useState(1); // PDF starts from 1
  const [numPages, setNumPages] = useState<number>(0);
  const [fullscreen, setFullscreen] = useState(false);

  const goToPage = useCallback((direction: "next" | "prev") => {
    if (direction === "next" && currentPage >= numPages) return;
    if (direction === "prev" && currentPage <= 1) return;
    setCurrentPage((p) => direction === "next" ? p + 1 : p - 1);
  }, [currentPage, numPages]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " ") goToPage("next");
    if (e.key === "ArrowLeft") goToPage("prev");
    if (e.key === "Escape") onClose();
  }, [goToPage, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col"
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
            Page {currentPage} / {numPages}
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
        <button
          onClick={() => goToPage("prev")}
          disabled={currentPage === 1}
          className="absolute left-4 z-10 p-2 rounded-full bg-card/60 backdrop-blur-sm border border-border text-foreground hover:bg-card transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center p-4">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page
              pageNumber={currentPage}
              width={500} // 👈 key fix
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>

        <button
          onClick={() => goToPage("next")}
          disabled={currentPage >= numPages}
          className="absolute right-4 z-10 p-2 rounded-full bg-card/60 backdrop-blur-sm border border-border text-foreground hover:bg-card transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Page progress bar */}
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-gradient-orange transition-all duration-300"
          style={{ width: `${numPages ? (currentPage / numPages) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
};

export default MangaReader;
