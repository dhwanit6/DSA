import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CHAPTER_MAP, getOrderedChapterMeta, type ChapterMeta } from "@/lib/chapters";

interface Chapter {
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  content: string;
}

function resolveContentRoot(): string {
  const candidates = [
    path.resolve(process.cwd(), ".."), // when running from /web
    path.resolve(process.cwd()), // when running from repo root
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "phases", "start-here.md"))) {
      return candidate;
    }
  }

  return path.resolve(process.cwd(), "..");
}

const CONTENT_ROOT = resolveContentRoot();

export function getAllChapterMeta(): ChapterMeta[] {
  return getOrderedChapterMeta();
}

export function getChapterBySlug(slug: string): Chapter | null {
  const meta = CHAPTER_MAP[slug];
  if (!meta) return null;

  const filePath = path.join(CONTENT_ROOT, meta.path);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);

  return {
    slug,
    title: meta.title,
    description: meta.description,
    category: meta.category,
    order: meta.order,
    content,
  };
}

export function getAllSlugs(): string[] {
  return Object.keys(CHAPTER_MAP);
}

export function getChaptersByCategory(): Record<string, ChapterMeta[]> {
  const chapters = getAllChapterMeta();
  const grouped: Record<string, ChapterMeta[]> = {};
  for (const chapter of chapters) {
    if (!grouped[chapter.category]) grouped[chapter.category] = [];
    grouped[chapter.category].push(chapter);
  }
  return grouped;
}
