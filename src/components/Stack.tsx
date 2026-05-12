import { motion } from 'framer-motion';

const stackGroups = [
  {
    label: 'Languages',
    color: 'var(--accent-primary)',
    items: ['TypeScript', 'Python', 'SQL'],
  },
  {
    label: 'Frameworks & Runtime',
    color: 'var(--accent-secondary)',
    items: ['Next.js', 'React', 'Node.js', 'Nest.js', 'Fastify', 'Flask', 'Temporal'],
  },
  {
    label: 'Infrastructure & Cloud',
    color: 'var(--accent-warm)',
    items: ['Docker', 'Nginx', 'Hetzner', 'Kafka', 'PostgreSQL', 'MongoDB', 'Redis', 'BullMQ', 'AWS', 'GCP'],
  },
  {
    label: 'Integrations',
    color: 'var(--accent-primary)',
    items: ['Stripe', 'OAuth 2.0', 'Open Banking (PSD2)', 'Brevo', 'Umami'],
  },
];

export default function Stack() {
  return (
    <section id="stack" className="px-6 md:px-12 lg:px-24 py-20 border-t-2 border-[var(--border-muted)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-sm font-mono font-bold bg-[var(--accent-secondary)] text-[var(--bg-primary)] px-3 py-1.5 uppercase tracking-wider">
            Tech Stack
          </h2>
          <div className="flex-1 h-[2px] bg-[var(--border-muted)]" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {stackGroups.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="border-2 border-[var(--border-muted)] p-6 hover:shadow-[4px_4px_0_var(--border-muted)] transition-all"
              style={{ borderLeftColor: group.color, borderLeftWidth: '4px' }}
            >
              <h3
                className="text-xs font-mono uppercase tracking-widest mb-4 font-bold"
                style={{ color: group.color }}
              >
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-muted)] text-[var(--text-secondary)] font-mono hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-default"
                  >
                    {item}
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
