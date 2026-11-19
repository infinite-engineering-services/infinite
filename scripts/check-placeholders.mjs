// Lists sample content that must be replaced before launch.
// Usage: npm run check:placeholders          (report only)
//        npm run check:placeholders -- --strict  (exit 1 if any remain, e.g. in CI)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const dirs = ["config", "content", "app"];
const hits = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(name)) {
      readFileSync(p, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (/PLACEHOLDER|placeholder: true/.test(line)) hits.push(`${relative(root, p)}:${i + 1}  ${line.trim()}`);
        });
    }
  }
}
dirs.forEach((d) => walk(join(root, d)));

if (!hits.length) {
  console.log("✓ No placeholders left.");
  process.exit(0);
}
console.log(`⚠ ${hits.length} placeholder markers found:\n`);
console.log(hits.join("\n"));
if (process.argv.includes("--strict")) process.exit(1);
