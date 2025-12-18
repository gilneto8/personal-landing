import { motion } from 'framer-motion';

const experiences = [
  {
    period: '4/2021 – Present',
    title: 'Lead Software Engineer',
    company: 'Opplane',
    description: 'Promoted to Lead Engineer. Architected and led the development of AI-powered features, including the integration of LLM frameworks into core products. Orchestrated the transition to a microservices architecture to support scalable AI solutions.',
    highlights: [
      'Led the design and implementation of integrations with LLM frameworks (e.g., LangChain, Gemini) to enable intelligent data processing.',
      'Managed and optimized high-traffic data enrichment pipelines that served as the backbone for machine learning models.',
      'Architected a scalable logging and monitoring system for AI services using AWS CloudWatch and Grafana.',
      'Mentored a team of developers, fostering best practices in both software and AI engineering.',
    ],
    tech: ['Python', 'Flask', 'Kafka', 'AWS Lambda', 'AWS CloudWatch', 'Grafana', 'PostgreSQL'],
  },
  {
    period: '3/2020 – 4/2021',
    title: 'Senior Software Engineer',
    company: 'Opplane',
    description: 'Joined as a Senior Engineer to tackle full-stack challenges in a high-paced environment.',
    highlights: [
      'Built and maintained scalable design systems',
      'Managed project lifecycles and led front-end architecture decisions',
    ],
    tech: ['ReactJS', 'Node.js', 'Nest.js', 'TypeScript', 'SASS', 'Bootstrap'],
  },
  {
    period: '1/2018 – 2/2020',
    title: 'Front-end Lead Developer',
    company: 'Glartek',
    description: 'Led the front-end development for Glartek\'s core product through multiple application iterations. Successfully created the frontend structure for the product, making a robust impression on multiple industry-leading companies.',
    tech: ['ReactJS', 'JavaScript', 'TypeScript', 'SASS', 'Webpack'],
  },
  {
    period: '9/2013 – 1/2018',
    title: 'Analyst / Consultant',
    company: 'Link Consulting',
    description: 'Responsible for analyzing and developing features for multiple enterprise applications. Later specialized in systems administration for a major oil & gas project in Kuwait.',
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
                      <li key={i} className="flex gap-3">
                        <span className="text-[var(--accent-primary)] mt-1">→</span>
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
