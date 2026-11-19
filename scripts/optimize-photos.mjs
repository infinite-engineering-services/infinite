// Compresses the stock photos in scripts/photo-src/*.jpg into
// public/photos/<name>.webp (1600 px) and <name>-800.webp, cropped to 3:2.
// Usage: npm run photos
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const src = path.resolve("scripts/photo-src");
const out = path.resolve("public/photos");
await mkdir(out, { recursive: true });

for (const file of (await readdir(src)).filter((f) => f.endsWith(".jpg"))) {
  const name = path.basename(file, ".jpg");
  for (const [w, suffix] of [
    [1600, ""],
    [800, "-800"],
  ]) {
    const info = await sharp(path.join(src, file))
      .resize({ width: w, height: Math.round((w * 2) / 3), fit: "cover", position: "attention" })
      .webp({ quality: 74, effort: 5 })
      .toFile(path.join(out, `${name}${suffix}.webp`));
    console.log(`${name}${suffix}.webp  ${(info.size / 1024).toFixed(0)} KB`);
  }
}
