import { useState, useEffect } from "react";
import { translations } from "../data/translations.js";

export function getLanguage() {
  if (typeof window === "undefined") return "id";
  return localStorage.getItem("lang") || "id";
}

export function setLanguage(lang) {
  if (typeof window === "undefined") return;
  localStorage.setItem("lang", lang);
  window.dispatchEvent(new CustomEvent("languageChange", { detail: lang }));
}

export function useLanguage() {
  const [lang, setLangState] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = (e) => {
      setLangState(e.detail || getLanguage());
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const changeLang = (newLang) => {
    setLanguage(newLang);
  };

  const t = (path) => {
    const keys = path.split(".");
    let current = translations[lang] || translations.id;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return path;
      }
    }
    return current;
  };

  return { lang, setLang: changeLang, t, dict: translations[lang] || translations.id };
}
