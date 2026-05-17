"use client";

import { motion } from "framer-motion";
import { WarmAssetImage } from "./WarmAssetImage";
import { HERO } from "@/lib/story";

const ease = [0.22, 1, 0.36, 1] as const;

export function WarmHero() {
  return (
    <section className="relative overflow-hidden bg-[#fffaf5] px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-orange-100/40 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-rose-100/30 blur-2xl" />

      <div className="relative mx-auto flex max-w-lg flex-col items-center text-center lg:max-w-5xl lg:flex-row lg:items-center lg:gap-16 lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="order-2 mt-12 w-full lg:order-1 lg:mt-0 lg:flex-1 lg:max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <WarmAssetImage
              file={HERO.heroFile}
              alt={HERO.heroImageAlt}
              priority
              size="hero"
            />
          </motion.div>
        </motion.div>

        <div className="order-1 max-w-xl lg:order-2 lg:flex-1">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="font-handwriting text-lg text-amber-800/90"
          >
            {HERO.kicker}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease }}
            className="mt-3 text-balance font-display text-[clamp(1.85rem,5.5vw,2.85rem)] font-medium leading-[1.12] tracking-tight text-stone-900"
          >
            {HERO.titleLines[0]}
            <br />
            {HERO.titleLines[1]}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease }}
            className="mt-6 text-pretty text-lg leading-relaxed text-stone-600 sm:text-xl"
          >
            {HERO.lead}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.32, ease }}
            className="mt-4 text-pretty text-base leading-relaxed text-stone-500"
          >
            {HERO.sub}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
