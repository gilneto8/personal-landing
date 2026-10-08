import { AnimatePresence, motion, MotionConfig, useScroll, useTransform } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ease, fadeUp, stagger } from '../lib/motion';

const rotating = ['agent memory', 'eval harnesses', 'retrieval that says "not found"', 'B2B utilities', 'infra to UI, solo'];

function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % rotating.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex overflow-hidden align-bottom h-[1.15em]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          className="italic text-[var(--sun-400)] whitespace-nowrap"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1, transition: { duration: 0.7, ease } }}
          exit={{ y: '-100%', opacity: 0, transition: { duration: 0.5, ease } }}
        >
          {rotating[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%']);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const letters = 'Gil Neto'.split('');

  return (
    <MotionConfig reducedMotion="user">
      <section ref={ref} id="top" className="relative min-h-[100svh] flex flex-col overflow-hidden">
        {/* ambient light */}
        <motion.div style={{ y: blobY }} aria-hidden className="absolute inset-0">
          <div className="blob orbit-a w-[60vw] h-[60vw] -top-[20vw] -right-[12vw] bg-[var(--aqua-300)] opacity-[0.14]" />
          <div className="blob orbit-b w-[45vw] h-[45vw] top-[25%] -left-[15vw] bg-[var(--ink-600)] opacity-90" />
          <div className="blob orbit-a w-[22vw] h-[22vw] bottom-[5%] right-[25%] bg-[var(--sun-400)] opacity-[0.07]" />
        </motion.div>

        <div className="relative z-10 flex-1 flex flex-col justify-end px-5 md:px-12 lg:px-20 pt-28 pb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.1 } }}
            className="inline-flex self-start items-center gap-2.5 mb-6 md:mb-8 px-4 py-2 rounded-full border border-[var(--ink-600)] bg-[var(--ink-900)]/40 backdrop-blur text-[10px] md:text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--aqua-300)]"
          >
            <span className="relative flex w-2 h-2 shrink-0">
              <span className="absolute inset-0 rounded-full bg-[var(--sun-400)] animate-ping opacity-60" />
              <span className="relative w-2 h-2 rounded-full bg-[var(--sun-400)]" />
            </span>
            Open: fractional build · bank-data & accounting pipelines
          </motion.div>

          {/* the name fills the width — no dead space */}
          <motion.h1
            aria-label="Gil Neto"
            style={{ y: nameY, opacity: nameOpacity }}
            className="font-display font-normal leading-[0.85] tracking-[-0.035em] text-[var(--mist-50)] text-[27vw] md:text-[19vw] whitespace-nowrap -ml-[0.03em]"
          >
            {letters.map((c, i) => (
              <span key={i} aria-hidden className={`inline-block overflow-hidden align-bottom pb-[0.06em] ${i > 3 ? 'italic pr-[0.06em] -mr-[0.06em]' : ''}`}>
                <motion.span
                  className="inline-block"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%', transition: { duration: 1.2, ease, delay: 0.15 + i * 0.06 } }}
                >
                  {c === ' ' ? ' ' : c}
                </motion.span>
              </span>
            ))}
            <motion.span
              aria-hidden
              className="inline-block text-[var(--sun-400)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { type: 'spring', stiffness: 500, damping: 18, delay: 0.75 } }}
            >
              .
            </motion.span>
          </motion.h1>

          <motion.div
            className="mt-8 md:mt-10 grid md:grid-cols-[1.1fr_1fr] gap-7 md:gap-16 items-end"
            initial="hidden"
            animate="visible"
            variants={stagger(0.1, 0.55)}
          >
            <motion.div variants={fadeUp}>
              <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-[var(--aqua-300)] mb-3">
                Founder-Engineer & Senior Software Engineer, AI Products
              </p>
              <p className="font-display text-[2.2rem] md:text-6xl leading-[1.05] text-[var(--mist-50)]">
                I build <br className="md:hidden" />
                <Rotator />
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-[var(--mist-200)] leading-relaxed text-[15px] md:text-base">
                Senior engineer, 12 years. I build LLM-backed systems where the model does judgment and deterministic code does correctness. Most of that work now sits in memory: how an agent captures what it learns, where that knowledge lives, how it comes back, and what stops it confidently repeating something that stopped being true. I run my own second brain on those rules, and I ship B2B utilities end-to-end — infrastructure to UI — solo.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="md:col-span-2 flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap gap-3">
                <a href="#projects" className="btn btn-primary">View my work <span className="arrow">→</span></a>
                <a href="mailto:gilneto8.work@gmail.com" className="btn btn-ghost">Let's talk <span className="arrow">→</span></a>
                <a href="/blog" className="btn btn-ghost">Read the blog <span className="arrow">→</span></a>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[var(--aqua-300)]">
                <a href="mailto:gilneto8.work@gmail.com" className="link-slide flex items-center gap-2 hover:text-[var(--mist-50)] transition-colors"><Mail size={15} /> gilneto8.work@gmail.com</a>
                <a href="https://github.com/gilneto8" target="_blank" rel="noopener noreferrer" className="link-slide flex items-center gap-2 hover:text-[var(--mist-50)] transition-colors"><Github size={15} /> GitHub</a>
                <a href="https://www.linkedin.com/in/gil-neto-7b44946a" target="_blank" rel="noopener noreferrer" className="link-slide flex items-center gap-2 hover:text-[var(--mist-50)] transition-colors"><Linkedin size={15} /> LinkedIn</a>
                <span className="flex items-center gap-2"><MapPin size={15} className="text-[var(--sun-400)]" /> Lisbon, PT</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* scroll cue: a saffron bead travelling down a hairline */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.4, duration: 0.8 } }}
          className="hidden md:flex absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex-col items-center"
        >
          <span className="relative w-px h-14 bg-[var(--ink-500)]/60 overflow-hidden">
            <motion.span
              className="absolute left-[-1.5px] w-[4px] h-[4px] rounded-full bg-[var(--sun-400)]"
              animate={{ top: ['-10%', '110%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            />
          </span>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
