"use client";

import { use } from "react";
import type { Comment } from "@/lib/comments";

// React 19 use(): unwraps a promise created on the server and passed as a prop.
// The parent wraps this in <Suspense>, so it suspends until comments resolve.
export function Comments({ promise }: { promise: Promise<Comment[]> }) {
  const comments = use(promise);

  if (comments.length === 0) {
    return <p className="text-sm text-foreground/60">No comments yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {comments.map((c, i) => (
        <li
          key={i}
          className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/15"
        >
          <span className="font-medium">{c.author}</span>
          <p className="mt-1 text-foreground/80">{c.text}</p>
        </li>
      ))}
    </ul>
  );
}
