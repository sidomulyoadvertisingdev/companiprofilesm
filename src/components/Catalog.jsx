import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { getProducts, getSite } from "../lib/content.js";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card.jsx";

const VISIBLE_COUNT = 6;

function ProductCard({ item, wa }) {
  return (
    <CardContainer className="w-full h-full">
      <CardBody className="bg-white dark:bg-slate-800/80 relative group/card border border-[#e5e5e5] dark:border-slate-700/80 w-full h-full rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
        <div>
          <CardItem
            translateZ="30"
            className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block mb-1"
          >
            {item.category || "Produk"}
          </CardItem>

          <CardItem translateZ="50" className="w-full">
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
          </CardItem>

          <CardItem translateZ="40" className="w-full mt-2">
            <p
              className="text-sm text-[#6e6e73] dark:text-slate-400 leading-relaxed line-clamp-2 overflow-hidden h-[2.6rem]"
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
          </CardItem>

          <CardItem translateZ="80" className="w-full mt-4">
            <div className="overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-2xl relative">
              <img
                src={item.image || "/catalog-1.webp"}
                alt={item.title}
                className="w-full h-full object-cover rounded-2xl group-hover/card:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </CardItem>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <CardItem
            translateZ="30"
            className="text-sm font-bold text-[#1d1d1f] dark:text-slate-200"
          >
            {item.priceText}
          </CardItem>

          <CardItem
            translateZ="50"
            as="a"
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            data-track="cta-pesan-sekarang-catalog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm hover:shadow-md"
          >
            Pesan Sekarang <FiArrowRight />
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

export default function Catalog({ initialData }) {
  const [products, setProducts] = useState(initialData || []);
  const [site, setSite] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!initialData) getProducts().then(setProducts);
    getSite().then(setSite);
  }, [initialData]);

  const wa = site ? `https://wa.me/${site.phone}` : "#";
  const displayedProducts = isExpanded ? products : products.slice(0, VISIBLE_COUNT);
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
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-700 dark:text-blue-400">
            Katalog Produk
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-white mt-3">
            Produk Unggulan
          </h2>
          <p className="text-lg text-[#6e6e73] dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            Pilihan produk percetakan untuk kebutuhan branding bisnis Anda.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <AnimatePresence mode="popLayout">
            {displayedProducts.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i < VISIBLE_COUNT ? i * 0.06 : 0.05 }}
                className="h-full flex flex-col"
              >
                <ProductCard item={item} wa={wa} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mt-12 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-blue-700 text-blue-700 dark:border-blue-500 dark:text-blue-400 font-semibold text-sm hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-sm hover:shadow-md"
            >
              {isExpanded ? "Tampilkan Top 6" : `Lihat Produk Lainnya (${products.length - VISIBLE_COUNT} produk lagi)`}
              <FiArrowRight className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
            </button>

            {!isExpanded && (
              <a
                href="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 transition-all shadow-sm hover:shadow-md"
              >
                Lihat Semua Katalog <FiArrowRight />
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
