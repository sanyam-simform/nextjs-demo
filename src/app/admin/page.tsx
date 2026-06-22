import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getCachedPosts } from "@/lib/cached";
import { DeleteButton } from "@/components/DeleteButton";

export const metadata: Metadata = { title: "Admin" };

// This whole route is gated by proxy.ts (admin-auth cookie). The list reads the
// same cached, tagged posts as the public site; writes invalidate the tag.
async function AdminList() {
  const posts = await getCachedPosts();

  if (posts.length === 0) {
    return <p className="text-foreground/60">No posts. Create one above.</p>;
  }

  return (
    <ul className="divide-y divide-black/10 rounded-xl border border-black/10 dark:divide-white/10 dark:border-white/15">
      {posts.map((post) => (
        <li key={post.id} className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <Link
              href={`/posts/${post.slug}`}
              className="truncate font-medium hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-xs text-foreground/50">
              {post.author} · {post.likes} likes
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/admin/${post.slug}/edit`}
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Edit
            </Link>
            <DeleteButton slug={post.slug} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
        <Link
          href="/admin/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          + New post
        </Link>
      </div>

      <Suspense fallback={<p className="text-foreground/50">Loading…</p>}>
        <AdminList />
      </Suspense>
    </div>
  );
}
