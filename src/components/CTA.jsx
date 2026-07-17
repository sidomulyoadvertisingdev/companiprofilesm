import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { getSite } from "../lib/content.js";

export default function CTA({ initialData }) {
  const [site, setSite] = useState(initialData || null);
  useEffect(() => {
    if (!initialData) getSite().then(setSite);
  }, [initialData]);

  const waLink = site ? `https://wa.me/${site.phone}` : "#";

  return (
    <section className="py-28 bg-[#0b1220] text-center relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-50"
           style={{ background: "radial-gradient(circle at 50% 120%, rgba(255,138,76,0.2), transparent 60%)" }} />
      <div className="relative max-w-3xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Siap Meningkatkan Branding Bisnis Anda?
        </h2>
        <p className="text-lg text-slate-300 mb-10">
          Konsultasikan kebutuhan percetakan & advertising Anda bersama tim
          profesional kami.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-orange-500 text-white px-8 py-4 text-sm font-semibold hover:bg-orange-400 transition"
        >
          Hubungi via WhatsApp
          <FiArrowRight />
        </a>
      </div>
    </section>
  );
}
