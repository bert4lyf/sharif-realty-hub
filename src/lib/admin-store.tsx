import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const SHARIF_MEDIA_BASE = "https://sharifrealty.com/wp-content/uploads";
export const FALLBACK_IMAGE = `${SHARIF_MEDIA_BASE}/2024/01/sharif-realty-placeholder.jpg`;
export const FALLBACK_IMAGE_ALT = "https://sharifrealty.com/wp-content/themes/wpresidence/img/no-image.jpg";

export const ADMIN_EMAIL = "admin@gmail.com";
export const ADMIN_PASSWORD = "admin123";

const AUTH_KEY = "sharif.admin.session";
const POSTS_KEY = "sharif.admin.posts";

export type AdminUser = { email: string; name: string; role: "Administrator" };

export type PostStatus = "Published" | "Draft";

export type AdminPost = {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  status: PostStatus;
  comments: number;
  date: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  address: string;
  image: string;
};

export const POST_CATEGORIES = ["Properties", "Featured", "Off Market", "Commercial", "Rentals"];
export const PROPERTY_TYPES = [
  "Single Family",
  "Multi Family",
  "Condo",
  "Townhouse",
  "Commercial",
  "Land",
];

export const SEED_POSTS: AdminPost[] = [
  {
    id: "p-1",
    title: "Off Market 4 bed 3 bath 1,724sqft 102 Madera Dr, Waterbury, CT 06704",
    description:
      "Off market opportunity in Waterbury. Four bedrooms, three full baths, hardwood throughout and a deep backyard. Priced for a quick close with cash or hard-money buyers.",
    author: "Majeed",
    category: "Off Market",
    tags: ["off-market", "waterbury", "investment"],
    status: "Published",
    comments: 3,
    date: "2026-07-28",
    price: 289000,
    beds: 4,
    baths: 3,
    sqft: 1724,
    propertyType: "Single Family",
    address: "102 Madera Dr, Waterbury, CT 06704",
    image: `${SHARIF_MEDIA_BASE}/2026/07/102-madera-dr-waterbury.jpg`,
  },
  {
    id: "p-2",
    title: "Off Market 3 bed 2 bath 1,410sqft 55 Willow St, New Britain, CT 06051",
    description:
      "Turnkey three bedroom with new roof and mechanicals. Currently tenant occupied at market rent, perfect buy-and-hold.",
    author: "Majeed",
    category: "Off Market",
    tags: ["off-market", "new-britain", "rental"],
    status: "Published",
    comments: 1,
    date: "2026-07-21",
    price: 234500,
    beds: 3,
    baths: 2,
    sqft: 1410,
    propertyType: "Single Family",
    address: "55 Willow St, New Britain, CT 06051",
    image: `${SHARIF_MEDIA_BASE}/2026/07/55-willow-st-new-britain.jpg`,
  },
  {
    id: "p-3",
    title: "Featured 5 bed 4 bath 3,280sqft 18 Harbor View Ln, Stamford, CT 06902",
    description:
      "Waterfront five bedroom with chef's kitchen, primary suite with harbor views and a finished lower level.",
    author: "Majeed",
    category: "Featured",
    tags: ["featured", "stamford", "waterfront"],
    status: "Published",
    comments: 8,
    date: "2026-06-30",
    price: 1450000,
    beds: 5,
    baths: 4,
    sqft: 3280,
    propertyType: "Single Family",
    address: "18 Harbor View Ln, Stamford, CT 06902",
    image: `${SHARIF_MEDIA_BASE}/2026/06/18-harbor-view-ln-stamford.jpg`,
  },
  {
    id: "p-4",
    title: "Retail Storefront 2,600sqft 740 Main St, Hartford, CT 06103",
    description:
      "Ground floor retail on Main Street with high foot traffic, two restrooms and rear loading access. NNN lease available.",
    author: "Majeed",
    category: "Commercial",
    tags: ["commercial", "hartford", "retail"],
    status: "Draft",
    comments: 0,
    date: "2026-06-12",
    price: 875000,
    beds: 0,
    baths: 2,
    sqft: 2600,
    propertyType: "Commercial",
    address: "740 Main St, Hartford, CT 06103",
    image: `${SHARIF_MEDIA_BASE}/2026/06/740-main-st-hartford.jpg`,
  },
  {
    id: "p-5",
    title: "For Rent 2 bed 2 bath 1,050sqft 300 Bank St #4B, Waterbury, CT 06702",
    description:
      "Renovated downtown loft rental with in-unit laundry, exposed brick and one covered parking space included.",
    author: "Majeed",
    category: "Rentals",
    tags: ["rental", "waterbury", "loft"],
    status: "Published",
    comments: 2,
    date: "2026-05-19",
    price: 2150,
    beds: 2,
    baths: 2,
    sqft: 1050,
    propertyType: "Condo",
    address: "300 Bank St #4B, Waterbury, CT 06702",
    image: `${SHARIF_MEDIA_BASE}/2026/05/300-bank-st-waterbury.jpg`,
  },
];

export type PostDraft = Omit<AdminPost, "id" | "comments" | "date" | "author"> &
  Partial<Pick<AdminPost, "author" | "date" | "comments">>;

type AdminContextValue = {
  user: AdminUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => { ok: boolean; message?: string };
  signOut: () => void;
  posts: AdminPost[];
  createPost: (draft: PostDraft) => AdminPost;
  updatePost: (id: string, draft: PostDraft) => void;
  deletePost: (id: string) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [posts, setPosts] = useState<AdminPost[]>(SEED_POSTS);

  useEffect(() => {
    setUser(readJson<AdminUser | null>(AUTH_KEY, null));
    setPosts(readJson<AdminPost[]>(POSTS_KEY, SEED_POSTS));
    setReady(true);
  }, []);

  const persistPosts = useCallback((next: AdminPost[]) => {
    setPosts(next);
    try {
      window.localStorage.setItem(POSTS_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return { ok: false, message: "Invalid email or password." };
    }
    const next: AdminUser = { email: ADMIN_EMAIL, name: "Majeed", role: "Administrator" };
    setUser(next);
    try {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(AUTH_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const createPost = useCallback(
    (draft: PostDraft) => {
      const post: AdminPost = {
        id: `p-${Date.now()}`,
        comments: 0,
        author: draft.author ?? "Majeed",
        date: draft.date ?? new Date().toISOString().slice(0, 10),
        ...draft,
      } as AdminPost;
      persistPosts([post, ...posts]);
      return post;
    },
    [persistPosts, posts],
  );

  const updatePost = useCallback(
    (id: string, draft: PostDraft) => {
      persistPosts(posts.map((post) => (post.id === id ? ({ ...post, ...draft } as AdminPost) : post)));
    },
    [persistPosts, posts],
  );

  const deletePost = useCallback(
    (id: string) => {
      persistPosts(posts.filter((post) => post.id !== id));
    },
    [persistPosts, posts],
  );

  const value = useMemo(
    () => ({ user, ready, signIn, signOut, posts, createPost, updatePost, deletePost }),
    [user, ready, signIn, signOut, posts, createPost, updatePost, deletePost],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
}

export function withImageFallback(event: React.SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.dataset.fallbackStep === "2") return;
  if (img.dataset.fallbackStep === "1") {
    img.dataset.fallbackStep = "2";
    img.src = FALLBACK_IMAGE_ALT;
    return;
  }
  img.dataset.fallbackStep = "1";
  img.src = FALLBACK_IMAGE;
}
