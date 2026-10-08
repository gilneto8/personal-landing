import { motion, MotionConfig, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ease, fadeUp, stagger } from '../lib/motion';

const languages = [
  { label: 'Portuguese (native)', tone: 'var(--sun-400)' },
  { label: 'English (proficient)', tone: 'var(--aqua-300)' },
  { label: 'Spanish (elementary)', tone: 'var(--ink-500)' },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['18%', '0%']);

  return (
    <MotionConfig reducedMotion="user">
      <footer ref={ref} id="contact" className="relative overflow-hidden px-5 md:px-12 lg:px-20 pt-28 md:pt-40 pb-10">
        <div aria-hidden className="blob orbit-b w-[40vw] h-[40vw] -bottom-[10vw] -left-[10vw] bg-[var(--sun-400)] opacity-[0.08]" />

        <motion.div
          className="relative flex items-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="relative flex w-2.5 h-2.5">
            <span className="absolute inset-0 rounded-full bg-[var(--sun-400)] animate-ping opacity-60" />
            <span className="relative w-2.5 h-2.5 rounded-full bg-[var(--sun-400)]" />
          </span>
          <span data-thread className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--aqua-300)]">
            Available for fractional build: bank-data & accounting pipelines
          </span>
        </motion.div>

        <motion.h2
          style={{ x }}
          className="relative font-display font-bold text-[15vw] md:text-[11vw] leading-[0.86] tracking-[-0.05em] text-[var(--mist-50)] whitespace-nowrap"
        >
          Let's build<br />
          <span className="text-[var(--sun-400)]">something.</span>
        </motion.h2>

        <motion.div
          className="relative mt-12 md:mt-16 grid md:grid-cols-[1fr_auto] gap-8 items-end"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger(0.1)}
        >
          <motion.p variants={fadeUp} className="text-[var(--mist-200)] leading-relaxed max-w-xl">
            I take on fractional build work on bank-data and accounting pipelines. That means I ship the thing as well as shape it - architecture, the first working version, and the handover that lets someone else carry it. Remote-first (EU timezones), Lisbon-based. Hard problem that needs end-to-end judgement, infra to UI? Let's talk.
          </motion.p>
          <motion.a variants={fadeUp} href="mailto:gilneto8.work@gmail.com" className="btn btn-primary text-sm !py-5 !px-8">
            Start a conversation <span className="arrow">→</span>
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
          className="relative mt-20 h-px bg-[var(--ink-600)] origin-left"
        />
        <div className="relative pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 text-sm">
          <div className="flex items-center gap-6">
            <p className="font-mono text-xs text-[var(--aqua-300)]">© 2026 Gil Neto. All rights reserved.</p>
            <a href="/rss.xml" className="link-slide font-mono text-xs uppercase tracking-wider text-[var(--aqua-300)] hover:text-[var(--mist-50)] transition-colors">
              RSS
            </a>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[var(--mist-200)]">
            {languages.map((l) => (
              <span key={l.label} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: l.tone }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}
