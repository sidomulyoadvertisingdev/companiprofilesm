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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group rounded-3xl bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-colors"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mt-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#6e6e73] dark:text-slate-400 mt-2 leading-relaxed">
                    {item.shortDesc}
                  </p>
                  <p className="text-sm font-semibold text-[#1d1d1f] dark:text-slate-200 mt-4">
                    {item.priceText}
                  </p>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:gap-2 transition-all"
                  >
                    Tanya Produk <FiArrowRight />
                  </a>
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
          className="inline-flex items-center gap-2 rounded-full bg-orange-500 text-white px-10 py-4 text-sm font-semibold hover:bg-orange-400 transition"
        >
          Konsultasi & Pemesanan
          <FiArrowRight />
        </a>
      </section>
    </main>
  );
}
