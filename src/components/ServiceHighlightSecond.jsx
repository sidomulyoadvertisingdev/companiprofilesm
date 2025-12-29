import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ServiceHighlightSecond() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax ringan (image gerak pelan)
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center bg-white"
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT - IMAGE (PARALLAX) */}
        <motion.div
          style={{ y }}
          className="relative"
        >
          <img
            src="/service-banner.png"
            alt="Banner dan Huruf Timbul"
            className="w-full rounded-3xl shadow-sm"
          />
        </motion.div>

        {/* RIGHT - TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mb-6">
            Banner & Huruf Timbul
          </h2>

          <p className="text-[#6e6e73] text-lg leading-relaxed">
            Solusi visual untuk promosi bisnis Anda dengan material berkualitas,
            cetakan tajam, dan finishing rapi yang meningkatkan daya tarik brand.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
