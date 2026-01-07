import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiMessageCircle,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

export default function Navbar() {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // ✅ cek login
  const isLoggedIn = !!localStorage.getItem("token");

  // ✅ tampilkan auth button HANYA di halaman jobs
  const isJobsPage = location.pathname.startsWith("/jobs");

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
            <NavLink to="/jobs" className={menuClass}>Karir / Lowongan</NavLink>
            <NavLink to="/about" className={menuClass}>About</NavLink>
            <NavLink to="/contact" className={menuClass}>Contact</NavLink>
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* 🔥 AUTH ACTION – DESKTOP (HANYA DI JOBS) */}
            {isJobsPage && (
              <div className="hidden md:flex items-center gap-3">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="text-sm px-4 py-2 border rounded hover:bg-[#f5f5f7]"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-sm px-4 py-2 bg-[#1d1d1f] text-white rounded"
                    >
                      Daftar
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-sm px-4 py-2 border rounded hover:bg-[#f5f5f7]"
                    >
                      <FiUser />
                      Profile
                    </Link>
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

              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: "Portfolio", path: "/portfolio" },
                { name: "Catalog", path: "/catalog" },
                { name: "Karir / Lowongan", path: "/jobs" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-5 text-lg hover:bg-[#f5f5f7]"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {/* 🔥 AUTH – MOBILE (HANYA DI JOBS) */}
              {isJobsPage && (
                !isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="block px-6 py-5 text-lg"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        onClick={() => setOpen(false)}
                        className="block px-6 py-5 text-lg font-semibold"
                      >
                        Daftar
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        className="block px-6 py-5 text-lg"
                      >
                        Profile
                      </Link>
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
