import Link from "next/link";

// Rendered by notFound() when a slug doesn't match any post.
export default function PostNotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Post not found</h1>
      <p className="mt-2 text-foreground/60">
        That post may have been deleted or never existed.
      </p>
      <Link href="/" className="mt-6 inline-block underline">
        ← Back to all posts
      </Link>
    </div>
  );
}
