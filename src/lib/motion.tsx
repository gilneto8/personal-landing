import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

export const ease = [0.16, 1, 0.3, 1] as const;

export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 30, mass: 1 },
  smooth: { type: 'spring', stiffness: 200, damping: 24, mass: 1 },
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } },
};

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/* Words rise out of a mask, one after another. */
export function MaskWords({
  text,
  className = '',
  delay = 0,
  gap = 0.06,
  inView = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  gap?: number;
  inView?: boolean;
}) {
  const words = text.split(' ');
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.6 } }
    : { initial: 'hidden', animate: 'visible' };
  return (
    <motion.span aria-label={text} className={className} variants={stagger(gap, delay)} {...trigger}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%' },
              visible: { y: '0%', transition: { duration: 0.9, ease } },
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* Statement text that lights up word by word as it scrolls through the viewport. */
export function ScrollLitText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <LitWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </LitWord>
      ))}
    </p>
  );
}

function LitWord({ children, progress, range }: { children: ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span aria-hidden style={{ opacity }} className="inline-block mr-[0.25em]">
      {children}
    </motion.span>
  );
}

/* Section eyebrow: yellow index + label + a rule that draws itself. */
export function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <motion.div
      className="flex items-center gap-4 mb-10 md:mb-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={stagger(0.08)}
    >
      <motion.span data-thread variants={fadeUp} className="font-display italic text-2xl text-[var(--sun-400)]">
        {index}
      </motion.span>
      <motion.span variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--aqua-300)]">
        {label}
      </motion.span>
      <motion.span
        className="flex-1 h-px bg-[var(--ink-600)]"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1.1, ease } } }}
      />
    </motion.div>
  );
}
