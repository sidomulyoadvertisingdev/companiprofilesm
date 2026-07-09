import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function CatalogPage() {
  return (
    <main className="pt-20">
      <section className="min-h-[60vh] flex items-center bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-semibold mb-6"
          >
            Katalog Produk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-[#6e6e73] max-w-3xl"
          >
            Berbagai pilihan produk percetakan dan advertising
            untuk mendukung branding bisnis Anda.
          </motion.p>
        </div>
      </section>

      <section className="py-32 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { title: "Neon Box Akrilik", desc: "LED premium & desain modern", image: "/catalog-1.webp" },
              { title: "Banner Flexi", desc: "Indoor & outdoor berkualitas", image: "/catalog-2.webp" },
              { title: "Huruf Timbul", desc: "Akrilik & stainless", image: "/catalog-3.webp" },
              { title: "Sticker & Digital Printing", desc: "Cetak tajam & tahan lama", image: "/catalog-4.webp" },
              { title: "Akrilik Custom", desc: "Display & branding eksklusif", image: "/catalog-5.webp" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="overflow-hidden rounded-3xl mb-6 bg-white">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-[4/3] object-cover
                               transition-transform duration-500
                               group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-[#6e6e73] mb-4">{item.desc}</p>
                <a
                  href="https://wa.me/6288808888880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2
                             text-blue-600 text-sm hover:underline"
                >
                  Tanya Produk
                  <FiArrowRight />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white text-center">
        <h2 className="text-4xl font-semibold mb-6">
          Kualitas yang Bisa Diandalkan
        </h2>
        <p className="text-lg text-[#6e6e73] max-w-3xl mx-auto">
          Semua produk kami diproses dengan mesin modern, material terbaik,
          dan kontrol kualitas ketat untuk hasil maksimal.
        </p>
      </section>

      <section className="py-32 bg-[#f5f5f7] text-center">
        <a
          href="https://wa.me/6288808888880"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2
                     rounded-full bg-[#1d1d1f] text-white
                     px-10 py-4 text-sm font-medium
                     hover:bg-black transition"
        >
          Konsultasi & Pemesanan
          <FiArrowRight />
        </a>
      </section>
    </main>
  );
}
