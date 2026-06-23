import { promises as fs } from "node:fs";
import path from "node:path";

// File-based JSON persistence. Real CRUD that survives server restarts, with
// no database setup. The JSON lives at <project>/data/posts.json.

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverId: string; // picsum.photos image id (legacy fallback)
  cover?: string; // full image URL (e.g. from the seeded API); preferred when set
  author: string;
  createdAt: string;
  likes: number;
};

export type PostInput = {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverId?: string;
  cover?: string;
};

// Resolve the cover image URL for a post: prefer an explicit full URL, else
// fall back to the legacy picsum.photos id. The optional width/height shape the
// picsum fallback; they're ignored when an explicit URL is present.
export function coverUrl(post: Post, width: number, height: number): string {
  if (post.cover) return post.cover;
  return `https://picsum.photos/id/${post.coverId}/${width}/${height}`;
}

const DATA_FILE = path.join(process.cwd(), "data", "posts.json");

async function readAll(): Promise<Post[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as Post[];
  } catch {
    return [];
  }
}

async function writeAll(posts: Post[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), "utf8");
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// --- Reads ------------------------------------------------------------------

export async function getPosts(): Promise<Post[]> {
  const posts = await readAll();
  return [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await readAll();
  return posts.find((p) => p.slug === slug) ?? null;
}

// --- Writes -----------------------------------------------------------------

export async function createPost(input: PostInput): Promise<Post> {
  const posts = await readAll();

  // Ensure a unique slug.
  let slug = slugify(input.title) || "post";
  let n = 2;
  while (posts.some((p) => p.slug === slug)) {
    slug = `${slugify(input.title)}-${n++}`;
  }

  const post: Post = {
    id: String(Date.now()),
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    coverId: input.coverId?.trim() || String(1000 + (posts.length % 80)),
    cover: input.cover?.trim() || undefined,
    author: input.author,
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  posts.push(post);
  await writeAll(posts);
  return post;
}

export async function updatePost(
  slug: string,
  input: PostInput,
): Promise<Post | null> {
  const posts = await readAll();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return null;

  posts[idx] = {
    ...posts[idx],
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    author: input.author,
    coverId: input.coverId?.trim() || posts[idx].coverId,
    cover: input.cover?.trim() || posts[idx].cover,
  };
  await writeAll(posts);
  return posts[idx];
}

export async function deletePost(slug: string): Promise<boolean> {
  const posts = await readAll();
  const next = posts.filter((p) => p.slug !== slug);
  if (next.length === posts.length) return false;
  await writeAll(next);
  return true;
}

export async function likePost(slug: string): Promise<number> {
  const posts = await readAll();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return 0;
  post.likes += 1;
  await writeAll(posts);
  return post.likes;
}
