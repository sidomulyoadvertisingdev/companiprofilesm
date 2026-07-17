import { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  });

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-colors ${
        theme === "dark"
          ? "border-slate-600 bg-slate-800 text-yellow-400 hover:bg-slate-700"
          : "border-[#d2d2d7] bg-white text-slate-600 hover:bg-[#f5f5f7]"
      } ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
}
