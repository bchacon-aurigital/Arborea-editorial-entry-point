"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import OrderCheckoutForm from "@/components/sections/OrderCheckoutForm";
import { useOrderCart } from "@/hooks/useOrderCart";
import {
  TbArrowLeft, TbCircleCheck, TbBrandWhatsapp, TbCheck, TbPhoto,
  TbSparkles, TbShoppingCart, TbShoppingCartCheck,
  TbDroplet, TbFlame, TbLeaf, TbWind, TbSun,
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
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1F3B2C] font-sans font-medium text-sm text-[#F3E6CE] hover:bg-[#1F3B2C]/90 transition-colors duration-200 shrink-0 w-fit"
          >
            <TbBrandWhatsapp size={16} />
            {t("wellnessSpa.whatsapp")}
          </a>
        </div>

        <div className="px-8 md:px-16 flex flex-col gap-16 pb-24">

          {/* Story — pseudo hero */}
          <div className="bg-[#241606] border border-[#C9974F]/15 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:h-[420px]" data-aos="fade-up">
            <div className="flex flex-col justify-center gap-5 px-8 md:px-12 py-12 lg:py-0 order-2 lg:order-1">
              <TbSparkles size={22} className="text-[#C9974F]/60" />
              <h2
                className="text-3xl md:text-4xl text-[#F3E6CE] tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-alpina)" }}
              >
                {t("wellnessSpa.story.heading")}
              </h2>
              <div className="w-12 h-px bg-[#C9974F]/40" />
              <p className="font-sans text-sm text-[#F3E6CE]/60 leading-relaxed whitespace-pre-line max-w-md">
                {t("wellnessSpa.story.body")}
              </p>
            </div>
            <div className="h-56 lg:h-full order-1 lg:order-2 overflow-hidden">
              <img
                src="/assets/Massages/PseudoHeroSection.avif"
                alt={t("wellnessSpa.story.heading")}
                className="w-full h-full object-cover"
              />
            </div>
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
              {Array.isArray(massageItems) && massageItems.map((item, i) => (
                <MassageCard
                  key={i}
                  name={item.name}
                  description={item.description}
                  image={item.image}
                  groupId={`massage-${i}`}
                  durations={Array.isArray(durationPricing) ? durationPricing : []}
                  cart={cart}
                />
              ))}
              {fourHands && (
                <MassageCard
                  name={fourHands.label}
                  description={fourHands.description}
                  image={fourHands.image}
                  groupId="four-hands"
                  durations={[{ label: fourHands.duration, priceValue: fourHands.priceValue }]}
                  cart={cart}
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
            {facialMain && (
              <FacialCard
                facialMain={facialMain}
                addonItems={Array.isArray(addonItems) ? addonItems : []}
                addonPrice={addonPrice}
                addonsHeading={t("wellnessSpa.facials.addons.heading")}
                addonsDuration={t("wellnessSpa.facials.addons.duration")}
                addonsRequiresMain={t("wellnessSpa.facials.addons.requiresMain")}
                addServiceLabel={t("common.addService")}
                addedLabel={t("common.added")}
                cart={cart}
              />
            )}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* Order form header */}
          <div className="flex flex-col gap-6 -mb-10" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-4 py-1.5 mb-3">
                <span className="font-sans text-xs text-[#222E2C]">{t("orderForm.pill")}</span>
              </div>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("orderForm.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-1 max-w-2xl">{t("orderForm.subheading")}</p>
            </div>
          </div>

          <OrderCheckoutForm
            compact
            dark
            service="Wellness Spa"
            lines={cart.lines}
            total={cart.total}
            notes={notes}
            onNotesChange={setNotes}
          />

          {/* Bottom CTA */}
          <div
            className="bg-[#241606] border border-[#C9974F]/15 rounded-2xl px-8 md:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            data-aos="fade-up"
          >
            <div className="flex flex-col gap-1.5">
              <h2 className="font-sans font-semibold text-xl text-[#F3E6CE]">
                {t("wellnessSpa.ctaHeading")}
              </h2>
              <p className="font-sans text-sm text-[#F3E6CE]/60">
                {t("wellnessSpa.ctaSubheading")}
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1F3B2C] font-sans font-medium text-sm text-[#F3E6CE] hover:bg-[#1F3B2C]/90 transition-colors duration-200 shrink-0"
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

function MassageCard({ name, description, image, groupId, durations, cart }) {
  const selected = cart.items[groupId];
  const pick = (d) => {
    if (selected && selected.duration === d.label) {
      cart.removeItem(groupId);
    } else {
      cart.setItem(groupId, { label: `${name} (${d.label})`, price: d.priceValue, duration: d.label });
    }
  };
  return (
    <div className={`rounded-2xl overflow-hidden flex flex-col h-full border transition-colors duration-200 ${selected ? "bg-[#2E1D0B] border-[#C9974F]/40" : "bg-[#241606] border-[#C9974F]/15"}`}>
      {/* Photo */}
      <div className="h-44 bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <TbPhoto size={28} className="text-[#C9974F]/30" />
        )}
      </div>

      <div className="px-5 pt-5 pb-5 flex flex-col gap-3 flex-1">
        <h3 className="font-sans font-semibold text-base text-[#F3E6CE] tracking-tight">{name}</h3>
        {description && (
          <p className="font-sans text-xs text-[#F3E6CE]/50 leading-relaxed">{description}</p>
        )}

        <div className="flex gap-2 mt-auto pt-3" role="radiogroup">
          {durations.map((d, i) => {
            const active = selected?.duration === d.label;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => pick(d)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl border font-sans transition-colors duration-200 ${
                  active
                    ? "bg-[#C9974F] border-[#C9974F] text-[#1B1006]"
                    : "border-[#C9974F]/25 text-[#F3E6CE]/70 hover:border-[#C9974F]/50"
                }`}
              >
                <span className="font-semibold text-sm">${d.priceValue}</span>
                <span className={`text-[10px] uppercase tracking-wide ${active ? "text-[#1B1006]/70" : "opacity-60"}`}>{d.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const ADDON_ICONS = [TbSparkles, TbDroplet, TbFlame, TbLeaf, TbWind, TbSun];

function FacialCard({ facialMain, addonItems, addonPrice, addonsHeading, addonsDuration, addonsRequiresMain, addServiceLabel, addedLabel, cart }) {
  const mainSelected = cart.isSelected("facial-main");

  const toggleMain = () => {
    const willSelect = !mainSelected;
    cart.toggleItem("facial-main", { label: facialMain.name, price: facialMain.priceValue });
    if (!willSelect) {
      addonItems.forEach((_, i) => {
        if (cart.isSelected(`addon-${i}`)) cart.removeItem(`addon-${i}`);
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-3">

      {/* Left: dark hero panel */}
      <div className={`rounded-2xl border flex flex-col justify-between gap-8 px-8 py-8 transition-colors duration-200 ${mainSelected ? "bg-[#2E1D0B] border-[#C9974F]/40" : "bg-[#241606] border-[#C9974F]/15"}`}>
        <div className="flex flex-col gap-3">
          <h3
            className="text-2xl md:text-3xl text-[#F3E6CE] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-alpina)" }}
          >
            {facialMain.name}
          </h3>
          {facialMain.description && (
            <p className="font-sans text-sm text-[#F3E6CE]/50 leading-relaxed">{facialMain.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={toggleMain}
          className={`flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-sans font-medium text-base w-fit bg-[#C9974F] text-[#1B1006] transition-colors duration-200 ${
            mainSelected ? "" : "hover:bg-[#C9974F]/85"
          }`}
        >
          {mainSelected ? <TbCheck size={18} /> : <TbShoppingCart size={18} />}
          {mainSelected ? addedLabel : addServiceLabel}
          <span className="opacity-60">· ${facialMain.priceValue}</span>
        </button>
      </div>

      {/* Right: add-ons grid */}
      <div className="rounded-2xl border border-[#222E2C]/15 bg-[#E0D4C4] px-6 py-6 flex flex-col gap-4">
        <div>
          <p className="font-sans font-semibold text-sm text-[#222E2C]">{addonsHeading}</p>
          <p className="font-sans text-xs text-[#222E2C]/45 mt-0.5">
            {mainSelected ? addonsDuration : addonsRequiresMain}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {addonItems.map((name, i) => {
            const Icon = ADDON_ICONS[i % ADDON_ICONS.length];
            const addonSelected = cart.isSelected(`addon-${i}`);
            return (
              <button
                key={i}
                type="button"
                disabled={!mainSelected}
                onClick={() => cart.toggleItem(`addon-${i}`, { label: name, price: addonPrice })}
                aria-disabled={!mainSelected}
                className={`flex items-center gap-3 text-left px-3 py-3 rounded-xl border transition-colors duration-200 ${
                  !mainSelected
                    ? "border-[#222E2C]/8 opacity-40 cursor-not-allowed"
                    : addonSelected
                      ? "border-[#C9974F]/50 bg-[#241606]"
                      : "border-[#222E2C]/10 hover:border-[#222E2C]/25"
                }`}
              >
                <span className={`flex items-center justify-center size-9 rounded-xl shrink-0 transition-colors duration-200 ${addonSelected && mainSelected ? "bg-[#C9974F]/25" : "bg-[#222E2C]/5"}`}>
                  <Icon size={16} className={addonSelected && mainSelected ? "text-[#C9974F]" : "text-[#222E2C]/50"} />
                </span>
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span className={`font-sans font-medium text-sm truncate ${addonSelected && mainSelected ? "text-[#F3E6CE]" : "text-[#222E2C]"}`}>{name}</span>
                  <span className={`font-sans text-xs ${addonSelected && mainSelected ? "text-[#F3E6CE]/50" : "text-[#222E2C]/45"}`}>${addonPrice}</span>
                </span>
                {addonSelected && mainSelected && <TbCheck size={16} className="text-[#C9974F] ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const PACKAGE_THEMES = [
  { bg: "#8B5A3C", title: "#FBEEE0", body: "rgba(251,238,224,0.85)", subtle: "rgba(251,238,224,0.65)", border: "rgba(251,238,224,0.22)" },
  { bg: "#3B2415", title: "#F3DFC0", body: "rgba(243,223,192,0.85)", subtle: "rgba(243,223,192,0.6)", border: "rgba(243,223,192,0.18)" },
  { bg: "#6B5A2E", title: "#F7EEDB", body: "rgba(247,238,219,0.85)", subtle: "rgba(247,238,219,0.65)", border: "rgba(247,238,219,0.2)" },
  { bg: "#24402F", title: "#E7F0E1", body: "rgba(231,240,225,0.85)", subtle: "rgba(231,240,225,0.65)", border: "rgba(231,240,225,0.2)" },
  { bg: "#C9974F", title: "#241606", body: "rgba(36,22,6,0.78)", subtle: "rgba(36,22,6,0.58)", border: "rgba(36,22,6,0.18)" },
  { bg: "#A15A34", title: "#FBEBDD", body: "rgba(251,235,221,0.85)", subtle: "rgba(251,235,221,0.65)", border: "rgba(251,235,221,0.2)" },
  { bg: "#5C3324", title: "#F2DFC8", body: "rgba(242,223,200,0.85)", subtle: "rgba(242,223,200,0.62)", border: "rgba(242,223,200,0.18)" },
];

function PackageCard({ pkg, colorIndex = 0, selected, onClick }) {
  const theme = PACKAGE_THEMES[colorIndex] ?? PACKAGE_THEMES[0];
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: theme.bg }}
      className={`text-left rounded-2xl px-6 py-6 flex flex-col gap-5 h-full transition-all duration-200 ${selected ? "ring-2 ring-[#C9974F] ring-offset-2 ring-offset-[#EDE5D8]" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-xs" style={{ color: theme.subtle }}>{pkg.duration} · ${pkg.priceValue}</p>
          <h3 className="font-sans font-semibold text-lg mt-0.5" style={{ color: theme.title }}>{pkg.name}</h3>
        </div>
        <span
          className="flex items-center justify-center size-9 rounded-xl shrink-0 transition-colors duration-200"
          style={{ backgroundColor: selected ? theme.title : "rgba(255,255,255,0.16)" }}
        >
          {selected ? (
            <TbShoppingCartCheck size={18} style={{ color: theme.bg }} />
          ) : (
            <TbShoppingCart size={18} style={{ color: theme.title }} />
          )}
        </span>
      </div>

      <div style={{ backgroundColor: theme.border }} className="h-px w-full" />

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
    </button>
  );
}
