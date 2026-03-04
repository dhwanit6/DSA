"use client";

const STORAGE_KEY = "dsa-mastery-progress";

interface Progress {
  solvedProblems: string[];
  readChapters: string[];
  revisionMarks: string[];
  activity: Record<string, number>; // YYYY-MM-DD -> count
}

function getProgress(): Progress {
  if (typeof window === "undefined") return { solvedProblems: [], readChapters: [], revisionMarks: [], activity: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { solvedProblems: [], readChapters: [], revisionMarks: [], activity: {} };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      solvedProblems: parsed.solvedProblems || [],
      readChapters: parsed.readChapters || [],
      revisionMarks: parsed.revisionMarks || [],
      activity: parsed.activity || {},
    };
  } catch {
    return { solvedProblems: [], readChapters: [], revisionMarks: [], activity: {} };
  }
}

function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isProblemSolved(id: string): boolean {
  return getProgress().solvedProblems.includes(id);
}

export function toggleProblem(id: string): boolean {
  const progress = getProgress();
  const idx = progress.solvedProblems.indexOf(id);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  if (idx === -1) {
    progress.solvedProblems.push(id);
    progress.activity[today] = (progress.activity[today] || 0) + 1;
  } else {
    progress.solvedProblems.splice(idx, 1);
    // Optional: decrement activity? We'll leave it as actual solving effort counts.
  }
  
  // If marked for revision, unmark it when solved
  const revIdx = progress.revisionMarks.indexOf(id);
  if (revIdx !== -1 && idx === -1) {
    progress.revisionMarks.splice(revIdx, 1);
  }

  saveProgress(progress);
  return idx === -1;
}

export function isMarkedForRevision(id: string): boolean {
  return getProgress().revisionMarks.includes(id);
}

export function toggleRevisionMark(id: string): boolean {
  const progress = getProgress();
  const idx = progress.revisionMarks.indexOf(id);
  
  if (idx === -1) {
    progress.revisionMarks.push(id);
  } else {
    progress.revisionMarks.splice(idx, 1);
  }
  
  saveProgress(progress);
  return idx === -1;
}

export function getCurrentStreak(): number {
  const progress = getProgress();
  const activity = progress.activity;
  if (Object.keys(activity).length === 0) return 0;

  let streak = 0;
  const now = new Date();
  
  // Check up to 30 days back
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    if (activity[dateStr] && activity[dateStr] > 0) {
      streak++;
    } else if (i === 0) {
      // Missed today is fine, keep checking yesterday
      continue;
    } else {
      // Missed a previous day, streak broken
      break;
    }
  }
  return streak;
}

export function isChapterRead(slug: string): boolean {
  return getProgress().readChapters.includes(slug);
}

export function markChapterRead(slug: string): void {
  const progress = getProgress();
  if (!progress.readChapters.includes(slug)) {
    progress.readChapters.push(slug);
    saveProgress(progress);
  }
}

export function getStats(): { problemsSolved: number; chaptersRead: number } {
  const progress = getProgress();
  return {
    problemsSolved: progress.solvedProblems.length,
    chaptersRead: progress.readChapters.length,
  };
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getDashboardNudge(): { title: string; link: string; type: "revision" | "reading" | "solving" } {
  const progress = getProgress();

  // Priority 1: Revision items waiting
  if (progress.revisionMarks.length > 0) {
    return {
      title: `You have ${progress.revisionMarks.length} problem${progress.revisionMarks.length > 1 ? "s" : ""} marked for revision. Revisiting these will strengthen your recall.`,
      link: "/problems",
      type: "revision"
    };
  }

  // Priority 2: Brand new — haven't started reading
  if (progress.readChapters.length === 0) {
    return {
      title: "Welcome! The best place to begin is the 'Start Here' chapter — it takes about 10 minutes and sets up your entire learning path.",
      link: "/start-here",
      type: "reading"
    };
  }

  // Priority 3: Reading but haven't solved any problems yet
  if (progress.solvedProblems.length === 0) {
    return {
      title: "You've been reading — great. Now try solving 'Two Sum' to put that knowledge into practice.",
      link: "/problems",
      type: "solving"
    };
  }

  // Priority 4: Keep going
  return {
    title: "Good momentum. Pick up where you left off — consistency matters more than speed.",
    link: "/problems",
    type: "solving"
  };
}
