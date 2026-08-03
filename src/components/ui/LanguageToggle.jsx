import { useLanguage } from "../../lib/i18n.js";
import { FiGlobe } from "react-icons/fi";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full p-1 bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] text-xs font-bold tracking-wider uppercase">
      <FiGlobe className="ml-2 mr-1 text-slate-500 dark:text-slate-400 text-sm" />
      <button
        type="button"
        onClick={() => setLang("id")}
        className={`px-2.5 py-1 rounded-full transition-all duration-300 ${
          lang === "id"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
        aria-label="Bahasa Indonesia"
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full transition-all duration-300 ${
          lang === "en"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
        aria-label="English Language"
      >
        EN
      </button>
    </div>
  );
}
