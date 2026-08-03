import { motion } from "framer-motion";
import { FiTrendingUp, FiLayers, FiCpu, FiTarget } from "react-icons/fi";
import { useLanguage } from "../lib/i18n.js";

const iconMap = [FiTrendingUp, FiLayers, FiCpu, FiTarget];

export default function WhyUs() {
  const { dict } = useLanguage();
  const pillars = dict.whyUs.pillars;

  return (
    <section id="why-us" className="py-16 md:py-24 bg-slate-50 dark:bg-[#0c0e14] relative overflow-hidden transition-colors duration-300 border-y border-slate-200/80 dark:border-white/[0.08]">


      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-blue-500 mb-3 block">
              {dict.whyUs.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {dict.whyUs.title}
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed"
          >
            {dict.whyUs.sub}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, i) => {
            const Icon = iconMap[i % iconMap.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-3xl p-8 bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Icon />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc || item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

