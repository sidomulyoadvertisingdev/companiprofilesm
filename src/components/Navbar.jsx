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
  FiMessageCircle,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const [pathname, setPathname] = useState("");
  useEffect(() => {
    setIsClient(true);
    setPathname(window.location.pathname);
  }, []);

  const isLoggedIn = isClient ? !!localStorage.getItem("token") : false;
  const isJobsPage = isClient ? pathname.startsWith("/jobs") : false;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 80 && !open) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Catalog", path: "/catalog" },
    { name: "Karir / Lowongan", path: "/jobs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
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
        className="fixed top-0 w-full z-50 backdrop-blur bg-white/70 border-b border-[#e5e5e5]"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LOGO */}
          <a href="/">
            <img
              src="/logo-sidomulyo.png"
              alt="Sidomulyo Advertising"
              className="h-9 w-auto"
            />
          </a>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex space-x-8 text-sm text-[#1d1d1f]">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`hover:opacity-70 transition cursor-pointer ${pathname === item.path ? "opacity-50" : ""}`}
              >
                {item.name}
              </a>
            ))}
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* AUTH ACTION – DESKTOP (HANYA DI JOBS) */}
            {isJobsPage && (
              <div className="hidden md:flex items-center gap-3">
                {!isLoggedIn ? (
                  <>
                    <a
                      href="/login"
                      className="text-sm px-4 py-2 border rounded hover:bg-[#f5f5f7]"
                    >
                      Login
                    </a>
                    <a
                      href="/register"
                      className="text-sm px-4 py-2 bg-[#1d1d1f] text-white rounded"
                    >
                      Daftar
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="/profile"
                      className="flex items-center gap-2 text-sm px-4 py-2 border rounded hover:bg-[#f5f5f7]"
                    >
                      <FiUser />
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm px-4 py-2 border rounded hover:bg-red-50 text-red-600"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}

            {/* WHATSAPP */}
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
              {navItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-5 text-lg hover:bg-[#f5f5f7]"
                  >
                    {item.name}
                  </a>
                </li>
              ))}

              {/* AUTH – MOBILE (HANYA DI JOBS) */}
              {isJobsPage && (
                !isLoggedIn ? (
                  <>
                    <li>
                      <a
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="block px-6 py-5 text-lg"
                      >
                        Login
                      </a>
                    </li>
                    <li>
                      <a
                        href="/register"
                        onClick={() => setOpen(false)}
                        className="block px-6 py-5 text-lg font-semibold"
                      >
                        Daftar
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <a
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className="block px-6 py-5 text-lg"
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                        className="w-full text-left px-6 py-5 text-lg text-red-600"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )
              )}

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
