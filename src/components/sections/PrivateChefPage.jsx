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
  TbPlant2, TbFlame, TbSoup, TbSeedling, TbFish,
} from "react-icons/tb";

const WHATSAPP = "50685011042";

function computeServicePrice(item, guests) {
  return item.basePrice + Math.max(0, guests - item.baseGuests) * item.extraPersonPrice;
}

function findThemedTier(tiers, guests) {
  return tiers.find((tier) => guests >= tier.minGuests && guests <= tier.maxGuests) || tiers[tiers.length - 1];
}

export default function PrivateChefPage() {
  const { t } = useI18n();
  const cart = useOrderCart();
  const [notes, setNotes] = useState("");

  const breakfastItems  = t("privateChef.breakfast.items");
  const breakfastExtras = t("privateChef.breakfast.extras");
  const lunchItems      = t("privateChef.lunch.items");
  const dinnerItems     = t("privateChef.dinner.items");
  const dessertsItems   = t("privateChef.desserts.items");
  const bakeryItems     = t("privateChef.bakery.items");
  const themedNights    = t("privateChef.themedNights.nights");
  const pricingPS       = t("privateChef.pricing.perService.items");
  const themedTiers     = t("privateChef.pricing.themedNights.items");
  const oceanDinner     = t("privateChef.pricing.themedNights.oceanDinner");
  const pricingBar      = t("privateChef.pricing.bartender.items");
  const ob              = t("privateChef.orderBuilder");

  const [orderType, setOrderType] = useState("standard");
  const [selectedServiceIdx, setSelectedServiceIdx] = useState(null);
  const [guests, setGuests] = useState(2);
  const [selectedNightIdx, setSelectedNightIdx] = useState(null);
  const [themedGuests, setThemedGuests] = useState(2);
  const [bartenderIdx, setBartenderIdx] = useState(null);

  const switchTab = (tab) => {
    if (tab === orderType) return;
    setOrderType(tab);
    if (tab === "standard") {
      setSelectedNightIdx(null);
      cart.removeItem("themed-night");
      cart.removeItem("ocean-dinner");
    } else {
      setSelectedServiceIdx(null);
      cart.removeItem("service");
    }
  };

  const pickService = (i) => {
    setSelectedServiceIdx(i);
    const item = pricingPS[i];
    cart.setItem("service", { label: `${item.label} · ${guests} guests`, price: computeServicePrice(item, guests) });
  };

  const changeGuests = (val) => {
    const g = Math.max(2, Number(val) || 2);
    setGuests(g);
    if (selectedServiceIdx !== null && Array.isArray(pricingPS)) {
      const item = pricingPS[selectedServiceIdx];
      cart.setItem("service", { label: `${item.label} · ${g} guests`, price: computeServicePrice(item, g) });
    }
  };

  const pickNight = (i) => {
    setSelectedNightIdx(i);
    const tier = findThemedTier(themedTiers, themedGuests);
    cart.setItem("themed-night", { label: `${themedNights[i].title} · ${themedGuests} guests`, price: tier.priceValue });
  };

  const changeThemedGuests = (val) => {
    const g = Math.max(2, Number(val) || 2);
    setThemedGuests(g);
    if (selectedNightIdx !== null) {
      const tier = findThemedTier(themedTiers, g);
      cart.setItem("themed-night", { label: `${themedNights[selectedNightIdx].title} · ${g} guests`, price: tier.priceValue });
    }
  };

  const toggleOceanDinner = () => {
    cart.toggleItem("ocean-dinner", { label: oceanDinner.label, price: oceanDinner.priceValue });
  };

  const pickBartender = (i) => {
    if (bartenderIdx === i) {
      setBartenderIdx(null);
      cart.removeItem("bartender");
      return;
    }
    setBartenderIdx(i);
    cart.setItem("bartender", { label: pricingBar[i].label, price: pricingBar[i].priceValue });
  };

  const clearBartender = () => {
    setBartenderIdx(null);
    cart.removeItem("bartender");
  };

  const showBreakfast = orderType === "standard" && (selectedServiceIdx === 0 || selectedServiceIdx === 3);
  const showLunch      = orderType === "standard" && (selectedServiceIdx === 1 || selectedServiceIdx === 3);
  const showDinner     = orderType === "standard" && (selectedServiceIdx === 2 || selectedServiceIdx === 3);

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
              <TbLeaf size={15} className="text-[#222E2C]" />
              <span className="font-sans text-sm text-[#222E2C]">{t("privateChef.pill")}</span>
            </div>
            <h1
              className="text-4xl md:text-5xl text-[#213B2F] tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-alpina)" }}
            >
              {t("privateChef.title")}
            </h1>
            <p className="font-sans text-sm text-[#222E2C]/50 mt-1">{t("privateChef.subtitle")}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200 shrink-0 w-fit"
          >
            <TbBrandWhatsapp size={16} />
            {t("privateChef.whatsapp")}
          </a>
        </div>

        <div className="px-8 md:px-16 flex flex-col gap-16 pb-24">

          {/* Story */}
          <div className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col gap-4" data-aos="fade-up">
            <TbLeaf size={22} className="text-[#D8DDB8]/50" />
            <h2 className="font-sans font-semibold text-lg text-[#D8DDB8]">
              {t("privateChef.story.heading")}
            </h2>
            <p className="font-sans text-sm text-[#D8DDB8]/70 leading-relaxed whitespace-pre-line max-w-3xl">
              {t("privateChef.story.body")}
            </p>
          </div>

          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {ob.heading}
              </h2>
            </div>

            <div className="flex gap-2 w-fit bg-[#E0D4C4] rounded-full p-1">
              {[["standard", ob.standardTab], ["themed", ob.themedTab]].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchTab(key)}
                  className={`px-5 py-2 rounded-full font-sans text-sm font-medium transition-colors duration-200 ${
                    orderType === key ? "bg-[#213B2F] text-[#D8DDB8]" : "text-[#222E2C]/60 hover:text-[#222E2C]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {orderType === "standard" ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Array.isArray(pricingPS) && pricingPS.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pickService(i)}
                      className={`text-left rounded-xl px-5 py-4 flex flex-col gap-1 border-2 transition-colors duration-200 ${
                        selectedServiceIdx === i ? "bg-[#213B2F] border-[#213B2F]" : "bg-[#E0D4C4] border-transparent"
                      }`}
                    >
                      <span className={`font-sans font-semibold text-sm ${selectedServiceIdx === i ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>
                        {item.label}
                      </span>
                      <span className={`font-sans text-xs ${selectedServiceIdx === i ? "text-[#D8DDB8]/70" : "text-[#222E2C]/50"}`}>
                        ${item.basePrice} for {item.baseGuests} · +${item.extraPersonPrice}/extra
                      </span>
                      {selectedServiceIdx === i && (
                        <span className="font-sans font-semibold text-sm text-[#D8DDB8] mt-1">
                          ${computeServicePrice(item, guests)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {selectedServiceIdx !== null && (
                  <Stepper label={ob.guestsLabel} value={guests} onChange={changeGuests} min={2} />
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                    {t("privateChef.themedNights.subheading")}
                  </p>
                  <h3 className="font-sans font-semibold text-base text-[#222E2C]">
                    {t("privateChef.themedNights.heading")}
                  </h3>
                  <p className="font-sans text-sm text-[#222E2C]/50 mt-1 max-w-2xl">
                    {t("privateChef.themedNights.description")}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {Array.isArray(themedNights) && themedNights.map((night, i) => (
                    <ThemedNightCard
                      key={i}
                      night={night}
                      colorIndex={i}
                      selected={selectedNightIdx === i}
                      onClick={() => pickNight(i)}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <Stepper label={ob.guestsLabel} value={themedGuests} onChange={changeThemedGuests} min={2} max={15} />
                  {selectedNightIdx !== null && (
                    <span className="font-sans font-semibold text-sm text-[#222E2C]">
                      ${findThemedTier(themedTiers, themedGuests).priceValue}
                    </span>
                  )}
                  {oceanDinner && (
                    <PriceChip
                      label={`${oceanDinner.label} · +$${oceanDinner.priceValue}`}
                      selected={cart.isSelected("ocean-dinner")}
                      onClick={toggleOceanDinner}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Breakfast */}
          {showBreakfast && (
            <MenuSection
              heading={t("privateChef.breakfast.heading")}
              subheading={t("privateChef.breakfast.subheading")}
              items={Array.isArray(breakfastItems) ? breakfastItems : []}
              note={t("privateChef.breakfast.note")}
              extras={Array.isArray(breakfastExtras) ? breakfastExtras : []}
              extrasHeading={t("privateChef.breakfast.extrasHeading")}
              extrasSubheading={t("privateChef.breakfast.extrasSubheading")}
              idPrefix="breakfast"
              cart={cart}
              hint={ob.dishesHint}
            />
          )}

          {/* Lunch */}
          {showLunch && (
            <MenuSection
              heading={t("privateChef.lunch.heading")}
              subheading={t("privateChef.lunch.subheading")}
              items={Array.isArray(lunchItems) ? lunchItems : []}
              idPrefix="lunch"
              cart={cart}
              hint={ob.dishesHint}
            />
          )}

          {/* Dinner */}
          {showDinner && (
            <MenuSection
              heading={t("privateChef.dinner.heading")}
              subheading={t("privateChef.dinner.subheading")}
              items={Array.isArray(dinnerItems) ? dinnerItems : []}
              idPrefix="dinner"
              cart={cart}
              hint={ob.dishesHint}
            />
          )}

          {/* Desserts + Bakery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16" data-aos="fade-up">
            <SimpleMenuSection
              heading={t("privateChef.desserts.heading")}
              subheading={t("privateChef.desserts.subheading")}
              items={Array.isArray(dessertsItems) ? dessertsItems : []}
              idPrefix="dessert"
              cart={cart}
            />
            <SimpleMenuSection
              heading={t("privateChef.bakery.heading")}
              subheading={t("privateChef.bakery.subheading")}
              items={Array.isArray(bakeryItems) ? bakeryItems : []}
              idPrefix="bakery"
              cart={cart}
            />
          </div>

          <div className="flex flex-col gap-4" data-aos="fade-up">
            <h3 className="font-sans font-semibold text-base text-[#222E2C]">{ob.bartenderHeading}</h3>
            <div className="flex flex-wrap gap-2" role="radiogroup">
              <RadioPill label={ob.bartenderNone} selected={bartenderIdx === null} onClick={clearBartender} />
              {Array.isArray(pricingBar) && pricingBar.map((item, i) => (
                <RadioPill
                  key={i}
                  label={`${item.label} · $${item.priceValue}`}
                  selected={bartenderIdx === i}
                  onClick={() => pickBartender(i)}
                />
              ))}
            </div>
          </div>

          <OrderCheckoutForm
            service="Private Chef"
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
                {t("privateChef.ctaHeading")}
              </h2>
              <p className="font-sans text-sm text-[#D8DDB8]/60">
                {t("privateChef.ctaSubheading")}
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#D8DDB8] font-sans font-medium text-sm text-[#213B2F] hover:bg-[#D8DDB8]/90 transition-colors duration-200 shrink-0"
            >
              <TbBrandWhatsapp size={16} />
              {t("privateChef.whatsapp")}
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function MenuSection({ heading, subheading, items, note, extras, extrasHeading, extrasSubheading, idPrefix, cart, hint }) {
  return (
    <div className="flex flex-col gap-5" data-aos="fade-up">
      <div className="border-b border-[#222E2C]/15 pb-4">
        <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
          {subheading}
        </p>
        <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
          {heading}
        </h2>
        {hint && <p className="font-sans text-xs text-[#222E2C]/40 mt-1">{hint}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, i) => {
          const id = `dish-${idPrefix}-${i}`;
          const selected = cart.isSelected(id);
          return (
            <button
              key={i}
              type="button"
              onClick={() => cart.toggleItem(id, { label: item.title, price: 0 })}
              className={`text-left rounded-xl px-5 py-5 flex flex-col gap-2 border-2 transition-colors duration-200 ${
                selected ? "bg-[#213B2F] border-[#213B2F]" : "bg-[#E0D4C4] border-transparent"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                {item.tag && (
                  <span className="inline-flex w-fit items-center gap-1 bg-[#213B2F]/10 text-[#213B2F] text-xs font-semibold px-2.5 py-1 rounded-full">
                    🇨🇷 {item.tag}
                  </span>
                )}
                {selected && <TbCheck size={16} className="text-[#D8DDB8] shrink-0" />}
              </div>
              <h3 className={`font-sans font-semibold text-sm ${selected ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{item.title}</h3>
              <p className={`font-sans text-sm leading-relaxed ${selected ? "text-[#D8DDB8]/70" : "text-[#222E2C]/60"}`}>{item.description}</p>
            </button>
          );
        })}
      </div>
      {note && (
        <p className="font-sans text-sm text-[#222E2C]/50 italic">{note}</p>
      )}
      {extras && extras.length > 0 && (
        <div className="flex flex-col gap-3 pt-2">
          <div>
            <p className="font-sans font-semibold text-sm text-[#222E2C]">{extrasHeading}</p>
            {extrasSubheading && (
              <p className="font-sans text-xs text-[#222E2C]/50 mt-0.5">{extrasSubheading}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {extras.map((extra, i) => {
              const id = `dish-${idPrefix}-extra-${i}`;
              const selected = cart.isSelected(id);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => cart.toggleItem(id, { label: extra.title, price: 0 })}
                  className={`text-left border-2 rounded-xl px-4 py-3.5 flex flex-col gap-1 flex-1 transition-colors duration-200 ${
                    selected ? "bg-[#213B2F] border-[#213B2F]" : "border-[#222E2C]/10"
                  }`}
                >
                  <p className={`font-sans font-semibold text-sm ${selected ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{extra.title}</p>
                  <p className={`font-sans text-xs leading-relaxed ${selected ? "text-[#D8DDB8]/70" : "text-[#222E2C]/55"}`}>{extra.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleMenuSection({ heading, subheading, items, idPrefix, cart }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-[#222E2C]/15 pb-3">
        <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
          {subheading}
        </p>
        <h2 className="font-sans font-semibold text-lg text-[#222E2C] tracking-tight">{heading}</h2>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const id = `dish-${idPrefix}-${i}`;
          const selected = cart.isSelected(id);
          return (
            <button
              key={i}
              type="button"
              onClick={() => cart.toggleItem(id, { label: item.title, price: 0 })}
              className={`text-left flex items-start gap-2 rounded-lg px-3 py-2.5 border-2 transition-colors duration-200 ${
                selected ? "bg-[#213B2F] border-[#213B2F]" : "border-transparent hover:bg-[#E0D4C4]/50"
              }`}
            >
              {selected && <TbCheck size={15} className="text-[#D8DDB8] shrink-0 mt-0.5" />}
              <div className="flex flex-col gap-0.5">
                <h3 className={`font-sans font-semibold text-sm ${selected ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{item.title}</h3>
                <p className={`font-sans text-sm leading-relaxed ${selected ? "text-[#D8DDB8]/70" : "text-[#222E2C]/60"}`}>{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
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
          : "border-[#222E2C]/20 text-[#222E2C]/70 hover:border-[#222E2C]/40"
      }`}
    >
      {selected && <TbCheck size={13} />}
      {label}
    </button>
  );
}

function RadioPill({ label, selected, onClick }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border font-sans text-sm transition-colors duration-200 ${
        selected
          ? "bg-[#213B2F] border-[#213B2F] text-[#D8DDB8]"
          : "border-[#222E2C]/20 text-[#222E2C]/70 hover:border-[#222E2C]/40"
      }`}
    >
      <span className={`flex items-center justify-center size-3.5 rounded-full border shrink-0 ${selected ? "border-[#D8DDB8]" : "border-[#222E2C]/35"}`}>
        {selected && <span className="size-1.5 rounded-full bg-[#D8DDB8]" />}
      </span>
      {label}
    </button>
  );
}

function Stepper({ label, value, onChange, min = 2, max }) {
  const clamp = (n) => Math.max(min, max ? Math.min(max, n) : n);
  return (
    <label className="flex flex-col gap-1.5 w-fit">
      <span className="font-sans text-xs text-[#222E2C]/50">{label}</span>
      <div className="flex items-center justify-between gap-2 pl-2 pr-1.5 py-1.5 rounded-xl bg-white border border-[#222E2C]/12 shadow-sm w-32">
        <button
          type="button"
          onClick={() => onChange(String(clamp(value - 1)))}
          className="size-8 flex items-center justify-center rounded-lg text-[#222E2C]/60 hover:bg-[#222E2C]/6 transition-colors duration-150 font-sans text-base"
        >
          −
        </button>
        <span className="font-sans text-sm text-[#222E2C] font-medium w-8 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(String(clamp(value + 1)))}
          className="size-8 flex items-center justify-center rounded-lg text-[#222E2C]/60 hover:bg-[#222E2C]/6 transition-colors duration-150 font-sans text-base"
        >
          +
        </button>
      </div>
    </label>
  );
}

// Each night: bg color + two text tiers (title solid, body readable) + border + icon
const NIGHT_THEMES = [
  { bg: "#4B4D40", title: "#EDE5D8", body: "rgba(237,229,216,0.88)", subtle: "rgba(237,229,216,0.72)", border: "rgba(237,229,216,0.25)", icon: TbPlant2 },
  { bg: "#59493B", title: "#FFEAD8", body: "rgba(255,234,216,0.88)", subtle: "rgba(255,234,216,0.72)", border: "rgba(255,234,216,0.25)", icon: TbFlame },
  { bg: "#A5886D", title: "#3D1A08", body: "rgba(61,26,8,0.82)", subtle: "rgba(61,26,8,0.65)", border: "rgba(61,26,8,0.20)", icon: TbSoup },
  { bg: "#345B49", title: "#EDEFDF", body: "rgba(237,239,223,0.88)", subtle: "rgba(237,239,223,0.72)", border: "rgba(237,239,223,0.25)", icon: TbSeedling },
  { bg: "#8C8F77", title: "#1E2312", body: "rgba(30,35,18,0.82)", subtle: "rgba(30,35,18,0.65)", border: "rgba(30,35,18,0.20)", icon: TbFish },
];

function ThemedNightCard({ night, colorIndex = 0, selected, onClick }) {
  const theme = NIGHT_THEMES[colorIndex] ?? NIGHT_THEMES[0];
  const Icon = theme.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: theme.bg }}
      className={`text-left rounded-2xl px-6 py-7 flex flex-col md:flex-row gap-6 transition-all duration-200 ${selected ? "ring-2 ring-[#213B2F] ring-offset-2 ring-offset-[#EDE5D8]" : ""}`}
    >
      {/* Left: icon + title block */}
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
          <h3 className="font-sans font-semibold text-lg" style={{ color: theme.title }}>{night.title}</h3>
          <p className="font-sans text-sm mt-1" style={{ color: theme.body }}>{night.subtitle}</p>
          {night.description && (
            <p className="font-sans text-sm mt-2" style={{ color: theme.body }}>{night.description}</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ backgroundColor: theme.border }} className="w-full h-px md:w-px md:h-auto md:self-stretch" />

      {/* Right: includes + dessert */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {night.includes.map((item, i) => (
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
        {night.dessert && (
          <div style={{ borderTopColor: theme.border }} className="border-t pt-3 mt-auto">
            <p className="font-sans text-sm" style={{ color: theme.body }}>
              <span className="font-semibold" style={{ color: theme.title }}>Dessert: </span>
              {night.dessert}
            </p>
          </div>
        )}
      </div>
    </button>
  );
}
