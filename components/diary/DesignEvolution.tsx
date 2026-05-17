"use client";

import { motion } from "framer-motion";
import { DESIGN_EVOLUTION } from "@/lib/story";
import { EvolutionTrack } from "./EvolutionTrack";

const ease = [0.22, 1, 0.36, 1] as const;

export function DesignEvolution() {
  const { sectionEyebrow, sectionTitle, sectionIntro, chapters } = DESIGN_EVOLUTION;

  return (
    <section id="evolution" className="bg-[#fffaf5] px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="font-handwriting text-xl text-amber-800/85">{sectionEyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
          {sectionTitle}
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-stone-600 sm:text-lg">
          {sectionIntro}
        </p>
      </motion.div>

      <div className="mx-auto mt-16 max-w-3xl space-y-4 md:mt-24">
        {chapters.map((chapter, i) => (
          <EvolutionTrack
            key={chapter.id}
            chapter={chapter}
            priorityFirstImage={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
