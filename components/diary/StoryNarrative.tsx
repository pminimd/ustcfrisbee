"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { STORY_BLOCKS, STORY_SECTION } from "@/lib/story";
import { WarmAssetImage } from "./WarmAssetImage";

const ease = [0.22, 1, 0.36, 1] as const;

function StoryImage({
  block,
}: {
  block: (typeof STORY_BLOCKS)[number];
}) {
  if (block.imageKind === "asset") {
    return (
      <WarmAssetImage
        file={block.file}
        alt={block.imageAlt}
        size="timeline"
        className="shadow-[0_20px_50px_-18px_rgba(82,56,36,0.18)]"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_50px_-18px_rgba(82,56,36,0.18)] ring-1 ring-stone-200/80">
      <motion.div
        className="relative aspect-[5/4] w-full"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={block.image}
          alt={block.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
    </div>
  );
}

export function StoryNarrative() {
  const lastIndex = STORY_BLOCKS.length - 1;

  return (
    <section className="bg-[#fdf8f3] px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="font-handwriting text-xl text-amber-800/85">
          {STORY_SECTION.eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
          {STORY_SECTION.title}
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-stone-600 sm:text-lg">
          {STORY_SECTION.intro}
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl bg-white/80 px-5 py-5 shadow-sm ring-1 ring-amber-100/80">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800/55">
            {STORY_SECTION.dualTheme.label}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-950 ring-1 ring-amber-200/80">
              {STORY_SECTION.dualTheme.professional}
            </span>
            <span className="font-handwriting text-lg text-amber-800/70">与</span>
            <span className="rounded-full bg-stone-50 px-4 py-1.5 text-sm font-medium text-stone-800 ring-1 ring-stone-200/80">
              {STORY_SECTION.dualTheme.memory}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {STORY_SECTION.dualTheme.bridge}
          </p>
        </div>
      </motion.div>

      <div className="mx-auto mt-16 max-w-3xl space-y-20 sm:mt-24 sm:space-y-28">
        {STORY_BLOCKS.map((block, i) => {
          const imageFirst = block.imageSide === "left";
          return (
            <motion.article
              key={block.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, delay: 0.05, ease }}
              className="grid gap-10 sm:gap-12 md:grid-cols-2 md:items-center"
            >
              <motion.div
                className={imageFirst ? "md:order-1" : "md:order-2"}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <StoryImage block={block} />
              </motion.div>

              <div className={imageFirst ? "md:order-2" : "md:order-1"}>
                <p className="text-xs font-semibold tracking-[0.2em] text-amber-800/60">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-2xl font-medium text-stone-900 sm:text-3xl">
                  {block.heading}
                </h3>
                <p className="mt-4 text-pretty text-base leading-relaxed text-stone-600 sm:text-[1.05rem]">
                  {block.body}
                </p>
                {block.bullets ? (
                  <ul className="mt-5 space-y-2.5 text-left">
                    {block.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm leading-relaxed text-stone-600 sm:text-[0.95rem]"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500/80"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {i === lastIndex ? (
                  <p className="font-handwriting mt-6 text-xl text-amber-800/80">
                    {STORY_SECTION.footerNote}
                  </p>
                ) : null}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
