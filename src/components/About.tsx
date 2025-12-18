import { motion } from 'framer-motion';

const skills = {
  'AI & Machine Learning': ['Multi-Agent Systems', 'LLM Orchestration', 'LangChain', 'Gemini', 'Vector Databases', 'Prompt Engineering'],
  'Core Languages': ['TypeScript', 'Python', 'JavaScript', 'Rust', 'SQL'],
  'Frameworks & Runtime': ['ReactJS', 'Next.js', 'Node.js', 'Nest.js', 'Flask'],
  'Cloud & Infrastructure': ['AWS Lambda', 'CloudWatch', 'Kafka', 'PostgreSQL', 'Docker', 'Git'],
};

const categoryColors: Record<string, string> = {
  'AI & Machine Learning': 'var(--accent-primary)',
  'Core Languages': 'var(--accent-secondary)',
  'Frameworks & Runtime': 'var(--accent-warm)',
  'Cloud & Infrastructure': 'var(--text-muted)',
};

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
            Who Am I?
          </h2>
          <div className="flex-1 h-[2px] bg-[var(--border-muted)]" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="border-2 border-[var(--border-muted)] p-6 relative">
            <div className="absolute -top-3 left-4 bg-[var(--bg-primary)] px-2 text-xs font-mono text-[var(--text-muted)] uppercase">
              Profile
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Passionate about music, books, and technology, I am, at my core, a programmer who 
              believes in keeping the mood light during crunch time, fostering a transparent and 
              energetic (sometimes goofy) team culture, while thriving on solving complex problems, 
              from architecting scalable backend services to developing sophisticated AI models. 
              I am objective-driven, aiming for high-quality standards while respecting delivery 
              timelines, and I constantly seek new knowledge, whether in technology, music, or 
              literature.
            </p>
          </div>
          
          <div className="space-y-6">
            {Object.entries(skills).map(([category, items], index) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="border-l-2 pl-4"
                style={{ borderColor: categoryColors[category] }}
              >
                <h3 className="font-mono text-sm uppercase tracking-wider mb-2" style={{ color: categoryColors[category] }}>
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span 
                      key={item} 
                      className="text-xs px-2 py-1 border border-[var(--border-muted)] text-[var(--text-secondary)] font-mono"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
