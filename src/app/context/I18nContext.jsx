"use client";

import { createContext, useContext, useState, useEffect } from "react";
import en from "@/i18n/en.json";
import es from "@/i18n/es.json";

const messages = { en, es };

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState("es");

  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved === "en" || saved === "es") setLocale(saved);
  }, []);

  const toggleLocale = () => {
    const next = locale === "es" ? "en" : "es";
    setLocale(next);
    localStorage.setItem("locale", next);
  };

  // t("common.seeMore") → navega el JSON con dot notation
  const t = (key) => {
    const parts = key.split(".");
    let val = messages[locale];
    for (const p of parts) {
      val = val?.[p];
    }
    return val ?? key;
  };

  return (
    <I18nContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
