"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { PostFormState } from "@/lib/actions";
import type { Post } from "@/lib/posts";

const initial: PostFormState = { ok: false, message: "" };

// Shared create/edit form driven by a Server Action through useActionState.
// The parent passes the bound action (create, or update bound to a slug).
export function PostForm({
  action,
  post,
  submitLabel,
}: {
  action: (prev: PostFormState, formData: FormData) => Promise<PostFormState>;
  post?: Post;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initial);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <p
          className={`rounded-md border px-4 py-2 text-sm ${
            state.ok
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <Field label="Title" error={errors.title}>
        <input
          name="title"
          defaultValue={post?.title}
          className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      </Field>

      <Field label="Author" error={errors.author}>
        <input
          name="author"
          defaultValue={post?.author}
          className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      </Field>

      <Field label="Cover image id (picsum.photos)" error={undefined}>
        <input
          name="coverId"
          defaultValue={post?.coverId}
          placeholder="e.g. 1015"
          className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      </Field>

      <Field label="Excerpt" error={errors.excerpt}>
        <input
          name="excerpt"
          defaultValue={post?.excerpt}
          className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      </Field>

      <Field label="Content" error={errors.content}>
        <textarea
          name="content"
          rows={8}
          defaultValue={post?.content}
          className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      </Field>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <Link href="/admin" className="text-sm hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
