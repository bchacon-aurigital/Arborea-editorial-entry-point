"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/app/context/CartContext";
import { skuOf, lineIdOf } from "@/lib/sku";
import { money } from "@/lib/format";
import {
  TbArrowLeft, TbLeaf, TbCircleCheck, TbBrandWhatsapp, TbCheck,
  TbGlassCocktail, TbCoffee, TbSalad, TbToolsKitchen2,
  TbHandClick, TbAdjustments, TbSend, TbListCheck, TbCalendarEvent, TbPlus,
  TbNotes, TbShoppingBag,
} from "react-icons/tb";

const WHATSAPP = "50685011042";
const STORY_IMAGE = "/assets/InHouseServices/PrivateChefExperience.avif";

const MEAL_META = {
  breakfast: { icon: TbCoffee },
  lunch: { icon: TbSalad },
  dinner: { icon: TbToolsKitchen2 },
};

function computeServicePrice(item, guests) {
  return item.basePrice + Math.max(0, guests - item.baseGuests) * item.extraPersonPrice;
}

function findThemedTier(tiers, guests) {
  return tiers.find((tier) => guests >= tier.minGuests && guests <= tier.maxGuests) || tiers[tiers.length - 1];
}

// Which meal menus a given per-service option unlocks (Full Day unlocks all three).
const SERVICE_MEALS = [["breakfast"], ["lunch"], ["dinner"], ["breakfast", "lunch", "dinner"]];

const SERVICE = "private-chef";

