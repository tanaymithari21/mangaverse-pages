export interface Manga {
  id: string;
  title: string;
  cover: string;
  description: string;
  genres: string[];
  rating: number;
  chapters: number;
  status: "Ongoing" | "Completed";
  author: string;
  year: number;
}

export const genres = [
  "All", "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life",
  "Sports", "Supernatural", "Thriller"
];

export const mangaList: Manga[] = [
  {
    id: "1",
    title: "Phantom Blade",
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop",
    description: "In a world where ancient swords hold the power of forgotten gods, a young blacksmith discovers a blade that whispers secrets of a lost civilization.",
    genres: ["Action", "Fantasy", "Adventure"],
    rating: 4.8,
    chapters: 156,
    status: "Ongoing",
    author: "Takeshi Yamamoto",
    year: 2021
  },
  {
    id: "2",
    title: "Neon Tokyo",
    cover: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=600&fit=crop",
    description: "A cyberpunk thriller set in a dystopian megacity where hackers fight against corporate overlords controlling reality itself.",
    genres: ["Sci-Fi", "Thriller", "Action"],
    rating: 4.6,
    chapters: 89,
    status: "Ongoing",
    author: "Rei Nakamura",
    year: 2022
  },
  {
    id: "3",
    title: "Moonlit Academy",
    cover: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=400&h=600&fit=crop",
    description: "At a prestigious academy where students train in magical arts, a scholarship student uncovers a dark conspiracy among the elite.",
    genres: ["Fantasy", "Mystery", "Drama"],
    rating: 4.5,
    chapters: 203,
    status: "Completed",
    author: "Sakura Aoi",
    year: 2019
  },
  {
    id: "4",
    title: "Dragon's Crown",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    description: "An epic tale of warring kingdoms and the legendary dragon riders who hold the balance of power in a fractured world.",
    genres: ["Fantasy", "Action", "Adventure"],
    rating: 4.9,
    chapters: 312,
    status: "Ongoing",
    author: "Hiroshi Tanaka",
    year: 2018
  },
  {
    id: "5",
    title: "Silent Heartbeat",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    description: "A touching romance between a deaf musician and a voice actress, exploring love beyond words in modern Tokyo.",
    genres: ["Romance", "Drama", "Slice of Life"],
    rating: 4.7,
    chapters: 67,
    status: "Completed",
    author: "Yuki Hayashi",
    year: 2020
  },
  {
    id: "6",
    title: "Abyssal Hunter",
    cover: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop",
    description: "Deep beneath the ocean lies a world of monsters and treasure. One diver's obsession leads them into the darkest depths imaginable.",
    genres: ["Horror", "Adventure", "Supernatural"],
    rating: 4.4,
    chapters: 134,
    status: "Ongoing",
    author: "Kaito Mizuki",
    year: 2021
  },
  {
    id: "7",
    title: "Court of Shadows",
    cover: "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=400&h=600&fit=crop",
    description: "A political thriller in a medieval fantasy setting where spies and assassins determine the fate of empires.",
    genres: ["Thriller", "Fantasy", "Mystery"],
    rating: 4.6,
    chapters: 178,
    status: "Ongoing",
    author: "Misaki Endo",
    year: 2020
  },
  {
    id: "8",
    title: "Kickoff Dream",
    cover: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=600&fit=crop",
    description: "A underdog high school soccer team fights their way to the nationals, forging bonds that last a lifetime.",
    genres: ["Sports", "Comedy", "Drama"],
    rating: 4.3,
    chapters: 245,
    status: "Completed",
    author: "Daisuke Kato",
    year: 2017
  },
  {
    id: "9",
    title: "Witch's Garden",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    description: "A young witch runs a magical flower shop in a sleepy countryside town, helping troubled souls find peace through enchanted botanicals.",
    genres: ["Slice of Life", "Fantasy", "Comedy"],
    rating: 4.5,
    chapters: 92,
    status: "Ongoing",
    author: "Hana Fujimoto",
    year: 2023
  },
  {
    id: "10",
    title: "Crimson Protocol",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop",
    description: "When a mysterious virus turns people into superhuman warriors, a team of scientists races to find a cure before society collapses.",
    genres: ["Sci-Fi", "Action", "Thriller"],
    rating: 4.7,
    chapters: 56,
    status: "Ongoing",
    author: "Ryo Ishida",
    year: 2024
  },
  {
    id: "11",
    title: "Spirit Detective",
    cover: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=400&h=600&fit=crop",
    description: "A teenager who can see spirits teams up with a fox demon to solve supernatural crimes across Japan.",
    genres: ["Supernatural", "Mystery", "Action"],
    rating: 4.8,
    chapters: 198,
    status: "Completed",
    author: "Shiro Watanabe",
    year: 2019
  },
  {
    id: "12",
    title: "Laugh Factory",
    cover: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=600&fit=crop",
    description: "The misadventures of a group of aspiring comedians trying to make it big in Osaka's competitive comedy scene.",
    genres: ["Comedy", "Slice of Life", "Drama"],
    rating: 4.2,
    chapters: 145,
    status: "Ongoing",
    author: "Miki Suzuki",
    year: 2022
  }
];

// Sample manga pages for the reader
export const samplePages: string[] = [
  "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800&h=1200&fit=crop",
];
