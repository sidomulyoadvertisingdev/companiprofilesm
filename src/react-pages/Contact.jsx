import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiSend } from "react-icons/fi";
import { getSite } from "../lib/content.js";

export default function Contact({ initialData }) {
  const [site, setSite] = useState(initialData || null);
  useEffect(() => {
    if (!initialData) getSite().then(setSite);
  }, [initialData]);

  if (!site) return <main className="pt-20 min-h-screen" />;

  const { address, phoneDisplay, email, phone, mapsEmbed, mapsUrl } = site;
  const wa = `https://wa.me/${phone}`;

  return (
    <main className="pt-20">
      <section className="min-h-[60vh] flex items-center bg-white dark:bg-[#0a0a1a] transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-semibold mb-6 dark:text-white"
          >
            Hubungi Kami
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-[#6e6e73] dark:text-slate-400 max-w-3xl"
          >
            Silakan hubungi Sidomulyo Advertising untuk konsultasi,
            penawaran harga, atau kerja sama.
          </motion.p>
        </div>
      </section>

      <section className="py-32 bg-[#f5f5f7] dark:bg-[#111118] transition-colors">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 transition-colors"
          >
            <FiPhone className="text-2xl mb-4" />
            <h3 className="text-xl font-medium mb-2 dark:text-white">WhatsApp</h3>
            <p className="text-[#6e6e73] dark:text-slate-400 mb-4">{phoneDisplay}</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" data-track="cta-whatsapp-contact" className="text-orange-600 dark:text-orange-400 hover:underline">
              Chat Sekarang
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 transition-colors"
          >
            <FiMail className="text-2xl mb-4" />
            <h3 className="text-xl font-medium mb-2 dark:text-white">Email</h3>
            <p className="text-[#6e6e73] dark:text-slate-400 mb-4">{email}</p>
            <a href={`mailto:${email}`} className="text-orange-600 dark:text-orange-400 hover:underline">
              Kirim Email
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 transition-colors"
          >
            <FiMapPin className="text-2xl mb-4" />
            <h3 className="text-xl font-medium mb-2 dark:text-white">Alamat</h3>
            <p className="text-[#6e6e73] dark:text-slate-400 leading-relaxed">
               {site.name}<br />
               {address.street}<br />
               Kota {address.city}, {address.region} {address.postalCode}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-white dark:bg-[#0a0a1a] transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="overflow-hidden rounded-3xl">
            <iframe
              title="Lokasi Sidomulyo Advertising & Printing"
              src={mapsEmbed}
              className="w-full h-[400px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="text-center mt-6">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:underline"
            >
              Buka di Google Maps
            </a>
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#f5f5f7] dark:bg-[#111118] transition-colors">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-semibold mb-10 text-center dark:text-white"
          >
            Kirim Pesan
          </motion.h2>
          <form className="space-y-6">
            <input type="text" placeholder="Nama" className="w-full px-6 py-4 rounded-xl border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors" />
            <input type="email" placeholder="Email" className="w-full px-6 py-4 rounded-xl border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors" />
            <textarea placeholder="Pesan" rows="5" className="w-full px-6 py-4 rounded-xl border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors" />
            <button
              type="submit"
              className="inline-flex items-center gap-2
                         rounded-full bg-[#1d1d1f] dark:bg-white dark:text-[#1d1d1f] text-white
                         px-8 py-4 text-sm font-medium
                         hover:bg-black dark:hover:bg-gray-200 transition-colors"
            >
              Kirim Pesan
              <FiSend />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
