import fs from "fs";
import path from "path";

const repoRoot = path.resolve(process.cwd(), "..");
const contentRoots = ["phases", "interview", "fundamentals", "topics", "tracking"];

const markdownFiles = contentRoots.flatMap((folder) =>
  fs
    .readdirSync(path.join(repoRoot, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(repoRoot, folder, entry.name)),
);

const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
const errors = [];

for (const filePath of markdownFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativeFile = path.relative(repoRoot, filePath);

  for (const match of content.matchAll(linkPattern)) {
    const href = match[1]?.trim() ?? "";
    if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) {
      continue;
    }

    const cleanHref = href.split("#")[0].split("?")[0];
    if (!cleanHref.endsWith(".md")) continue;

    const resolved = path.resolve(path.dirname(filePath), cleanHref);
    if (!fs.existsSync(resolved)) {
      errors.push(`${relativeFile}: broken markdown link -> ${href}`);
    }
  }
}

if (errors.length > 0) {
  console.error("Content audit failed.\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Content audit passed for ${markdownFiles.length} markdown files.`);
