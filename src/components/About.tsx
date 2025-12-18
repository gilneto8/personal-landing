import { motion } from 'framer-motion';

const accentClasses = [
  'accent-primary',
  'accent-secondary',
  'accent-warm',
  'accent-primary',
  'accent-secondary',
];

const faqData = [
  {
    question: "Who are you?",
    answer: "I'm Gil Neto, an Developer-made-architect & AI Engineer based in Lisbon. Passionate about music, books, and technology, I am, at my core, a programmer who believes in keeping the mood light during crunch time and fostering a transparent, energetic team culture."
  },
  {
    question: "What are your core specializations?",
    answer: "I specialize in building scalable products, with a newfound love for AI. My core focus right now is on Multi-Agent Systems, LLM Orchestration, and integration AI solutions into robust, production-ready applications."
  },
  {
    question: "What's your primary tech stack?",
    answer: "My expertise spans across core languages (Typescript and Python) and frameworks (React, Next.js, Node.js, Flask, FastAPI), cloud infrastructure (AWS, GCP, Docker) and now AI (LangChain, Gemini)."
  },
  {
    question: "What kind of roles are you interested in?",
    answer: "I am actively seeking to explore more roles related to AI, where I can leverage both my background in software architecture and my motivation in AI, to build innovative products from the ground up."
  },
  {
    question: "What is your technical philosophy?",
    answer: "I thrive on solving complex problems, from architecting scalable backend services to developing sophisticated AI models. I am objective-driven, aiming for high-quality standards while respecting delivery timelines, and I constantly seek new knowledge."
  }
];

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
            About
          </h2>
          <div className="flex-1 h-[2px] bg-[var(--border-muted)]" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {faqData.map((faq, index) => (
            <div 
              key={index}
              className={`faq-card faq-card--${accentClasses[index]} border-2 border-[var(--border-muted)] border-l-4 p-6 relative group hover:shadow-[4px_4px_0_var(--border-muted)] transition-all`}
            >
              <span className={`faq-number faq-number--${accentClasses[index]} absolute -top-3 right-4 px-2 text-xs font-mono uppercase tracking-wider bg-[var(--bg-primary)]`}>
                0{index + 1}
              </span>
              <h3 className="font-bold text-lg text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <span className={`faq-arrow faq-arrow--${accentClasses[index]} flex-shrink-0`}>→</span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
