"use client";

import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { useI18n } from "@/app/context/I18nContext";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="w-full px-8 md:px-16 pt-24 pb-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-16 pb-16">
        <div className="flex flex-col gap-6 max-w-sm shrink-0">
          <Link href="/" className="inline-block">
            <object type="image/svg+xml" data="/assets/logos/LogoNavbar.svg" width={182} height={83} aria-label="Arborea Experiences" className="pointer-events-none" />
          </Link>
          <div className="flex flex-col gap-5">
            <p className="font-sans text-base text-[#381d14]/50 leading-relaxed">
              {t("footer.description")}
            </p>
            <p className="font-sans font-medium text-sm text-[#381d14]/80">
              {t("footer.location")}
            </p>
          </div>
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
              <li className="font-sans text-sm text-[#381d14]/50">{t("footer.location")}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#381d14]/[0.12] pt-6 flex items-center justify-between">
        <p className="font-sans text-sm text-[#381d14]/80">{t("footer.copyright")}</p>
        <div className="flex items-center gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="size-12 rounded-full border border-[#381d14]/[0.12] flex items-center justify-center hover:border-[#381d14]/30 transition-colors duration-200"
          >
            <FaFacebook size={18} className="text-[#381d14]/70" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="size-12 rounded-full border border-[#381d14]/[0.12] flex items-center justify-center hover:border-[#381d14]/30 transition-colors duration-200"
          >
            <FaLinkedin size={18} className="text-[#381d14]/70" />
          </a>
        </div>
      </div>
    </footer>
  );
}
