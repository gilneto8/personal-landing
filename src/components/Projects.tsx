import { motion, MotionConfig, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Eyebrow, MaskWords, ease } from '../lib/motion';

const projects = [
  {
    title: 'Second Brain',
    status: 'Running Daily',
    url: '/blog',
    tagline: 'Persistent Memory for an LLM Agent',
    description: 'A markdown knowledge base an LLM agent reads and writes as its long-term memory, in use every day since Jan 2026. The prompts were never the hard part. Capture that cannot be skipped, routing that happens on a schedule rather than when someone remembers, retrieval in two rungs (generated indexes for state, vector search for a specific fact), and a scored nightly eval that catches the index lying before I act on it. Two published write-ups, both with the real numbers rather than the flattering ones.',
    infra: 'Lifecycle hooks enforce capture and checkpointing outside the model, so a skipped save is structurally impossible rather than discouraged. A nightly batch routes the inbox, regenerates every index, runs a scored eval against a fixed question set, and audits the previous day\'s work for drift. Context reads are capped and the cost per night is a tracked number.',
    tech: ['LLM Agents', 'Lifecycle Hooks', 'Vector Search', 'Eval Harness', 'Python', 'systemd'],
  },
  {
    title: 'Kelaro',
    status: 'Live · Closed Beta',
    url: 'https://kelaro.io',
    tagline: 'Accounting-Automation SaaS',
    description: 'B2B SaaS for fractional CFOs and accountants. Ingests bank PDFs and Open Banking (PSD2) feeds, runs deterministic extraction via an internal engine (Koa) orchestrated by Temporal, and emits accountant-ready datasets. The model may explain a number. It never produces one. Active pilot: PT chartered accountant. NL pending.',
    infra: 'Next.js + Postgres 16 + Temporal workflows. Stripe integration with founder-discount pipeline (coupons, promo codes, 30-day trial). Admin dashboard for Users / Waitlist / Promo Codes / MRR. OAuth 2.0 against GCP and Azure Entra ID enterprise tenants.',
    tech: ['Next.js', 'TypeScript', 'Temporal', 'PostgreSQL', 'Stripe', 'OAuth 2.0', 'PSD2'],
  },
  {
    title: 'Koa',
    status: 'Engine',
    url: null,
    tagline: 'Deterministic Document Extraction — the Alternative to Vision-LLM',
    description: 'Config-driven extraction system that turns bank-statement PDFs into structured JSON. Built deliberately against the vision-LLM approach: balances have to reconcile and the engine refuses loudly when they don\'t, rather than returning a plausible total. A confidence score is not a proof. Three components: a Python/FastAPI engine, a Next.js + Prisma mapper UI for authoring per-bank templates, and an isolated PII scrub container. Powers Kelaro\'s extraction pipeline.',
    infra: 'Python 3.12 / FastAPI with pdfplumber + pikepdf for native PDFs and Tesseract / PaddleOCR fallback for scans. Pydantic schemas end-to-end. mypy strict, ruff, CI-gated, auto-deployed via GitHub Actions on push to release branch.',
    tech: ['Python 3.12', 'FastAPI', 'Pydantic', 'pdfplumber', 'PaddleOCR', 'Next.js', 'Prisma', 'Docker'],
  },
];

type Project = (typeof projects)[number];

function Panel({ p, i }: { p: Project; i: number }) {
  const Title = p.url ? 'a' : 'span';
  return (
    <article
      className={`group relative shrink-0 w-full md:h-[72vh] rounded-[2rem] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.45)] p-7 md:p-12 grid md:grid-cols-[1fr_1.15fr] gap-8 md:gap-14 overflow-hidden border border-[var(--ink-500)]/40 ${
        i % 2 ? 'bg-[var(--ink-700)]' : 'bg-[var(--ink-600)]'
      }`}
    >
      <div className="relative flex flex-col">
        <span className="self-start flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--sun-400)] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--sun-400)] shadow-[0_0_10px_var(--sun-400)]" />
          {p.status}
        </span>
        <h3 className="font-display text-6xl md:text-[6.5vw] leading-[0.9] tracking-[-0.02em] text-[var(--mist-50)] mb-4">
          <Title
            {...(p.url ? { href: p.url, target: p.url.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' } : {})}
            className={p.url ? 'hover:text-[var(--sun-400)] transition-colors duration-300' : ''}
          >
            {p.title}
            {p.url && <span className="text-[var(--sun-400)] text-[0.5em] align-top ml-2 inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">↗</span>}
          </Title>
        </h3>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--aqua-300)] max-w-[32ch]">{p.tagline}</p>
        <span aria-hidden className="hidden md:block mt-auto font-display italic text-[11vw] leading-[0.75] text-[var(--ink-500)]/50 group-hover:text-[var(--sun-400)]/70 transition-colors duration-700 select-none">
          0{i + 1}
        </span>
      </div>
      <div className="relative flex flex-col gap-5 md:overflow-y-auto md:pr-2">
        <p className="text-[var(--mist-200)] leading-relaxed text-[15px]">{p.description}</p>
        <div className="rounded-2xl bg-[var(--ink-800)]/70 p-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--sun-400)] block mb-2">Infrastructure</span>
          <p className="text-[13px] text-[var(--mist-200)]/85 leading-relaxed">{p.infra}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <span key={t} className="text-[11px] px-3 py-1 rounded-full border border-[var(--ink-500)] text-[var(--aqua-300)] font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return desktop;
}

/* Desktop: cards pin one after another and stack like a deck; the one underneath sinks back. */
function StackCard({ p, i, progress }: { p: Project; i: number; progress: MotionValue<number> }) {
  const n = projects.length;
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.05]);
  const dim = useTransform(progress, [i / n, (i + 1) / n], [0, i < n - 1 ? 0.35 : 0]);
  return (
    <div className="sticky h-[88vh] flex items-start" style={{ top: `calc(11vh + ${i * 22}px)` }}>
      <motion.div style={{ scale }} className="relative w-full origin-top">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, ease }}
        >
          <Panel p={p} i={i} />
        </motion.div>
        <motion.div style={{ opacity: dim }} className="absolute inset-0 rounded-[2rem] bg-[var(--ink-950)] pointer-events-none" />
      </motion.div>
    </div>
  );
}

function StackedCards() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <div ref={ref} className="relative px-12 lg:px-20 pb-[10vh]">
      {projects.map((p, i) => (
        <StackCard key={p.title} p={p} i={i} progress={scrollYProgress} />
      ))}
    </div>
  );
}

export default function Projects() {
  const desktop = useDesktop();
  return (
    <MotionConfig reducedMotion="user">
      <section id="projects" className="relative pt-20">
        <div className="px-5 md:px-12 lg:px-20">
          <Eyebrow index="02" label="Selected Work" />
        </div>
        {desktop ? (
          <>
            <p className="px-12 lg:px-20 mb-6 font-display text-[4.2vw] leading-[1] tracking-[-0.01em] text-[var(--mist-50)] max-w-[18ch]">
              <MaskWords text="Things I build and run myself." />
            </p>
            <StackedCards />
          </>
        ) : (
          <div className="px-5 md:px-12 flex flex-col gap-6 pb-10">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 60, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, ease }}
              >
                <Panel p={p} i={i} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </MotionConfig>
  );
}
