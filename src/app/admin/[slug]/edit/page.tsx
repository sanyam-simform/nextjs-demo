import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCachedPost } from "@/lib/cached";
import { updatePostAction } from "@/lib/actions";
import { PostForm } from "@/components/PostForm";

type Params = Promise<{ slug: string }>;

export const metadata: Metadata = { title: "Edit post" };

async function EditForm({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getCachedPost(slug);
  if (!post) notFound();

  // Bind the slug to the update action so PostForm gets a (prev, formData)
  // signature. Binding a Server Action is supported and keeps it server-side.
  const action = updatePostAction.bind(null, slug);

  return <PostForm action={action} post={post} submitLabel="Save changes" />;
}

export default function EditPostPage({ params }: { params: Params }) {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Edit post</h1>
      <Suspense fallback={<p className="text-foreground/50">Loading…</p>}>
        <EditForm params={params} />
      </Suspense>
    </div>
  );
}
