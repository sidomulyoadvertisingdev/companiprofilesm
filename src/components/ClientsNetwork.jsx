import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getPartners } from "../lib/content.js";

// Section "Mitra & Klien" — logo cloud dengan swap animation.
export default function ClientsNetwork({ initialData }) {
  const [partners, setPartners] = useState(initialData || []);
  useEffect(() => {
    if (!initialData) getPartners().then(setPartners);
  }, [initialData]);

  if (!partners.length) return null;

  // Duplikat logo untuk seamless loop
  const row1 = [...partners, ...partners, ...partners];
  const row2 = [...partners, ...partners, ...partners].reverse();

  return (
    <section className="py-28 bg-white dark:bg-[#0a0a1a] overflow-hidden transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">
            Mitra & Klien
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-white mt-3">
            Dipercaya Banyak Perusahaan
          </h2>
          <p className="text-lg text-[#6e6e73] dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            Jaringan mitra dan klien yang telah mempercayai Sidomulyo
            Advertising untuk kebutuhan percetakan mereka.
          </p>
        </motion.div>
      </div>

      {/* Logo Cloud — dua baris berlawanan arah */}
      <div className="relative">
        {/* Gradient fade kiri-kanan */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-white dark:from-[#0a0a1a] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-white dark:from-[#0a0a1a] to-transparent z-10" />

        {/* Baris 1: scroll kanan → kiri */}
        <div className="marquee-row mb-6">
          <div className="marquee-track marquee-left">
            {row1.map((p, i) => (
              <LogoItem key={`r1-${i}`} partner={p} />
            ))}
          </div>
        </div>

        {/* Baris 2: scroll kiri → kanan (berlawanan) */}
        <div className="marquee-row">
          <div className="marquee-track marquee-right">
            {row2.map((p, i) => (
              <LogoItem key={`r2-${i}`} partner={p} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-row {
          width: 100%;
          overflow: hidden;
        }
        .marquee-track {
          display: flex;
          align-items: center;
          gap: 3rem;
          width: max-content;
        }
        .marquee-left {
          animation: scrollLeft 30s linear infinite;
        }
        .marquee-right {
          animation: scrollRight 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

function LogoItem({ partner }) {
  return (
    <div className="shrink-0 flex items-center justify-center px-4 py-3 rounded-2xl bg-[#f5f5f7] dark:bg-slate-800 hover:bg-[#e8e8ed] dark:hover:bg-slate-700 transition-colors duration-300 group">
      <img
        src={partner.logo}
        alt={partner.name}
        className="h-10 md:h-12 w-auto object-contain opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300"
      />
    </div>
  );
}
