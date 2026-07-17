import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { getPortfolio, getSite } from "../lib/content.js";

export default function PortfolioPage({ initialData, siteData }) {
  const [items, setItems] = useState(initialData || []);
  const [site, setSite] = useState(siteData || null);
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    if (!initialData) getPortfolio().then(setItems);
    if (!siteData) getSite().then(setSite);
  }, [initialData, siteData]);

  const categories = useMemo(
    () => ["Semua", ...new Set(items.map((i) => i.category))],
    [items]
  );
  const visible = useMemo(
    () => (filter === "Semua" ? items : items.filter((i) => i.category === filter)),
    [items, filter]
  );

  const wa = site ? `https://wa.me/${site.phone}` : "#";

  return (
    <main className="pt-20">
      <section className="min-h-[55vh] flex items-center bg-white dark:bg-[#0a0a1a] transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-6 dark:text-white"
          >
            Portofolio Kami
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-[#6e6e73] dark:text-slate-400 max-w-3xl"
          >
            Berbagai proyek percetakan dan advertising yang telah kami kerjakan
            untuk klien dari berbagai sektor.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-[#f5f5f7] dark:bg-[#111118] transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === c
                    ? "bg-[#1d1d1f] dark:bg-white dark:text-[#1d1d1f] text-white"
                    : "bg-white dark:bg-slate-800 text-[#6e6e73] dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-slate-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {visible.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="overflow-hidden rounded-3xl mb-5 bg-white dark:bg-slate-800 shadow-sm transition-colors">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                  {item.category}
                </span>
                <h3 className="text-xl font-semibold mb-1 dark:text-white">{item.title}</h3>
                <p className="text-[#6e6e73] dark:text-slate-400 text-sm">
                  {item.client} · {item.year}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-[#0a0a1a] text-center transition-colors">
        <h2 className="text-4xl font-bold mb-6 dark:text-white">Pengalaman & Kualitas Terpercaya</h2>
        <p className="text-lg text-[#6e6e73] dark:text-slate-400 max-w-3xl mx-auto mb-10">
          Kami telah menangani berbagai proyek percetakan dan advertising dengan
          standar kualitas tinggi, ketepatan waktu, dan hasil yang memuaskan klien.
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-orange-500 text-white px-10 py-4 text-sm font-semibold hover:bg-orange-400 transition"
        >
          Konsultasi Proyek Anda
          <FiArrowRight />
        </a>
      </section>
    </main>
  );
}
