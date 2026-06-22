"use client";

import { useTransition } from "react";
import { deletePostAction } from "@/lib/actions";

// Calls the delete Server Action with a confirmation. Uses useTransition for
// the pending state; the action redirects on success.
export function DeleteButton({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this post? This cannot be undone.")) {
          startTransition(() => deletePostAction(slug));
        }
      }}
      className="rounded-md border border-red-500/40 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-500/10 disabled:opacity-60"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
