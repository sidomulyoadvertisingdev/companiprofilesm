import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar, FiShield, FiPhone } from "react-icons/fi";
import { getSite } from "../lib/content.js";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";
import { useLanguage } from "../lib/i18n.js";



export default function Hero({ initialData, children }) {
  const [site, setSite] = useState(initialData || null);
  const [isDark, setIsDark] = useState(true);
  const { dict } = useLanguage();

  useEffect(() => {
    if (!initialData) getSite().then(setSite);

    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [initialData]);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
      <BackgroundGradientAnimation
        gradientBackgroundStart={isDark ? "#09090b" : "#f8fafc"}
        gradientBackgroundEnd={isDark ? "#0c0e14" : "#eff6ff"}
        firstColor={isDark ? "37,99,235" : "191,219,254"}
        secondColor={isDark ? "30,58,138" : "219,234,254"}
        thirdColor={isDark ? "15,23,42" : "224,231,255"}
        fourthColor={isDark ? "59,130,246" : "147,197,253"}
        fifthColor={isDark ? "212,175,55" : "252,211,77"}
        pointerCircleColor={isDark ? "37,99,235" : "59,130,246"}
        size="70%"
        blendingValue={isDark ? "soft-light" : "hard-light"}
        className="!h-auto !min-h-[90vh] lg:!min-h-screen"
        containerClassName="!h-auto !min-h-[90vh] lg:!min-h-screen"
        interactive={false}
      >
        <div className="relative max-w-7xl mx-auto px-6 w-full py-32 lg:py-40 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="lg:col-span-7 max-w-3xl"
            >
              {/* Agency Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-md">
                <FiShield className="text-sm" />
                <span>{dict.hero.badge}</span>
              </div>

              {/* High-Impact Corporate Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-8">
                {dict.hero.headlineLine1}{" "}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-200 dark:to-indigo-300">
                  {dict.hero.headlineLine2}
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-2xl font-normal">
                {dict.hero.subheadline}
              </p>

              {/* Dual Executive CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  data-track="cta-schedule-consultation-hero"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-sm font-bold tracking-wider uppercase shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 transform active:scale-95"
                >
                  <FiCalendar className="text-base" />
                  <span>{dict.hero.ctaPrimary}</span>
                  <FiArrowRight className="text-base" />
                </a>

                <a
                  href="/contact"
                  data-track="cta-contact-hero"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 bg-white/60 dark:bg-white/5 hover:bg-white text-slate-800 dark:text-white px-8 py-4 text-sm font-semibold tracking-wide backdrop-blur-md transition-all duration-300 shadow-xs group"
                >
                  <FiPhone className="text-base text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>{dict.hero.ctaSecondary}</span>
                </a>


              </div>
            </motion.div>


            {children && (
              <div className="lg:col-span-5 relative z-20 w-full h-[380px] lg:h-[500px]">
                {children}
              </div>
            )}

          </div>
        </div>
      </BackgroundGradientAnimation>
    </section>
  );
}


