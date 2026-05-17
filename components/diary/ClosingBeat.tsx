"use client";

import { motion } from "framer-motion";
import { WarmAssetImage } from "./WarmAssetImage";
import { CLOSING } from "@/lib/story";

const ease = [0.22, 1, 0.36, 1] as const;

export function ClosingBeat() {
  return (
    <footer className="bg-[#fdf8f3] px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease }}
          className="w-full"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <WarmAssetImage
              file={CLOSING.imageFile}
              alt={CLOSING.imageAlt}
              size="closing"
            />
          </motion.div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="mt-12 font-display text-2xl font-medium leading-snug text-stone-900 sm:text-3xl"
        >
          {CLOSING.line}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-stone-600"
        >
          {CLOSING.line2}
        </motion.p>
        <p className="font-handwriting mt-10 text-xl text-amber-800/75">
          {CLOSING.signoff}
        </p>
      </div>
    </footer>
  );
}
