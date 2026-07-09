"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import id from "@/translations/id.json";
import en from "@/translations/en.json";

type Language = "id" | "en";
type Translations = typeof id;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const translations = { id, en };

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const subscribe = (callback: () => void) => {
  window.addEventListener("language-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("language-change", callback);
    window.removeEventListener("storage", callback);
  };
};

const getSnapshot = (): Language => {
  const savedLang = localStorage.getItem("language") as Language;
  return savedLang === "id" || savedLang === "en" ? savedLang : "id";
};

const getServerSnapshot = (): Language => {
  return "id";
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    window.dispatchEvent(new Event("language-change"));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
