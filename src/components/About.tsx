import { motion, MotionConfig } from 'framer-motion';
import { Eyebrow, ScrollLitText, ease } from '../lib/motion';

const philosophy = [
  {
    title: 'Memory as Infrastructure',
    body: 'An agent that forgets is a demo. I build the layer underneath: capture that cannot be skipped, routing that runs on a schedule rather than on attention, retrieval split between generated indexes for state and vector search for facts, and a nightly eval that says out loud when the index has started lying. Judgment is the model\'s job. The guarantees are the harness\'s.',
    tags: ['Agent memory', 'Retrieval', 'Eval harness', 'Drift audit'],
  },
  {
    title: 'Infrastructure-First',
    body: 'I own the boundary — from DNS record to React component. Several products in production behind one operational surface: Docker, Nginx, Postgres, durable workflow orchestration, self-hosted analytics, all containerized and reproducible. Runbooks and an infrastructure map kept in sync with prod.',
    tags: ['Docker', 'Nginx', 'Postgres', 'Temporal', 'Runbooks'],
  },
  {
    title: 'AI-Augmented Execution',
    body: 'AI coding agents kill boilerplate. That frees me to spend cycles on system architecture, data modeling, and business logic — not scaffolding. The result: solo-shipping multiple products without cutting corners on tests, types, or observability.',
    tags: ['Claude Code', 'AI Agents', 'Type-strict', 'CI-gated'],
  },
];

export default function About() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="about" className="relative px-5 md:px-12 lg:px-20 pt-28 md:pt-40 pb-24">
        <Eyebrow index="01" label="Approach" />

        <ScrollLitText
          className="font-display text-[2.1rem] leading-[1.08] md:text-[4.6vw] md:leading-[1.04] font-medium tracking-[-0.02em] text-[var(--mist-50)] max-w-[22ch] md:max-w-none"
          text="An agent that forgets is a demo. The model does judgment. Deterministic code does correctness. The harness keeps the guarantees."
        />

        <div className="mt-20 md:mt-28 grid md:grid-cols-3 gap-5">
          {philosophy.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 50, rotate: index % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl bg-[var(--ink-700)] p-7 md:p-8 flex flex-col overflow-hidden border border-[var(--ink-600)] hover:border-[var(--sun-400)]/60 transition-colors duration-500"
            >
              {/* saffron glow follows hover */}
              <span aria-hidden className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-[var(--sun-400)] opacity-0 blur-3xl group-hover:opacity-20 transition-opacity duration-700" />
              <span className="font-display text-7xl font-bold outline-text group-hover:[-webkit-text-stroke-color:var(--sun-400)] transition-all duration-500 mb-6">
                0{index + 1}
              </span>
              <h3 className="font-display text-2xl font-semibold text-[var(--mist-50)] mb-4">{item.title}</h3>
              <p className="text-[var(--mist-200)]/85 leading-relaxed text-[15px] mb-6 flex-grow">{item.body}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-[11px] px-3 py-1 rounded-full bg-[var(--ink-800)] text-[var(--aqua-300)] font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
