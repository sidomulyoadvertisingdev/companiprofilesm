import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

export default function Services() {
  return (
    <>
      <Navbar />

      {/* wrapper */}
      <main className="pt-20">

        {/* SERVICES HERO */}
        <section className="min-h-[60vh] flex items-center bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-semibold mb-6"
            >
              Layanan Kami
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-[#6e6e73] max-w-3xl"
            >
              Kami menyediakan berbagai layanan percetakan dan advertising
              untuk mendukung branding serta promosi bisnis Anda.
            </motion.p>
          </div>
        </section>

        {/* SERVICES LIST */}
        <section className="py-32 bg-[#f5f5f7]">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">

            {[
              {
                title: "Neon Box",
                desc: "Pembuatan neon box akrilik dan LED dengan desain modern, pencahayaan optimal, dan material berkualitas tinggi.",
              },
              {
                title: "Digital Printing",
                desc: "Cetak banner, spanduk, poster, stiker, dan media promosi lainnya dengan hasil tajam dan warna akurat.",
              },
              {
                title: "Huruf Timbul",
                desc: "Produksi huruf timbul dari akrilik, stainless, dan galvanis untuk tampilan branding yang eksklusif.",
              },
              {
                title: "Branding & Advertising",
                desc: "Solusi branding menyeluruh untuk toko, kantor, dan usaha Anda agar tampil lebih profesional.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-10"
              >
                <h3 className="text-2xl font-medium mb-4">
                  {item.title}
                </h3>
                <p className="text-[#6e6e73] text-lg leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </section>

        {/* WORK PROCESS */}
        <section className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl font-semibold mb-12"
            >
              Proses Kerja Kami
            </motion.h2>

            <div className="grid md:grid-cols-4 gap-10">
              {[
                "Konsultasi Kebutuhan",
                "Desain & Perencanaan",
                "Produksi",
                "Pemasangan & Finishing",
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
                >
                  <FiCheckCircle className="text-2xl mb-4" />
                  <p className="text-lg font-medium text-[#1d1d1f]">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="py-32 bg-[#f5f5f7] text-center">
          <h2 className="text-4xl font-semibold mb-6">
            Siap Meningkatkan Branding Bisnis Anda?
          </h2>

          <a
            href="https://wa.me/6288808888880"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2
                       rounded-full bg-[#1d1d1f] text-white
                       px-10 py-4 text-sm font-medium
                       hover:bg-black transition"
          >
            Konsultasi Sekarang
            <FiArrowRight />
          </a>
        </section>

        <Footer />
      </main>
    </>
  );
}
