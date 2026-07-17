import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { getProducts, getSite } from "../lib/content.js";

export default function Catalog({ initialData }) {
  const [products, setProducts] = useState(initialData || []);
  const [site, setSite] = useState(null);
  useEffect(() => {
    if (!initialData) getProducts().then(setProducts);
    getSite().then(setSite);
  }, [initialData]);

  const wa = site ? `https://wa.me/${site.phone}` : "#";

  return (
    <section className="py-28 bg-white dark:bg-[#0a0a1a] transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
            Katalog Produk
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-white mt-3">
            Produk Unggulan
          </h2>
          <p className="text-lg text-[#6e6e73] dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            Pilihan produk percetakan untuk kebutuhan branding bisnis Anda.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group rounded-3xl border border-[#e5e5e5] dark:border-slate-700 overflow-hidden hover:shadow-lg transition dark:bg-slate-800/50"
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
                <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white mt-4">
                  {item.priceText}
                </p>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="cta-pesan-sekarang-catalog"
                  className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-orange-600 hover:gap-2 transition-all"
                >
                  Pesan Sekarang <FiArrowRight />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
