"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

// Overlay shell for the intercepted quick-view. Closing navigates back, which
// clears the @modal slot (returns to @modal/default.tsx).
export function QuickViewModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => router.back()}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-black/10 bg-background p-6 shadow-xl dark:border-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-6 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background"
        >
          Close
        </button>
      </div>
    </div>
  );
}
