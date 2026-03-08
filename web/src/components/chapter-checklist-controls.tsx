"use client";

import { useSyncExternalStore } from "react";
import type { ChecklistItem } from "@/lib/chapter-checklists";
import {
  getProgressServerSnapshot,
  getProgressSnapshot,
  isChecklistItemComplete,
  subscribeProgress,
  toggleChecklistItem,
} from "@/lib/progress";

interface ChapterChecklistControlsProps {
  slug: string;
  items: ChecklistItem[];
}

export function ChapterChecklistControls({ slug, items }: ChapterChecklistControlsProps) {
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );

  const completedCount = items.filter((item) => isChecklistItemComplete(progress, slug, item.id)).length;
  const totalCount = items.length;

  return (
    <section data-testid="chapter-checklist" className="mb-10 rounded-xl border border-border bg-surface-1 p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-fg">Execution Checklist</p>
          <p className="mt-1 text-sm text-foreground/85">
            {completedCount} / {totalCount} completed
          </p>
        </div>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-foreground/70 transition-all duration-500"
            style={{ width: `${totalCount === 0 ? 0 : (completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const completed = isChecklistItemComplete(progress, slug, item.id);
          return (
            <label
              key={item.id}
              data-testid="chapter-checklist-item"
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                completed
                  ? "border-green-600/30 bg-green-500/10 text-foreground/80"
                  : "border-border bg-background/60 hover:border-foreground/25"
              }`}
            >
              <input
                type="checkbox"
                checked={completed}
                onChange={() => toggleChecklistItem(slug, item.id)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border accent-green-500"
              />
              <span className={completed ? "line-through decoration-green-500/60 decoration-2" : ""}>
                {index + 1}. {item.text}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
