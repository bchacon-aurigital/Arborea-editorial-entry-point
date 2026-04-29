"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useI18n } from "@/app/context/I18nContext";
import { TbArrowNarrowLeft, TbArrowNarrowRight, TbCompass } from "react-icons/tb";

const ActivitiesCarousel = dynamic(() => import("./ActivitiesCarousel"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-[#f4e9dc]/60 rounded-2xl h-[480px] animate-pulse" />
      ))}
    </div>
  ),
});

export default function ToursActivitiesSection() {
  const { t } = useI18n();
  const swiperRef = useRef(null);

  return (
    <section id="tours" className="flex flex-col px-8 md:px-16 pb-24 gap-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-4" data-aos="fade-up">
          <div className="flex items-center gap-2 w-fit border border-[#381d14]/20 rounded-full px-3 py-1.5">
            <TbCompass size={14} className="text-[#381d14]/60" />
            <span className="font-sans text-xs text-[#381d14]/60 tracking-wide">
              {t("tours.pill")}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl text-[#381d14] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-alpina)" }}
          >
            {t("tours.title")}
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

      <div className="w-full">
        <ActivitiesCarousel swiperRef={swiperRef} />
      </div>

    </section>
  );
}
