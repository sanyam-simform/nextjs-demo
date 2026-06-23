// Seed data/posts.json from the jsonfakery blogs API.
//
//   node scripts/seed-from-api.mjs [count]
//
// Fetches blog records, maps each onto the app's Post shape, and writes them to
// data/posts.json. `featured_image` (an Unsplash URL) becomes the post cover, so
// images render reliably without depending on picsum.photos.

import { promises as fs } from "node:fs";
import path from "node:path";

const API = "https://jsonfakery.com/blogs";
const COUNT = Number(process.argv[2] ?? 12);
const OUT = path.join(process.cwd(), "data", "posts.json");

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Strip HTML to readable plain text (the page renders content in a <p>).
function htmlToText(html) {
  return html
    .replace(/<\/(p|h[1-6]|blockquote|li|div)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// Read the API JSON from stdin if piped (works around corporate TLS proxies
// that break Node's fetch); otherwise fetch directly.
async function loadRaw() {
  if (!process.stdin.isTTY) {
    const chunks = [];
    for await (const c of process.stdin) chunks.push(c);
    const text = Buffer.concat(chunks).toString("utf8").trim();
    if (text) return JSON.parse(text);
  }
  const res = await fetch(API);
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  return res.json();
}

const raw = await loadRaw();

const seen = new Set();
const posts = [];

for (const b of raw) {
  if (posts.length >= COUNT) break;

  let slug = slugify(b.title) || "post";
  let n = 2;
  while (seen.has(slug)) slug = `${slugify(b.title)}-${n++}`;
  seen.add(slug);

  const author = [b.user?.first_name, b.user?.last_name]
    .filter(Boolean)
    .join(" ") || "Anonymous";

  posts.push({
    id: b.id,
    slug,
    title: b.title,
    excerpt: b.summary?.trim() || b.subtitle?.trim() || "",
    content: htmlToText(b.main_content ?? ""),
    coverId: "1015", // legacy picsum fallback if cover is ever cleared
    cover: b.featured_image,
    author,
    createdAt: new Date(b.created_at ?? Date.now()).toISOString(),
    likes: 0,
  });
}

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, JSON.stringify(posts, null, 2), "utf8");
console.log(`Wrote ${posts.length} posts to ${OUT}`);
