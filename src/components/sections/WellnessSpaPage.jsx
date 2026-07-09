"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import {
  TbArrowLeft, TbLeaf, TbCircleCheck, TbBrandWhatsapp,
  TbHeart, TbDroplet, TbFlame, TbSeedling, TbWaveSine, TbMoon, TbSparkles,
} from "react-icons/tb";

const WHATSAPP = "50683010027";

export default function WellnessSpaPage() {
  const { t } = useI18n();
  const router = useRouter();

  const massageItems  = t("wellnessSpa.massages.items");
  const fourHands     = t("wellnessSpa.massages.fourHands");
  const facialMain    = t("wellnessSpa.facials.main");
  const addonItems    = t("wellnessSpa.facials.addons.items");
  const packages      = t("wellnessSpa.packages.items");
  const pricingMassages  = t("wellnessSpa.pricing.massages");
  const pricingFourHands = t("wellnessSpa.pricing.fourHands");
  const pricingFacials   = t("wellnessSpa.pricing.facials");

  return (
    <>
      <Navbar />
      <main className="pt-24">

        {/* Header */}
        <div className="px-8 md:px-16 pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1" data-aos="fade-up">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 w-fit mb-3 text-sm font-sans font-medium text-[#222E2C]/50 hover:text-[#222E2C] transition-colors duration-200"
            >
              <TbArrowLeft size={16} />
              {t("common.back")}
            </button>
            <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-4 py-2 mb-3">
              <TbSparkles size={15} className="text-[#222E2C]" />
              <span className="font-sans text-sm text-[#222E2C]">{t("wellnessSpa.pill")}</span>
            </div>
            <h1
              className="text-4xl md:text-5xl text-[#213B2F] tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-alpina)" }}
            >
              {t("wellnessSpa.title")}
            </h1>
            <p className="font-sans text-sm text-[#222E2C]/50 mt-1">{t("wellnessSpa.subtitle")}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200 shrink-0 w-fit"
          >
            <TbBrandWhatsapp size={16} />
            {t("wellnessSpa.whatsapp")}
          </a>
        </div>

        <div className="px-8 md:px-16 flex flex-col gap-16 pb-24">

          {/* Story */}
          <div className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col gap-4" data-aos="fade-up">
            <TbSparkles size={22} className="text-[#D8DDB8]/50" />
            <h2 className="font-sans font-semibold text-lg text-[#D8DDB8]">
              {t("wellnessSpa.story.heading")}
            </h2>
            <p className="font-sans text-sm text-[#D8DDB8]/70 leading-relaxed whitespace-pre-line max-w-3xl">
              {t("wellnessSpa.story.body")}
            </p>
          </div>

          {/* Massages */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {t("wellnessSpa.massages.subheading")}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("wellnessSpa.massages.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">
                {t("wellnessSpa.massages.description")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.isArray(massageItems) && massageItems.map((name, i) => (
                <div key={i} className="bg-[#E0D4C4] rounded-xl px-5 py-5 flex flex-col gap-3">
                  <TbLeaf size={18} className="text-[#213B2F]/50" />
                  <div>
                    <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{name}</h3>
                    <p className="font-sans text-xs text-[#222E2C]/50 mt-1">60 min · 90 min</p>
                  </div>
                </div>
              ))}
              {fourHands && (
                <div className="bg-[#213B2F] rounded-xl px-5 py-5 flex flex-col gap-3">
                  <TbHeart size={18} className="text-[#D8DDB8]/50" />
                  <div>
                    <h3 className="font-sans font-semibold text-sm text-[#D8DDB8]">{fourHands.label}</h3>
                    <p className="font-sans text-xs text-[#D8DDB8]/50 mt-1">{fourHands.duration}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Facial Treatments */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {t("wellnessSpa.facials.subheading")}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("wellnessSpa.facials.heading")}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {facialMain && (
                <div className="bg-[#E0D4C4] rounded-xl px-6 py-5">
                  <span className="font-sans font-semibold text-sm text-[#222E2C]">{facialMain.name}</span>
                </div>
              )}
              <div className="flex flex-col gap-3 pt-2">
                <div>
                  <p className="font-sans font-semibold text-sm text-[#222E2C]">{t("wellnessSpa.facials.addons.heading")}</p>
                  <p className="font-sans text-xs text-[#222E2C]/50 mt-0.5">
                    {t("wellnessSpa.facials.addons.duration")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(addonItems) && addonItems.map((name, i) => (
                    <div key={i} className="border border-[#222E2C]/10 rounded-full px-4 py-2">
                      <span className="font-sans text-sm text-[#222E2C]/70">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Spa Packages */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {t("wellnessSpa.packages.subheading")}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("wellnessSpa.packages.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">
                {t("wellnessSpa.packages.description")}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {Array.isArray(packages) && packages.map((pkg, i) => (
                <PackageCard key={i} pkg={pkg} colorIndex={i} />
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex flex-col gap-10" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {t("wellnessSpa.pricing.subheading")}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("wellnessSpa.pricing.heading")}
              </h2>
            </div>

            {/* Individual treatments: 2-col on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* Left: Massages + Four Hands */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">
                    {t("wellnessSpa.pricing.massagesHeading")}
                  </p>
                  <div className="flex flex-col gap-2">
                    {Array.isArray(pricingMassages) && pricingMassages.map((item, i) => (
                      <PriceRow key={i} label={item.label} price={item.price} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">
                    {t("wellnessSpa.pricing.fourHandsHeading")}
                  </p>
                  <div className="flex flex-col gap-2">
                    {Array.isArray(pricingFourHands) && pricingFourHands.map((item, i) => (
                      <PriceRow key={i} label={item.label} price={item.price} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Facials + Add-ons */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">
                    {t("wellnessSpa.pricing.facialsHeading")}
                  </p>
                  <div className="flex flex-col gap-2">
                    {Array.isArray(pricingFacials) && pricingFacials.map((item, i) => (
                      <PriceRow key={i} label={item.label} price={item.price} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">
                      {t("wellnessSpa.pricing.addonsHeading")}
                    </p>
                    <p className="font-sans text-xs text-[#222E2C]/40 mt-0.5">
                      {t("wellnessSpa.pricing.addonsSubheading")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {Array.isArray(addonItems) && addonItems.map((name, i) => (
                      <PriceRow key={i} label={name} price="$40" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Spa Packages: 2-col grid */}
            <div className="flex flex-col gap-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">
                {t("wellnessSpa.packages.heading")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Array.isArray(packages) && packages.map((pkg, i) => (
                  <PriceRow key={i} label={`${pkg.name} · ${pkg.duration}`} price={pkg.price} />
                ))}
              </div>
            </div>

            <p className="font-sans text-xs text-[#222E2C]/40 italic">
              {t("wellnessSpa.pricing.note")}
            </p>
          </div>

          {/* Bottom CTA */}
          <div
            className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            data-aos="fade-up"
          >
            <div className="flex flex-col gap-1.5">
              <h2 className="font-sans font-semibold text-xl text-[#D8DDB8]">
                {t("wellnessSpa.ctaHeading")}
              </h2>
              <p className="font-sans text-sm text-[#D8DDB8]/60">
                {t("wellnessSpa.ctaSubheading")}
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#D8DDB8] font-sans font-medium text-sm text-[#213B2F] hover:bg-[#D8DDB8]/90 transition-colors duration-200 shrink-0"
            >
              <TbBrandWhatsapp size={16} />
              {t("wellnessSpa.whatsapp")}
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

const PACKAGE_THEMES = [
  { bg: "#9B7B6E", title: "#FFF4EF", body: "rgba(255,244,239,0.85)", subtle: "rgba(255,244,239,0.65)", border: "rgba(255,244,239,0.22)", icon: TbHeart },
  { bg: "#59493B", title: "#FFEAD8", body: "rgba(255,234,216,0.85)", subtle: "rgba(255,234,216,0.65)", border: "rgba(255,234,216,0.22)", icon: TbHeart },
  { bg: "#4B4D40", title: "#EDE5D8", body: "rgba(237,229,216,0.85)", subtle: "rgba(237,229,216,0.65)", border: "rgba(237,229,216,0.22)", icon: TbDroplet },
  { bg: "#345B49", title: "#EDEFDF", body: "rgba(237,239,223,0.85)", subtle: "rgba(237,239,223,0.65)", border: "rgba(237,239,223,0.22)", icon: TbLeaf },
  { bg: "#A5886D", title: "#2C1A0E", body: "rgba(44,26,14,0.80)", subtle: "rgba(44,26,14,0.60)", border: "rgba(44,26,14,0.18)", icon: TbSeedling },
  { bg: "#3D6B7A", title: "#E4F4F8", body: "rgba(228,244,248,0.85)", subtle: "rgba(228,244,248,0.65)", border: "rgba(228,244,248,0.22)", icon: TbWaveSine },
  { bg: "#6B7A8D", title: "#EEF0F8", body: "rgba(238,240,248,0.85)", subtle: "rgba(238,240,248,0.65)", border: "rgba(238,240,248,0.22)", icon: TbMoon },
];

function PackageCard({ pkg, colorIndex = 0 }) {
  const theme = PACKAGE_THEMES[colorIndex] ?? PACKAGE_THEMES[0];
  const Icon = theme.icon;
  return (
    <div style={{ backgroundColor: theme.bg }} className="rounded-2xl px-6 py-7 flex flex-col md:flex-row gap-6">
      <div className="md:w-56 shrink-0 flex flex-col gap-3">
        <Icon size={26} style={{ color: theme.subtle }} />
        <div>
          <h3 className="font-sans font-semibold text-lg" style={{ color: theme.title }}>{pkg.name}</h3>
          <p className="font-sans text-xs mt-1" style={{ color: theme.subtle }}>{pkg.duration}</p>
        </div>
      </div>

      <div style={{ backgroundColor: theme.border }} className="w-full h-px md:w-px md:h-auto md:self-stretch" />

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {pkg.includes.map((item, i) => (
            <div
              key={i}
              style={{ borderColor: theme.border }}
              className="flex items-center gap-1.5 border rounded-full px-2.5 py-1"
            >
              <TbCircleCheck size={12} style={{ color: theme.subtle }} className="shrink-0" />
              <span className="font-sans text-xs font-medium" style={{ color: theme.body }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PriceRow({ label, price }) {
  return (
    <div className="bg-[#E0D4C4] rounded-xl px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 flex-1">
      <span className="font-sans text-sm text-[#222E2C]/70">{label}</span>
      <span className="font-sans font-semibold text-sm text-[#222E2C] sm:whitespace-nowrap">{price}</span>
    </div>
  );
}
