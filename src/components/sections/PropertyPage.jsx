"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Navbar from "@/components/layout/navbar";
import GoodToKnowSection from "@/components/sections/GoodToKnowSection";
import Footer from "@/components/layout/Footer";
import { useI18n } from "@/app/context/I18nContext";
import { HIGHLIGHT_ICONS } from "@/data/properties";
import {
  TbWifi, TbKey, TbMapPin, TbCopy, TbCheck, TbChevronRight, TbArrowLeft, TbInfoCircle,
} from "react-icons/tb";

export default function PropertyPage({ property }) {
  const { t } = useI18n();
  const { i18nKey, images, wifi, directionsUrl, highlights } = property;

  const name  = t(`properties.${i18nKey}.name`);
  const about = t(`properties.${i18nKey}.about`);

  return (
    <>
      <Navbar />
      <main className="pt-24">

        {/* ── Header ── */}
        <div className="px-8 md:px-16 pt-8 pb-6 flex flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 w-fit text-sm font-sans font-medium text-[#222E2C]/50 hover:text-[#222E2C] transition-colors duration-200"
          >
            <TbArrowLeft size={16} />
            {t("common.back")}
          </Link>
          <h1
            className="text-5xl md:text-6xl text-[#213B2F] tracking-tight"
            style={{ fontFamily: "var(--font-alpina)" }}
            data-aos="fade-up"
          >
            {name}
          </h1>
          <div className="flex items-center gap-3 flex-wrap" data-aos="fade-up" data-aos-delay="80">
            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200"
              >
                <TbMapPin size={16} />
                {t("common.getDirections")}
              </a>
            )}
            <a
              href="#wifi-section"
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#222E2C] font-sans font-medium text-sm text-[#222E2C] hover:bg-[#222E2C]/5 transition-colors duration-200"
            >
              <TbWifi size={16} />
              {t("propertyPage.wifiAndMore")}
            </a>
          </div>
        </div>

        {/* ── Image grid ── */}
        <div className="mb-12">
          {/* Mobile: Swiper carousel */}
          <div className="md:hidden px-8">
            <Swiper
              modules={[Pagination]}
              slidesPerView={1}
              spaceBetween={12}
              pagination={{ clickable: true }}
              className="property-swiper"
            >
              {images.map((src, i) => (
                <SwiperSlide key={i}>
                  <img src={src} alt={`${name} ${i + 1}`} className="w-full h-80 object-cover rounded-2xl" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* Desktop: 1 large + 2×2 grid */}
          <div className="hidden md:grid px-8 md:px-16 grid-cols-[55fr_45fr] gap-3 min-h-[600px]">
            <img src={images[0]} alt={name} className="w-full h-full object-cover rounded-2xl" />
            <div className="grid grid-cols-2 grid-rows-2 gap-3">
              {images.slice(1, 5).map((src, i) => (
                <img key={i} src={src} alt={`${name} ${i + 2}`} className="w-full h-full object-cover rounded-2xl" />
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-8 md:px-16 flex flex-col gap-12 md:gap-16 pb-24">

          {/* WiFi & Directions */}
          <div id="wifi-section" className="flex flex-col gap-5" data-aos="fade-up">
            <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
              {t("propertyPage.wifiSection")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CopyCard
                icon={<TbWifi size={20} className="text-[#213B2F]" />}
                label={t("propertyPage.wifiName")}
                value={wifi.name}
              />
              <CopyCard
                icon={<TbKey size={20} className="text-[#213B2F]" />}
                label={t("propertyPage.password")}
                value={wifi.password}
              />
              {directionsUrl ? (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#213B2F] rounded-xl px-4 py-4 flex items-center justify-between gap-3 hover:bg-[#213B2F]/90 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#EDE5D8] rounded-xl size-12 flex items-center justify-center shrink-0">
                      <TbMapPin size={20} className="text-[#213B2F]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-sans font-semibold text-sm text-[#D8DDB8]">{t("propertyPage.directions")}</p>
                      <p className="font-sans text-sm text-[#D8DDB8]/60">{t("propertyPage.seeDirections")}</p>
                    </div>
                  </div>
                  <div className="border border-[#D8DDB8]/20 rounded-xl size-9 flex items-center justify-center shrink-0">
                    <TbChevronRight size={16} className="text-[#D8DDB8]/60" />
                  </div>
                </a>
              ) : (
                <div className="bg-[#222E2C]/10 rounded-xl px-4 py-4 flex items-center gap-3">
                  <div className="bg-[#222E2C]/10 rounded-xl size-12 flex items-center justify-center shrink-0">
                    <TbMapPin size={20} className="text-[#222E2C]/40" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-sans font-semibold text-sm text-[#222E2C]/40">{t("propertyPage.directions")}</p>
                    <p className="font-sans text-sm text-[#222E2C]/30">{t("propertyPage.directionsComingSoon")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Highlights */}
          <div className="flex flex-col gap-5" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("propertyPage.highlightsSection")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-6 pb-2">
              {highlights.map((key, i) => {
                const Icon = HIGHLIGHT_ICONS[key] ?? HIGHLIGHT_ICONS.views;
                return (
                  <div key={key} className="flex items-center gap-3" data-aos="fade-up" data-aos-delay={i * 60}>
                    <div className="border border-[#222E2C]/15 rounded-xl size-10 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-[#222E2C]/70" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-sans font-semibold text-sm text-[#222E2C] flex items-center gap-1.5">
                        {t(`propertyPage.highlights.${key}.title`)}
                        {key === "petsAllowed" && (
                          <TbInfoCircle
                            size={15}
                            className="text-[#222E2C]/40 shrink-0"
                            title={t("propertyPage.highlights.petsAllowed.restrictionsNote")}
                          />
                        )}
                      </p>
                      <p className="font-sans text-sm text-[#222E2C]/60">
                        {t(`propertyPage.highlights.${key}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col gap-5" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("propertyPage.aboutSection")}
              </h2>
            </div>
            <p className="font-sans text-base text-[#222E2C]/60 leading-relaxed whitespace-pre-line max-w-4xl">
              {about}
            </p>
          </div>

        </div>

        <GoodToKnowSection />
      </main>
      <Footer />
    </>
  );
}

function CopyCard({ icon, label, value }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#213B2F] rounded-xl px-4 py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="bg-[#EDE5D8] rounded-xl size-12 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <p className="font-sans font-semibold text-sm text-[#D8DDB8]">{label}</p>
          <p className="font-sans text-sm text-[#D8DDB8]/60 truncate">{value}</p>
        </div>
      </div>
      <button
        onClick={copy}
        className="border border-[#D8DDB8]/20 rounded-xl size-9 flex items-center justify-center shrink-0 hover:border-[#D8DDB8]/40 transition-colors duration-200"
        aria-label="Copy"
      >
        {copied
          ? <TbCheck size={16} className="text-[#D8DDB8]/60" />
          : <TbCopy size={16} className="text-[#D8DDB8]/60" />
        }
      </button>
    </div>
  );
}
