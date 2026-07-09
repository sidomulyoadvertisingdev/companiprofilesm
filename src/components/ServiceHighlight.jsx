import { motion } from "framer-motion";

export default function ServiceHighlight() {
  return (
    <section className="min-h-screen flex items-center bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT - TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-6">
            Neon Box Berkualitas Tinggi
          </h2>

          <p className="text-[#6e6e73] text-lg leading-relaxed">
            Desain presisi, pencahayaan LED optimal, dan material premium
            untuk tampilan bisnis yang profesional dan modern.
          </p>
        </motion.div>

        {/* RIGHT - IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
        >
          <img
            src="/service-neonbox.webp"
            alt="Neon Box Sidomulyo Advertising"
            className="w-full rounded-3xl shadow-sm"
          />
        </motion.div>

      </div>
    </section>
  );
}
