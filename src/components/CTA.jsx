import { useEffect, useState } from "react";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { getSite } from "../lib/content.js";
import { useLanguage } from "../lib/i18n.js";

export default function CTA({ initialData }) {
  const [site, setSite] = useState(initialData || null);
  const { dict } = useLanguage();

  useEffect(() => {
    if (!initialData) getSite().then(setSite);
  }, [initialData]);

  return (
    <section className="py-16 md:py-24 bg-slate-900 dark:bg-[#09090b] text-center relative overflow-hidden transition-colors duration-300 border-t border-slate-800/80">

      {/* Deep Royal Light Gradient Accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 120%, rgba(37,99,235,0.35), transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 z-10">
        <span className="text-xs font-bold tracking-widest uppercase text-blue-400 dark:text-blue-500 mb-4 block">
          {dict.cta.badge}
        </span>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8 leading-tight">
          {dict.cta.title}
        </h2>

        <p className="text-base md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
          {dict.cta.sub}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/contact"
            data-track="cta-schedule-consultation-bottom"
            className="inline-flex items-center gap-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-9 py-4 text-xs font-bold tracking-wider uppercase shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 transform active:scale-95"
          >
            <FiCalendar className="text-base" />
            <span>{dict.cta.button}</span>
            <FiArrowRight className="text-base" />
          </a>
        </div>
      </div>
    </section>
  );

}


