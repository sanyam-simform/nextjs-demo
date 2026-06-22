// Mock comments. Not persisted — generated per slug with an artificial delay so
// the detail page can stream them in via Suspense and unwrap with React's use().

export type Comment = { author: string; text: string };

const SAMPLE: Comment[] = [
  { author: "reader_42", text: "Great write-up, the cache tag example finally made it click." },
  { author: "devGrace", text: "Tried this in my own app — the updateTag read-your-writes is chef's kiss." },
  { author: "kernelpanic", text: "Renaming middleware to proxy threw me off at first, but it makes sense." },
];

export async function getComments(slug: string): Promise<Comment[]> {
  // Simulate a slow, uncached data source.
  await new Promise((r) => setTimeout(r, 900));
  // Vary count by slug length just so different posts differ.
  return SAMPLE.slice(0, (slug.length % 3) + 1);
}
