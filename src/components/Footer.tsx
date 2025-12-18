import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer id="contact" className="px-6 md:px-12 lg:px-24 py-20 border-t-2 border-[var(--border-muted)]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-[var(--accent-primary)] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)]">Available for work</span>
          </div>
          <h2 className="text-3xl font-black mb-2 text-[var(--text-primary)]">Let's connect</h2>
          <p className="text-[var(--text-secondary)]">Always open to interesting conversations and opportunities.</p>
        </div>
        
        <a
          href="mailto:gilneto8@gmail.com"
          className="group bg-[var(--accent-primary)] text-[var(--bg-primary)] px-6 py-3 font-mono font-bold uppercase tracking-wider hover:shadow-[4px_4px_0_var(--accent-secondary)] transition-all border-2 border-[var(--accent-primary)]"
        >
          Get in touch <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </motion.div>
      
      <div className="mt-16 pt-8 border-t border-[var(--border-muted)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p className="font-mono text-[var(--text-muted)]">© 2025 Gil Neto. All rights reserved.</p>
        <div className="flex gap-6 text-[var(--text-secondary)]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--accent-primary)]" />
            Portuguese (native)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--accent-secondary)]" />
            English (proficient)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--accent-warm)]" />
            Spanish (elementary)
          </span>
        </div>
      </div>
    </footer>
  );
}
