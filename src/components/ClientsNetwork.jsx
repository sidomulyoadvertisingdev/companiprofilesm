import { motion } from "framer-motion";

export default function ClientsNetwork() {
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
            Perusahaan yang Bekerja Sama
          </h2>
          <p className="text-lg text-[#6e6e73]">
            Jaringan mitra dan klien yang telah mempercayai Sidomulyo Advertising
          </p>
        </motion.div>

        {/* Network Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src="/clients-network.png"
            alt="Jaringan Perusahaan Sidomulyo Advertising"
            className="w-full max-w-4xl object-contain"
          />
        </motion.div>

      </div>
    </section>
  );
}
