"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WarmAssetImage } from "./WarmAssetImage";
import { EASTER_EGG } from "@/lib/story";

const ease = [0.22, 1, 0.36, 1] as const;

export function EasterEgg() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#fff7ef] px-5 py-20 sm:px-8 sm:py-28">
      <div className="pointer-events-none absolute right-[-20%] top-10 h-56 w-56 rotate-12 rounded-3xl bg-amber-100/40 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-10%] h-48 w-48 -rotate-6 rounded-full bg-orange-100/35 blur-2xl" />

      <div className="relative mx-auto max-w-2xl">
        <p className="text-center font-handwriting text-lg text-amber-800/85">
          {EASTER_EGG.eyebrow}
        </p>
        <h2 className="mt-2 text-center font-display text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
          {EASTER_EGG.title}
        </h2>
        <p className="mt-4 text-pretty text-center text-base leading-relaxed text-stone-600 sm:text-lg">
          {EASTER_EGG.teaser}
        </p>

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen((v) => !v)}
          className="mx-auto mt-8 flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-amber-900 shadow-[0_10px_30px_-12px_rgba(120,83,50,0.35)] ring-1 ring-amber-200/80 transition hover:bg-amber-50"
        >
          <span className="font-handwriting text-base">
            {open ? EASTER_EGG.buttonClose : EASTER_EGG.buttonOpen}
          </span>
        </motion.button>

        <AnimatePresence>
          {open ? (
            <motion.div
              key="egg"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.55, ease }}
              className="relative mt-12"
            >
              <div className="grid gap-8 sm:grid-cols-2 sm:items-start">
                <motion.div
                  initial={{ rotate: -2.5 }}
                  animate={{ rotate: -2 }}
                  transition={{ type: "spring", stiffness: 120, damping: 16 }}
                  className="justify-self-center sm:justify-self-end"
                >
                  <WarmAssetImage
                    file={EASTER_EGG.sleeveFile}
                    alt={EASTER_EGG.sleeveAlt}
                    size="scrapbook"
                    className="shadow-[0_24px_60px_-20px_rgba(62,42,28,0.35)]"
                  />
                </motion.div>
                <motion.div
                  initial={{ rotate: 3.5, y: 8 }}
                  animate={{ rotate: 3, y: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 16 }}
                  className="justify-self-center sm:-mt-6 sm:justify-self-start"
                >
                  <WarmAssetImage
                    file={EASTER_EGG.patternFile}
                    alt={EASTER_EGG.patternAlt}
                    size="scrapbook"
                    className="shadow-[0_22px_50px_-18px_rgba(62,42,28,0.28)]"
                  />
                </motion.div>
              </div>
              <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-stone-200/70 sm:p-6">
                <h3 className="font-display text-lg font-medium text-stone-900">
                  {EASTER_EGG.revealTitle}
                </h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-stone-600 sm:text-[0.95rem]">
                  {EASTER_EGG.revealBody}
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
