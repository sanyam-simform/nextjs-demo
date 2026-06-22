import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-8">
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Admin login</h1>
      <p className="mb-6 text-sm text-foreground/60">
        The admin area is gated by <code>proxy.ts</code>. Sign in to manage posts.
      </p>
      <LoginForm />
    </div>
  );
}
