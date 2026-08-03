import { motion } from "framer-motion";
import { FiSearch, FiCompass, FiFeather, FiPrinter, FiCheckCircle } from "react-icons/fi";
import { useLanguage } from "../lib/i18n.js";

const iconMap = [FiSearch, FiCompass, FiFeather, FiPrinter, FiCheckCircle];

export default function Process() {
  const { dict } = useLanguage();
  const steps = dict.process.steps;

  return (
    <section id="process" className="py-16 md:py-24 bg-white dark:bg-[#09090b] relative overflow-hidden transition-colors">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-blue-500 mb-3 block">
            {dict.process.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            {dict.process.title}
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {dict.process.sub}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, i) => {
            const Icon = iconMap[i % iconMap.length];
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-3xl p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-500 tracking-tighter">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 flex items-center justify-center text-lg shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {step.title}
                  </h3>
                  <div className="text-[11px] font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-3">
                    {step.sub}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc || step.description}
                  </p>
                </div>

                {/* Progress bar line under each step */}
                <div className="mt-8 h-1 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
