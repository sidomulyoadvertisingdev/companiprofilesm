import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      {/* wrapper agar tidak ketutup navbar */}
      <main className="pt-20">

        {/* HERO ABOUT */}
        <section className="min-h-[70vh] flex items-center bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-semibold text-[#1d1d1f] mb-6"
            >
              Tentang Sidomulyo Advertising
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-[#6e6e73] max-w-3xl leading-relaxed"
            >
              Kami adalah perusahaan yang bergerak di bidang percetakan dan
              advertising dengan fokus pada kualitas, ketepatan, dan kepuasan
              pelanggan.
            </motion.p>
          </div>
        </section>

        {/* COMPANY STORY */}
        <section className="py-32 bg-[#f5f5f7]">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

            {/* TEXT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-semibold text-[#1d1d1f] mb-6">
                Siapa Kami
              </h2>
              <p className="text-[#6e6e73] text-lg leading-relaxed">
                Sidomulyo Advertising adalah salah satu perusahaan yang bergerak
                di bidang jasa digital printing dan advertising. Kami didukung
                oleh mesin-mesin modern, tenaga profesional, serta pengalaman
                dalam menangani berbagai kebutuhan promosi dan branding
                perusahaan.
              </p>
            </motion.div>

            {/* LOGO IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="bg-white rounded-3xl shadow-sm p-10">
                <img
                  src="/logo-sidomulyo.png"
                  alt="Sidomulyo Advertising"
                  className="h-40 md:h-48 w-auto object-contain mx-auto"
                />
              </div>
            </motion.div>

          </div>
        </section>

        {/* VISI MISI */}
        <section className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-semibold mb-4">Visi</h3>
              <p className="text-[#6e6e73] text-lg">
                Menjadi perusahaan percetakan dan advertising terpercaya dengan
                kualitas terbaik di Indonesia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-semibold mb-4">Misi</h3>
              <ul className="text-[#6e6e73] text-lg space-y-3 list-disc list-inside">
                <li>Memberikan hasil cetak berkualitas tinggi</li>
                <li>Mengutamakan kepuasan pelanggan</li>
                <li>Mengikuti perkembangan teknologi percetakan</li>
                <li>Memberikan pelayanan cepat dan profesional</li>
              </ul>
            </motion.div>

          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-32 bg-[#f5f5f7]">
          <div className="max-w-6xl mx-auto px-6 text-center">

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl font-semibold mb-12"
            >
              Kenapa Memilih Kami
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                "Kualitas Premium",
                "Harga Kompetitif",
                "Tim Profesional",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8"
                >
                  <h4 className="text-xl font-medium mb-3">{item}</h4>
                  <p className="text-[#6e6e73]">
                    Kami berkomitmen memberikan layanan terbaik dengan standar
                    profesional.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 bg-white text-center">
          <h2 className="text-4xl font-semibold mb-6">
            Siap Bekerja Sama dengan Kami?
          </h2>
          <a
            href="https://wa.me/6288808888880"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full
                       bg-[#1d1d1f] text-white
                       px-8 py-4 text-sm font-medium
                       hover:bg-black transition"
          >
            Hubungi Kami
          </a>
        </section>

        <Footer />
      </main>
    </>
  );
}
