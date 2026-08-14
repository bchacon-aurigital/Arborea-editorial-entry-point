"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import OrderCheckoutForm from "@/components/sections/OrderCheckoutForm";
import { useOrderCart } from "@/hooks/useOrderCart";
import {
  TbArrowLeft, TbAnchor, TbCheck, TbBrandWhatsapp, TbCircleCheck,
  TbFish, TbSun, TbWaveSine, TbSunset2, TbClock,
} from "react-icons/tb";

const WHATSAPP = "50685011042";

const PACKAGE_ICONS = [TbWaveSine, TbAnchor, TbSun, TbFish, TbFish, TbSunset2];

export default function FishingToursPage() {
  const { t } = useI18n();
  const cart = useOrderCart();
  const [notes, setNotes] = useState("");

  const packages = t("fishingTours.packages.items");
  const conditionItems = t("fishingTours.conditions.items");

  return (
    <>
      <Navbar />
      <main className="pt-24">

        {/* Header */}
        <div className="px-8 md:px-16 pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1" data-aos="fade-up">
            <Link
              href="/"
              className="flex items-center gap-1.5 w-fit mb-3 text-sm font-sans font-medium text-[#222E2C]/50 hover:text-[#222E2C] transition-colors duration-200"
            >
              <TbArrowLeft size={16} />
              {t("common.back")}
            </Link>
            <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-4 py-2 mb-3">
              <TbAnchor size={15} className="text-[#222E2C]" />
              <span className="font-sans text-sm text-[#222E2C]">{t("fishingTours.pill")}</span>
            </div>
            <h1
              className="text-4xl md:text-5xl text-[#213B2F] tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-alpina)" }}
            >
              {t("fishingTours.title")}
            </h1>
            <p className="font-sans text-sm text-[#222E2C]/50 mt-1">{t("fishingTours.subtitle")}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200 shrink-0 w-fit"
          >
            <TbBrandWhatsapp size={16} />
            {t("fishingTours.whatsapp")}
          </a>
        </div>

        <div className="px-8 md:px-16 flex flex-col gap-16 pb-24">

          {/* Story */}
          <div className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col gap-4" data-aos="fade-up">
            <TbAnchor size={22} className="text-[#D8DDB8]/50" />
            <h2 className="font-sans font-semibold text-lg text-[#D8DDB8]">
              {t("fishingTours.story.heading")}
            </h2>
            <p className="font-sans text-sm text-[#D8DDB8]/70 leading-relaxed whitespace-pre-line max-w-3xl">
              {t("fishingTours.story.body")}
            </p>
          </div>

          {/* Packages */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {t("fishingTours.packages.subheading")}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fishingTours.packages.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">
                {t("fishingTours.packages.description")}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {Array.isArray(packages) && packages.map((pkg, i) => (
                <PackageCard
                  key={i}
                  pkg={pkg}
                  icon={PACKAGE_ICONS[i % PACKAGE_ICONS.length]}
                  selected={cart.isSelected(`fishing-package-${i}`)}
                  onClick={() =>
                    cart.toggleItem(`fishing-package-${i}`, {
                      label: `${pkg.name} (${pkg.priceLabel})`,
                      price: pkg.priceValue,
                    })
                  }
                />
              ))}
            </div>
            <p className="font-sans text-xs text-[#222E2C]/40 italic">{t("fishingTours.packages.durationNote")}</p>
          </div>

          {/* Conditions / Good to know */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fishingTours.conditions.heading")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.isArray(conditionItems) && conditionItems.map((item, i) => (
                <div key={i} className="bg-[#E0D4C4] rounded-xl px-5 py-5 flex items-start gap-3">
                  <TbCircleCheck size={18} className="text-[#222E2C]/40 shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-[#222E2C]/60 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <p className="font-sans text-xs text-[#222E2C]/40 italic">{t("fishingTours.note")}</p>
          </div>

          <OrderCheckoutForm
            service="Fishing Tours"
            lines={cart.lines}
            total={cart.total}
            notes={notes}
            onNotesChange={setNotes}
          />

          {/* Bottom CTA */}
          <div
            className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            data-aos="fade-up"
          >
            <div className="flex flex-col gap-1.5">
              <h2 className="font-sans font-semibold text-xl text-[#D8DDB8]">
                {t("fishingTours.ctaHeading")}
              </h2>
              <p className="font-sans text-sm text-[#D8DDB8]/60">
                {t("fishingTours.ctaSubheading")}
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#D8DDB8] font-sans font-medium text-sm text-[#213B2F] hover:bg-[#D8DDB8]/90 transition-colors duration-200 shrink-0"
            >
              <TbBrandWhatsapp size={16} />
              {t("fishingTours.whatsapp")}
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

const DURATION_STYLES = {
  full: { bg: "#B8894F", text: "#FFF6EA", icon: TbSun },
  half: { bg: "#3D7A6B", text: "#EAFFF9", icon: TbClock },
};

function DurationBadge({ label, isHalf }) {
  const style = isHalf ? DURATION_STYLES.half : DURATION_STYLES.full;
  const Icon = style.icon;
  return (
    <span
      style={{ backgroundColor: style.bg, color: style.text }}
      className="inline-flex items-center gap-1.5 w-fit pl-2 pr-3 py-1 rounded-full font-sans text-xs font-semibold shadow-sm"
    >
      <Icon size={13} />
      {label}
    </span>
  );
}

function PackageCard({ pkg, icon: Icon, selected, onClick }) {
  const isHalf = /half|medio/i.test(pkg.duration || "");
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl px-6 py-7 flex flex-col md:flex-row gap-6 transition-all duration-200 ${
        selected ? "bg-[#213B2F] ring-2 ring-[#213B2F] ring-offset-2 ring-offset-[#F7F3EC]" : "bg-[#E0D4C4]"
      }`}
    >
      <div className="md:w-56 shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Icon size={26} className={selected ? "text-[#D8DDB8]/60" : "text-[#213B2F]/50"} />
          {selected && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15">
              <TbCheck size={12} className="text-[#D8DDB8]" />
            </span>
          )}
        </div>
        <div>
          <h3 className={`font-sans font-semibold text-lg ${selected ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>
            {pkg.name}
          </h3>
          <p className={`font-sans text-xs mt-1 ${selected ? "text-[#D8DDB8]/60" : "text-[#222E2C]/50"}`}>
            {pkg.species}
          </p>
        </div>
        {pkg.duration && <DurationBadge label={pkg.duration} isHalf={isHalf} />}
      </div>

      <div className={`w-full h-px md:w-px md:h-auto md:self-stretch ${selected ? "bg-[#D8DDB8]/20" : "bg-[#222E2C]/10"}`} />

      <div className="flex-1 flex flex-col justify-between gap-3">
        <p className={`font-sans text-sm leading-relaxed ${selected ? "text-[#D8DDB8]/80" : "text-[#222E2C]/60"}`}>
          {pkg.description}
        </p>
        <span className={`font-sans font-semibold text-base ${selected ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>
          {pkg.priceLabel}
        </span>
      </div>
    </button>
  );
}
