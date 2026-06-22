import type { Metadata } from "next";
import { createPostAction } from "@/lib/actions";
import { PostForm } from "@/components/PostForm";

export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">New post</h1>
      <PostForm action={createPostAction} submitLabel="Publish" />
    </div>
  );
}
