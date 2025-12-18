import { motion } from 'framer-motion';

const experiences = [
  {
    period: '4/2021 – Present',
    title: 'Lead Software Engineer',
    company: 'Opplane',
    description: 'Promoted to Lead Engineer. Orchestrated the transition from monolithic architecture to microservices while managing a development team.',
    highlights: [
      'Managed feature delivery for high-traffic enrichment pipelines',
      'Designed integrations with LLM frameworks and implemented comprehensive logging systems',
      'Mentored junior developers and enforced code quality standards',
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
    <section id="experience" className="px-6 md:px-12 lg:px-24 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-sm font-bold bg-white text-black px-2 py-1 inline-block mb-12">
          EXPERIENCE
        </h2>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="grid md:grid-cols-[150px_1fr] gap-4 md:gap-8"
            >
              <div className="text-sm text-neutral-500">{exp.period}</div>
              <div>
                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{exp.title}</h3>
                  <span className="text-neutral-500">{exp.company}</span>
                </div>
                <p className="text-neutral-400 mb-3">{exp.description}</p>
                {exp.highlights && (
                  <ul className="list-disc list-inside text-neutral-400 mb-3 space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
                {exp.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
                      <span key={t} className="text-xs text-neutral-500 italic">{t}</span>
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
