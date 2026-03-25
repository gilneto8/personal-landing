import { motion } from 'framer-motion';

const accentColors = [
  'var(--accent-primary)',
  'var(--accent-secondary)',
  'var(--accent-warm)',
];

const philosophy = [
  {
    title: 'Infrastructure-First',
    body: 'I believe in owning the full stack. From Nginx reverse proxies and Redis queues to centralized observability with Better Stack, I build backends that don\'t wake me up at 3 AM. Everything containerized. Everything reproducible.',
    tags: ['Docker', 'Nginx PM', 'Redis', 'Better Stack', 'VPS'],
  },
  {
    title: 'AI-Leveraged Execution',
    body: 'I use AI coding agents heavily to eliminate boilerplate and accelerate delivery — which means I spend my time on system architecture, database design, and complex API integrations rather than scaffolding. High velocity without cutting corners.',
    tags: ['AI Agents', 'n8n', 'Gemini', 'Automation'],
  },
  {
    title: 'Business Logic First',
    body: 'Code is a tool to solve business friction. I focus on building stateless, low-liability utilities with high operational impact — products that earn their keep. Scope is sacred; complexity is a liability.',
    tags: ['B2B SaaS', 'API Design', 'Operational Impact'],
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
