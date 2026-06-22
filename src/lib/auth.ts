import { cookies } from "next/headers";

// Trivial demo auth: a single shared password sets an `admin-auth` cookie that
// the proxy checks. NOT real authentication — just enough to exercise the
// proxy boundary in a realistic way.

export const AUTH_COOKIE = "admin-auth";
export const AUTH_VALUE = "ok";
// In a real app this would be hashed and server-side. Demo only.
export const DEMO_PASSWORD = "letmein";

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value === AUTH_VALUE;
}
