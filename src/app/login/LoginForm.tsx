"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

// Login form driven by a Server Action via useActionState. On success the
// action sets the admin-auth cookie and redirects to /admin.
export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          autoFocus
          className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-xs text-foreground/50">Demo password: letmein</p>
    </form>
  );
}
