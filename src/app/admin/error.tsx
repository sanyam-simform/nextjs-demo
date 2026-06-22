"use client";

// Error boundary for the admin segment. Catches render/action errors and lets
// the user recover with reset().
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-12">
      <h1 className="text-2xl font-bold text-red-600">Admin error</h1>
      <pre className="mt-3 overflow-x-auto rounded-md border border-red-500/40 bg-red-500/5 p-3 text-sm">
        {error.message}
      </pre>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background"
      >
        Try again
      </button>
    </div>
  );
}
