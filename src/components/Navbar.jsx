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
  FiShoppingBag,
} from "react-icons/fi";
import ThemeToggle from "./ui/ThemeToggle.jsx";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (!open && latest > 80 && latest - previous > 4) {
      setHidden(true);
    } else if (latest < previous || latest <= 80) {
      setHidden(false);
    }
  });

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Catalog", path: "/catalog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 backdrop-blur bg-white/70 dark:bg-[#0a0a1a]/70 border-b border-[#e5e5e5] dark:border-slate-700/50 transition-colors"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LOGO */}
          <a href="/" className="flex items-center gap-2">
            <img
              src="/sm-logo.png"
              alt="Sidomulyo Advertising"
              className="h-9 w-auto"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-[#1d1d1f] dark:text-slate-100">
                Sidomulyo Advertising
              </span>
              <span className="text-xs font-medium text-[#6e6e73] dark:text-slate-400">
                digital printing salatiga
              </span>
            </span>
          </a>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex space-x-8 text-sm text-[#1d1d1f] dark:text-slate-200">
              {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`relative transition cursor-pointer hover:text-orange-500 dark:hover:text-orange-400 ${pathname === item.path ? "text-orange-600 dark:text-orange-400 font-semibold" : ""}`}
              >
                {item.name}
              </a>
            ))}
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* THEME TOGGLE */}
            <ThemeToggle />

            {/* MARKETPLACE */}
            <a
              href="/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2
                         rounded-full border border-[#d2d2d7] dark:border-slate-600
                         px-4 py-2 text-sm font-medium
                         hover:bg-[#f5f5f7] dark:hover:bg-slate-800 transition"
            >
              <FiShoppingBag />
              Marketplace
            </a>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-2xl"
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-[72px] left-0 w-full z-40
                       backdrop-blur bg-white/90 dark:bg-[#0a0a1a]/90 border-b border-[#e5e5e5] dark:border-slate-700/50"
          >
            <ul className="flex flex-col divide-y divide-[#e5e5e5] dark:divide-slate-700/50">
            {navItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-5 text-lg hover:bg-[#f5f5f7] dark:hover:bg-slate-800 transition"
                  >
                    {item.name}
                  </a>
                </li>
              ))}

              {/* MARKETPLACE – MOBILE */}
              <li className="px-6 py-5">
                <a
                  href="/marketplace"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2
                             rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f]
                             px-6 py-3 text-sm font-medium transition"
                >
                  <FiShoppingBag />
                  Marketplace
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
