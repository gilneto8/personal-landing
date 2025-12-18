import { motion } from 'framer-motion';

const skills = {
  'Core Languages': ['TypeScript', 'Python', 'JavaScript', 'Rust', 'SQL'],
  'Frameworks & Runtime': ['ReactJS', 'Next.js', 'Node.js', 'Nest.js', 'Flask'],
  'Cloud & Infrastructure': ['AWS Lambda', 'CloudWatch', 'Kafka', 'PostgreSQL', 'Docker', 'Git'],
};

export default function About() {
  return (
    <section id="about" className="px-6 md:px-12 lg:px-24 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-sm font-bold bg-white text-black px-2 py-1 inline-block mb-8">
          WHO AM I?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <p className="text-neutral-300 leading-relaxed">
            Passionate about music, books, and technology. I am, at my core, a programmer who believes in 
            keeping the mood light during crunch time, fostering a transparent and energetic (sometimes goofy) 
            team culture. Professionally, I am objective-driven, aiming for high-quality standards while 
            respecting delivery timelines. I constantly seek new knowledge, whether through books, tech threads, 
            or exploring new music.
          </p>
          
          <div className="space-y-6">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-semibold mb-2">{category}:</h3>
                <p className="text-neutral-400">{items.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
