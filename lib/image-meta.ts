import { GENERATED_IMAGE_META } from "./image-meta.generated";

export type ImageMeta = {
  width: number;
  height: number;
  /** 原始 PNG 文件名，如 front_v1.png */
  file: string;
};

const DEFAULT: ImageMeta = {
  width: 2304,
  height: 1728,
  file: "unknown.png",
};

/** 由 scripts/optimize-images.mjs 根据 assets 实测尺寸生成 */
export function getImageMeta(pngFile: string): ImageMeta {
  const stem = pngFile.replace(/\.png$/i, "");
  return GENERATED_IMAGE_META[stem] ?? { ...DEFAULT, file: pngFile };
}

export function imageAspectRatio(meta: ImageMeta) {
  return meta.width / meta.height;
}

/** 横版球衣稿 4:3 · 宽幅定稿 3:2 */
export function isWideJersey(meta: ImageMeta) {
  const r = imageAspectRatio(meta);
  return r >= 1.45;
}
