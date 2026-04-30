"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useI18n } from "@/app/context/I18nContext";
import { TbArrowNarrowLeft, TbArrowNarrowRight, TbLeaf, TbSun } from "react-icons/tb";

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
  const swiperRef = useRef(null);

  return (
    <section className="flex flex-col pb-24 gap-8">

      {/* ── Hero intro ── */}
      <div className="flex flex-col items-center justify-center gap-6 px-8 md:px-16 pt-32 pb-16 text-center" data-aos="fade-up">
        <div className="flex items-center gap-2 w-fit border border-[#381d14] rounded-full px-5 py-2.5">
          <TbSun size={16} className="text-[#381d14]" />
          <span className="font-sans font-medium text-sm text-[#381d14] tracking-tight">
            {t("hero.introPill")}
          </span>
        </div>
        <h1
          className="text-3xl lg:text-6xl text-[#773824] tracking-[-0.03em] leading-[1.07] max-w-5xl"
          style={{ fontFamily: "var(--font-alpina)" }}
        >
          {t("hero.introTitle")}
        </h1>
        <p className="font-sans font-medium text-base text-[#381d14] leading-relaxed tracking-tight max-w-xl">
          {t("hero.introSubtitle")}
        </p>
        <a
          href="https://wa.me/50685011042"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#F4E9DC] font-sans font-medium text-sm text-[#381d14]"
        >
          {t("hero.whatsappCta")}
          <TbArrowNarrowRight size={16} />
        </a>
      </div>

      {/* ── Houses header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-8 md:px-16">
        <div className="flex flex-col gap-4" data-aos="fade-up">
          <div className="flex items-center gap-2 w-fit border border-[#381d14]/20 rounded-full px-3 py-1.5">
            <TbLeaf size={14} className="text-[#381d14]/60" />
            <span className="font-sans text-xs text-[#381d14]/60 tracking-wide">
              {t("hero.pill")}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl text-[#381d14] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-alpina)" }}
          >
            {t("hero.title")}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0" data-aos="fade-up" data-aos-delay="100">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex items-center justify-center w-16 h-11 rounded-full border border-[#381d14]/30 text-[#381d14]/50 hover:border-[#381d14] hover:text-[#381d14] transition-all duration-200"
            aria-label="Previous"
          >
            <TbArrowNarrowLeft size={20} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="flex items-center justify-center w-16 h-11 rounded-full border border-[#381d14]/30 text-[#381d14]/50 hover:border-[#381d14] hover:text-[#381d14] transition-all duration-200"
            aria-label="Next"
          >
            <TbArrowNarrowRight size={20} />
          </button>
        </div>
      </div>

      {/* ── Carousel ── */}
      <div id="casas" className="w-full px-8 md:px-16">
        <PropertiesCarousel swiperRef={swiperRef} />
      </div>

    </section>
  );
}
