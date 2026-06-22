"use client";

import { useOptimistic, useTransition } from "react";
import { likePostAction } from "@/lib/actions";

// React 19 useOptimistic: the like count bumps instantly on click while the
// Server Action persists to disk. If the action throws, React rolls back.
export function LikeButton({
  slug,
  likes,
}: {
  slug: string;
  likes: number;
}) {
  const [optimisticLikes, addOptimistic] = useOptimistic(
    likes,
    (current) => current + 1,
  );
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          addOptimistic(null);
          await likePostAction(slug);
        })
      }
      className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 disabled:opacity-60 dark:border-white/20 dark:hover:bg-white/10"
    >
      <span aria-hidden>❤️</span>
      <span className="tabular-nums">{optimisticLikes}</span>
      <span className="text-foreground/60">likes</span>
    </button>
  );
}
