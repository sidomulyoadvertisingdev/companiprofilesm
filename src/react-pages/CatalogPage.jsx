import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { getProducts, getSite } from "../lib/content.js";

export default function CatalogPage({ initialData, siteData }) {
  const [products, setProducts] = useState(initialData || []);
  const [site, setSite] = useState(siteData || null);

  useEffect(() => {
    if (!initialData) getProducts().then(setProducts);
    if (!siteData) getSite().then(setSite);
  }, [initialData, siteData]);

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
            Katalog Produk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-[#6e6e73] dark:text-slate-400 max-w-3xl"
          >
            Berbagai pilihan produk percetakan dan advertising untuk mendukung
            branding bisnis Anda.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-[#f5f5f7] dark:bg-[#111118] transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {products.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="h-full flex flex-col"
              >
                <div className="flex flex-col h-full rounded-3xl border border-[#e5e5e5] dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 bg-white dark:bg-slate-800/50">
                  <div className="overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-900 relative">
                    <img
                      src={item.image || "/catalog-1.webp"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block mb-1">
                        {item.category || "Produk"}
                      </span>
                      <h3
                        className="text-lg font-bold text-[#1d1d1f] dark:text-white line-clamp-2 leading-snug min-h-[3rem]"
                        title={item.title}
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-sm text-[#6e6e73] dark:text-slate-400 mt-2 leading-relaxed line-clamp-2 overflow-hidden h-[2.6rem]"
                        title={item.shortDesc}
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.shortDesc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col gap-2">
                      <p className="text-sm font-bold text-[#1d1d1f] dark:text-slate-200">
                        {item.priceText}
                      </p>
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track="cta-tanya-produk-catalog"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:gap-2.5 transition-all w-fit"
                      >
                        Tanya Produk <FiArrowRight />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-[#0a0a1a] text-center transition-colors">
        <h2 className="text-4xl font-bold mb-6 dark:text-white">Kualitas yang Bisa Diandalkan</h2>
        <p className="text-lg text-[#6e6e73] dark:text-slate-400 max-w-3xl mx-auto mb-10">
          Semua produk kami diproses dengan mesin modern, material terbaik, dan
          kontrol kualitas ketat untuk hasil maksimal.
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          data-track="cta-konsultasi-catalog"
          className="inline-flex items-center gap-2 rounded-full bg-blue-700 text-white px-10 py-4 text-sm font-semibold hover:bg-blue-400 transition"
        >
          Konsultasi & Pemesanan
          <FiArrowRight />
        </a>
      </section>
    </main>
  );
}