export default function PrivateChefPage() {
  const { t } = useI18n();
  const { setLine, clearService, setServiceForm, openCart, linesByService, lines, serviceForms, hydrated } = useCart();
  const [notes, setNotes] = useState("");

  const nav             = t("privateChef.nav");
  const breakfastItems  = t("privateChef.breakfast.items");
  const breakfastExtras = t("privateChef.breakfast.extras");
  const lunchItems      = t("privateChef.lunch.items");
  const dinnerItems     = t("privateChef.dinner.items");
  const dessertsItems   = t("privateChef.desserts.items");
  const bakeryItems     = t("privateChef.bakery.items");
  const themedNights    = t("privateChef.themedNights.nights");
  const pricingPS       = t("privateChef.pricing.perService.items");
  const themedTiers     = t("privateChef.pricing.themedNights.items");
  const pricingBar      = t("privateChef.pricing.bartender.items");
  const ob              = t("privateChef.orderBuilder");
  const sweets          = t("privateChef.sweetsSection");
  const fridgeBeverages = t("fullFridge.beverages");

  const [selectedServiceIdx, setSelectedServiceIdx] = useState(null);
  const [guests, setGuests] = useState(2);
  const [serviceDate, setServiceDate] = useState("");
  const [selectedNightIdx, setSelectedNightIdx] = useState(null);
  const [themedGuests, setThemedGuests] = useState(2);
  const [themedDate, setThemedDate] = useState("");
  const [bevQty, setBevQty] = useState({});
  const [bartenderIdx, setBartenderIdx] = useState(null);
  const [activeMeal, setActiveMeal] = useState(null);

  // Dish picks are preferences for the chef, not priced line items.
  const [dishes, setDishes] = useState({});
  const [dishQty, setDishQty] = useState({});

  const toggleDish = (id, label, group) => {
    const limit = guests >= 5 ? 2 : 1;
    setDishes((prev) => {
      if (prev[id]) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      const groupEntries = Object.entries(prev).filter(([, d]) => d.group === group);
      if (groupEntries.length >= limit) {
        // Auto-replace the oldest pick in this group
        const [oldestId] = groupEntries[0];
        const next = { ...prev };
        delete next[oldestId];
        return { ...next, [id]: { label, group } };
      }
      return { ...prev, [id]: { label, group } };
    });
  };

  const DISH_PRICE = 15;

  /* Desserts and bakery are priced items, so they are quantities — not the dish
   * "preferences" that `dishes` tracks for the meal menus. The old version wrote to
   * both, and the copy in `dishes` was never read back. */
  const changeDishQty = (id, qty) => {
    setDishQty((prev) => ({ ...prev, [id]: Math.max(0, qty) }));
  };

  const visibleMeals = selectedServiceIdx === null ? [] : SERVICE_MEALS[selectedServiceIdx];
  const maxDishes = guests >= 5 ? 2 : 1;

  useEffect(() => {
    const meals = selectedServiceIdx === null ? [] : SERVICE_MEALS[selectedServiceIdx];
    setActiveMeal(meals.length ? meals[0] : null);
  }, [selectedServiceIdx]);

  const pickService = (i) => {
    const deselecting = selectedServiceIdx === i;
    const nextIdx = deselecting ? null : i;
    setSelectedServiceIdx(nextIdx);

    // Drop dish picks whose menu is no longer on screen.
    const stillVisible = nextIdx === null ? [] : SERVICE_MEALS[nextIdx];
    setDishes((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([, d]) => !["breakfast", "lunch", "dinner"].includes(d.group) || stillVisible.includes(d.group))
      )
    );
  };

  const changeGuests = (val) => setGuests(Math.max(2, Number(val) || 2));

  const pickNight = (i) => {
    if (selectedNightIdx === i) {
      setSelectedNightIdx(null);
      setThemedDate("");
      return;
    }
    setSelectedNightIdx(i);
  };

  const changeThemedGuests = (g) => setThemedGuests(Math.max(2, Math.min(15, g)));

  const handleThemedDate = (d) => setThemedDate(d);

  const changeBevQty = (i, qty) => setBevQty((prev) => ({ ...prev, [i]: Math.max(0, qty) }));

  const pickBartender = (i) => setBartenderIdx((prev) => (prev === i ? null : i));

  const clearBartender = () => setBartenderIdx(null);

  const inCart = linesByService.some((g) => g.service.id === SERVICE);

  /*
   * Restore the page when the guest returns via the cart's "Edit" link, so
   * re-committing doesn't wipe what they already added (every commit clears this
   * service first). Each committed line is matched back to the control that made it.
   */
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current || !hydrated) return;
    seeded.current = true;

    const mine = lines.filter((l) => l.service === SERVICE);
    if (!mine.length) return;
    const bySku = new Map(mine.map((l) => [l.sku, l]));

    if (Array.isArray(pricingPS)) {
      pricingPS.forEach((_, i) => {
        const line = bySku.get(skuOf("privateChef.pricing.perService.items", i, "label"));
        if (!line) return;
        setSelectedServiceIdx(i);
        setServiceDate(line.date ?? "");
        const n = parseInt(line.options?.guests, 10);
        if (Number.isFinite(n)) setGuests(Math.max(2, n));
      });
    }

    if (Array.isArray(themedNights)) {
      themedNights.forEach((_, i) => {
        const line = bySku.get(skuOf("privateChef.themedNights.nights", i, "title"));
        if (!line) return;
        setSelectedNightIdx(i);
        setThemedDate(line.date ?? "");
        const n = parseInt(line.options?.guests, 10);
        if (Number.isFinite(n)) setThemedGuests(Math.max(2, Math.min(15, n)));
      });
    }

    if (Array.isArray(pricingBar)) {
      pricingBar.forEach((_, i) => {
        if (bySku.has(skuOf("privateChef.pricing.bartender.items", i, "label"))) setBartenderIdx(i);
      });
    }

    if (Array.isArray(fridgeBeverages?.items)) {
      const restored = {};
      fridgeBeverages.items.forEach((_, i) => {
        const line = bySku.get(skuOf("fullFridge.beverages.items", i, "title"));
        if (line) restored[i] = line.qty;
      });
      if (Object.keys(restored).length) setBevQty(restored);
    }

    const restoredQty = {};
    for (const [group, path] of [["dessert", "privateChef.desserts.items"], ["bakery", "privateChef.bakery.items"]]) {
      const items = t(path);
      if (!Array.isArray(items)) continue;
      items.forEach((_, i) => {
        const line = bySku.get(`${group}-${skuOf(path, i, "title")}`);
        if (line) restoredQty[`dish-${group}-${i}`] = line.qty;
      });
    }
    if (Object.keys(restoredQty).length) setDishQty(restoredQty);

    const saved = serviceForms[SERVICE];
    if (saved?.notes) setNotes(saved.notes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  /*
   * Everything priced on this page: the chosen service, a themed night, beverages,
   * the bartender, and dessert/bakery quantities.
   *
   * Guest counts drive the price but are NOT folded into the title — they go in
   * `options` so the drawer caption and the sheet keep them as their own field.
   */
  const buildLines = () => {
    const out = [];

    if (selectedServiceIdx !== null && Array.isArray(pricingPS)) {
      const item = pricingPS[selectedServiceIdx];
      const sku = skuOf("privateChef.pricing.perService.items", selectedServiceIdx, "label");
      out.push({
        lineId: lineIdOf(SERVICE, sku),
        service: SERVICE,
        sku,
        title: item.label,
        qty: 1,
        unitPrice: computeServicePrice(item, guests),
        date: serviceDate,
        options: { guests: `${guests} guests` },
      });
    }

    if (selectedNightIdx !== null && Array.isArray(themedNights) && Array.isArray(themedTiers)) {
      const night = themedNights[selectedNightIdx];
      const tier = findThemedTier(themedTiers, themedGuests);
      const sku = skuOf("privateChef.themedNights.nights", selectedNightIdx, "title");
      out.push({
        lineId: lineIdOf(SERVICE, sku),
        service: SERVICE,
        sku,
        title: night.title,
        qty: 1,
        unitPrice: tier?.priceValue ?? 0,
        date: themedDate,
        options: { guests: `${themedGuests} guests` },
      });
    }

    if (Array.isArray(fridgeBeverages?.items)) {
      fridgeBeverages.items.forEach((item, i) => {
        const qty = bevQty[i] || 0;
        if (!qty) return;
        const sku = skuOf("fullFridge.beverages.items", i, "title");
        out.push({
          lineId: lineIdOf(SERVICE, sku),
          service: SERVICE,
          sku,
          title: item.title,
          qty,
          unitPrice: item.priceValue,
          date: "",
          options: {},
        });
      });
    }

    if (bartenderIdx !== null && Array.isArray(pricingBar)) {
      const item = pricingBar[bartenderIdx];
      const sku = skuOf("privateChef.pricing.bartender.items", bartenderIdx, "label");
      out.push({
        lineId: lineIdOf(SERVICE, sku),
        service: SERVICE,
        sku,
        title: `Bartender — ${item.label}`,
        qty: 1,
        unitPrice: item.priceValue,
        date: "",
        options: {},
      });
    }

    /* Desserts and bakery share one flat per-item price. */
    for (const [group, path] of [["dessert", "privateChef.desserts.items"], ["bakery", "privateChef.bakery.items"]]) {
      const items = t(path);
      if (!Array.isArray(items)) continue;
      items.forEach((item, i) => {
        const qty = dishQty[`dish-${group}-${i}`] || 0;
        if (!qty) return;
        const sku = `${group}-${skuOf(path, i, "title")}`;
        out.push({
          lineId: lineIdOf(SERVICE, sku),
          service: SERVICE,
          sku,
          title: item.title,
          qty,
          unitPrice: DISH_PRICE,
          date: "",
          options: {},
        });
      });
    }

    return out;
  };

  const draftLines = buildLines();
  const draftTotal = draftLines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);

  /* Dish picks per meal, grouped by meal. These are free-text preferences for the
   * chef to read, so they stay as the titles in the guest's own language — unlike
   * `sku`, which must be locale-independent because it identifies a priced item. */
  const buildDishPicks = () => {
    const picks = {};
    for (const d of Object.values(dishes)) {
      if (!["breakfast", "lunch", "dinner"].includes(d.group)) continue;
      (picks[d.group] ??= []).push(d.label);
    }
    return picks;
  };

  const addToCart = (dietary) => {
    if (!draftLines.length) return;

    /* Replace rather than append, so deselecting something and re-adding doesn't
     * leave the old line behind. */
    clearService(SERVICE);
    draftLines.forEach(setLine);

    const form = { ...dietary };
    const picks = buildDishPicks();
    if (Object.keys(picks).length) form.dishes = picks;
    if (notes.trim()) form.notes = notes.trim();
    if (Object.keys(form).length) setServiceForm(SERVICE, form);

    openCart();
  };

  const buildInfoLines = () => {
    const groups = [
      { key: "breakfast", label: t("privateChef.breakfast.heading") },
      { key: "lunch", label: t("privateChef.lunch.heading") },
      { key: "dinner", label: t("privateChef.dinner.heading") },
    ];

    const picked = Object.values(dishes);
    const lines = groups
      .map(({ key, label }) => {
        const names = picked.filter((d) => d.group === key).map((d) => d.label);
        return names.length ? { label: `${label}: ${names.join(", ")}`, price: 0 } : null;
      })
      .filter(Boolean);

    if (serviceDate) lines.push({ label: `Preferred date: ${serviceDate}`, price: 0 });

    return lines;
  };

  return (
    <>
      <Navbar />
      <main className="pt-24">

        {/* Hero */}
        <div className="px-8 md:px-16 pt-8 pb-10">
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
            <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-md">{t("privateChef.subtitle")}</p>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200 shrink-0 w-fit mt-6"
            >
              <TbBrandWhatsapp size={16} />
              {t("privateChef.whatsapp")}
            </a>
          </div>
        </div>

        <div className="flex flex-col pb-8">

          {/* 01 — Overview / Story */}
          <div id="overview" className="flex flex-col gap-8 scroll-mt-40 px-8 md:px-16 pt-2 pb-14 md:pb-20">

            {/* Story — photo + text */}
            <div className="bg-[#213B2F] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:h-[440px]" data-aos="fade-up">
              <div className="flex flex-col justify-center gap-5 px-8 md:px-12 py-12 lg:py-0 order-2 lg:order-1">
                <TbLeaf size={22} className="text-[#D8DDB8]/60" />
                <h2 className="text-3xl md:text-4xl text-[#EDE5D8] tracking-tight leading-tight" style={{ fontFamily: "var(--font-alpina)" }}>
                  {t("privateChef.story.heading")}
                </h2>
                <div className="w-12 h-px bg-[#D8DDB8]/40" />
                <p className="font-sans text-sm text-[#D8DDB8]/65 leading-relaxed whitespace-pre-line max-w-md">
                  {t("privateChef.story.body")}
                </p>
              </div>
              <div className="h-56 lg:h-full order-1 lg:order-2 overflow-hidden">
                <img src={STORY_IMAGE} alt={t("privateChef.story.heading")} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* How it works — steps */}
            <div className="flex flex-col gap-6" data-aos="fade-up">
              <div className="flex flex-col gap-2 max-w-xl">
                <h2 className="text-3xl md:text-4xl text-[#213B2F] tracking-tight leading-tight" style={{ fontFamily: "var(--font-alpina)" }}>
                  How to build your experience
                </h2>
                <p className="font-sans text-sm text-[#222E2C]/50 leading-relaxed">
                  Browse the menus, pick your dishes, and submit — your chef handles the rest.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {[
                  { Icon: TbHandClick,     step: "Pick a service",      body: "Choose between Breakfast, Lunch, Dinner, or a Full Day — then set your guest count." },
                  { Icon: TbListCheck,     step: "Browse the menus",    body: "Explore each meal and select the dishes you'd like the chef to prepare." },
                  { Icon: TbAdjustments,   step: "Add preferences",     body: "Let the chef know about dietary restrictions, allergies, or anything you'd rather avoid." },
                  { Icon: TbSend,          step: "Review & submit",     body: "Scroll to the order summary at the bottom, add any final notes for the chef, and submit — we'll confirm everything before your stay." },
                ].map(({ Icon, step, body }, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-3 bg-white rounded-2xl px-5 py-5 border border-[#222E2C]/8">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#213B2F] flex items-center justify-center shrink-0">
                        <Icon size={15} className="text-[#D8DDB8]" />
                      </div>
                      <span className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">Step {i + 1}</span>
                    </div>
                    <p className="font-sans text-base font-medium text-[#222E2C] leading-snug">{step}</p>
                    <p className="font-sans text-sm text-[#222E2C]/55 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 02 — Menu Builder */}
          <div id="menu" className="flex flex-col gap-10 scroll-mt-40 border-t border-[#222E2C]/10 px-8 md:px-16 py-14 md:py-20">

            <div className="flex flex-col gap-8" data-aos="fade-up">

              {/* Heading */}
              <div className="flex flex-col gap-1.5">
                <p className="font-sans text-xs font-semibold text-[#222E2C]/50 uppercase tracking-widest">02 — Menu Builder</p>
                <h2 className="font-sans font-semibold text-2xl md:text-3xl text-[#222E2C] tracking-tight">
                  {ob.standardHeading}
                </h2>
              </div>

              {/* Service type selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Array.isArray(pricingPS) && pricingPS.map((item, i) => (
                  <button key={i} type="button" aria-pressed={selectedServiceIdx === i} onClick={() => pickService(i)}
                    className={`text-left rounded-xl px-5 py-5 flex flex-col gap-2 border-2 transition-all duration-200 ${
                      selectedServiceIdx === i
                        ? "bg-[#213B2F] border-[#213B2F]"
                        : "bg-white border-[#222E2C]/10 hover:border-[#222E2C]/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`font-sans font-semibold text-base ${selectedServiceIdx === i ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>
                        {item.label}
                      </span>
                      {selectedServiceIdx === i && <TbCheck size={16} className="text-[#D8DDB8] shrink-0 mt-0.5" />}
                    </div>
                    <span className={`font-sans text-sm ${selectedServiceIdx === i ? "text-[#D8DDB8]/70" : "text-[#222E2C]/65"}`}>
                      ${item.basePrice} for up to {item.baseGuests} guests
                    </span>
                    {selectedServiceIdx === i && (
                      <span className="font-sans font-bold text-xl text-[#D8DDB8] mt-1">
                        ${computeServicePrice(item, guests)}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Hint when no service selected yet */}
              {selectedServiceIdx === null && (
                <p className="font-sans text-sm text-[#222E2C]/40 italic text-center py-2">
                  Select a service above — Breakfast, Lunch, Dinner, or Full Day — to start building your menu.
                </p>
              )}

              {/* Guest count + preferred date */}
              {selectedServiceIdx !== null && (() => {
                const todayIso = new Date().toISOString().slice(0, 10);
                return (
                  <div className="flex flex-wrap items-end gap-6 bg-[#213B2F]/5 rounded-2xl px-6 py-5 border border-[#213B2F]/10">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#222E2C]/40">{ob.guestsLabel}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => changeGuests(String(Math.max(2, guests - 1)))}
                          className="size-9 flex items-center justify-center rounded-full border-2 border-[#213B2F]/25 text-[#213B2F] font-sans text-lg hover:bg-[#213B2F]/8 transition-colors select-none">−</button>
                        <div className="flex items-center justify-center px-5 py-2 rounded-full bg-[#213B2F] min-w-[3.5rem]">
                          <span className="font-sans font-bold text-lg text-[#EDE5D8]">{guests}</span>
                        </div>
                        <button type="button" onClick={() => changeGuests(String(guests + 1))}
                          className="size-9 flex items-center justify-center rounded-full border-2 border-[#213B2F]/25 text-[#213B2F] font-sans text-lg hover:bg-[#213B2F]/8 transition-colors select-none">+</button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-[#222E2C]/40 cursor-default">
                        <TbCalendarEvent size={11} />
                        Preferred date
                        <span className="font-normal normal-case tracking-normal text-[#222E2C]/30">(optional)</span>
                      </label>
                      <input
                        type="date"
                        min={todayIso}
                        value={serviceDate}
                        onChange={(e) => setServiceDate(e.target.value)}
                        className="font-sans text-sm rounded-xl px-4 py-2.5 bg-white border border-[#222E2C]/12 text-[#222E2C] focus:outline-none focus:ring-2 focus:ring-[#213B2F]/30 focus:border-transparent transition-all shadow-sm"
                      />
                    </div>

                    <div className="ml-auto flex flex-col items-end gap-0.5 shrink-0">
                      <span className="font-sans text-xs text-[#222E2C]/40 uppercase tracking-widest">Total</span>
                      <span className="font-sans font-bold text-3xl text-[#222E2C]">
                        ${computeServicePrice(pricingPS[selectedServiceIdx], guests).toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Dish selection */}
            {visibleMeals.length > 0 && (
              <div className="flex flex-col gap-6" data-aos="fade-up">

                {/* Dish limit banner */}
                <div className={`rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 ${maxDishes === 2 ? "bg-[#213B2F]" : "bg-[#222E2C]/6 border border-[#222E2C]/12"}`}>
                  <div className="flex-1">
                    {maxDishes === 2 ? (
                      <>
                        <p className="font-sans font-semibold text-base text-[#D8DDB8]">With {guests} guests, choose up to 2 dishes per meal</p>
                        <p className="font-sans text-sm text-[#D8DDB8]/70 mt-0.5">The chef will prepare both options for your group. Selecting a third dish replaces the first.</p>
                      </>
                    ) : (
                      <>
                        <p className="font-sans font-semibold text-base text-[#222E2C]">Choose 1 dish per meal</p>
                        <p className="font-sans text-sm text-[#222E2C]/65 mt-0.5">Select the dish you'd like the chef to prepare. Picking another automatically replaces the current one.</p>
                      </>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full shrink-0 font-sans text-sm font-semibold ${maxDishes === 2 ? "bg-[#D8DDB8]/15 text-[#D8DDB8]" : "bg-[#222E2C]/10 text-[#222E2C]"}`}>
                    {maxDishes === 2 ? "Up to 2 dishes" : "1 dish per meal"}
                  </div>
                </div>

                {/* Meal tabs for Full Day */}
                {visibleMeals.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {visibleMeals.map((meal) => {
                      const Icon = MEAL_META[meal]?.icon;
                      const mealPicked = Object.values(dishes).filter(d => d.group === meal).length;
                      return (
                        <button key={meal} type="button" aria-pressed={activeMeal === meal} onClick={() => setActiveMeal(meal)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-sans text-sm font-medium transition-colors duration-200 ${
                            activeMeal === meal
                              ? "bg-[#213B2F] border-[#213B2F] text-[#D8DDB8]"
                              : "border-[#222E2C]/20 text-[#222E2C] hover:border-[#222E2C]/40"
                          }`}
                        >
                          {Icon && <Icon size={15} />}
                          {t(`privateChef.${meal}.heading`)}
                          {mealPicked > 0 && (
                            <span className={`size-5 flex items-center justify-center rounded-full text-xs font-bold ${activeMeal === meal ? "bg-[#D8DDB8]/20 text-[#D8DDB8]" : "bg-[#213B2F] text-[#D8DDB8]"}`}>
                              {mealPicked}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeMeal === "breakfast" && (
                  <MenuSection
                    heading={t("privateChef.breakfast.heading")}
                    items={Array.isArray(breakfastItems) ? breakfastItems : []}
                    note={t("privateChef.breakfast.note")}
                    extras={Array.isArray(breakfastExtras) ? breakfastExtras : []}
                    extrasHeading={t("privateChef.breakfast.extrasHeading")}
                    group="breakfast" dishes={dishes} onToggle={toggleDish}
                    maxDishes={maxDishes} hideHeading={visibleMeals.length > 1}
                  />
                )}
                {activeMeal === "lunch" && (
                  <MenuSection
                    heading={t("privateChef.lunch.heading")}
                    items={Array.isArray(lunchItems) ? lunchItems : []}
                    group="lunch" dishes={dishes} onToggle={toggleDish}
                    maxDishes={maxDishes} hideHeading={visibleMeals.length > 1}
                  />
                )}
                {activeMeal === "dinner" && (
                  <MenuSection
                    heading={t("privateChef.dinner.heading")}
                    items={Array.isArray(dinnerItems) ? dinnerItems : []}
                    group="dinner" dishes={dishes} onToggle={toggleDish}
                    maxDishes={maxDishes} hideHeading={visibleMeals.length > 1}
                  />
                )}

              </div>
            )}
          </div>

          {/* 03 — Themed Nights */}
          <div id="themed-nights" className="flex flex-col gap-6 scroll-mt-40 border-t border-[#222E2C]/8 px-8 md:px-16 py-14 md:py-20" data-aos="fade-up">
            <Eyebrow num="03" label={nav.themedNights} />
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {t("privateChef.themedNights.subheading")}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("privateChef.themedNights.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">
                {t("privateChef.themedNights.description")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {Array.isArray(themedNights) && themedNights.map((night, i) => (
                <ThemedNightPanel
                  key={i}
                  night={night}
                  image={NIGHT_IMAGES[i]}
                  selected={selectedNightIdx === i}
                  onClick={() => pickNight(i)}
                  guests={themedGuests}
                  onGuestsChange={changeThemedGuests}
                  date={themedDate}
                  onDateChange={handleThemedDate}
                  price={findThemedTier(themedTiers, themedGuests)?.priceValue}
                />
              ))}
            </div>

            {/* Beverage add-ons */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="border-b border-[#222E2C]/15 pb-3">
                <h3 className="font-sans font-semibold text-base text-[#222E2C]">
                  {fridgeBeverages.heading}
                </h3>
                <p className="font-sans text-sm text-[#222E2C]/50 mt-0.5">{fridgeBeverages.subheading}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.isArray(fridgeBeverages.items) && fridgeBeverages.items.map((item, i) => {
                  const qty = bevQty[i] || 0;
                  const active = qty > 0;
                  return (
                    <div
                      key={i}
                      className={`rounded-2xl p-5 flex flex-col gap-4 border-2 transition-all duration-200 ${
                        active
                          ? "bg-[#213B2F] border-[#213B2F] shadow-md"
                          : "bg-white border-transparent shadow-sm hover:border-[#213B2F]/15"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className={`font-sans font-semibold text-sm ${active ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{item.title}</p>
                          {item.description && (
                            <p className={`font-sans text-xs leading-snug ${active ? "text-[#D8DDB8]/60" : "text-[#222E2C]/55"}`}>{item.description}</p>
                          )}
                        </div>
                        <span className={`font-sans font-semibold text-sm whitespace-nowrap shrink-0 ${active ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{item.price}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        {active ? (
                          <div className="flex items-center rounded-xl overflow-hidden border border-white/15 bg-white/10 w-fit">
                            <button type="button" onClick={() => changeBevQty(i, qty - 1)}
                              className="w-9 h-9 flex items-center justify-center font-sans text-lg leading-none text-[#D8DDB8]/70 hover:bg-white/10 transition-colors select-none">−</button>
                            <span className="w-8 text-center font-sans text-sm font-bold text-[#EDE5D8]">{qty}</span>
                            <button type="button" onClick={() => changeBevQty(i, qty + 1)}
                              className="w-9 h-9 flex items-center justify-center font-sans text-lg leading-none text-[#D8DDB8]/70 hover:bg-white/10 transition-colors select-none">+</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => changeBevQty(i, 1)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#213B2F] text-[#D8DDB8] font-sans text-xs font-semibold hover:bg-[#213B2F]/85 transition-colors">
                            <TbPlus size={11} />
                            Add
                          </button>
                        )}
                        {active && (
                          <span className="font-sans text-sm font-semibold text-[#D8DDB8]">
                            ${(item.priceValue * qty).toLocaleString("en-US")}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="font-sans text-xs text-[#222E2C]/45 italic">{fridgeBeverages.note}</p>
            </div>

            {/* Bartender add-on */}
            <div className="flex flex-col gap-4 pt-2 border-t border-[#222E2C]/8">
              <div className="flex flex-col gap-1">
                <h3 className="flex items-center gap-2 font-sans font-semibold text-base text-[#222E2C]">
                  <TbGlassCocktail size={17} className="text-[#222E2C]/45" />
                  {ob.bartenderHeading}
                </h3>
              </div>
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
          </div>

          {/* 04 — Desserts + Bakery */}
          <div id="sweets" className="flex flex-col gap-6 scroll-mt-40 border-t border-[#222E2C]/8 px-8 md:px-16 py-14 md:py-20" data-aos="fade-up">
            <Eyebrow num="04" label={nav.sweets} />
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {sweets.kicker}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {sweets.heading}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">{sweets.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <SimpleMenuSection
                heading={t("privateChef.desserts.heading")}
                subheading={t("privateChef.desserts.subheading")}
                items={Array.isArray(dessertsItems) ? dessertsItems : []}
                group="dessert"
                dishQty={dishQty}
                onQtyChange={changeDishQty}
              />
              <SimpleMenuSection
                heading={t("privateChef.bakery.heading")}
                subheading={t("privateChef.bakery.subheading")}
                items={Array.isArray(bakeryItems) ? bakeryItems : []}
                group="bakery"
                dishQty={dishQty}
                onQtyChange={changeDishQty}
              />
            </div>
          </div>

          {/* Quote */}
          <div className="flex flex-col items-center text-center gap-5 py-8 border-t border-[#222E2C]/8 px-8 md:px-16" data-aos="fade-up">
            <div className="w-10 h-px bg-[#222E2C]/25" />
            <blockquote className="text-2xl md:text-3xl text-[#213B2F]/80 leading-relaxed max-w-2xl italic" style={{ fontFamily: "var(--font-alpina)" }}>
              "Tell me what you eat, and I will tell you what you are."
            </blockquote>
            <p className="font-sans text-sm text-[#222E2C]/45">— Jean Anthelme Brillat-Savarin</p>
            <div className="w-10 h-px bg-[#222E2C]/25" />
          </div>

          {/* 05 — Review & Submit */}
          <div id="book" className="flex flex-col gap-6 scroll-mt-40 border-t border-[#222E2C]/8 bg-[#E0D4C4]/35 px-8 md:px-16 py-14 md:py-20">
            <Eyebrow num="05" label={nav.book} standalone />

            <ChefSummary
              lines={draftLines.map((l) => ({
                label: l.qty > 1 ? `${l.title} × ${l.qty}` : l.title,
                price: l.qty * l.unitPrice,
              }))}
              infoLines={buildInfoLines()}
              total={draftTotal}
              notes={notes}
              onNotesChange={setNotes}
              onAddToCart={addToCart}
              inCart={inCart}
            />
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function Eyebrow({ num, label, standalone = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="font-sans text-xs font-semibold text-[#222E2C]/35 tabular-nums">{num}</span>
      <span className="w-5 h-px bg-[#222E2C]/25" />
      {!standalone && (
        <span className="font-sans text-xs font-semibold text-[#222E2C]/50 uppercase tracking-widest">{label}</span>
      )}
    </div>
  );
}


function MenuSection({ heading, items, note, extras, extrasHeading, group, dishes, onToggle, maxDishes = 1, hideHeading = false }) {
  const selectedCount = Object.values(dishes).filter(d => d.group === group).length;

  return (
    <div className="flex flex-col gap-5" data-aos="fade-up">
      {!hideHeading && (
        <h2 className="font-sans font-semibold text-xl text-[#222E2C] tracking-tight">{heading}</h2>
      )}

      {/* Progress indicator */}
      <div className="flex items-center gap-2.5">
        {Array.from({ length: maxDishes }).map((_, i) => (
          <div key={i} className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${i < selectedCount ? "bg-[#213B2F]" : "bg-[#222E2C]/15"}`} />
        ))}
        <span className="font-sans text-sm text-[#222E2C]/65 ml-1">
          {selectedCount === 0
            ? maxDishes === 1 ? "Pick a dish" : "Pick up to 2 dishes"
            : `${selectedCount} of ${maxDishes} selected`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, i) => {
          const id = `dish-${group}-${i}`;
          const selected = Boolean(dishes[id]);
          return (
            <button key={i} type="button" aria-pressed={selected} onClick={() => onToggle(id, item.title, group)}
              className={`text-left rounded-xl px-5 py-5 flex flex-col gap-2.5 border-2 transition-all duration-200 ${
                selected ? "bg-[#213B2F] border-[#213B2F]" : "bg-white border-[#222E2C]/10 hover:border-[#222E2C]/25"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                {item.tag && (
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    selected ? "bg-[#D8DDB8]/20 text-[#D8DDB8]" : "bg-[#213B2F]/10 text-[#213B2F]"
                  }`}>
                    🇨🇷 {item.tag}
                  </span>
                )}
                {selected && <TbCheck size={16} className="text-[#D8DDB8] shrink-0 ml-auto" />}
              </div>
              <h3 className={`font-sans font-semibold text-sm leading-snug ${selected ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{item.title}</h3>
              <p className={`font-sans text-sm leading-relaxed ${selected ? "text-[#D8DDB8]/70" : "text-[#222E2C]/65"}`}>{item.description}</p>
            </button>
          );
        })}
      </div>

      {note && <p className="font-sans text-sm text-[#222E2C]/65">{note}</p>}

      {extras && extras.length > 0 && (
        <div className="flex flex-col gap-3 pt-2 border-t border-[#222E2C]/10">
          <p className="font-sans font-semibold text-sm text-[#222E2C]">{extrasHeading}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            {extras.map((extra, i) => {
              const id = `dish-${group}-extra-${i}`;
              const selected = Boolean(dishes[id]);
              return (
                <button key={i} type="button" aria-pressed={selected} onClick={() => onToggle(id, extra.title, group)}
                  className={`text-left border-2 rounded-xl px-4 py-4 flex flex-col gap-1.5 flex-1 transition-all duration-200 ${
                    selected ? "bg-[#213B2F] border-[#213B2F]" : "bg-white border-[#222E2C]/10 hover:border-[#222E2C]/25"
                  }`}
                >
                  <p className={`font-sans font-semibold text-sm ${selected ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{extra.title}</p>
                  <p className={`font-sans text-sm leading-relaxed ${selected ? "text-[#D8DDB8]/70" : "text-[#222E2C]/65"}`}>{extra.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleMenuSection({ heading, subheading, items, group, dishQty, onQtyChange }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-[#222E2C]/15 pb-3">
        <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
          {subheading}
        </p>
        <h2 className="font-sans font-semibold text-lg text-[#222E2C] tracking-tight">{heading}</h2>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => {
          const id = `dish-${group}-${i}`;
          const qty = dishQty?.[id] || 0;
          const active = qty > 0;
          return (
            <div
              key={i}
              className={`rounded-2xl px-4 py-3.5 flex items-center justify-between gap-4 border-2 transition-all duration-200 ${
                active
                  ? "bg-[#213B2F] border-[#213B2F] shadow-md"
                  : "bg-white border-transparent shadow-sm hover:border-[#213B2F]/15"
              }`}
            >
              <div className="min-w-0">
                <h3 className={`font-sans font-semibold text-sm ${active ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{item.title}</h3>
                <p className={`font-sans text-xs leading-relaxed mt-0.5 ${active ? "text-[#D8DDB8]/65" : "text-[#222E2C]/55"}`}>{item.description}</p>
              </div>
              <div className="shrink-0">
                {active ? (
                  <div className="flex items-center rounded-xl overflow-hidden border border-white/15 bg-white/10">
                    <button type="button" onClick={() => onQtyChange(id, qty - 1)}
                      className="w-8 h-8 flex items-center justify-center font-sans text-lg leading-none text-[#D8DDB8]/70 hover:bg-white/10 transition-colors select-none">−</button>
                    <span className="w-7 text-center font-sans text-sm font-bold text-[#EDE5D8]">{qty}</span>
                    <button type="button" onClick={() => onQtyChange(id, qty + 1)}
                      className="w-8 h-8 flex items-center justify-center font-sans text-lg leading-none text-[#D8DDB8]/70 hover:bg-white/10 transition-colors select-none">+</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => onQtyChange(id, 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#213B2F] text-[#D8DDB8] font-sans text-xs font-semibold hover:bg-[#213B2F]/85 transition-colors">
                    <TbPlus size={11} />
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DarkField({ label, placeholder, value, onChange }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-xs font-medium text-[#D8DDB8]/55">{label}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 font-sans text-sm text-[#D8DDB8] placeholder:text-[#D8DDB8]/35 focus:outline-none focus:ring-2 focus:ring-[#D8DDB8]/30 focus:border-transparent transition-all duration-200"
      />
    </label>
  );
}

/*
 * End-of-page summary. The dietary form lives here rather than on the page because
 * nothing else needs it; on commit it is handed up as structured data and stored in
 * the cart's `serviceForms["private-chef"]`, not flattened into zero-price lines the
 * way the old version did.
 */
function ChefSummary({ lines, infoLines = [], total, notes, onNotesChange, onAddToCart, inCart }) {
  const { t } = useI18n();

  const df  = t("privateChef.dietaryForm");

  const [restrictionCounts, setRestrictionCounts] = useState({});
  const [restrictionOther, setRestrictionOther]   = useState("");
  const [allergies, setAllergies]                 = useState("");
  const [preferences, setPreferences]             = useState("");

  const changeRestrictionCount = (opt, count) => {
    const next = Math.max(0, count);
    setRestrictionCounts((prev) => {
      if (next === 0) { const n = { ...prev }; delete n[opt]; return n; }
      return { ...prev, [opt]: next };
    });
  };

  const handleAddToCart = () => {
    const dietary = {};
    if (Object.keys(restrictionCounts).length) dietary.restrictions = restrictionCounts;
    if (restrictionOther.trim()) dietary.restrictionOther = restrictionOther.trim();
    if (allergies.trim())        dietary.allergies        = allergies.trim();
    if (preferences.trim())      dietary.preferences      = preferences.trim();
    onAddToCart(dietary);
  };

  return (
    <div className="flex flex-col gap-6" data-aos="fade-up">
      <div className="bg-[#213B2F] rounded-2xl px-6 md:px-10 py-8 flex flex-col gap-8">

        {/* Priced summary */}
        <div className="flex flex-col gap-3">
          <h3 className="font-sans font-semibold text-sm text-[#D8DDB8]">Order Summary</h3>
          {lines.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D8DDB8]/25 px-4 py-5 text-center">
              <p className="font-sans text-sm italic text-[#D8DDB8]/45">No items selected yet — browse the sections above.</p>
            </div>
          ) : (
            <div className="rounded-xl bg-white/8 divide-y divide-[#D8DDB8]/10 overflow-hidden">
              {lines.map((line, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <span className="font-sans text-sm text-[#D8DDB8]/85">{line.label}</span>
                  <span className="font-sans font-medium text-sm whitespace-nowrap text-[#D8DDB8] tabular-nums">
                    {money(line.price)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/10">
                <span className="font-sans font-semibold text-sm text-[#D8DDB8]">Total</span>
                <span className="font-sans font-semibold text-base text-[#D8DDB8] tabular-nums">{money(total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Preferences & dish picks */}
        {infoLines.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="font-sans font-semibold text-sm text-[#D8DDB8]">Preferences & Details</h3>
            <div className="rounded-xl border border-[#D8DDB8]/15 px-4 py-3 flex flex-col gap-2">
              {infoLines.map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  <TbCheck size={14} className="shrink-0 mt-0.5 text-[#D8DDB8]/45" />
                  <span className="font-sans text-sm leading-relaxed text-[#D8DDB8]/75">{line.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dietary restrictions — inline */}
        <div className="flex flex-col gap-4 pt-2 border-t border-white/10">
          <div>
            <h3 className="font-sans font-semibold text-sm text-[#D8DDB8]">{df.heading}</h3>
            <p className="font-sans text-xs text-[#D8DDB8]/55 mt-1">{df.description}</p>
          </div>

          {/* Restriction option chips */}
          <div className="flex flex-col gap-2">
            <span className="font-sans text-xs font-semibold text-[#D8DDB8]/45 uppercase tracking-widest">{df.restrictionsLabel}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Array.isArray(df.options) && df.options.map((opt) => {
                const count = restrictionCounts[opt] || 0;
                const active = count > 0;
                return (
                  <div key={opt} className={`rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 border transition-all duration-200 ${active ? "bg-white/15 border-white/25" : "bg-white/6 border-white/10 hover:border-white/20"}`}>
                    <span className="font-sans text-sm text-[#D8DDB8]/85">{opt}</span>
                    {active ? (
                      <div className="flex items-center rounded-lg overflow-hidden border border-white/15 bg-white/10 shrink-0">
                        <button type="button" onClick={() => changeRestrictionCount(opt, count - 1)} className="w-7 h-7 flex items-center justify-center font-sans text-base leading-none text-[#D8DDB8]/70 hover:bg-white/10 transition-colors select-none">−</button>
                        <span className="w-6 text-center font-sans text-xs font-bold text-[#EDE5D8]">{count}</span>
                        <button type="button" onClick={() => changeRestrictionCount(opt, count + 1)} className="w-7 h-7 flex items-center justify-center font-sans text-base leading-none text-[#D8DDB8]/70 hover:bg-white/10 transition-colors select-none">+</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => changeRestrictionCount(opt, 1)} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-[#D8DDB8]/70 font-sans text-xs font-semibold hover:bg-white/15 transition-colors shrink-0">
                        <TbPlus size={10} />
                        Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Other / allergies / preferences */}
          <DarkField label={df.otherLabel} placeholder={df.otherPlaceholder} value={restrictionOther} onChange={(e) => setRestrictionOther(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DarkField label={df.allergiesLabel}   placeholder={df.allergiesPlaceholder}   value={allergies}   onChange={(e) => setAllergies(e.target.value)} />
            <DarkField label={df.preferencesLabel} placeholder={df.preferencesPlaceholder} value={preferences} onChange={(e) => setPreferences(e.target.value)} />
          </div>
        </div>

        {/* Notes */}
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs font-medium text-[#D8DDB8]/60">Notes for the chef</span>
          <div className="relative">
            <TbNotes size={16} className="absolute left-3.5 top-3.5 pointer-events-none text-[#D8DDB8]/35" />
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Anything else you'd like the chef to know..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 shadow-sm font-sans text-sm text-[#D8DDB8] placeholder:text-[#D8DDB8]/40 focus:outline-none focus:ring-2 focus:ring-[#D8DDB8]/40 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>
        </label>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={lines.length === 0}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-sans font-medium text-sm shadow-sm hover:shadow transition-all duration-200 w-fit disabled:opacity-50 bg-[#D8DDB8] text-[#213B2F] hover:bg-[#D8DDB8]/90"
        >
          {inCart ? <TbCheck size={16} /> : <TbShoppingBag size={16} />}
          {inCart ? t("cart.update") : t("cart.addToCart")}
        </button>

      </div>
    </div>
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


// Order must match the themedNights array order in i18n
const NIGHT_IMAGES = [
  "/assets/Chef/taco.avif",
  "/assets/Chef/smokehouse.avif",
  "/assets/Chef/tico.avif",
  "/assets/Chef/vegan.avif",
  "/assets/Chef/ocean.avif",
  "/assets/Chef/pasta.avif",
  "/assets/Chef/sushi.avif",
  "/assets/Chef/pizza.avif",
];

function ThemedNightPanel({ night, image, selected, onClick, guests, onGuestsChange, date, onDateChange, price }) {
  const todayIso = new Date().toISOString().slice(0, 10);

  // Extract the choice count for a menu section by scanning the includes summary
  const getChoiceCount = (sectionHeading) => {
    const key = sectionHeading.toLowerCase().replace(/s$/, "");
    const match = night.includes?.find((inc) => inc.toLowerCase().includes(key));
    const num = match?.match(/\d+/)?.[0];
    return num ? `Choose ${num}` : null;
  };

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-500 ${
      selected
        ? "border-[#213B2F] shadow-xl ring-2 ring-[#213B2F]/20"
        : "border-[#222E2C]/12 hover:border-[#213B2F]/30"
    }`}>

      {/* ── Collapsed row — slides out when selected ── */}
      <div className={`grid transition-all duration-500 ease-in-out ${selected ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
        <div className="overflow-hidden">
          <button
            type="button"
            onClick={onClick}
            className="w-full flex items-stretch text-left bg-white hover:bg-[#213B2F]/4 transition-colors duration-200"
          >
            <div className="w-44 shrink-0 overflow-hidden">
              <img src={image} alt={night.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 px-6 py-5 flex flex-col justify-center gap-1 min-w-0">
              <h3 className="font-sans font-semibold text-base text-[#222E2C]">{night.title}</h3>
              <p className="font-sans text-sm text-[#222E2C]/55">{night.subtitle}</p>
              <p className="font-sans text-xs text-[#222E2C]/40 mt-0.5 truncate">{night.description}</p>
            </div>
            <div className="px-6 py-5 flex flex-col items-end justify-center gap-2 shrink-0">
              <span className="font-sans text-xs text-[#222E2C]/40">from $530</span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#213B2F]/20 text-[#213B2F] font-sans text-sm font-medium">
                Select night
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ── Expanded panel — slides in when selected ── */}
      <div className={`grid transition-all duration-500 ease-in-out ${selected ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className={`transition-opacity duration-300 ${selected ? "opacity-100 delay-200" : "opacity-0"}`}>

            {/* Photo header with gradient overlay — click to deselect */}
            <div
              className="relative h-72 overflow-hidden cursor-pointer"
              onClick={onClick}
            >
              <img src={image} alt={night.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#213B2F] via-[#213B2F]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-8 py-6 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-sans font-bold text-2xl text-[#EDE5D8] leading-tight">{night.title}</h3>
                  <p className="font-sans text-sm text-[#D8DDB8]/70 mt-1">{night.subtitle}</p>
                </div>
                <span className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#D8DDB8] text-[#213B2F] font-sans text-sm font-bold shadow-lg">
                  <TbCheck size={15} />
                  Selected
                </span>
              </div>
            </div>

            {/* Controls bar: guests + date + price */}
            <div
              className="bg-[#213B2F] px-8 py-6 flex flex-wrap items-end gap-6 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1.5">
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#D8DDB8]/50">Guests</span>
                <div className="flex items-center bg-white/12 rounded-xl overflow-hidden w-fit border border-white/10">
                  <button type="button" onClick={() => onGuestsChange(guests - 1)}
                    className="size-10 flex items-center justify-center font-sans text-xl leading-none text-[#D8DDB8]/70 hover:bg-white/10 transition-colors select-none">−</button>
                  <span className="w-10 text-center font-sans text-sm font-bold text-[#EDE5D8]">{guests}</span>
                  <button type="button" onClick={() => onGuestsChange(guests + 1)}
                    className="size-10 flex items-center justify-center font-sans text-xl leading-none text-[#D8DDB8]/70 hover:bg-white/10 transition-colors select-none">+</button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-[#D8DDB8]/50 cursor-default">
                  <TbCalendarEvent size={11} />
                  Preferred date
                  <span className="font-normal normal-case tracking-normal text-[#D8DDB8]/35">(optional)</span>
                </label>
                <input
                  type="date"
                  min={todayIso}
                  value={date}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => { e.stopPropagation(); onDateChange(e.target.value); }}
                  className="font-sans text-sm rounded-xl px-4 py-2.5 bg-white/12 border border-white/15 text-[#D8DDB8] focus:outline-none focus:ring-2 focus:ring-white/25 [color-scheme:dark] transition-all"
                />
              </div>

              {price && (
                <div className="flex flex-col gap-0.5 ml-auto text-right">
                  <span className="font-sans text-xs text-[#D8DDB8]/50 uppercase tracking-widest">Total · {guests} guests</span>
                  <span className="font-sans font-bold text-3xl text-[#EDE5D8]">${price.toLocaleString("en-US")}</span>
                </div>
              )}
            </div>

            {/* Menu content */}
            <div className="bg-[#EDE5D8] px-8 py-8">
              {night.menu ? (
                /* Nights with selectable menus: show sections + "Choose N" badge */
                <div className="flex flex-col gap-8">
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#213B2F]/50">
                    Menu — select your preferences below and mention them in the notes
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {night.menu.map((section, si) => {
                      const choiceLabel = getChoiceCount(section.heading);
                      return (
                        <div key={si} className="flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-[#213B2F]/15">
                            <span className="font-sans font-bold text-sm text-[#213B2F] uppercase tracking-wider">
                              {section.heading}
                            </span>
                            {choiceLabel && (
                              <span className="font-sans text-xs font-bold px-3 py-1.5 rounded-full bg-[#213B2F] text-[#D8DDB8] shrink-0">
                                {choiceLabel}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {section.items.map((item, ii) => (
                              <div key={ii} className="flex items-start gap-2">
                                <TbCircleCheck size={12} className="text-[#213B2F]/35 shrink-0 mt-0.5" />
                                <span className="font-sans text-xs text-[#222E2C]/70 leading-snug">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* All-inclusive nights: just show what's included */
                <div className="flex flex-col gap-4">
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#213B2F]/50 pb-3 border-b-2 border-[#213B2F]/15">
                    Everything included
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-8">
                    {night.includes.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <TbCircleCheck size={13} className="text-[#213B2F]/40 shrink-0 mt-0.5" />
                        <span className="font-sans text-sm text-[#222E2C]/70">{item}</span>
                      </div>
                    ))}
                  </div>
                  {night.dessert && (
                    <div className="pt-4 border-t border-[#213B2F]/12 flex items-center gap-2">
                      <span className="font-sans font-semibold text-sm text-[#222E2C]">Dessert:</span>
                      <span className="font-sans text-sm text-[#222E2C]/65">{night.dessert}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
