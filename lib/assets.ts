/** Optimized WebP in public/jersey-web/ (see scripts/optimize-images.mjs). */
export function assetSrc(pngFile: string) {
  const stem = pngFile
    .split("/")
    .filter(Boolean)
    .join("/")
    .replace(/\.png$/i, "");
  return `/jersey-web/${stem}.webp`;
}
