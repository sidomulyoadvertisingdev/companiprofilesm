import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { getPortfolio } from "../lib/content.js";

export default function Portfolio({ initialData }) {
  const [items, setItems] = useState(initialData || []);
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    if (!initialData) getPortfolio().then(setItems);
  }, [initialData]);

  const categories = useMemo(
    () => ["Semua", ...new Set(items.map((i) => i.category))],
    [items]
  );

  const visible = useMemo(
    () =>
      filter === "Semua"
        ? items
        : items.filter((i) => i.category === filter),
    [items, filter]
  );

  return (
    <section id="portfolio" className="py-28 bg-[#f5f5f7] dark:bg-[#111118] transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
            Portofolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-white mt-3">
            Proyek Terpilih Kami
          </h2>
          <p className="text-lg text-[#6e6e73] dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            Berbagai proyek percetakan & advertising yang telah dipercayakan
            klien dari berbagai sektor.
          </p>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === c
                  ? "bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f]"
                  : "bg-white dark:bg-slate-800 text-[#6e6e73] dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-slate-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-sm mb-5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                {item.category}
              </span>
              <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mt-1">
                {item.title}
              </h3>
              <p className="text-sm text-[#6e6e73] dark:text-slate-400 mt-1">
                {item.client} · {item.year}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
