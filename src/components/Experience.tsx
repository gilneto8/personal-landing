import { motion } from 'framer-motion';

const experiences = [
  {
    period: '1/2026 – Present',
    title: 'Independent Founder-Engineer',
    company: 'Self-directed',
    description: 'Building and operating B2B utilities solo — infrastructure, backend, UI, billing, ops. Three products on a single Hetzner CCX23 VPS.',
    highlights: [
      'Kelaro (live, kelaro.io) — accounting-automation SaaS in closed beta with active pilots (PT chartered accountant, NL).',
      'Augur (live, tryaugur.eu) — GRC tooling for AI governance, EU data residency by design.',
      'Koa — deterministic PDF bank-statement extraction engine powering Kelaro\'s pipeline.',
      'Single-VPS multi-product topology: Nginx, Docker, Postgres 16, Temporal, ImprovMX, Brevo SMTP. Authored infrastructure map and runbooks.',
      'Launching a new venture in the hospitality sector (CTO).',
    ],
    tech: ['Next.js', 'TypeScript', 'Python', 'Temporal', 'PostgreSQL', 'Stripe', 'Docker', 'Hetzner', 'Nginx'],
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
  return (
    <section id="experience" className="px-6 md:px-12 lg:px-24 py-20 border-t-2 border-[var(--border-muted)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-sm font-mono font-bold bg-[var(--accent-secondary)] text-[var(--bg-primary)] px-3 py-1.5 uppercase tracking-wider">
            Experience
          </h2>
          <div className="flex-1 h-[2px] bg-[var(--border-muted)]" />
        </div>

        <div className="space-y-0">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-8 border-b border-[var(--border-muted)] last:border-b-0"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-[var(--accent-primary)] uppercase tracking-wider">
                  {exp.period}
                </span>
                <span className="text-sm font-mono text-[var(--text-muted)]">
                  @ {exp.company}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2">{exp.title}</h3>
                <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">{exp.description}</p>
                {exp.highlights && (
                  <ul className="text-[var(--text-secondary)] mb-4 space-y-2">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-baseline gap-3">
                        <span className="text-[var(--accent-primary)]">→</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {exp.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.tech.map((t) => (
                      <span 
                        key={t} 
                        className="text-xs px-2 py-1 border border-[var(--border-muted)] text-[var(--text-muted)] font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
