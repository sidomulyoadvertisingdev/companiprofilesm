import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStats } from "../lib/content.js";

export default function Stats({ initialData }) {
  const [stats, setStats] = useState(initialData || []);
  useEffect(() => {
    if (!initialData) getStats().then(setStats);
  }, [initialData]);

  return (
    <section className="bg-[#0b1220] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl md:text-5xl font-bold text-blue-400">
              {s.value}
              {s.suffix}
            </div>
            <div className="mt-2 text-sm text-slate-400">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
