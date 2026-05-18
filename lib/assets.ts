/** Optimized WebP in public/jersey-web/ (see scripts/optimize-images.mjs). */
export function assetStem(file: string) {
  return file
    .split("/")
    .filter(Boolean)
    .join("/")
    .replace(/\.(png|jpe?g)$/i, "");
}

export function assetSrc(file: string) {
  return `/jersey-web/${assetStem(file)}.webp`;
}
