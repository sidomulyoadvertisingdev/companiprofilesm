import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTestimonials } from "../lib/content.js";

export default function Testimonials({ initialData }) {
  const [items, setItems] = useState(initialData || []);
  useEffect(() => {
    if (!initialData) getTestimonials().then(setItems);
  }, [initialData]);

  return (
    <section className="py-28 bg-[#f5f5f7] dark:bg-[#111118] transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-700">
            Testimoni
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-white mt-3">
            Apa Kata Klien Kami
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm"
            >
              <p className="text-[#1d1d1f] dark:text-slate-200 leading-relaxed mb-6">
                “{t.quote}”
              </p>
              <div>
                <p className="font-semibold text-[#1d1d1f] dark:text-white">{t.name}</p>
                <p className="text-sm text-[#6e6e73] dark:text-slate-400">
                  {t.role} · {t.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
