import { motion } from 'framer-motion';

const projects = [
  {
    title: 'AI Product Validator Pipeline',
    description: 'Built an automated workflow using n8n that transforms raw Obsidian notes into actionable PoC plans. Orchestrated a multi-persona LLM council (Gemini) to evaluate technical feasibility and market reach, automatically generating implementation roadmaps and boilerplate bash scripts.',
    tech: ['n8n', 'Gemini API', 'Bash', 'Obsidian'],
  },
  {
    title: 'VoxSquare',
    description: 'Designed and developed a podcaster/brand social media platform using Next.js and AWS Lambda. Implemented AI-driven audience matching and real-time analytics dashboards to transparently connect advertisers with creators.',
    tech: ['ReactJS', 'Node.js', 'Next.js', 'TypeScript', 'AWS Lambda'],
  },
  {
    title: 'Bloodwork Analysis Engine',
    description: 'Developed a secure platform for analyzing bloodwork results using LLMs. Built a personalized recommendation engine for health insights and supplementation advice using a laboratory\'s supplement inventory.',
    tech: ['ReactJS', 'Node.js', 'Typescript', 'Next.js', 'Gemini API', 'Fine-tuning'],
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
            Technical Showcase
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
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-3">
                  {project.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">{project.description}</p>
              </div>
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
