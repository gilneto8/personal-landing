import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Kelaro',
    status: 'Live · Closed Beta',
    statusColor: 'var(--accent-primary)',
    url: 'https://kelaro.io',
    tagline: 'Accounting-Automation SaaS',
    description: 'B2B SaaS for fractional CFOs and accountants. Ingests bank PDFs and Open Banking (PSD2) feeds, runs deterministic extraction via an internal engine (Koa) orchestrated by Temporal, and emits accountant-ready datasets. Active pilots: PT chartered accountant + NL.',
    infra: 'Next.js + Postgres 16 + Temporal workflows on Hetzner. Stripe integration with founder-discount pipeline (coupons, promo codes, 30-day trial). Admin dashboard for Users / Waitlist / Promo Codes / MRR. OAuth 2.0 against GCP and Azure Entra ID enterprise tenants.',
    tech: ['Next.js', 'TypeScript', 'Temporal', 'PostgreSQL', 'Stripe', 'OAuth 2.0', 'PSD2'],
  },
  {
    title: 'Augur',
    status: 'Live · Phase 0',
    statusColor: 'var(--accent-secondary)',
    url: 'https://tryaugur.eu',
    tagline: 'GRC Tooling for AI Governance',
    description: 'Compliance and audit tooling targeting EU-regulated buyers. Designed for full EU data residency end-to-end — self-hosted analytics, EU-only infra, no third-party trackers. Phase 0: landing live, lead capture wired, going to market.',
    infra: 'Fastify + Postgres on Hetzner behind Nginx with TLS. Self-hosted Umami for privacy-first analytics. ImprovMX inbound mail. Same VPS as Kelaro — single-box multi-product topology.',
    tech: ['Fastify', 'Postgres', 'Nginx', 'Docker', 'Umami', 'Hetzner'],
  },
  {
    title: 'Koa',
    status: 'Engine',
    statusColor: 'var(--accent-warm)',
    url: null,
    tagline: 'Deterministic PDF Bank-Statement Extractor',
    description: 'Config-driven extraction system that turns bank-statement PDFs into structured JSON. Three components: a Python/FastAPI engine, a Next.js + Prisma mapper UI for authoring per-bank templates, and an isolated PII scrub container. Powers Kelaro\'s extraction pipeline.',
    infra: 'Python 3.12 / FastAPI with pdfplumber + pikepdf for native PDFs and Tesseract / PaddleOCR fallback for scans. Pydantic schemas end-to-end. mypy strict, ruff, CI-gated, auto-deployed via GitHub Actions on push to release branch.',
    tech: ['Python 3.12', 'FastAPI', 'Pydantic', 'pdfplumber', 'PaddleOCR', 'Next.js', 'Prisma', 'Docker'],
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
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {project.title} ↗
                    </a>
                  ) : (
                    project.title
                  )}
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
