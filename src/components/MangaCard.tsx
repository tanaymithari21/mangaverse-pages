import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Manga } from "@/data/manga";

interface MangaCardProps {
  manga: Manga;
}

const MangaCard = ({ manga }: MangaCardProps) => {
  return (
    <Link
      to={`/manga/${manga.id}`}
      className="group relative overflow-hidden rounded-xl bg-card border border-border shadow-card transition-all duration-300 hover:shadow-glow hover:border-primary/40 hover:-translate-y-1"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={manga.cover}
          alt={manga.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="absolute top-3 right-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${manga.status === "Ongoing"
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground"
          }`}>
          {manga.status}
        </span>
      </div>

      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm text-foreground line-clamp-1" style={{ fontFamily: 'var(--font-heading)' }}>
          {manga.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-xs text-muted-foreground">{manga.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">Ch. {manga.chapters.length}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {manga.genres.slice(0, 2).map((g) => (
            <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
              {g}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
