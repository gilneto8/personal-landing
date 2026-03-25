import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Kelaro',
    status: 'Closed Beta',
    statusColor: 'var(--accent-secondary)',
    tagline: 'Pre-Accounting Middleware for Fractional CFOs',
    description: 'B2B financial middleware that automates the extraction of unstructured bank PDFs and live open-banking feeds into pristine, accountant-ready datasets. Built for the fractional CFO market where data quality is non-negotiable.',
    infra: 'Next.js backend with PM2 process management. Complex OAuth 2.0 flows overcoming strict GCP and Azure Entra ID enterprise tenant restrictions. Secure server-side document parsing pipeline.',
    tech: ['Next.js', 'TypeScript', 'OAuth 2.0', 'GCP', 'Azure Entra ID', 'PM2', 'PDF Parsing'],
  },
  {
    title: 'Alerta-AT',
    status: 'Live',
    statusColor: 'var(--accent-primary)',
    tagline: 'High-Availability Downtime Alert Engine',
    description: 'A resilient webhook engine delivering real-time downtime alerts for the Portuguese Tax Authority (AT) portal. Architected to absorb massive traffic spikes during the April tax filing season without degradation.',
    infra: 'Fully Dockerized architecture with health checks and container restart policies. Strict transactional email deliverability via ZeptoMail API. Automated hard-bounce and unsubscribe webhook processing to maintain 99%+ sender reputation.',
    tech: ['Docker', 'Node.js', 'ZeptoMail API', 'Webhooks', 'TypeScript'],
  },
  {
    title: 'SaaS Boilerplate / Infra',
    status: 'Internal',
    statusColor: 'var(--accent-warm)',
    tagline: 'Multi-Tenant Deployment Engine on Dedicated VPS',
    description: 'A centralized infrastructure layer hosting all SaaS products on a dedicated Hetzner CCX23 server. Eliminates per-project setup overhead and provides a unified runtime, routing, and observability layer.',
    infra: 'Next.js monorepo. Nginx Proxy Manager for zero-downtime dynamic domain routing. Redis + BullMQ job queues to isolate heavy headless-Chrome PDF generation from web processes. Unified logging streams across all tenants.',
    tech: ['Next.js', 'Docker', 'Nginx Proxy Manager', 'Redis', 'BullMQ', 'Hetzner VPS'],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="px-6 md:px-12 lg:px-24 py-20 border-t-2 border-[var(--border-muted)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-sm font-mono font-bold bg-[var(--accent-warm)] text-[var(--bg-primary)] px-3 py-1.5 uppercase tracking-wider">
            Shipped Projects
          </h2>
          <div className="flex-1 h-[2px] bg-[var(--border-muted)]" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-[var(--bg-card)] border-2 border-[var(--border-muted)] p-6 hover:border-[var(--accent-primary)] transition-all hover:shadow-[4px_4px_0_var(--accent-primary)] flex flex-col group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {project.title}
                </h3>
                <span
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 border ml-3 flex-shrink-0"
                  style={{ color: project.statusColor, borderColor: project.statusColor }}
                >
                  {project.status}
                </span>
              </div>

              {/* Tagline */}
              <p className="text-xs font-mono text-[var(--text-muted)] mb-4 uppercase tracking-wider">{project.tagline}</p>

              {/* Description */}
              <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed flex-grow">{project.description}</p>

              {/* Infrastructure callout */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-muted)] p-3 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-primary)] block mb-1">Infrastructure</span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{project.infra}</p>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border-muted)]">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-muted)] text-[var(--text-muted)] font-mono"
                  >
                    {t}
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
