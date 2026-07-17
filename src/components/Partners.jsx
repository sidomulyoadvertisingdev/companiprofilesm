import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getPartners } from "../lib/content.js";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  useEffect(() => {
    getPartners().then(setPartners);
  }, []);

  return (
    <section className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
            Mitra & Klien
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mt-3">
            Dipercaya Banyak Perusahaan
          </h2>
          <p className="text-lg text-[#6e6e73] mt-4 max-w-2xl mx-auto">
            Jaringan mitra dan klien yang telah mempercayai Sidomulyo
            Advertising untuk kebutuhan percetakan mereka.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {partners.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <img
                src={p.logo}
                alt={p.name}
                className="h-14 w-auto object-contain opacity-80 hover:opacity-100 transition"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
