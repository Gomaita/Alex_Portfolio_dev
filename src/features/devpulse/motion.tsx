import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const motionTokens = {
  duration: { feedback: 0.12, route: 0.2, panel: 0.22, reveal: 0.5 },
  ease: [0.2, 0.8, 0.2, 1] as const,
  spring: { stiffness: 300, damping: 30 },
  stagger: 0.03,
};
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: reduced ? 0 : motionTokens.duration.reveal,
        ease: motionTokens.ease,
        delay: reduced ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
