"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useI18n } from "@/app/context/I18nContext";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="w-full px-8 md:px-16 pt-24 pb-8 relative">
      <div className="flex flex-col md:flex-row items-start justify-between gap-16 pb-16">
        <div className="flex flex-col gap-6 max-w-sm shrink-0">
          <Link href="/" className="inline-block">
            <object type="image/svg+xml" data="/assets/logos/LogoNavbar.svg" width={242} height={113} aria-label="Arborea Experiences" className="pointer-events-none" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-12 md:gap-16 lg:gap-24">
          <div className="flex flex-col gap-5">
            <p className="font-sans font-bold text-base text-[#381d14]/80">{t("footer.links.heading")}</p>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {(t("footer.links.items") || []).map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="font-sans text-sm text-[#381d14]/50 hover:text-[#381d14] transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-sans font-bold text-base text-[#381d14]/80">{t("footer.about.heading")}</p>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {(t("footer.about.items") || []).map((item, i) => (
                <li key={i}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-[#381d14]/50 hover:text-[#381d14] transition-colors duration-200">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-sans font-bold text-base text-[#381d14]/80">{t("footer.contact.heading")}</p>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              <li className="font-sans text-sm text-[#381d14]/50">{t("footer.contact.phone")}</li>
              <li>
                <a href={`mailto:${t("common.email")}`} className="font-sans text-sm text-[#381d14]/50 hover:text-[#381d14] underline transition-colors duration-200">
                  {t("common.email")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#381d14]/[0.12] pt-6 flex items-center justify-between">
        <p className="font-sans text-sm text-[#381d14]/80">{t("footer.copyright")}</p>
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/arboreavillas/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="size-12 rounded-full border border-[#381d14]/[0.12] flex items-center justify-center hover:border-[#381d14]/30 transition-colors duration-200"
          >
            <FaInstagram size={18} className="text-[#381d14]/70" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61574441755795"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="size-12 rounded-full border border-[#381d14]/[0.12] flex items-center justify-center hover:border-[#381d14]/30 transition-colors duration-200"
          >
            <FaFacebook size={18} className="text-[#381d14]/70" />
          </a>
        </div>
      </div>

      <div className="w-full h-6 flex justify-center items-center absolute left-0 bottom-0 bg-black">
        <a
          href="https://aurigital.com?utm_source=arborea-website&utm_medium=footer&utm_campaign=branding"
          target="_blank"
          rel="noopener"
          className="flex justify-center items-center mx-auto w-full"
          aria-label="Créditos de diseño y desarrollo por Aurigital"
        >
          <p className="text-white/60 uppercase text-[10px] text-center p-1 hover:text-white/80 transition-colors">
            Made by Aurigital
          </p>
          <img src="/assets/isotipo.avif" alt="Aurigital" className="h-[18px] w-[18px] ml-1" />
        </a>
      </div>
    </footer>
  );
}
