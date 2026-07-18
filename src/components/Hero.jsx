import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FiArrowRight, FiPhone } from "react-icons/fi";
import { getSite } from "../lib/content.js";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";

export default function Hero({ initialData, children }) {
  const [site, setSite] = useState(initialData || null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!initialData) getSite().then(setSite);
    setMounted(true);
  }, [initialData]);

  const waLink = site ? `https://wa.me/${site.phone}` : "#";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0b1220]">
      <BackgroundGradientAnimation
        gradientBackgroundStart="#0b1220"
        gradientBackgroundEnd="#1a0800"
        firstColor="249,115,22"
        secondColor="251,146,60"
        thirdColor="245,158,11"
        fourthColor="30,58,138"
        fifthColor="249,115,22"
        pointerCircleColor="249,115,22"
        size="60%"
        blendingValue="soft-light"
        className="!h-auto !min-h-screen"
        containerClassName="!h-auto !min-h-screen"
        interactive={false}
      >
        <div className="relative max-w-6xl mx-auto px-6 w-full py-28 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-orange-400 mb-5">
                Percetakan & Advertising Profesional
              </span>

               <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                 {mounted ? (
                   <TypeAnimation
                     sequence={[
                       "Sidomulyo Advertising",
                       2200,
                       "",
                       500,
                       "Solusi Cetak Terpercaya",
                       2200,
                       "",
                       500,
                     ]}
                     speed={70}
                     repeat={Infinity}
                     cursor={true}
                     wrapper="span"
                     className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent"
                   />
                 ) : (
                   <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                     Sidomulyo Advertising
                   </span>
                 )}
               </h1>

              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                {site?.description ||
                  "Perusahaan percetakan dan advertising profesional dengan mesin tercanggih untuk neon box, digital printing, huruf timbul, dan branding."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#portfolio"
                  data-track="cta-lihat-portofolio-hero"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 text-white px-6 py-3 text-sm font-semibold hover:bg-orange-400 transition"
                >
                  Lihat Portofolio
                  <FiArrowRight />
                </a>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="cta-whatsapp-hero"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  Hubungi Kami
                  <FiPhone />
                </a>
              </div>
            </motion.div>

            {children && (
              <div className="relative z-20 w-full h-[420px] lg:h-[520px] order-first lg:order-last">
                {children}
              </div>
            )}
          </div>
        </div>
      </BackgroundGradientAnimation>
    </section>
  );
}
