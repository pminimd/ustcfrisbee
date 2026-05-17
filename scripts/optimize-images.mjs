/**
 * 将 assets/*.png 转为 WebP，并同步 lib/image-meta.generated.ts（实测宽高）。
 */
import fs from "node:fs";
import path from "node:path";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import sharp from "sharp";

const root = process.cwd();
const assetsDir = path.join(root, "assets");
const outDir = path.join(root, "public", "jersey-web");
const metaOut = path.join(root, "lib", "image-meta.generated.ts");

const WIDTH_BY_FILE = {
  outline: 1400,
  final_version: 1600,
  加群二维码: 420,
};
const DEFAULT_MAX = 1200;

function stemOf(filename) {
  return filename.replace(/\.png$/i, "");
}

function maxWidthFor(stem) {
  return WIDTH_BY_FILE[stem] ?? DEFAULT_MAX;
}

async function shouldSkip(src, dest) {
  if (!fs.existsSync(dest)) return false;
  const [stSrc, stDst] = await Promise.all([stat(src), stat(dest)]);
  return stDst.mtimeMs >= stSrc.mtimeMs;
}

async function writeMetaFile(metaMap) {
  const entries = Object.entries(metaMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([stem, m]) =>
        `  ${JSON.stringify(stem)}: { width: ${m.width}, height: ${m.height}, file: ${JSON.stringify(m.file)} },`,
    )
    .join("\n");

  const content = `/** 自动生成 — 运行 npm run optimize:images 更新 */
export const GENERATED_IMAGE_META: Record<
  string,
  { width: number; height: number; file: string }
> = {
${entries}
};
`;
  await writeFile(metaOut, content, "utf8");
  console.log(`[meta] wrote ${path.relative(root, metaOut)} (${Object.keys(metaMap).length} files)`);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const names = (await readdir(assetsDir)).filter((n) => /\.png$/i.test(n));

  if (names.length === 0) {
    console.warn("optimize-images: no PNG files in assets/");
    return;
  }

  const metaMap = {};

  for (const name of names) {
    const src = path.join(assetsDir, name);
    const stem = stemOf(name);
    const dest = path.join(outDir, `${stem}.webp`);
    const maxW = maxWidthFor(stem);

    const { width, height } = await sharp(src).metadata();
    if (width && height) {
      metaMap[stem] = { width, height, file: name };
      console.log(
        `[dim] ${name} ${width}×${height} (${(width / height).toFixed(3)})`,
      );
    }

    if (await shouldSkip(src, dest)) {
      console.log(`[skip] ${name}`);
      continue;
    }

    await sharp(src)
      .rotate()
      .resize({
        width: maxW,
        height: maxW,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85, alphaQuality: 95, effort: 5 })
      .toFile(dest);

    const before = fs.statSync(src).size;
    const after = fs.statSync(dest).size;
    console.log(
      `[ok] ${name} → ${path.basename(dest)} (${(before / 1e6).toFixed(2)}MB → ${(after / 1e3).toFixed(0)}KB, max ${maxW}px)`,
    );
  }

  await writeMetaFile(metaMap);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
