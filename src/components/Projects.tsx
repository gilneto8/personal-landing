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
    tech: ['ReactJS', 'Node.js', 'Next.js', 'TypeScript', 'Tailwind', 'LLMs'],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="px-6 md:px-12 lg:px-24 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-sm font-bold bg-white text-black px-2 py-1 inline-block mb-12">
          TECHNICAL SHOWCASE
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-3">{project.title}</h3>
              <p className="text-neutral-400 text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="text-xs bg-neutral-800 px-2 py-1 rounded">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
