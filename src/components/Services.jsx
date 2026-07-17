import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { getServices } from "../lib/content.js";
import { getIcon } from "./ui/iconMap.jsx";

export default function Services({ initialData }) {
  const [services, setServices] = useState(initialData || []);
  useEffect(() => {
    if (!initialData) getServices().then(setServices);
  }, [initialData]);

  return (
    <section id="services" className="py-28 bg-white dark:bg-[#0a0a1a] transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
            Layanan Kami
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-white mt-3">
            Solusi Percetakan Lengkap
          </h2>
          <p className="text-lg text-[#6e6e73] dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            Dari neon box hingga digital printing — didukung mesin tercanggih
            untuk hasil profesional dan cepat jadi.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-8 hover:border-orange-300 hover:shadow-lg transition dark:bg-slate-800/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 flex items-center justify-center text-2xl mb-6">
                  <Icon />
                </div>
                <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[#6e6e73] dark:text-slate-400 text-sm leading-relaxed mb-5">
                  {item.shortDesc}
                </p>
                <a
                  href="/services"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:gap-2 transition-all"
                >
                  Selengkapnya <FiArrowRight />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
