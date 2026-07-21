"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";

const navLinkKeys = [
  { key: "houses",      href: "/#casas" },
  { key: "tours",       href: "#tours" },
  { key: "goodToKnow",  href: "#bueno-saber" },
  { key: "emergencias", href: "#emergencias" },
];

export default function Navbar() {
  const { locale, toggleLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY || y < 80);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Logo + idioma */}
      <header
        className={`fixed top-0 left-0 w-full z-40 flex items-center justify-between px-8 md:px-16 py-5 transition-transform duration-300 pointer-events-none ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link href="/" className="inline-block bg-[#E0D4C4] p-2 rounded-xl">
            <object type="image/svg+xml" data="/assets/logos/LogoNavbar.svg" width={162} height={63} aria-label="Arborea Experiences" className="pointer-events-none" />
          </Link>

          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 bg-[#213B2F] rounded-xl px-4 py-2.5 font-sans text-sm font-semibold text-[#D8DDB8] hover:bg-[#213B2F]/80 transition-colors duration-200"
            aria-label="Switch language"
          >
            <span className={locale === "en" ? "opacity-100" : "opacity-40"}>EN</span>
            <span className="opacity-30 select-none">|</span>
            <span className={locale === "es" ? "opacity-100" : "opacity-40"}>ES</span>
          </button>
        </div>

      </header>

      {/* Nav Osmo */}
      <nav
        data-navigation-status={isOpen ? "active" : "not-active"}
        className="navigation"
        aria-label="Menú principal"
      >
        <div
          data-navigation-toggle="close"
          className="navigation__dark-bg"
          onClick={() => setIsOpen(false)}
        />

        <div className="hamburger-nav">
          <div className="hamburger-nav__bg" />

          <div className="hamburger-nav__group">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-0 text-[#222E2C] font-extrabold">Menu</p>
            <ul className="flex flex-col gap-1.5 p-0 m-0 list-none">
              <li>
                <button
                  onClick={toggleLocale}
                  className="hamburger-nav__a w-full"
                  style={{ background: "transparent" }}
                >
                  <span className="text-2xl whitespace-nowrap pr-5">
                    {locale === "es" ? "English" : "Español"}
                  </span>
                  <div className="hamburger-nav__dot" />
                </button>
              </li>
              {navLinkKeys.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="hamburger-nav__a" onClick={() => setIsOpen(false)}>
                    <span className="text-2xl whitespace-nowrap pr-5">{t(`nav.links.${link.key}`)}</span>
                    <div className="hamburger-nav__dot" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="hamburger-nav__toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            <div className="hamburger-nav__toggle-bar" />
            <div className="hamburger-nav__toggle-bar" />
          </button>
        </div>
      </nav>
    </>
  );
}
