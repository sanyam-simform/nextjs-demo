import { NextResponse } from "next/server";
import { getPosts } from "@/lib/posts";

// Route Handler exposing the posts as JSON. Demonstrates app/api/*/route.ts.
//   GET /api/posts        -> all posts
//   GET /api/posts?slug=x -> single post
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const posts = await getPosts();

  if (slug) {
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  }

  return NextResponse.json({ count: posts.length, posts });
}
