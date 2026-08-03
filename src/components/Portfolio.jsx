import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { FiArrowRight } from "react-icons/fi";
import { getPortfolio } from "../lib/content.js";
import { useLanguage } from "../lib/i18n.js";

export default function Portfolio({ initialData }) {
  const [items, setItems] = useState(initialData || []);
  const { dict } = useLanguage();
  const [filter, setFilter] = useState(dict.portfolio.allFilter);

  useEffect(() => {
    if (!initialData) getPortfolio().then(setItems);
  }, [initialData]);

  const categories = useMemo(
    () => [dict.portfolio.allFilter, ...new Set(items.map((i) => i.category))],
    [items, dict]
  );

  const latestItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      if (b.order !== a.order) return b.order - a.order;
      return b.id - a.id;
    });
    return sorted.slice(0, 8);
  }, [items]);

  const visible = useMemo(
    () =>
      filter === dict.portfolio.allFilter || filter === "Semua" || filter === "All"
        ? latestItems
        : latestItems.filter((i) => i.category === filter),
    [latestItems, filter, dict]
  );

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-slate-50 dark:bg-[#0c0e14] transition-colors border-y border-slate-200/80 dark:border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-blue-500 mb-2 block">
              {dict.portfolio.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {dict.portfolio.title}
            </h2>
            {dict.portfolio.sub && (
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                {dict.portfolio.sub}
              </p>
            )}
          </motion.div>

          <a
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>{dict.portfolio.viewAll}</span>
            <FiArrowRight />
          </a>
        </div>



        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2.5 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                filter === c
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-white dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/[0.08] hover:border-blue-500/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {item.client} · {item.year}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

