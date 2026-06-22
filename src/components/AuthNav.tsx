import Link from "next/link";
import { isAuthed } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

// Server Component reading the auth cookie. Renders Login or Logout depending
// on the admin-auth cookie. Rendered inside <Suspense> in the root layout.
export async function AuthNav() {
  const authed = await isAuthed();

  if (!authed) {
    return (
      <Link href="/login" className="hover:underline">
        Login
      </Link>
    );
  }

  return (
    <form action={logoutAction}>
      <button type="submit" className="hover:underline">
        Logout
      </button>
    </form>
  );
}
