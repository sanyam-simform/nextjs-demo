# The Next Blog

A small but real **blog application** — create, read, update, delete posts, like them,
comment threads, an admin area, and login — built to exercise the **Next.js 16** feature
set as part of a working product rather than as isolated demos.

Same features as the sibling feature-showcase project, but here they do actual work:

| Next.js 16 feature | Where it earns its keep in this blog |
| --- | --- |
| **Turbopack** | Default dev/build bundler. `dev:webpack` script for the opt-out. |
| **Cache Components** (`use cache`) | The post list and each post are cached reads (`lib/cached.ts`) — instant navigation; PPR on every route. |
| **Refined Cache APIs** | `cacheTag("posts")` / `cacheTag("post:<slug>")` + `cacheLife("blog")`; create/edit/delete/like call `updateTag(...)` for read-your-writes. |
| **Proxy Middleware** (`proxy.ts`) | Gates `/admin/*` behind the `admin-auth` cookie, redirects legacy `/blog/:slug` → `/posts/:slug`, injects `x-blog-proxy`. |
| **Routing & Navigation** | Home list, dynamic `/posts/[slug]`, nested admin routes, **intercepting** quick-view modal, **programmatic** redirect after a Server Action. |
| **React 19 Hooks** | `useActionState` (post form validation), `useOptimistic` (Like button), `use()` (streamed comments), Server/Form Actions for all mutations. |
| **MCP DevTools** | `.mcp.json` registers `next-devtools-mcp`. |
| **Additional** | `generateMetadata` per post, streaming + Suspense, `loading.tsx`, `error.tsx`, `not-found.tsx`, Route Handler (`/api/posts`), `next/image`, `next/font`, async `params`/`cookies`/`headers`. |

---

## Setup

Requires **Node.js 20.9+**.

```bash
cd blog
npm install
npm run dev          # Turbopack, http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run dev:webpack` | Dev server (webpack opt-out) |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |

**Admin password:** `letmein` (set in `src/lib/auth.ts`, demo only).

Posts persist to `data/posts.json` (file-based store, survives restarts).

---

## Project structure

```
blog/
├─ data/posts.json                  # file-based store (seeded with 3 posts)
├─ .mcp.json                        # Next.js DevTools MCP
├─ next.config.ts                   # cacheComponents, cacheLife("blog"), images, turbopack.root
└─ src/
   ├─ proxy.ts                      # admin gate + legacy redirect + header
   ├─ lib/
   │  ├─ posts.ts                   # fs CRUD: get/create/update/delete/like
   │  ├─ cached.ts                  # getCachedPosts / getCachedPost ("use cache")
   │  ├─ actions.ts                 # Server Actions (CRUD + auth) + tag invalidation
   │  ├─ auth.ts                    # cookie helpers
   │  └─ comments.ts                # mock async comments (for use())
   ├─ components/                   # PostCard, PostForm, LikeButton, DeleteButton, Comments, AuthNav
   └─ app/
      ├─ layout.tsx                 # header nav, fonts, Metadata, @modal slot
      ├─ page.tsx                   # home: cached post list
      ├─ not-found.tsx
      ├─ posts/[slug]/              # detail: generateMetadata, like, streamed comments
      │  ├─ page.tsx  loading.tsx  not-found.tsx
      ├─ @modal/(.)posts/[slug]/    # intercepting quick-view modal
      ├─ admin/                     # CRUD dashboard (proxy-gated)
      │  ├─ page.tsx  error.tsx  new/page.tsx  [slug]/edit/page.tsx
      ├─ login/                     # useActionState login form
      └─ api/posts/route.ts         # JSON Route Handler
```

---

## How to test each feature

Run `npm run dev`, open `http://localhost:3000`.

- **Read (cached list + detail)** — home shows posts; click a card. Because the list is a
  cached, tagged read, navigation is instant and stays consistent across reloads.
- **Create** — `/admin` → "New post" (login with `letmein` when the proxy redirects you).
  Submit with empty fields to see `useActionState` validation; submit valid data → the
  Server Action writes to `posts.json`, `updateTag("posts")` invalidates the cache, and you
  are redirected to the new post (programmatic navigation).
- **Update** — edit any post from `/admin` or the post page; changes appear immediately
  (read-your-writes via `updateTag`).
- **Delete** — trash a post in `/admin`; the list revalidates and you stay on `/admin`.
- **Like** — click ❤️ on a post; the count bumps **optimistically** (`useOptimistic`) while
  the Server Action persists to disk.
- **Comments** — on a post, the comments section **streams in** after ~1s; the promise is
  created on the server and unwrapped client-side with `use()`.
- **Proxy** — visit `/admin` while logged out → redirected to `/login?from=/admin`. Visit a
  legacy `/blog/<slug>` URL → redirected to `/posts/<slug>`. Every matched response carries
  `x-blog-proxy: intercepted`.
- **Intercepting route** — clicking a post from the home list opens a **quick-view modal**;
  refreshing that URL shows the full page.
- **Metadata / Image / Font** — each post tab title is `"<post title> · The Next Blog"`;
  covers use `next/image`; fonts via `next/font`.
- **Route Handler** — `GET /api/posts` returns JSON; `GET /api/posts?slug=<slug>` one post.

Quick non-browser checks (dev server running):

```bash
curl -sI http://localhost:3000/posts/hello-nextjs-16 | grep -i x-blog-proxy        # proxy header
curl -s -o /dev/null -w "%{redirect_url}\n" http://localhost:3000/blog/hello-nextjs-16  # legacy redirect
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin                # 307 -> /login
curl -s http://localhost:3000/api/posts | head -c 80                                # JSON API
```

---

## Architectural decisions

- **Cache Components is opt-in.** Reads that should be fast are wrapped in `"use cache"`
  (`lib/cached.ts`) and **tagged**; every mutation in `lib/actions.ts` calls `updateTag()` so
  the UI reflects writes instantly (read-your-writes). Request-time data (auth cookie,
  comments, dynamic `params`) lives inside `<Suspense>` so it never blocks the static shell —
  that's why `AuthNav`, the article body, and comments are isolated components.
- **`proxy.ts`, not `middleware.ts`.** Auth and legacy redirects are a network-boundary
  concern, which is exactly what Next.js 16's `proxy.ts` models. The admin gate is enforced
  there; Server Actions still re-check `isAuthed()` as defense in depth.
- **File-based JSON store.** `data/posts.json` gives real, restart-surviving CRUD with zero
  database setup, keeping the focus on Next.js features. In production this layer would be
  swapped for a database — the `lib/posts.ts` interface wouldn't change.
- **Server Actions for all mutations.** No bespoke API routes for writes; forms post directly
  to `"use server"` functions, which keeps validation, persistence, cache invalidation, and
  redirect in one place.

---

## Status

`npm run build` succeeds (PPR `◐` on every route, Proxy active), `tsc --noEmit` and ESLint are
clean, and CRUD was verified end-to-end against the live server (create → visible in list /
detail / metadata, edit → title updated, like → incremented, delete → removed).
