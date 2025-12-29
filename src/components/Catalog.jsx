import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function Catalog() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-4">
            Katalog Produk
          </h2>
          <p className="text-lg text-[#6e6e73]">
            Produk unggulan untuk kebutuhan branding bisnis Anda
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 gap-14">
          {[
            {
              title: "Neon Box Akrilik",
              desc: "Pencahayaan LED premium & desain modern",
              image: "/catalog-1.png",
            },
            {
              title: "Banner Flexi",
              desc: "Material kuat untuk indoor & outdoor",
              image: "/catalog-2.png",
            },
            {
              title: "Huruf Timbul",
              desc: "Akrilik & stainless tampilan eksklusif",
              image: "/catalog-3.png",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-3xl mb-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-[4/3] object-cover
                             transition-transform duration-500
                             group-hover:scale-[1.03]"
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-medium text-[#1d1d1f] mb-2">
                {item.title}
              </h3>
              <p className="text-[#6e6e73] mb-4">
                {item.desc}
              </p>

              {/* Button */}
              <button
                className="inline-flex items-center gap-2
                           text-sm font-medium text-blue-600
                           hover:underline"
              >
                Lihat Detail
                <FiArrowRight />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-24">
          <a
            href="https://wa.me/6288808888880"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2
                       rounded-full bg-[#1d1d1f] text-white
                       px-8 py-4 text-sm font-medium
                       hover:bg-black transition"
          >
            Konsultasi Produk
            <FiArrowRight />
          </a>
        </div>

      </div>
    </section>
  );
}
