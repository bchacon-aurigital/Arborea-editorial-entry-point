"use client";

import dynamic from "next/dynamic";
import { useI18n } from "@/app/context/I18nContext";

const PropertiesCarousel = dynamic(() => import("./PropertiesCarousel"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-[#f4e9dc]/60 rounded-2xl h-[560px] animate-pulse" />
      ))}
    </div>
  ),
});

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="flex flex-col items-center px-8 md:px-16 pt-24 pb-24 gap-10">

      <div className="flex flex-col items-center gap-7">
        <object
          type="image/svg+xml"
          data="/assets/logos/LogoHero.svg"
          aria-label="Arbórea Experiences"
          className="w-[280px] max-w-full h-auto pointer-events-none"
        />
        <div className="text-base text-[#381d14]/50 text-center leading-relaxed">
          <a href={`mailto:${t("common.email")}`} className="block hover:text-[#381d14] transition-all duration-300">
            {t("common.email")}
          </a>
          <a href={`https://${t("common.website")}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#381d14] transition-all duration-300">
            {t("common.website")}
          </a>
        </div>
      </div>

      <div className="w-full">
        <PropertiesCarousel />
      </div>
    </section>
  );
}
