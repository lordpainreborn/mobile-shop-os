"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const cubicEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: cubicEase,
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: "blur(4px)",
    transition: {
      duration: 0.4,
      ease: cubicEase,
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
