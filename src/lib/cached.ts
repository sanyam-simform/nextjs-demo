import { cacheLife, cacheTag } from "next/cache";
import { getPosts, getPost, type Post } from "@/lib/posts";

// Cached reads. The post list and individual posts are cached with the "blog"
// cacheLife profile and tagged so Server Actions can invalidate them:
//   - "posts"         → the whole list
//   - "post:<slug>"   → a single post
// On a cache hit the JSON file is not read again until the tag is invalidated
// (updateTag) or the cacheLife window elapses.

export async function getCachedPosts(): Promise<Post[]> {
  "use cache";
  cacheTag("posts");
  cacheLife("blog");
  return getPosts();
}

export async function getCachedPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag(`post:${slug}`);
  cacheLife("blog");
  return getPost(slug);
}
