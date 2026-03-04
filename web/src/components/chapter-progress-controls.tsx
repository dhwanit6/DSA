"use client";

import { useSyncExternalStore } from "react";
import {
  getProgressServerSnapshot,
  getProgressSnapshot,
  subscribeProgress,
  toggleChapterRead,
} from "@/lib/progress";

interface ChapterProgressControlsProps {
  slug: string;
}

export function ChapterProgressControls({ slug }: ChapterProgressControlsProps) {
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );

  const complete = progress.readChapters.includes(slug);

  return (
    <button
      type="button"
      onClick={() => toggleChapterRead(slug)}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
        complete
          ? "border-green-600/30 bg-green-500/10 text-green-300"
          : "border-border text-muted-fg hover:text-foreground hover:border-foreground/30"
      }`}
      aria-pressed={complete}
    >
      <span
        className={`h-2 w-2 rounded-full ${complete ? "bg-green-400" : "bg-muted-fg/50"}`}
        aria-hidden="true"
      />
      {complete ? "Marked Complete" : "Mark as Complete"}
    </button>
  );
}
