"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FLOATING_CTA } from "@/lib/story";

const ease = [0.22, 1, 0.36, 1] as const;

export function FloatingReserveCta() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const target = document.getElementById(FLOATING_CTA.targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { root: null, threshold: 0.12 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const scrollToReservation = () => {
    const target = document.getElementById(FLOATING_CTA.targetId);
    if (!target) return;
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.35, ease }}
          className="fixed bottom-5 right-4 z-50 sm:bottom-8 sm:right-6"
        >
          <button
            type="button"
            onClick={scrollToReservation}
            className="rounded-full bg-amber-800 px-5 py-3 text-sm font-medium text-amber-50 shadow-[0_12px_32px_-8px_rgba(120,53,15,0.55)] ring-1 ring-amber-900/10 transition hover:bg-amber-900 active:scale-[0.98] sm:px-6 sm:py-3.5 sm:text-[0.95rem]"
          >
            {FLOATING_CTA.label}
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
