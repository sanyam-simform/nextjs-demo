import { Suspense } from "react";
import Link from "next/link";
import { getCachedPosts } from "@/lib/cached";
import { PostCard } from "@/components/PostCard";

// Home / main blog list. Reads the cached, tagged post list (use cache +
// cacheTag("posts")), so it serves instantly and revalidates when a post is
// created, edited, or deleted.
async function PostList() {
  const posts = await getCachedPosts();

  if (posts.length === 0) {
    return (
      <p className="text-foreground/60">
        No posts yet.{" "}
        <Link href="/admin/new" className="underline">
          Write the first one
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Latest posts</h1>
        <p className="mt-2 text-foreground/70">
          A tiny blog whose content is cached with Next.js 16 Cache Components
          and invalidated by tag on every edit.
        </p>
      </div>

      <Suspense fallback={<ListSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-xl border border-black/10 dark:border-white/15"
        />
      ))}
    </div>
  );
}
