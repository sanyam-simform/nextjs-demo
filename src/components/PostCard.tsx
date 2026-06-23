import Link from "next/link";
import Image from "next/image";
import { coverUrl, type Post } from "@/lib/posts";

// Card used on the home list. next/image optimizes the cover.
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-black/10 transition-colors hover:border-foreground/40 dark:border-white/15">
      <Link href={`/posts/${post.slug}`}>
        <Image
          src={coverUrl(post, 720, 280)}
          alt={post.title}
          width={720}
          height={280}
          className="h-44 w-full object-cover"
        />
        <div className="p-5">
          <h2 className="text-xl font-semibold group-hover:underline">
            {post.title}
          </h2>
          <p className="mt-1 text-sm text-foreground/70">{post.excerpt}</p>
          <p className="mt-3 text-xs text-foreground/50">
            {post.author} · {new Date(post.createdAt).toLocaleDateString()} ·{" "}
            {post.likes} likes
          </p>
        </div>
      </Link>
    </article>
  );
}
