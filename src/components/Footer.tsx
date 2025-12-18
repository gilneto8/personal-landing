import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer id="contact" className="px-6 md:px-12 lg:px-24 py-20 border-t border-neutral-800">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">Let's connect</h2>
          <p className="text-neutral-400">Always open to interesting conversations and opportunities.</p>
        </div>
        
        <a
          href="mailto:gilneto8@gmail.com"
          className="bg-white text-black px-6 py-3 font-medium hover:bg-neutral-200 transition-colors"
        >
          Get in touch
        </a>
      </motion.div>
      
      <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
        <p>© 2025 Gil Neto. All rights reserved.</p>
        <div className="flex gap-6">
          <span>🇵🇹 Portuguese (native)</span>
          <span>🇬🇧 English (proficient)</span>
          <span>🇪🇸 Spanish (elementary)</span>
        </div>
      </div>
    </footer>
  );
}
