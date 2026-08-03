import { motion } from "framer-motion";
import { FiCheckCircle, FiArrowRight, FiPhone, FiChevronRight, FiBriefcase, FiLayers, FiShield, FiZap, FiPrinter, FiLayout, FiTrendingUp } from "react-icons/fi";

const iconMap = {
  FiTrendingUp,
  FiLayout,
  FiZap,
  FiLayers,
  FiPrinter,
};

export default function ServiceDetailPage({ service, allServices = [], siteData }) {
  if (!service) return null;

  const phone = siteData?.phone || "6288808888880";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`Halo Sidomulyo Advertising, saya tertarik dengan layanan ${service.title}`)}`;
  const IconComponent = iconMap[service.icon] || FiZap;

  const otherServices = allServices.filter((s) => s.slug !== service.slug);

  return (
    <main className="pt-20 bg-white dark:bg-[#09090b] text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen">
      {/* BREADCRUMB & HERO */}
      <section className="pt-8 pb-14 md:pt-12 md:pb-16 bg-slate-50 dark:bg-[#0c0e14] border-b border-slate-200/80 dark:border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">
            <a href="/" className="hover:text-blue-600 transition">Beranda</a>
            <FiChevronRight className="text-xs text-slate-400" />
            <a href="/services" className="hover:text-blue-600 transition">Layanan</a>
            <FiChevronRight className="text-xs text-slate-400" />
            <span className="text-blue-600 dark:text-blue-400 font-bold">{service.title}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              <IconComponent className="text-sm" />
              <span>Kapabilitas Utama Korporat</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
              {service.title}
            </h1>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {service.shortDesc}
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN: DETAILS & DELIVERABLES */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Banner Image */}
              {service.image && (
                <div className="rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/[0.08] shadow-lg max-h-[420px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Comprehensive Description */}
              <div className="bg-slate-50 dark:bg-white/[0.02] rounded-3xl p-8 md:p-10 border border-slate-200/80 dark:border-white/[0.06] space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Deskripsi & Lingkup Kerja
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {service.longDesc || service.shortDesc}
                </p>
              </div>

              {/* Key Deliverables & Features */}
              {service.features && service.features.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Key Deliverables & Fitur Utama
                    </h2>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {service.features.length} Item Standar Kualitas
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] shadow-xs flex items-start gap-3.5 hover:border-blue-500/40 transition"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                          <FiCheckCircle className="text-sm" />
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Band inside Service Detail */}
              <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Tertarik dengan Layanan ini?</h3>
                  <p className="text-xs md:text-sm text-blue-100 max-w-md leading-relaxed">
                    Konsultasikan kebutuhan brand & spesifikasi periklanan perusahaan Anda bersama tim konsultan senior kami.
                  </p>
                </div>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs uppercase tracking-wider shadow-md shrink-0 transition"
                >
                  <FiPhone />
                  <span>Konsultasi WhatsApp</span>
                </a>
              </div>

            </div>

            {/* RIGHT COLUMN: SIDEBAR OTHER SERVICES & CTA CARD */}
            <div className="lg:col-span-4 space-y-8 sticky top-28">
              
              {/* CONSULTATION CARD */}
              <div className="p-6 rounded-3xl bg-slate-900 dark:bg-[#0c0e14] text-white border border-slate-800 shadow-xl space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block">
                  Direct Executive Support
                </span>
                <h3 className="text-lg font-bold">Diskusi Strategi Langsung</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tim teknis dan desainer siap melakukan survey lokasi, audit brand, dan penyusunan RAB sesuai anggaran korporasi.
                </p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-md transition"
                >
                  <span>Chat Tim Ahli</span>
                  <FiArrowRight />
                </a>
              </div>

              {/* OTHER SERVICES LIST */}
              {otherServices.length > 0 && (
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.08] space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Layanan Strategis Lainnya
                  </h3>
                  <div className="space-y-2">
                    {otherServices.map((other) => (
                      <a
                        key={other.slug}
                        href={`/services/${other.slug}`}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition group text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {other.title}
                        </span>
                        <FiChevronRight className="text-slate-400 group-hover:text-blue-600 transition" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
