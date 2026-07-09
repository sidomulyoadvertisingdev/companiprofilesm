import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function PortfolioPage() {
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
            Portofolio Kami
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-[#6e6e73] max-w-3xl"
          >
            Berbagai proyek percetakan dan advertising yang telah kami
            kerjakan untuk klien dari berbagai sektor.
          </motion.p>
        </div>
      </section>

      <section className="py-32 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { title: "Neon Box Toko", category: "Neon Box", image: "/portfolio-1.png" },
              { title: "Banner Promosi", category: "Banner", image: "/portfolio-2.png" },
              { title: "Huruf Timbul", category: "Huruf Timbul", image: "/portfolio-3.png" },
              { title: "Neon Box Outdoor", category: "Neon Box", image: "/portfolio-4.png" },
              { title: "Branding Toko", category: "Advertising", image: "/portfolio-5.png" },
              { title: "Display Akrilik", category: "Akrilik", image: "/portfolio-6.png" },
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
                               group-hover:scale-[1.05]"
                  />
                </div>
                <h3 className="text-xl font-medium mb-1">{item.title}</h3>
                <p className="text-[#6e6e73] text-sm">{item.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white text-center">
        <h2 className="text-4xl font-semibold mb-6">
          Pengalaman & Kualitas Terpercaya
        </h2>
        <p className="text-lg text-[#6e6e73] max-w-3xl mx-auto">
          Kami telah menangani berbagai proyek percetakan dan advertising
          dengan standar kualitas tinggi, ketepatan waktu, dan hasil yang
          memuaskan klien.
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
          Konsultasi Proyek Anda
          <FiArrowRight />
        </a>
      </section>
    </main>
  );
}
