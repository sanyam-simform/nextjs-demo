import { Suspense } from "react";
import { getCachedPost } from "@/lib/cached";
import { QuickViewModal } from "./QuickViewModal";

type Params = Promise<{ slug: string }>;

// Intercepting route. When a post link is clicked from within the app (e.g. the
// home list), this renders the post as a quick-view modal instead of a full
// page navigation. A hard refresh on /posts/[slug] bypasses interception and
// shows the real page.
async function ModalBody({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getCachedPost(slug);
  if (!post) return null;

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">{post.title}</h2>
      <p className="mt-1 text-sm text-foreground/60">
        {post.author} · {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="prose-content mt-4 max-h-[50vh] overflow-y-auto text-sm text-foreground/90">
        {post.content}
      </p>
    </>
  );
}

export default function InterceptedPost({ params }: { params: Params }) {
  return (
    <QuickViewModal>
      <Suspense fallback={<p className="text-sm">Loading…</p>}>
        <ModalBody params={params} />
      </Suspense>
    </QuickViewModal>
  );
}
