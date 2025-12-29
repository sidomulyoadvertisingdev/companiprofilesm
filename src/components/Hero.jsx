import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FiArrowRight, FiPhone } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT - TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* TYPING TEXT BERGANTIAN */}
          <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
            <TypeAnimation
              sequence={[
                "Sidomulyo Advertising",
                2000,               // diam 2 detik
                "",
                500,                // hapus
                "Percetakan Terbaik di Indonesia",
                2000,
                "",
                500,
              ]}
              speed={70}
              repeat={Infinity}
              cursor={true}
              wrapper="span"
              className="text-3d"
            />
          </h1>

          {/* DESKRIPSI */}
          <p className="text-lg text-[#6e6e73] mb-10 leading-relaxed">
            Sidomulyo Advertising adalah salah satu perusahaan yang bergerak di
            bidang layanan jasa digital printing & advertising dengan didukung
            oleh mesin-mesin tercanggih dan terbaru, serta manajemen SDM yang
            profesional.
          </p>

          {/* BUTTON */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2
                         rounded-full bg-[#1d1d1f] text-white
                         px-6 py-3 text-sm font-medium
                         hover:bg-black transition"
            >
              Lihat Portofolio
              <FiArrowRight />
            </a>

            <a
              href="https://wa.me/6288808888880"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2
                         rounded-full border border-[#d2d2d7]
                         px-6 py-3 text-sm font-medium text-[#1d1d1f]
                         hover:bg-[#f5f5f7] transition"
            >
              Hubungi Kami
              <FiPhone />
            </a>
          </div>
        </motion.div>

        {/* RIGHT - IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img
            src="/hero-product.jpg"
            alt="Produk Sidomulyo Advertising"
            className="w-full rounded-3xl shadow-sm"
          />
        </motion.div>

      </div>
    </section>
  );
}
