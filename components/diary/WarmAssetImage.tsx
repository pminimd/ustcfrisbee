import Image from "next/image";
import { assetSrc } from "@/lib/assets";
import { getImageMeta } from "@/lib/image-meta";

export type AssetFrameSize = "hero" | "timeline" | "closing" | "scrapbook";

const FRAME_CLASS: Record<AssetFrameSize, string> = {
  hero: "mx-auto w-full max-w-[min(100%,28rem)]",
  timeline: "w-full",
  closing: "mx-auto w-full max-w-[min(100%,22rem)]",
  scrapbook: "mx-auto w-full max-w-[13.5rem] sm:max-w-[15rem]",
};

type Props = {
  file: string;
  alt: string;
  priority?: boolean;
  className?: string;
  size?: AssetFrameSize;
};

export function WarmAssetImage({
  file,
  alt,
  priority,
  className = "",
  size = "timeline",
}: Props) {
  const meta = getImageMeta(file);

  return (
    <div
      className={`${FRAME_CLASS[size]} rounded-[1.35rem] bg-white p-2 shadow-[0_18px_44px_-14px_rgba(90,62,38,0.2)] ring-1 ring-stone-200/90 ${className}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-[#f4f1ec]"
        style={{ aspectRatio: `${meta.width} / ${meta.height}` }}
      >
        <Image
          src={assetSrc(file)}
          alt={alt}
          width={meta.width}
          height={meta.height}
          className="h-full w-full object-contain"
          sizes={
            size === "hero"
              ? "(max-width: 768px) 92vw, 28rem"
              : size === "scrapbook"
                ? "(max-width: 768px) 42vw, 15rem"
                : size === "closing"
                  ? "(max-width: 768px) 88vw, 22rem"
                  : "(max-width: 768px) 92vw, 36rem"
          }
          priority={priority}
        />
      </div>
    </div>
  );
}
