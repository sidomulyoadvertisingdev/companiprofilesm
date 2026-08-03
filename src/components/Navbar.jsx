import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiArrowRight,
  FiCalendar,
  FiChevronDown,
  FiTrendingUp,
  FiLayout,
  FiZap,
  FiLayers,
  FiPrinter,
} from "react-icons/fi";
import ThemeToggle from "./ui/ThemeToggle.jsx";
import LanguageToggle from "./ui/LanguageToggle.jsx";
import { useLanguage } from "../lib/i18n.js";
import { getSite } from "../lib/content.js";
import { useMemo } from "react";

const serviceIcons = [FiTrendingUp, FiLayout, FiZap, FiLayers, FiPrinter];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dbNav, setDbNav] = useState(null);
  const { dict } = useLanguage();

  const [pathname, setPathname] = useState("");
  useEffect(() => {
    setPathname(window.location.pathname);
    getSite().then((s) => {
      if (s?.navMenu && Array.isArray(s.navMenu) && s.navMenu.length > 0) {
        setDbNav(s.navMenu);
      }
    }).catch(() => {});
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (!open && latest > 80 && latest - previous > 4) {
      setHidden(true);
      setDropdownOpen(false);
    } else if (latest < previous || latest <= 80) {
      setHidden(false);
    }
  });

  const topNavItems = useMemo(() => {
    if (dbNav && dbNav.length > 0) {
      return dbNav
        .filter((item) => item.is_active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((item) => ({
          id: item.id,
          name: item.name,
          path: item.path,
          hasDropdown: item.has_dropdown || item.hasDropdown || item.id === "services",
          dropdownItems: item.dropdown_items || item.dropdownItems,
        }));
    }
    return [
      { id: "home", name: dict.nav.home, path: "/" },
      { id: "services", name: dict.nav.services, path: "/services", hasDropdown: true },
      { id: "portfolio", name: dict.nav.portfolio, path: "/portfolio" },
      { id: "blog", name: dict.nav.blog || "Blog", path: "/blog" },
      { id: "about", name: dict.nav.about, path: "/about" },
    ];
  }, [dbNav, dict]);

  const serviceSlugMap = {
    "brand-strategy": "/services/brand-strategy",
    "creative-design": "/services/creative-design",
    "advertising-campaign": "/services/advertising-campaign",
    "advertising-campaigns": "/services/advertising-campaign",
    "corporate-branding": "/services/corporate-branding",
    "corporate-signage": "/services/corporate-branding",
    "production-support": "/services/production-support",
    "precision-production": "/services/production-support",
  };

  const serviceItem = topNavItems.find((i) => i.hasDropdown);
  const servicesList = (serviceItem?.dropdownItems && serviceItem.dropdownItems.length > 0
    ? serviceItem.dropdownItems
    : (dict.services?.items || [])).map((d) => {
      const cleanId = d.id || d.slug;
      return {
        id: cleanId,
        title: d.title,
        shortDesc: d.desc || d.shortDesc,
        path: serviceSlugMap[cleanId] || (d.path && !d.path.includes("#") ? d.path : `/services/${cleanId}`),
      };
    });

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] transition-colors duration-300 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">

          {/* BRAND LOGO */}
          <a href="/" className="flex flex-col items-start justify-center group leading-none">
            <img
              src="/logo-sidomulyo.webp"
              alt="Sidomulyo Advertising & Printing"
              className="h-7 md:h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 mt-1">
              Advertising & Printing
            </span>
          </a>


          {/* DESKTOP NAV - RAMS MINIMALIST PILL NAV WITH DROPDOWN */}
          <div className="hidden lg:flex items-center bg-slate-100/80 dark:bg-white/[0.04] p-1.5 rounded-full border border-slate-200/80 dark:border-white/[0.06] backdrop-blur-md">
            <ul className="flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {topNavItems.map((item) => {
                const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));


                if (item.hasDropdown) {
                  return (
                    <li
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`relative px-4 py-2 rounded-full transition-all duration-200 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 ${
                          isActive || dropdownOpen
                            ? "text-blue-600 dark:text-white font-bold bg-white dark:bg-white/10 shadow-xs"
                            : "hover:bg-slate-200/50 dark:hover:bg-white/5"
                        }`}
                      >
                        <span>{item.name}</span>
                        <FiChevronDown
                          className={`text-xs transition-transform duration-200 ${
                            dropdownOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                          }`}
                        />
                      </button>

                      {/* DROPDOWN CARD (RAMS / PORTOFOLIORAMS STYLE) */}
                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[440px] z-50 pointer-events-auto"
                          >
                            <div className="rounded-3xl p-4 bg-white/95 dark:bg-[#0c0e14]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-1">
                              {servicesList.map((svc, i) => {
                                const Icon = serviceIcons[i % serviceIcons.length];
                                return (
                                  <a
                                    key={svc.id || i}
                                    href={svc.path}
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-white/[0.05] transition-all group/item text-left"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all mt-0.5">
                                      <Icon />
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                                        {svc.title}
                                      </div>
                                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed line-clamp-2 mt-0.5">
                                        {svc.shortDesc}
                                      </div>
                                    </div>
                                  </a>
                                );
                              })}

                              {/* DROPDOWN FOOTER LINKS */}
                              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between px-2 text-[11px]">
                                <a
                                  href="/#why-us"
                                  onClick={() => setDropdownOpen(false)}
                                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white font-medium transition"
                                >
                                  {dict.nav.whyUs}
                                </a>
                                <a
                                  href="/#process"
                                  onClick={() => setDropdownOpen(false)}
                                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white font-medium transition"
                                >
                                  {dict.nav.process}
                                </a>
                                <a
                                  href="/services"
                                  onClick={() => setDropdownOpen(false)}
                                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1"
                                >
                                  <span>Semua Layanan</span>
                                  <FiArrowRight className="text-[10px]" />
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

                return (
                  <a
                    key={item.path}
                    href={item.path}
                    suppressHydrationWarning
                    className={`relative px-4 py-2 rounded-full transition-all duration-200 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 ${
                      isActive
                        ? "text-blue-600 dark:text-white font-bold bg-white dark:bg-white/10 shadow-xs"
                        : "hover:bg-slate-200/50 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </a>
                );
              })}
            </ul>
          </div>

          {/* RIGHT CONTROLS & CTA */}
          <div className="flex items-center gap-2.5">
            {/* LANGUAGE TOGGLE */}
            <LanguageToggle />

            {/* THEME TOGGLE */}
            <ThemeToggle />

            {/* EXECUTIVE CTA BUTTON */}
            <a
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2
                         rounded-full bg-blue-600 hover:bg-blue-500 text-white
                         px-5 py-2.5 text-xs font-bold tracking-wider uppercase shadow-md shadow-blue-600/20
                         hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 transform active:scale-95"
            >
              <span>{dict.nav.cta}</span>
              <FiArrowRight className="text-sm" />
            </a>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden text-2xl text-slate-800 dark:text-slate-200 p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              aria-label="Toggle Navigation"
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-[70px] left-0 w-full z-40
                       backdrop-blur-2xl bg-white/95 dark:bg-[#09090b]/95 border-b border-slate-200 dark:border-white/[0.08] shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <ul className="flex flex-col divide-y divide-slate-100 dark:divide-white/[0.05] p-6">
              {topNavItems.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <li key={item.name} className="py-2">
                      <div className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 pt-2">
                        {item.name}
                      </div>
                      <div className="pl-2 space-y-2 border-l-2 border-slate-200 dark:border-white/10 my-2">
                        {servicesList.map((svc) => (
                          <a
                            key={svc.id}
                            href={svc.path}
                            onClick={() => setOpen(false)}
                            className="block py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition"
                          >
                            {svc.title}
                          </a>
                        ))}

                      </div>
                    </li>
                  );
                }
                return (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <span>{item.name}</span>
                      <FiArrowRight className="text-xs opacity-50" />
                    </a>
                  </li>
                );
              })}

              <li className="pt-4">
                <a
                  href="/#why-us"
                  onClick={() => setOpen(false)}
                  className="block py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition"
                >
                  {dict.nav.whyUs}
                </a>
                <a
                  href="/#process"
                  onClick={() => setOpen(false)}
                  className="block py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition"
                >
                  {dict.nav.process}
                </a>
              </li>

              <li className="pt-6 pb-2">
                <a
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2
                             rounded-xl bg-blue-600 text-white
                             py-3.5 text-xs font-bold tracking-wider uppercase shadow-md transition"
                >
                  <FiCalendar />
                  {dict.nav.cta}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}




