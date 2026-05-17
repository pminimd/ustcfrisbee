"use client";

import { motion } from "framer-motion";
import { WarmAssetImage } from "./WarmAssetImage";
import type { EvolutionChapter } from "@/lib/story";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  chapter: EvolutionChapter;
  priorityFirstImage?: boolean;
};

export function EvolutionTrack({ chapter, priorityFirstImage }: Props) {
  const singleStep = chapter.steps.length === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease }}
      className="border-t border-amber-100/80 pt-16 first:border-t-0 first:pt-0 md:pt-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-handwriting text-xl text-amber-800/85">{chapter.eyebrow}</p>
        <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-stone-900 sm:text-3xl">
          {chapter.title}
        </h3>
        <p className="mt-3 text-pretty text-base leading-relaxed text-stone-600 sm:text-lg">
          {chapter.intro}
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-xl md:mt-16">
        {!singleStep ? (
          <div className="absolute bottom-2 left-[0.65rem] top-2 w-px bg-gradient-to-b from-amber-300 via-amber-200/70 to-amber-100/30" />
        ) : null}

        <div className={singleStep ? "space-y-0" : "space-y-14 md:space-y-20"}>
          {chapter.steps.map((step, i) => (
            <motion.article
              key={step.file}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.85, delay: i * 0.05, ease }}
              className={singleStep ? "relative" : "relative pl-10"}
            >
              {!singleStep ? (
                <span className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-amber-900 shadow-sm ring-2 ring-amber-100">
                  {i + 1}
                </span>
              ) : null}

              <div className="rounded-2xl bg-white/90 p-4 shadow-[0_14px_36px_-14px_rgba(82,56,36,0.16)] ring-1 ring-stone-200/80 sm:p-5">
                <h4 className="font-display text-lg font-medium text-stone-900 sm:text-xl">
                  {step.title}
                </h4>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-stone-600 sm:text-[0.95rem]">
                  {step.note}
                </p>
                <motion.div
                  className="mt-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                >
                  <WarmAssetImage
                    file={step.file}
                    alt={step.title}
                    priority={priorityFirstImage && i === 0}
                    size="timeline"
                  />
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
