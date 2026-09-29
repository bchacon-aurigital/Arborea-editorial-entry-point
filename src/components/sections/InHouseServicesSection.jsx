"use client";

import { TbPhoto, TbArrowRight, TbHandClick, TbAdjustments, TbShoppingCart, TbCirclePlus, TbSend } from "react-icons/tb";
import { useI18n } from "@/app/context/I18nContext";
import Link from "next/link";

const STEP_ICONS = [TbHandClick, TbAdjustments, TbShoppingCart, TbCirclePlus, TbSend];

const CARD_PALETTE = [
  { bg: "#8B5A3C", dark: false }, // Spa — warm clay
  { bg: "#213B2F", dark: false }, // Chef — deep forest green
  { bg: "#5C3324", dark: false }, // Full Fridge — deep sienna
  { bg: "#6B5A2E", dark: false }, // Fishing — olive brown
];

function ServiceCard({ category, title, description, image, href, cta, palette }) {
  const fg       = palette.dark ? "#222E2C" : "#ffffff";
  const fgMuted  = palette.dark ? "rgba(34,46,44,0.55)" : "rgba(255,255,255,0.60)";
  const content = (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full transition-opacity duration-200 hover:opacity-95" style={{ backgroundColor: palette.bg }}>
      <div className="h-72 flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.08)" }}>
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <TbPhoto size={26} style={{ color: fgMuted }} />
        )}
      </div>
      <div className="px-6 py-6 flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1.5">
          <p className="font-sans font-semibold text-sm" style={{ color: fgMuted }}>{category}</p>
          <p className="font-sans font-medium text-lg" style={{ color: fg }}>{title}</p>
        </div>
        <p className="font-sans text-sm leading-relaxed" style={{ color: fgMuted }}>{description}</p>
        {href && cta && (
          <div className="pt-2 mt-auto">
            <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-sm" style={{ color: fg }}>
              {cta}
              <TbArrowRight size={15} />
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="h-full">{content}</Link>;
  }
  return content;
}

export default function InHouseServicesSection() {
  const { t } = useI18n();
  const services = t("inhouse.services");

  const steps = t("inhouse.craftSteps");

  return (
    <section className="flex flex-col px-8 md:px-16 pb-24 gap-16">

      {/* Craft intro + steps */}
      <div className="flex flex-col gap-10" data-aos="fade-up">
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2
            className="text-4xl md:text-5xl text-[#222E2C] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-alpina)" }}
          >
            {t("inhouse.craftTitle")}
          </h2>
          <p className="font-sans text-base text-[#222E2C]/55 leading-relaxed">
            {t("inhouse.craftDescription")}
          </p>
        </div>

        {/* Steps */}
        {Array.isArray(steps) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={i} className="flex-1 flex flex-col gap-3 bg-[#222E2C]/4 rounded-2xl px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[#213B2F] flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-[#D8DDB8]" />
                    </div>
                    <span className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">Step {i + 1}</span>
                  </div>
                  <p className="font-sans text-base font-medium text-[#222E2C] leading-snug">{step}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Signature Experiences title */}
      <h2
        className="text-4xl md:text-5xl text-[#222E2C] tracking-tight leading-tight"
        style={{ fontFamily: "var(--font-alpina)" }}
        data-aos="fade-up"
      >
        {t("inhouse.title")}
      </h2>

      {/* Cards */}
      {Array.isArray(services) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {services.map((svc, i) => (
            <ServiceCard key={i} {...svc} palette={CARD_PALETTE[i % CARD_PALETTE.length]} />
          ))}
        </div>
      )}

    </section>
  );
}
