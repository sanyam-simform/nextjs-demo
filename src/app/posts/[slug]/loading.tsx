// Loading UI for a post while it streams.
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 rounded bg-black/10 dark:bg-white/10" />
      <div className="mt-4 h-64 w-full rounded-xl bg-black/10 dark:bg-white/10" />
      <div className="mt-6 h-8 w-2/3 rounded bg-black/10 dark:bg-white/10" />
      <div className="mt-4 h-4 w-full rounded bg-black/10 dark:bg-white/10" />
      <div className="mt-2 h-4 w-5/6 rounded bg-black/10 dark:bg-white/10" />
    </div>
  );
}
