import { motion, MotionConfig } from 'framer-motion';
import { Eyebrow, ease } from '../lib/motion';

const stackGroups = [
  {
    label: 'Languages',
    items: ['TypeScript', 'Python', 'SQL'],
  },
  {
    label: 'Frameworks & Runtime',
    items: ['Next.js', 'React', 'Node.js', 'Nest.js', 'Fastify', 'Flask', 'Temporal'],
  },
  {
    label: 'AI & LLM',
    items: ['LLM Application Architecture', 'Agent Memory', 'RAG', 'pgvector', 'Eval Harnesses', 'Agent Orchestration', 'Document Extraction', 'Claude Code'],
  },
  {
    label: 'Infrastructure & Cloud',
    items: ['Docker', 'Nginx', 'Kafka', 'PostgreSQL', 'MongoDB', 'Redis', 'BullMQ', 'AWS', 'GCP'],
  },
  {
    label: 'Integrations',
    items: ['Stripe', 'OAuth 2.0', 'Open Banking (PSD2)', 'Brevo', 'Umami'],
  },
];

const all = stackGroups.flatMap((g) => g.items);
const half = Math.ceil(all.length / 2);
const rows = [all.slice(0, half), all.slice(half)];

export default function Stack() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="stack" className="relative py-24 md:py-32">
        <div className="px-5 md:px-12 lg:px-20">
          <Eyebrow index="04" label="Tech Stack" />
        </div>

        {/* two counter-running bands */}
        <div aria-hidden className="space-y-3 mb-20 -rotate-[1.5deg] scale-[1.03]">
          {rows.map((row, r) => (
            <div key={r} className={`marquee py-3 ${r ? 'bg-[var(--ink-700)]' : 'bg-[var(--ink-600)]'}`}>
              <div className={`marquee-track ${r ? 'reverse' : ''}`}>
                {[...row, ...row].map((t, i) => (
                  <span key={i} className="font-display text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-[var(--mist-200)] px-6 flex items-center gap-12">
                    {t} <span className="text-[var(--sun-400)] text-xl">✦</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 md:px-12 lg:px-20">
          {stackGroups.map((group, index) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease, delay: index * 0.05 }}
              className="grid md:grid-cols-[260px_1fr] gap-3 md:gap-8 py-6 border-t border-[var(--ink-600)] last:border-b"
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--sun-400)] pt-2">{group.label}</h3>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {group.items.map((item) => (
                  <span key={item} className="font-display text-xl md:text-2xl text-[var(--mist-200)] hover:text-[var(--sun-400)] transition-colors duration-300 cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
