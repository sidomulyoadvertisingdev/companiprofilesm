import { motion } from "framer-motion";
import { FiArrowRight, FiTrendingUp, FiLayout, FiZap, FiLayers, FiPrinter } from "react-icons/fi";
import { useLanguage } from "../lib/i18n.js";

const iconMap = [FiTrendingUp, FiLayout, FiZap, FiLayers, FiPrinter];

export default function Services({ initialData }) {
  const { dict } = useLanguage();
  const agencyServices = dict.services.items;

  return (
    <section id="services" className="py-16 md:py-24 bg-white dark:bg-[#09090b] transition-colors relative">

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-500 mb-3 block">
              {dict.services.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {dict.services.title}
            </h2>
          </div>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            {dict.services.sub}
          </p>
        </motion.div>

        {/* Grid of 5 Agency Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agencyServices.map((item, i) => {
            const Icon = iconMap[i % iconMap.length];
            const isLarge = i === 3 || i === 4;
            return (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`group rounded-3xl p-8 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.08] hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
                  isLarge ? "lg:col-span-1" : ""
                }`}
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Icon />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    {item.shortDesc}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="/services"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition-colors pt-4 border-t border-slate-200/60 dark:border-white/[0.06]"
                >
                  <span>{dict.services.explore}</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

