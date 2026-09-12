import { motion } from 'framer-motion';

const accentColors = [
  'var(--accent-primary)',
  'var(--accent-secondary)',
  'var(--accent-warm)',
];

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
    <section id="about" className="px-6 md:px-12 lg:px-24 py-20 border-t-2 border-[var(--border-muted)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-sm font-mono font-bold bg-[var(--accent-primary)] text-[var(--bg-primary)] px-3 py-1.5 uppercase tracking-wider">
            Philosophy
          </h2>
          <div className="flex-1 h-[2px] bg-[var(--border-muted)]" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {philosophy.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="border-2 border-[var(--border-muted)] p-6 relative group hover:shadow-[4px_4px_0_var(--border-muted)] transition-all flex flex-col"
              style={{ borderLeftColor: accentColors[index], borderLeftWidth: '4px' }}
            >
              <span
                className="absolute -top-3 right-4 px-2 text-xs font-mono uppercase tracking-wider"
                style={{ color: accentColors[index], backgroundColor: 'var(--bg-primary)' }}
              >
                0{index + 1}
              </span>
              <h3 className="font-bold text-lg text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <span className="flex-shrink-0" style={{ color: accentColors[index] }}>→</span>
                <span>{item.title}</span>
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm mb-4 flex-grow">{item.body}</p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border-muted)]">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-muted)] text-[var(--text-muted)] font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
