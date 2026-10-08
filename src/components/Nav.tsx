import { motion, MotionConfig } from 'framer-motion';
import { ease } from '../lib/motion';

const links = [
  { href: '#about', label: 'Approach' },
  { href: '#projects', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#writing', label: 'Writing' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.8, ease } }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <nav className="mx-4 md:mx-8 mt-3 flex items-center justify-between rounded-full border border-[var(--ink-600)]/70 bg-[var(--ink-800)]/60 backdrop-blur-md px-5 py-2.5">
          <a href="#top" className="font-display italic text-xl text-[var(--mist-50)] hover:text-[var(--sun-400)] transition-colors">
            gn<span className="text-[var(--sun-400)]">.</span>
          </a>
          <ul className="hidden md:flex gap-7">
            {links.map((l, i) => (
              <motion.li
                key={l.href}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.06, duration: 0.6, ease } }}
              >
                <a href={l.href} className="link-slide font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--aqua-300)] hover:text-[var(--mist-50)] transition-colors">
                  {l.label}
                </a>
              </motion.li>
            ))}
          </ul>
          <a href="mailto:gilneto8.work@gmail.com" className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--sun-400)] link-slide">
            Hire me
          </a>
        </nav>
      </motion.header>
    </MotionConfig>
  );
}
