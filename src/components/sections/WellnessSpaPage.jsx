"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import OrderCheckoutForm from "@/components/sections/OrderCheckoutForm";
import { useOrderCart } from "@/hooks/useOrderCart";
import {
  TbArrowLeft, TbLeaf, TbCircleCheck, TbBrandWhatsapp, TbCheck,
  TbHeart, TbDroplet, TbFlame, TbSeedling, TbWaveSine, TbMoon, TbSparkles,
} from "react-icons/tb";

const WHATSAPP = "50685011042";

export default function WellnessSpaPage() {
  const { t } = useI18n();
  const cart = useOrderCart();
  const [notes, setNotes] = useState("");

  const massageItems     = t("wellnessSpa.massages.items");
  const durationPricing  = t("wellnessSpa.massages.durationPricing");
  const fourHands        = t("wellnessSpa.massages.fourHands");
  const facialMain       = t("wellnessSpa.facials.main");
  const addonItems       = t("wellnessSpa.facials.addons.items");
  const addonPrice       = t("wellnessSpa.facials.addons.priceValue");
  const packages         = t("wellnessSpa.packages.items");

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
                <MassageCard
                  key={i}
                  name={name}
                  groupId={`massage-${i}`}
                  durations={Array.isArray(durationPricing) ? durationPricing : []}
                  cart={cart}
                />
              ))}
              {fourHands && (
                <SelectableTile
                  selected={cart.isSelected("four-hands")}
                  onClick={() => cart.toggleItem("four-hands", { label: fourHands.label, price: fourHands.priceValue })}
                  icon={TbHeart}
                  title={fourHands.label}
                  subtitle={fourHands.duration}
                  price={fourHands.priceValue}
                />
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
                <SelectableTile
                  wide
                  selected={cart.isSelected("facial-main")}
                  onClick={() => cart.toggleItem("facial-main", { label: facialMain.name, price: facialMain.priceValue })}
                  title={facialMain.name}
                  price={facialMain.priceValue}
                />
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
                    <PriceChip
                      key={i}
                      label={`${name} · $${addonPrice}`}
                      selected={cart.isSelected(`addon-${i}`)}
                      onClick={() => cart.toggleItem(`addon-${i}`, { label: name, price: addonPrice })}
                    />
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
                <PackageCard
                  key={i}
                  pkg={pkg}
                  colorIndex={i}
                  selected={cart.isSelected(`package-${i}`)}
                  onClick={() => cart.toggleItem(`package-${i}`, { label: `${pkg.name} (${pkg.duration})`, price: pkg.priceValue })}
                />
              ))}
            </div>
          </div>

          <OrderCheckoutForm
            service="Wellness Spa"
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

function MassageCard({ name, groupId, durations, cart }) {
  const selected = cart.items[groupId];
  const pick = (d) => {
    if (selected && selected.duration === d.label) {
      cart.removeItem(groupId);
    } else {
      cart.setItem(groupId, { label: `${name} (${d.label})`, price: d.priceValue, duration: d.label });
    }
  };
  return (
    <div className={`rounded-xl px-5 py-5 flex flex-col gap-3 transition-colors duration-200 ${selected ? "bg-[#213B2F]" : "bg-[#E0D4C4]"}`}>
      <TbLeaf size={18} className={selected ? "text-[#D8DDB8]/60" : "text-[#213B2F]/50"} />
      <h3 className={`font-sans font-semibold text-sm ${selected ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{name}</h3>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {durations.map((d, i) => {
          const active = selected?.duration === d.label;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => pick(d)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-sans text-xs transition-colors duration-200 ${
                active
                  ? "bg-[#D8DDB8] border-[#D8DDB8] text-[#213B2F]"
                  : selected
                    ? "border-[#D8DDB8]/30 text-[#D8DDB8]/80 hover:border-[#D8DDB8]/60"
                    : "border-[#222E2C]/20 text-[#222E2C]/70 hover:border-[#222E2C]/40"
              }`}
            >
              <span className={`flex items-center justify-center size-3 rounded-full border shrink-0 ${active ? "border-[#213B2F]" : "border-current opacity-50"}`}>
                {active && <span className="size-1.5 rounded-full bg-[#213B2F]" />}
              </span>
              {d.label} · ${d.priceValue}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SelectableTile({ selected, onClick, icon: Icon, title, subtitle, price, wide = false }) {
  const bg = selected ? "bg-[#213B2F]" : "bg-[#E0D4C4]";
  const textPrimary = selected ? "text-[#D8DDB8]" : "text-[#222E2C]";
  const textSecondary = selected ? "text-[#D8DDB8]/50" : "text-[#222E2C]/50";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl px-5 py-5 flex ${wide ? "flex-row items-center justify-between" : "flex-col"} gap-3 border-2 transition-colors duration-200 ${bg} ${selected ? "border-[#D8DDB8]/40" : "border-transparent"}`}
    >
      <div className={`flex ${wide ? "flex-row items-center gap-3" : "flex-col gap-3"}`}>
        {Icon && <Icon size={18} className={selected ? "text-[#D8DDB8]/60" : "text-[#213B2F]/50"} />}
        <div>
          <h3 className={`font-sans font-semibold text-sm ${textPrimary}`}>{title}</h3>
          {subtitle && <p className={`font-sans text-xs mt-1 ${textSecondary}`}>{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`font-sans font-semibold text-sm ${textPrimary}`}>${price}</span>
        {selected && <TbCheck size={16} className="text-[#D8DDB8]" />}
      </div>
    </button>
  );
}

function PriceChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border font-sans text-sm transition-colors duration-200 ${
        selected
          ? "bg-[#213B2F] border-[#213B2F] text-[#D8DDB8]"
          : "border-[#222E2C]/10 text-[#222E2C]/70 hover:border-[#222E2C]/30"
      }`}
    >
      {selected && <TbCheck size={13} />}
      {label}
    </button>
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

function PackageCard({ pkg, colorIndex = 0, selected, onClick }) {
  const theme = PACKAGE_THEMES[colorIndex] ?? PACKAGE_THEMES[0];
  const Icon = theme.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: theme.bg, outlineColor: theme.title }}
      className={`text-left rounded-2xl px-6 py-7 flex flex-col md:flex-row gap-6 transition-all duration-200 ${selected ? "ring-2 ring-[#213B2F] ring-offset-2 ring-offset-[#EDE5D8]" : ""}`}
    >
      <div className="md:w-56 shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Icon size={26} style={{ color: theme.subtle }} />
          {selected && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20">
              <TbCheck size={12} style={{ color: theme.title }} />
            </span>
          )}
        </div>
        <div>
          <h3 className="font-sans font-semibold text-lg" style={{ color: theme.title }}>{pkg.name}</h3>
          <p className="font-sans text-xs mt-1" style={{ color: theme.subtle }}>{pkg.duration} · ${pkg.priceValue}</p>
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
    </button>
  );
}
