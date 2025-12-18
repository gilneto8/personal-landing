import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin } from 'lucide-react';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20 pb-32 md:pb-20 relative">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] text-xs font-mono uppercase tracking-wider">
          <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse" />
          Open to opportunities
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-[var(--text-primary)]">
          GIL NETO
        </h1>
        <p className="text-xl md:text-2xl text-[var(--accent-primary)] font-semibold mb-2 font-mono">
          AI Engineer & Architect
        </p>
        <p className="text-md md:text-lg text-[var(--text-secondary)] mb-8 max-w-xl">
          Specialized in Multi-Agent Systems, LLM Orchestration, and Scalable Product Engineering.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)] mb-12"
      >
        <a href="mailto:gilneto8@gmail.com" className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2 px-3 py-2 border-2 border-[var(--border-muted)] hover:border-[var(--accent-primary)]">
          <Mail size={16} className="text-[var(--accent-secondary)]" /> gilneto8@gmail.com
        </a>
        <a href="https://github.com/gilneto8" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2 px-3 py-2 border-2 border-[var(--border-muted)] hover:border-[var(--accent-primary)]">
          <Github size={16} className="text-[var(--text-primary)]" /> GitHub
        </a>
        <a href="https://linkedin.com/in/gil-neto" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2 px-3 py-2 border-2 border-[var(--border-muted)] hover:border-[var(--accent-primary)]">
          <Linkedin size={16} className="text-[#0A66C2]" /> LinkedIn
        </a>
        <span className="flex items-center gap-2 px-3 py-2 border-2 border-[var(--border-muted)]">
          <MapPin size={16} className="text-[var(--accent-warm)]" /> Lisbon, PT
        </span>
      </motion.div>

      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex flex-wrap gap-3"
      >
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group text-sm font-mono uppercase tracking-wider border-2 border-[var(--border-muted)] px-5 py-3 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all hover:shadow-[4px_4px_0_var(--accent-primary)]"
          >
            <span className="text-[var(--text-muted)] mr-2">0{index + 1}</span>
            {section.label}
          </a>
        ))}
      </motion.nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-8 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] hidden md:flex"
      >
        <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-[var(--accent-primary)]"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
