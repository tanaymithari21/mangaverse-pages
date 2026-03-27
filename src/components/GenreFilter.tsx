import { genres } from "@/data/manga";

interface GenreFilterProps {
  selected: string;
  onChange: (genre: string) => void;
}

const GenreFilter = ({ selected, onChange }: GenreFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onChange(genre)}
          className={`genre-chip ${selected === genre ? "genre-chip-active" : ""}`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
