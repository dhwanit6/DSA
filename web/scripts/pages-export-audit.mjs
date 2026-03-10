import fs from "fs";
import path from "path";

const outDir = path.resolve(process.cwd(), "out");
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(fullPath);
    }
  }
}

if (!fs.existsSync(outDir)) {
  console.error("Pages export audit failed: out/ directory is missing.");
  process.exit(1);
}

walk(outDir);

const badRootPathPattern = /(?:href|src)="\/(?!DSA\/)/g;
const errors = [];

for (const filePath of htmlFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const matches = content.match(badRootPathPattern);
  if (!matches) continue;
  errors.push(`${path.relative(process.cwd(), filePath)} contains root-relative asset or route paths without /DSA prefix.`);
}

if (errors.length > 0) {
  console.error("Pages export audit failed.\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Pages export audit passed for ${htmlFiles.length} HTML files.`);
