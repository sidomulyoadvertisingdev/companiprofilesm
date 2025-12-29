import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiMessageCircle,
} from "react-icons/fi";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 80 && !open) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const menuClass =
    "hover:opacity-70 transition cursor-pointer";

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 backdrop-blur bg-white/70 border-b border-[#e5e5e5]"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LOGO */}
          <Link to="/">
            <img
              src="/logo-sidomulyo.png"
              alt="Sidomulyo Advertising"
              className="h-9 w-auto"
            />
          </Link>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex space-x-8 text-sm text-[#1d1d1f]">
            <NavLink to="/" className={menuClass}>Home</NavLink>
            <NavLink to="/services" className={menuClass}>Services</NavLink>
            <NavLink to="/portfolio" className={menuClass}>Portfolio</NavLink>
            <NavLink to="/catalog" className={menuClass}>Catalog</NavLink>
            <NavLink to="/about" className={menuClass}>About</NavLink>
            <NavLink to="/contact" className={menuClass}>Contact</NavLink>
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* MARKETPLACE – DESKTOP */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://www.tokopedia.com/sidomulyo-printing--adver"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition"
              >
                <img src="/logo-tokopedia.png" className="h-5" />
              </a>

              <a
                href="https://www.tiktok.com/@sidomulyo.advertising"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition"
              >
                <img src="/logo-tiktokshop.png" className="h-5" />
              </a>

              <a
                href="https://shopee.co.id/sidomulyoadvertising"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition"
              >
                <img src="/logo-shopee.png" className="h-5" />
              </a>
            </div>

            {/* WHATSAPP DESKTOP */}
            <a
              href="https://wa.me/6288808888880"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2
                         rounded-full border border-[#d2d2d7]
                         px-4 py-2 text-sm font-medium
                         hover:bg-[#f5f5f7] transition"
            >
              <FiMessageCircle />
              WhatsApp
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
                       backdrop-blur bg-white/90 border-b border-[#e5e5e5]"
          >
            <ul className="flex flex-col divide-y">

              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: "Portfolio", path: "/portfolio" },
                { name: "Catalog", path: "/catalog" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-5 text-lg
                               hover:bg-[#f5f5f7]"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {/* MARKETPLACE – MOBILE */}
              <li className="px-6 py-5">
                <div className="flex gap-4 items-center">
                  <a href="https://www.tokopedia.com/sidomulyo-printing--adver" target="_blank">
                    <img src="/logo-tokopedia.png" className="h-6" />
                  </a>
                  <a href="https://www.tiktok.com/@sidomulyo.advertising" target="_blank">
                    <img src="/logo-tiktokshop.png" className="h-6" />
                  </a>
                  <a href="https://shopee.co.id/sidomulyoadvertising" target="_blank">
                    <img src="/logo-shopee.png" className="h-6" />
                  </a>
                </div>
              </li>

              {/* WHATSAPP – MOBILE */}
              <li className="px-6 py-5">
                <a
                  href="https://wa.me/6288808888880"
                  className="inline-flex items-center gap-2
                             rounded-full bg-[#1d1d1f] text-white
                             px-6 py-3 text-sm font-medium"
                >
                  <FiMessageCircle />
                  WhatsApp
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
