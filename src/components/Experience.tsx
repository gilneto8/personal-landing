import { motion, MotionConfig, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Eyebrow, ease } from '../lib/motion';

const experiences = [
  {
    period: '1/2026 – Present',
    title: 'Independent Founder-Engineer',
    company: 'Self-directed',
    description: 'Building and operating B2B utilities solo — infrastructure, backend, UI, billing, ops — plus contract work as a senior full-stack engineer on AI product teams, where the current brief is the knowledge and memory layer an LLM product runs on.',
    highlights: [
      'Agent memory system in daily use: an LLM agent reading and writing a persistent markdown knowledge base, where capture, routing and checkpointing are enforced by lifecycle hooks instead of prompts, and a scored nightly eval gates the whole thing.',
      'Retrieval designed in two rungs — generated indexes for state, vector search for a specific fact — with "not in the corpus" kept as a valid answer rather than a failure to paper over.',
      'Kelaro (live, kelaro.io) — accounting-automation SaaS in closed beta with one active pilot (PT chartered accountant), NL pending, powered by Koa.',
      'Koa — deterministic document-extraction engine, built as the deliberate alternative to vision-LLM extraction: balances must reconcile, and it refuses loudly rather than returning a plausible total.',
      'Multi-product operational topology: Nginx, Docker, Postgres 16, Temporal, transactional and inbound mail. Authored infrastructure map and runbooks.',
      'Agentic development pipeline with a decision gate ahead of specification, so agents execute settled decisions rather than improvising undecided ones.',
    ],
    tech: ['Next.js', 'TypeScript', 'Python', 'Temporal', 'PostgreSQL', 'Stripe', 'Docker', 'Nginx'],
  },
  {
    period: '4/2021 – 1/2026',
    title: 'Lead Software Engineer',
    company: 'Opplane',
    description: 'Promoted to Lead. Drove monolith-to-microservices migration and feature delivery across the enrichment platform while managing a development team.',
    highlights: [
      'Owned feature delivery for high-traffic enrichment pipelines processing data at production scale.',
      'Designed and shipped the LLM-integration layer (prompt orchestration, structured-output extraction) powering production enrichment workflows.',
      'Stood up the observability stack (Grafana, CloudWatch, structured logging), reducing incident MTTR.',
      'Mentored junior engineers across teams of 4–5. Introduced code-review and CI quality gates that lowered regression rate.',
    ],
    tech: ['Python', 'Flask', 'Kafka', 'AWS Lambda', 'AWS CloudWatch', 'Grafana', 'PostgreSQL'],
  },
  {
    period: '3/2020 – 4/2021',
    title: 'Senior Software Engineer',
    company: 'Opplane',
    description: 'Joined as Senior to tackle full-stack challenges in a high-paced environment.',
    highlights: [
      'Built and maintained a scalable design system consumed across multiple product surfaces.',
      'Owned front-end architecture decisions (state, routing, build) across feature teams.',
      'Drove client-facing projects across sectors (health, retail, others).',
    ],
    tech: ['ReactJS', 'Node.js', 'Nest.js', 'TypeScript', 'SASS', 'React Native', 'PubNub', 'GCP'],
  },
  {
    period: '1/2018 – 2/2020',
    title: 'Front-end Lead Developer',
    company: 'Glartek',
    description: 'Built and led the front-end for Glartek\'s core industrial-IoT product across multiple iterations. Defined the component library, build pipeline, and front-end architecture that supported enterprise deals with industry-leading manufacturing and oil & gas companies.',
    tech: ['ReactJS', 'TypeScript', 'JavaScript', 'SASS', 'Webpack'],
  },
  {
    period: '9/2013 – 1/2018',
    title: 'Analyst / Consultant',
    company: 'Link Consulting',
    description: 'Delivered features across multiple enterprise applications. Final two years: on-site systems administrator for a major oil & gas project in Kuwait, owning operations and incident response.',
    tech: [],
  },
];

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <MotionConfig reducedMotion="user">
      <section id="experience" className="relative px-5 md:px-12 lg:px-20 py-24 md:py-36">
        <Eyebrow index="03" label="Experience" />

        <div ref={ref} className="relative">
          {/* the timeline rail fills saffron as you read down it */}
          <div aria-hidden className="absolute left-[7px] md:left-[calc(220px+7px)] top-2 bottom-2 w-px bg-[var(--ink-600)]">
            <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-[var(--sun-400)]" />
          </div>

          {experiences.map((exp, index) => (
            <div key={index} className="relative grid md:grid-cols-[220px_1fr] gap-3 md:gap-0 pl-9 md:pl-0 pb-16 last:pb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease }}
                className="md:sticky md:top-28 self-start md:pr-10"
              >
                <span className="font-display text-5xl md:text-6xl text-[var(--mist-50)] block leading-none">
                  {exp.period.split(' – ')[0].split('/')[1]}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--aqua-300)] block mt-2">{exp.period}</span>
              </motion.div>

              <motion.span
                aria-hidden
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                className="absolute left-0 md:left-[220px] top-1.5 w-[15px] h-[15px] rounded-full bg-[var(--ink-800)] border-2 border-[var(--sun-400)]"
              />

              <motion.div
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease, delay: 0.08 }}
                className="md:pl-14"
              >
                <h3 className="font-display text-3xl md:text-4xl text-[var(--mist-50)]">
                  {exp.title} <span className="italic text-[var(--aqua-300)]">at {exp.company}</span>
                </h3>
                <p className="text-[var(--mist-200)] mt-3 mb-5 leading-relaxed max-w-3xl">{exp.description}</p>
                {exp.highlights && (
                  <ul className="space-y-3 mb-5 max-w-3xl">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-baseline gap-3 text-[15px] text-[var(--mist-200)]/85 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--sun-400)] shrink-0 translate-y-[-2px]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {exp.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
                      <span key={t} className="text-[11px] px-3 py-1 rounded-full bg-[var(--ink-700)] text-[var(--aqua-300)] font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
