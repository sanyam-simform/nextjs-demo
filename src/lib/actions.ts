"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import {
  createPost,
  updatePost,
  deletePost,
  likePost,
  type PostInput,
} from "@/lib/posts";
import { AUTH_COOKIE, AUTH_VALUE, DEMO_PASSWORD, isAuthed } from "@/lib/auth";

// Shape returned to useActionState on the post form.
export type PostFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof PostInput, string>>;
};

function parseAndValidate(formData: FormData): {
  data?: PostInput;
  errors: PostFormState["fieldErrors"];
} {
  const data: PostInput = {
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    coverId: String(formData.get("coverId") ?? "").trim(),
    cover: String(formData.get("cover") ?? "").trim(),
  };

  const errors: PostFormState["fieldErrors"] = {};
  if (data.title.length < 3) errors.title = "Title must be at least 3 characters.";
  if (data.excerpt.length < 10) errors.excerpt = "Excerpt must be at least 10 characters.";
  if (data.content.length < 20) errors.content = "Content must be at least 20 characters.";
  if (!data.author) errors.author = "Author is required.";

  if (Object.keys(errors).length > 0) return { errors };
  return { data, errors: {} };
}

// --- Create (Form Action + useActionState) ----------------------------------

export async function createPostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  if (!(await isAuthed())) {
    return { ok: false, message: "Not authorized." };
  }

  const { data, errors } = parseAndValidate(formData);
  if (!data) {
    return { ok: false, message: "Please fix the errors below.", fieldErrors: errors };
  }

  const post = await createPost(data);
  updateTag("posts"); // read-your-writes: list reflects the new post immediately

  // Programmatic navigation from a Server Action.
  redirect(`/posts/${post.slug}`);
}

// --- Update -----------------------------------------------------------------

export async function updatePostAction(
  slug: string,
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  if (!(await isAuthed())) {
    return { ok: false, message: "Not authorized." };
  }

  const { data, errors } = parseAndValidate(formData);
  if (!data) {
    return { ok: false, message: "Please fix the errors below.", fieldErrors: errors };
  }

  const updated = await updatePost(slug, data);
  if (!updated) return { ok: false, message: "Post not found." };

  updateTag("posts");
  updateTag(`post:${slug}`);
  redirect(`/posts/${updated.slug}`);
}

// --- Delete -----------------------------------------------------------------

export async function deletePostAction(slug: string): Promise<void> {
  if (!(await isAuthed())) return;
  await deletePost(slug);
  updateTag("posts");
  updateTag(`post:${slug}`);
  redirect("/admin");
}

// --- Like (useOptimistic) ---------------------------------------------------

export async function likePostAction(slug: string): Promise<number> {
  const likes = await likePost(slug);
  updateTag("posts");
  updateTag(`post:${slug}`);
  return likes;
}

// --- Auth -------------------------------------------------------------------

export async function loginAction(
  _prev: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string } | undefined> {
  const password = String(formData.get("password") ?? "");
  if (password !== DEMO_PASSWORD) {
    return { error: "Wrong password. Hint: letmein" };
  }
  const store = await cookies();
  store.set(AUTH_COOKIE, AUTH_VALUE, { httpOnly: true, path: "/" });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  redirect("/");
}
