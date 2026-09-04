"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import OrderCheckoutForm from "@/components/sections/OrderCheckoutForm";
import { useOrderCart } from "@/hooks/useOrderCart";
import {
  TbArrowLeft, TbLeaf, TbCircleCheck, TbBrandWhatsapp, TbCheck,
  TbPlant2, TbFlame, TbSoup, TbSeedling, TbFish,
  TbChevronLeft, TbChevronRight, TbGlassCocktail, TbCoffee, TbSalad, TbToolsKitchen2,
} from "react-icons/tb";

const WHATSAPP = "50685011042";
const HERO_IMAGE = "/assets/InHouseServices/PrivateChefExperience.avif";

const SECTIONS = [
  { id: "overview", num: "01" },
  { id: "menu", num: "02" },
  { id: "sweets", num: "03" },
  { id: "themed-nights", num: "04" },
  { id: "bar", num: "05" },
  { id: "book", num: "06" },
];

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

export default function PrivateChefPage() {
  const { t } = useI18n();
  const cart = useOrderCart();
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
  const oceanDinner     = t("privateChef.pricing.themedNights.oceanDinner");
  const pricingBar      = t("privateChef.pricing.bartender.items");
  const ob              = t("privateChef.orderBuilder");
  const df              = t("privateChef.dietaryForm");
  const sl              = t("privateChef.summaryLabels");
  const sweets          = t("privateChef.sweetsSection");

  const [selectedServiceIdx, setSelectedServiceIdx] = useState(null);
  const [guests, setGuests] = useState(2);
  const [selectedNightIdx, setSelectedNightIdx] = useState(null);
  const [themedGuests, setThemedGuests] = useState(2);
  const [bartenderIdx, setBartenderIdx] = useState(null);
  const [activeMeal, setActiveMeal] = useState(null);

  // Dish picks are preferences for the chef, not priced line items.
  const [dishes, setDishes] = useState({});
  const [restrictions, setRestrictions] = useState([]);
  const [allergies, setAllergies] = useState("");
  const [preferences, setPreferences] = useState("");

  // Scrollspy for the sticky section nav.
  const sectionEls = useRef({});
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    Object.values(sectionEls.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const registerSection = useCallback((id) => (el) => {
    sectionEls.current[id] = el;
  }, []);

  const goToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Themed nights carousel.
  const nightsScrollerRef = useRef(null);
  const [nightSlide, setNightSlide] = useState(0);

  const scrollNights = (dir) => {
    const el = nightsScrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-night-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const handleNightsScroll = () => {
    const el = nightsScrollerRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll("[data-night-card]"));
    if (!cards.length) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setNightSlide(closest);
  };

  const toggleDish = (id, label, group) => {
    setDishes((prev) => {
      if (prev[id]) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { label, group } };
    });
  };

  const toggleRestriction = (opt) => {
    setRestrictions((prev) => (prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt]));
  };

  const visibleMeals = selectedServiceIdx === null ? [] : SERVICE_MEALS[selectedServiceIdx];

  useEffect(() => {
    const meals = selectedServiceIdx === null ? [] : SERVICE_MEALS[selectedServiceIdx];
    setActiveMeal(meals.length ? meals[0] : null);
  }, [selectedServiceIdx]);

  const pickService = (i) => {
    const deselecting = selectedServiceIdx === i;
    const nextIdx = deselecting ? null : i;
    setSelectedServiceIdx(nextIdx);

    if (deselecting) {
      cart.removeItem("service");
    } else {
      const item = pricingPS[i];
      cart.setItem("service", { label: `${item.label} · ${guests} guests`, price: computeServicePrice(item, guests) });
    }

    // Drop dish picks whose menu is no longer on screen.
    const stillVisible = nextIdx === null ? [] : SERVICE_MEALS[nextIdx];
    setDishes((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([, d]) => !["breakfast", "lunch", "dinner"].includes(d.group) || stillVisible.includes(d.group))
      )
    );
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
    if (selectedNightIdx === i) {
      setSelectedNightIdx(null);
      cart.removeItem("themed-night");
      cart.removeItem("ocean-dinner");
      return;
    }
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

  const buildInfoLines = () => {
    const groups = [
      { key: "breakfast", label: t("privateChef.breakfast.heading") },
      { key: "lunch", label: t("privateChef.lunch.heading") },
      { key: "dinner", label: t("privateChef.dinner.heading") },
      { key: "dessert", label: t("privateChef.desserts.heading") },
      { key: "bakery", label: t("privateChef.bakery.heading") },
    ];

    const picked = Object.values(dishes);
    const lines = groups
      .map(({ key, label }) => {
        const names = picked.filter((d) => d.group === key).map((d) => d.label);
        return names.length ? { label: `${label}: ${names.join(", ")}`, price: 0 } : null;
      })
      .filter(Boolean);

    if (restrictions.length) lines.push({ label: `${sl.restrictions}: ${restrictions.join(", ")}`, price: 0 });
    if (allergies.trim()) lines.push({ label: `${sl.allergies}: ${allergies.trim()}`, price: 0 });
    if (preferences.trim()) lines.push({ label: `${sl.preferences}: ${preferences.trim()}`, price: 0 });

    return lines;
  };

  const activeMealLabel = activeMeal ? t(`privateChef.${activeMeal}.heading`) : "";

  return (
    <>
      <Navbar />
      <main className="pt-24">

        {/* Hero */}
        <div className="px-8 md:px-16 pt-8 pb-10 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
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

          <div className="relative rounded-2xl overflow-hidden min-h-[260px] sm:min-h-[340px] lg:h-[380px]" data-aos="fade-up">
            <img
              src={HERO_IMAGE}
              alt={t("privateChef.title")}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161f19]/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-[#EDE5D8]/95 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <TbLeaf size={18} className="text-[#213B2F] shrink-0" />
              <p className="font-sans text-xs font-medium text-[#222E2C] leading-snug">{t("privateChef.heroNote")}</p>
            </div>
          </div>
        </div>

        {/* Sticky section nav */}
        <div className="sticky top-24 z-30 px-8 md:px-16 mb-4">
          <nav
            aria-label="Section navigation"
            className="flex items-center gap-1 w-full max-w-full overflow-x-auto no-scrollbar bg-[#EDE5D8]/95 backdrop-blur border border-[#222E2C]/10 rounded-full p-1.5 shadow-sm"
          >
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSection(s.id)}
                aria-current={activeSection === s.id ? "true" : undefined}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-xs font-medium whitespace-nowrap transition-colors duration-200 shrink-0 ${
                  activeSection === s.id ? "bg-[#213B2F] text-[#D8DDB8]" : "text-[#222E2C]/55 hover:text-[#222E2C]"
                }`}
              >
                <span className="tabular-nums opacity-60">{s.num}</span>
                {nav[s.id === "themed-nights" ? "themedNights" : s.id]}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col pb-8">

          {/* 01 — Overview / Story */}
          <div id="overview" ref={registerSection("overview")} className="flex flex-col gap-5 scroll-mt-40 px-8 md:px-16 pt-2 pb-14 md:pb-20" data-aos="fade-up">
            <Eyebrow num="01" label={nav.overview} />
            <div className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col gap-4">
              <TbLeaf size={22} className="text-[#D8DDB8]/50" />
              <h2 className="font-sans font-semibold text-lg text-[#D8DDB8]">
                {t("privateChef.story.heading")}
              </h2>
              <p className="font-sans text-sm text-[#D8DDB8]/70 leading-relaxed whitespace-pre-line max-w-3xl">
                {t("privateChef.story.body")}
              </p>
            </div>
          </div>

          {/* 02 — Menu Builder */}
          <div id="menu" ref={registerSection("menu")} className="flex flex-col gap-6 scroll-mt-40 border-t border-[#222E2C]/8 bg-[#E0D4C4]/35 px-8 md:px-16 py-14 md:py-20">
            <div className="flex flex-col gap-6" data-aos="fade-up">
              <Eyebrow num="02" label={nav.menu} />
              <div className="border-b border-[#222E2C]/15 pb-4">
                <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                  {ob.standardHeading}
                </h2>
                <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">{ob.standardDescription}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Array.isArray(pricingPS) && pricingPS.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={selectedServiceIdx === i}
                    onClick={() => pickService(i)}
                    className={`text-left rounded-xl px-5 py-4 flex flex-col gap-1 border-2 transition-colors duration-200 ${
                      selectedServiceIdx === i ? "bg-[#213B2F] border-[#213B2F]" : "bg-[#E0D4C4] border-transparent hover:border-[#222E2C]/15"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`font-sans font-semibold text-sm ${selectedServiceIdx === i ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>
                        {item.label}
                      </span>
                      {selectedServiceIdx === i && <TbCheck size={16} className="text-[#D8DDB8] shrink-0" />}
                    </div>
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

              {selectedServiceIdx === null ? (
                <p className="font-sans text-xs text-[#222E2C]/40 italic">{ob.servicePickHint}</p>
              ) : (
                <Stepper label={ob.guestsLabel} value={guests} onChange={changeGuests} min={2} />
              )}
            </div>

            {/* Meal menus for the selected service — tabbed when more than one is unlocked */}
            {visibleMeals.length > 0 && (
              <div className="flex flex-col gap-5 mt-4" data-aos="fade-up">
                {visibleMeals.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {visibleMeals.map((meal) => {
                      const Icon = MEAL_META[meal]?.icon;
                      return (
                        <button
                          key={meal}
                          type="button"
                          aria-pressed={activeMeal === meal}
                          onClick={() => setActiveMeal(meal)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-sans text-sm font-medium transition-colors duration-200 ${
                            activeMeal === meal
                              ? "bg-[#213B2F] border-[#213B2F] text-[#D8DDB8]"
                              : "border-[#222E2C]/20 text-[#222E2C]/70 hover:border-[#222E2C]/40"
                          }`}
                        >
                          {Icon && <Icon size={15} />}
                          {t(`privateChef.${meal}.heading`)}
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeMeal === "breakfast" && (
                  <MenuSection
                    heading={t("privateChef.breakfast.heading")}
                    subheading={t("privateChef.breakfast.subheading")}
                    items={Array.isArray(breakfastItems) ? breakfastItems : []}
                    note={t("privateChef.breakfast.note")}
                    extras={Array.isArray(breakfastExtras) ? breakfastExtras : []}
                    extrasHeading={t("privateChef.breakfast.extrasHeading")}
                    extrasSubheading={t("privateChef.breakfast.extrasSubheading")}
                    group="breakfast"
                    dishes={dishes}
                    onToggle={toggleDish}
                    hint={ob.dishesHint}
                    hideHeading={visibleMeals.length > 1}
                  />
                )}

                {activeMeal === "lunch" && (
                  <MenuSection
                    heading={t("privateChef.lunch.heading")}
                    subheading={t("privateChef.lunch.subheading")}
                    items={Array.isArray(lunchItems) ? lunchItems : []}
                    group="lunch"
                    dishes={dishes}
                    onToggle={toggleDish}
                    hint={ob.dishesHint}
                    hideHeading={visibleMeals.length > 1}
                  />
                )}

                {activeMeal === "dinner" && (
                  <MenuSection
                    heading={t("privateChef.dinner.heading")}
                    subheading={t("privateChef.dinner.subheading")}
                    items={Array.isArray(dinnerItems) ? dinnerItems : []}
                    group="dinner"
                    dishes={dishes}
                    onToggle={toggleDish}
                    hint={ob.dishesHint}
                    hideHeading={visibleMeals.length > 1}
                  />
                )}
              </div>
            )}
          </div>

          {/* 03 — Desserts + Bakery */}
          <div id="sweets" ref={registerSection("sweets")} className="flex flex-col gap-6 scroll-mt-40 border-t border-[#222E2C]/8 px-8 md:px-16 py-14 md:py-20" data-aos="fade-up">
            <Eyebrow num="03" label={nav.sweets} />
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
                dishes={dishes}
                onToggle={toggleDish}
              />
              <SimpleMenuSection
                heading={t("privateChef.bakery.heading")}
                subheading={t("privateChef.bakery.subheading")}
                items={Array.isArray(bakeryItems) ? bakeryItems : []}
                group="bakery"
                dishes={dishes}
                onToggle={toggleDish}
              />
            </div>
          </div>

          {/* 04 — Themed Nights */}
          <div id="themed-nights" ref={registerSection("themed-nights")} className="flex flex-col gap-6 scroll-mt-40 border-t border-[#222E2C]/8 bg-[#E0D4C4]/35 px-8 md:px-16 py-14 md:py-20" data-aos="fade-up">
            <Eyebrow num="04" label={nav.themedNights} />
            <div className="border-b border-[#222E2C]/15 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
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
              {Array.isArray(themedNights) && themedNights.length > 1 && (
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-sans text-xs text-[#222E2C]/40 tabular-nums">
                    {String(nightSlide + 1).padStart(2, "0")} / {String(themedNights.length).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollNights(-1)}
                      aria-label="Previous"
                      className="size-9 flex items-center justify-center rounded-full border border-[#222E2C]/20 text-[#222E2C]/60 hover:bg-[#222E2C]/6 transition-colors duration-150"
                    >
                      <TbChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollNights(1)}
                      aria-label="Next"
                      className="size-9 flex items-center justify-center rounded-full border border-[#222E2C]/20 text-[#222E2C]/60 hover:bg-[#222E2C]/6 transition-colors duration-150"
                    >
                      <TbChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div
              ref={nightsScrollerRef}
              onScroll={handleNightsScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-8 px-8 md:-mx-16 md:px-16"
            >
              {Array.isArray(themedNights) && themedNights.map((night, i) => (
                <div key={i} data-night-card className="snap-start shrink-0 w-[88%] sm:w-[440px] lg:w-[500px]">
                  <ThemedNightCard
                    night={night}
                    colorIndex={i}
                    selected={selectedNightIdx === i}
                    onClick={() => pickNight(i)}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <Stepper label={ob.guestsLabel} value={themedGuests} onChange={changeThemedGuests} min={2} max={15} />
              {selectedNightIdx !== null && (
                <span className="font-sans font-semibold text-sm text-[#222E2C] pb-3">
                  ${findThemedTier(themedTiers, themedGuests).priceValue}
                </span>
              )}
              {oceanDinner && (
                <div className="pb-2">
                  <PriceChip
                    label={`${oceanDinner.label} · +$${oceanDinner.priceValue}`}
                    selected={cart.isSelected("ocean-dinner")}
                    disabled={selectedNightIdx === null}
                    onClick={toggleOceanDinner}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 05 — Bar & Preferences */}
          <div id="bar" ref={registerSection("bar")} className="flex flex-col gap-10 scroll-mt-40 border-t border-[#222E2C]/8 px-8 md:px-16 py-14 md:py-20">
            <Eyebrow num="05" label={nav.bar} />

            <div className="flex flex-col gap-4" data-aos="fade-up">
              <h3 className="flex items-center gap-2 font-sans font-semibold text-base text-[#222E2C]">
                <TbGlassCocktail size={18} className="text-[#222E2C]/50" />
                {ob.bartenderHeading}
              </h3>
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

            <div className="flex flex-col gap-6" data-aos="fade-up">
              <div className="border-b border-[#222E2C]/15 pb-4">
                <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                  {df.heading}
                </h2>
                <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">{df.description}</p>
              </div>

              <div className="bg-[#E0D4C4] rounded-2xl px-6 md:px-8 py-7 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <span className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">
                    {df.restrictionsLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(df.options) && df.options.map((opt) => (
                      <PriceChip
                        key={opt}
                        label={opt}
                        selected={restrictions.includes(opt)}
                        onClick={() => toggleRestriction(opt)}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ChefField
                    label={df.allergiesLabel}
                    placeholder={df.allergiesPlaceholder}
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                  <ChefField
                    label={df.preferencesLabel}
                    placeholder={df.preferencesPlaceholder}
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 06 — Book Now */}
          <div id="book" ref={registerSection("book")} className="flex flex-col gap-6 scroll-mt-40 border-t border-[#222E2C]/8 bg-[#E0D4C4]/35 px-8 md:px-16 py-14 md:py-20">
            <Eyebrow num="06" label={nav.book} standalone />

            <OrderCheckoutForm
              service="Private Chef"
              lines={cart.lines}
              infoLines={buildInfoLines()}
              total={cart.total}
              notes={notes}
              onNotesChange={setNotes}
            />

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

function ChefField({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-xs text-[#222E2C]/50">{label}</span>
      <input
        type="text"
        {...props}
        className="w-full px-4 py-3 rounded-xl bg-[#EDE5D8] border border-[#222E2C]/12 shadow-sm font-sans text-sm text-[#222E2C] placeholder:text-[#222E2C]/35 focus:outline-none focus:ring-2 focus:ring-[#213B2F]/15 focus:border-[#213B2F]/40 transition-all duration-200"
      />
    </label>
  );
}

function MenuSection({ heading, subheading, items, note, extras, extrasHeading, extrasSubheading, group, dishes, onToggle, hint, hideHeading = false }) {
  return (
    <div className="flex flex-col gap-5" data-aos="fade-up">
      {!hideHeading && (
        <div className="border-b border-[#222E2C]/15 pb-4">
          <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
            {subheading}
          </p>
          <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
            {heading}
          </h2>
          {hint && <p className="font-sans text-xs text-[#222E2C]/40 mt-1">{hint}</p>}
        </div>
      )}
      {hideHeading && hint && (
        <p className="font-sans text-xs text-[#222E2C]/40">{hint}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, i) => {
          const id = `dish-${group}-${i}`;
          const selected = Boolean(dishes[id]);
          return (
            <button
              key={i}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(id, item.title, group)}
              className={`text-left rounded-xl px-5 py-5 flex flex-col gap-2 border-2 transition-colors duration-200 ${
                selected ? "bg-[#213B2F] border-[#213B2F]" : "bg-[#E0D4C4] border-transparent"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                {item.tag && (
                  <span
                    className={`inline-flex w-fit items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      selected ? "bg-[#D8DDB8]/20 text-[#D8DDB8]" : "bg-[#213B2F]/10 text-[#213B2F]"
                    }`}
                  >
                    🇨🇷 {item.tag}
                  </span>
                )}
                {selected && <TbCheck size={16} className="text-[#D8DDB8] shrink-0 ml-auto" />}
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
              const id = `dish-${group}-extra-${i}`;
              const selected = Boolean(dishes[id]);
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onToggle(id, extra.title, group)}
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

function SimpleMenuSection({ heading, subheading, items, group, dishes, onToggle }) {
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
          const id = `dish-${group}-${i}`;
          const selected = Boolean(dishes[id]);
          return (
            <button
              key={i}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(id, item.title, group)}
              className={`text-left flex items-start gap-2 rounded-xl px-3 py-2.5 border-2 transition-colors duration-200 ${
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

function PriceChip({ label, selected, onClick, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border font-sans text-sm transition-colors duration-200 ${
        disabled
          ? "border-[#222E2C]/8 text-[#222E2C]/30 cursor-not-allowed"
          : selected
            ? "bg-[#213B2F] border-[#213B2F] text-[#D8DDB8]"
            : "border-[#222E2C]/20 text-[#222E2C]/70 hover:border-[#222E2C]/40"
      }`}
    >
      {selected && !disabled && <TbCheck size={13} />}
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
      <div className="flex items-center justify-between gap-2 pl-2 pr-1.5 py-1.5 rounded-xl bg-[#EDE5D8] border border-[#222E2C]/12 shadow-sm w-32">
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
      aria-pressed={selected}
      onClick={onClick}
      style={{ backgroundColor: theme.bg }}
      className={`text-left rounded-2xl px-6 py-7 flex flex-col gap-6 h-full w-full transition-all duration-200 ${selected ? "ring-2 ring-[#213B2F] ring-offset-2 ring-offset-[#EDE5D8]" : ""}`}
    >
      {/* Icon + title block */}
      <div className="flex flex-col gap-3">
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
      <div style={{ backgroundColor: theme.border }} className="w-full h-px" />

      {/* Includes + dessert */}
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
