import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";
import { getProducts, getSite } from "../lib/content.js";

const VISIBLE_COUNT = 6;

function ProductCard({ item, wa }) {
  return (
    <div className="flex flex-col rounded-3xl border border-[#e5e5e5] dark:border-slate-700 overflow-hidden hover:shadow-lg transition dark:bg-slate-800/50 h-full">
      <div className="overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full aspect-[4/3] object-cover transition-transform duration-500 hover:scale-[1.05]"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          {item.category}
        </span>
        <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mt-1 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-[#6e6e73] dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
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
          className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-blue-800 hover:gap-2 transition-all"
        >
          Pesan Sekarang <FiArrowRight />
        </a>
      </div>
    </div>
  );
}

export default function Catalog({ initialData }) {
  const [products, setProducts] = useState(initialData || []);
  const [site, setSite] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!initialData) getProducts().then(setProducts);
    getSite().then(setSite);
  }, [initialData]);

  useEffect(() => {
    if (showAll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showAll]);

  const wa = site ? `https://wa.me/${site.phone}` : "#";
  const visible = products.slice(0, VISIBLE_COUNT);
  const hasMore = products.length > VISIBLE_COUNT;

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
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-700">
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
          {visible.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <ProductCard item={item} wa={wa} />
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-blue-700 text-blue-700 font-semibold text-sm hover:bg-blue-700 hover:text-white transition-all"
            >
              Lihat Semua Produk <FiArrowRight />
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAll(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0a0a1a] rounded-3xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5] dark:border-slate-700">
                <div>
                  <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">
                    Semua Produk
                  </h2>
                  <p className="text-sm text-[#6e6e73] dark:text-slate-400 mt-1">
                    {products.length} produk tersedia
                  </p>
                </div>
                <button
                  onClick={() => setShowAll(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition text-[#6e6e73] dark:text-slate-300"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="overflow-y-auto p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((item) => (
                    <ProductCard key={item.id} item={item} wa={wa} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
