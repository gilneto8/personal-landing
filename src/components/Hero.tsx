import { motion } from 'framer-motion';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4">
          GIL NETO
        </h1>
        <p className="text-xl md:text-2xl text-neutral-400 mb-8">
          Senior Software Engineer
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-wrap gap-6 text-sm text-neutral-400 mb-12"
      >
        <a href="mailto:gilneto8@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
          <span>📧</span> gilneto8@gmail.com
        </a>
        <a href="https://github.com/gilneto8" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
          <span>🐙</span> GitHub
        </a>
        <a href="https://linkedin.com/in/gil-neto" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
          <span>💼</span> LinkedIn
        </a>
        <span className="flex items-center gap-2">
          <span>📍</span> Lisbon
        </span>
      </motion.div>

      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex flex-wrap gap-4"
      >
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="text-sm border border-neutral-700 px-4 py-2 hover:border-neutral-500 hover:text-white transition-colors"
          >
            {section.label}
          </a>
        ))}
      </motion.nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500"
      >
        <span className="text-xs">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
