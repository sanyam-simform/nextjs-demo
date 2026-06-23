import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCachedPost } from "@/lib/cached";
import { coverUrl } from "@/lib/posts";
import { getComments } from "@/lib/comments";
import { LikeButton } from "@/components/LikeButton";
import { Comments } from "@/components/Comments";

type Params = Promise<{ slug: string }>;

// Metadata API: per-post title/description generated from the cached post.
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

// The article body. Reads the cached post; param read is isolated here and the
// page wraps it in <Suspense>.
async function Article({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getCachedPost(slug);
  if (!post) notFound();

  return (
    <article>
      <Link href="/" className="text-sm text-foreground/60 hover:underline">
        ← All posts
      </Link>

      <Image
        src={coverUrl(post, 800, 320)}
        alt={post.title}
        width={800}
        height={320}
        priority
        className="mt-4 h-64 w-full rounded-xl object-cover"
      />

      <h1 className="mt-6 text-3xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-foreground/60">
        {post.author} · {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <p className="prose-content mt-6 text-foreground/90">{post.content}</p>

      <div className="mt-8 flex items-center gap-4">
        <LikeButton slug={post.slug} likes={post.likes} />
        <Link
          href={`/admin/${post.slug}/edit`}
          className="text-sm text-foreground/60 hover:underline"
        >
          Edit (admin)
        </Link>
      </div>

      {/* Streaming: comments come from a slow uncached source and stream in. */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">Comments</h2>
        <Suspense
          fallback={
            <p className="text-sm text-foreground/50">Loading comments…</p>
          }
        >
          <Comments promise={getComments(post.slug)} />
        </Suspense>
      </section>
    </article>
  );
}

export default function PostPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<p className="text-foreground/50">Loading post…</p>}>
      <Article params={params} />
    </Suspense>
  );
}
