import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiSend,
} from "react-icons/fi";

export default function Contact() {
  return (
    <>
      <Navbar />

      <main className="pt-20">

        {/* HERO */}
        <section className="min-h-[60vh] flex items-center bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-semibold mb-6"
            >
              Hubungi Kami
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-[#6e6e73] max-w-3xl"
            >
              Silakan hubungi Sidomulyo Advertising untuk konsultasi,
              penawaran harga, atau kerja sama.
            </motion.p>
          </div>
        </section>

        {/* INFO */}
        <section className="py-32 bg-[#f5f5f7]">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">

            {/* WhatsApp */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8"
            >
              <FiPhone className="text-2xl mb-4" />
              <h3 className="text-xl font-medium mb-2">WhatsApp</h3>
              <p className="text-[#6e6e73] mb-4">
                0888 0888 8880
              </p>
              <a
                href="https://wa.me/6288808888880"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Chat Sekarang
              </a>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8"
            >
              <FiMail className="text-2xl mb-4" />
              <h3 className="text-xl font-medium mb-2">Email</h3>
              <p className="text-[#6e6e73] mb-4">
                sosmedsidomulyo@gmail.com
              </p>
              <a
                href="mailto:sosmedsidomulyo@gmail.com"
                className="text-blue-600 hover:underline"
              >
                Kirim Email
              </a>
            </motion.div>

            {/* Alamat */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8"
            >
              <FiMapPin className="text-2xl mb-4" />
              <h3 className="text-xl font-medium mb-2">Alamat</h3>
              <p className="text-[#6e6e73] leading-relaxed">
                SIDOMULYO ADVERTISING & PRINTING<br />
                Jl. Kartini No.108<br />
                Salatiga, Jawa Tengah 50711
              </p>
            </motion.div>

          </div>
        </section>

        {/* GOOGLE MAPS – SALATIGA (BENAR) */}
        <section className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="overflow-hidden rounded-3xl">
              <iframe
                title="Lokasi Sidomulyo Advertising & Printing"
                src="https://www.google.com/maps?q=SIDOMULYO+ADVERTISING+%26+PRINTING,+Jl.+Kartini+No.108,+Salatiga,+Jawa+Tengah&output=embed"
                className="w-full h-[400px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* OPEN MAPS BUTTON */}
            <div className="text-center mt-6">
              <a
                href="https://maps.app.goo.gl/9ZQzJmZ2uKwYqiop9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2
                           text-blue-600 hover:underline"
              >
                Buka di Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="py-32 bg-[#f5f5f7]">
          <div className="max-w-3xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl font-semibold mb-10 text-center"
            >
              Kirim Pesan
            </motion.h2>

            <form className="space-y-6">
              <input
                type="text"
                placeholder="Nama"
                className="w-full px-6 py-4 rounded-xl border focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-6 py-4 rounded-xl border focus:outline-none"
              />
              <textarea
                placeholder="Pesan"
                rows="5"
                className="w-full px-6 py-4 rounded-xl border focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2
                           rounded-full bg-[#1d1d1f] text-white
                           px-8 py-4 text-sm font-medium
                           hover:bg-black transition"
              >
                Kirim Pesan
                <FiSend />
              </button>
            </form>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
