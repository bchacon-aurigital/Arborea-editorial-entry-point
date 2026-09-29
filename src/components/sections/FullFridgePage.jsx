"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import { useOrderCart } from "@/hooks/useOrderCart";
import {
  TbArrowLeft, TbLeaf, TbCheck,
  TbSalad, TbToolsKitchen2, TbShoppingCart, TbCookie,
} from "react-icons/tb";

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function CheckboxChip({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-sans text-sm transition-colors duration-200 ${
        checked
          ? "bg-[#D8DDB8] border-[#D8DDB8] text-[#213B2F]"
          : "bg-transparent border-[#D8DDB8]/25 text-[#D8DDB8]/80 hover:border-[#D8DDB8]/50"
      }`}
    >
      {checked && <TbCheck size={14} />}
      {label}
    </button>
  );
}

function RadioPill({ label, checked, onChange, dark = false }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onChange}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-sans text-sm transition-colors duration-200 ${
        dark
          ? checked
            ? "bg-[#D8DDB8] border-[#D8DDB8] text-[#213B2F]"
            : "bg-transparent border-[#D8DDB8]/25 text-[#D8DDB8]/80 hover:border-[#D8DDB8]/50"
          : checked
            ? "bg-[#213B2F] border-[#213B2F] text-[#D8DDB8]"
            : "bg-transparent border-[#222E2C]/20 text-[#222E2C]/70 hover:border-[#222E2C]/40"
      }`}
    >
      <span className={`flex items-center justify-center size-3.5 rounded-full border shrink-0 ${
        dark
          ? checked ? "border-[#213B2F]" : "border-[#D8DDB8]/40"
          : checked ? "border-[#D8DDB8]" : "border-[#222E2C]/35"
      }`}>
        {checked && <span className={`size-1.5 rounded-full ${dark ? "bg-[#213B2F]" : "bg-[#D8DDB8]"}`} />}
      </span>
      {label}
    </button>
  );
}

const fieldClass = "w-full px-4 py-3 rounded-xl bg-white border border-[#222E2C]/12 shadow-sm font-sans text-sm text-[#222E2C] placeholder:text-[#222E2C]/35 focus:outline-none focus:ring-2 focus:ring-[#D8DDB8]/40 transition-all duration-200";

function TextField({ label, wrapClassName = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 ${wrapClassName}`}>
      {label && <span className="font-sans text-xs text-[#D8DDB8]/70">{label}</span>}
      <input {...props} className={fieldClass} />
    </label>
  );
}

function TextAreaField({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="font-sans text-xs text-[#D8DDB8]/70">{label}</span>}
      <textarea {...props} className={`${fieldClass} resize-none`} />
    </label>
  );
}

function QuestionCard({ icon: Icon, heading, question, answered = false, children }) {
  return (
    <div className={`rounded-xl p-5 flex flex-col gap-3 border transition-colors duration-300 ${
      answered ? "bg-[#D8DDB8]/10 border-[#D8DDB8]/25" : "bg-white/5 border-white/0"
    }`}>
      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0">
          <div className={`size-8 rounded-full flex items-center justify-center transition-colors duration-300 ${answered ? "bg-[#D8DDB8]" : "bg-[#D8DDB8]/15"}`}>
            <Icon size={15} className={answered ? "text-[#213B2F]" : "text-[#D8DDB8]"} />
          </div>
          {answered && (
            <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-[#5C3324] border-2 border-[#5C3324] flex items-center justify-center">
              <TbCheck size={9} className="text-[#D8DDB8]" strokeWidth={3} />
            </div>
          )}
        </div>
        <h3 className="font-sans font-semibold text-sm text-[#D8DDB8]">{heading}</h3>
      </div>
      {question && <p className="font-sans text-xs text-[#D8DDB8]/60">{question}</p>}
      {children}
    </div>
  );
}

const CATEGORY_IMAGES = [
  "/assets/Fridge/dairy.avif",
  "/assets/Fridge/eggs.avif",
  "/assets/Fridge/pork.avif",
  "/assets/Fridge/beef.avif",
  "/assets/Fridge/vegetables.avif",
  "/assets/Fridge/fruits.avif",
  "/assets/Fridge/herbs.avif",
  "/assets/Fridge/grains.avif",
  "/assets/Fridge/beverages.avif",
];

export default function FullFridgePage() {
  const { t } = useI18n();
  const cart = useOrderCart();
  const [notes, setNotes] = useState("");

  const produceCategories = t("fullFridge.produce.categories");
  const steps              = t("fullFridge.howItWorks.steps");

  const [selectedProduce, setSelectedProduce] = useState([]);
  const allProduceKeys = Array.isArray(produceCategories)
    ? produceCategories.flatMap(cat => cat.items.map(item => `${cat.title}::${item}`))
    : [];
  const isAllSelected = allProduceKeys.length > 0 && allProduceKeys.every(k => selectedProduce.includes(k));
  const toggleProduce = (key) => setSelectedProduce(prev => toggleInArray(prev, key));
  const handleSelectAll = () => setSelectedProduce(isAllSelected ? [] : allProduceKeys);
  const beverages          = t("fullFridge.beverages.items");
  const pricingColumns     = t("fullFridge.pricing.columns");
  const pricingRows        = t("fullFridge.pricing.rows");

  const q = t("fullFridge.questionnaire");

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [days, setDays] = useState(3);

  const totalGuests = adults + children;
  const nearestRow = Array.isArray(pricingRows)
    ? pricingRows.reduce((best, _, i) => Math.abs(pricingRows[i].days - days) < Math.abs(pricingRows[best].days - days) ? i : best, 0)
    : null;
  const nearestCol = Array.isArray(pricingColumns)
    ? pricingColumns.reduce((best, _, i) => Math.abs(pricingColumns[i].guests - totalGuests) < Math.abs(pricingColumns[best].guests - totalGuests) ? i : best, 0)
    : null;

  const updatePackageCart = (total, d) => {
    if (!Array.isArray(pricingRows) || !Array.isArray(pricingColumns)) return;
    const rIdx = pricingRows.reduce((best, _, i) => Math.abs(pricingRows[i].days - d) < Math.abs(pricingRows[best].days - d) ? i : best, 0);
    const cIdx = pricingColumns.reduce((best, _, i) => Math.abs(pricingColumns[i].guests - total) < Math.abs(pricingColumns[best].guests - total) ? i : best, 0);
    cart.setItem("package", {
      label: `${pricingRows[rIdx].label} · ${pricingColumns[cIdx].label}`,
      price: pricingRows[rIdx].priceValues[cIdx],
    });
  };

  const [form, setForm] = useState({
    dietary: [],
    dietaryOther: "",
    dietaryPreferences: "",
    cooking: "",
    groceries: "",
    snacksFor: [],
    preferredSnacks: "",
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateList = (field, value) => setForm((prev) => ({ ...prev, [field]: toggleInArray(prev[field], value) }));

  const answered = {
    dietary: Boolean(form.dietary.length || form.dietaryOther || form.dietaryPreferences),
    cooking: Boolean(form.cooking),
    groceries: Boolean(form.groceries),
    snacks: Boolean(form.snacksFor.length || form.preferredSnacks),
  };
  const answeredCount = Object.values(answered).filter(Boolean).length;
  const totalQuestions = Object.keys(answered).length;

  return (
    <>
      <Navbar />
      <main className="pt-24">

        {/* Header */}
        <div className="px-8 md:px-16 pt-8 pb-6" data-aos="fade-up">
          <Link
            href="/"
            className="flex items-center gap-1.5 w-fit mb-3 text-sm font-sans font-medium text-[#222E2C]/50 hover:text-[#222E2C] transition-colors duration-200"
          >
            <TbArrowLeft size={16} />
            {t("common.back")}
          </Link>
          <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-4 py-2 mb-3">
            <TbLeaf size={15} className="text-[#222E2C]" />
            <span className="font-sans text-sm text-[#222E2C]">{t("fullFridge.pill")}</span>
          </div>
          <h1
            className="text-4xl md:text-5xl text-[#213B2F] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-alpina)" }}
          >
            {t("fullFridge.title")}
          </h1>
          <p className="font-sans text-sm text-[#222E2C]/50 mt-1">{t("fullFridge.subtitle")}</p>
        </div>

        <div className="px-8 md:px-16 flex flex-col gap-16 pb-24">

          {/* Concept */}
          <div className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:h-[440px]" style={{ backgroundColor: "#5C3324" }} data-aos="fade-up">
            <div className="flex flex-col justify-center gap-5 px-8 md:px-12 py-12 lg:py-0 order-2 lg:order-1">
              <TbLeaf size={22} className="text-[#D8DDB8]/50" />
              <h2 className="text-3xl md:text-4xl text-[#EDE5D8] tracking-tight leading-tight" style={{ fontFamily: "var(--font-alpina)" }}>
                {t("fullFridge.concept.heading")}
              </h2>
              <div className="w-12 h-px bg-[#D8DDB8]/40" />
              <p className="font-sans text-sm text-[#D8DDB8]/65 leading-relaxed whitespace-pre-line max-w-md">
                {t("fullFridge.concept.body")}
              </p>
            </div>
            <div className="h-56 lg:h-full order-1 lg:order-2 overflow-hidden">
              <img src="/assets/InHouseServices/fullfridge.avif" alt={t("fullFridge.concept.heading")} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* How it works */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.howItWorks.heading")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Array.isArray(steps) && steps.map((step, i) => (
                <div key={i} className="bg-[#E0D4C4] rounded-2xl px-6 py-7 flex flex-col gap-4">
                  <div className="size-9 rounded-full bg-[#5C3324] flex items-center justify-center shrink-0">
                    <span className="font-sans font-semibold text-sm text-[#D8DDB8]">{i + 1}</span>
                  </div>
                  <h3 className="font-sans font-semibold text-base text-[#222E2C]">{step.title}</h3>
                  <p className="font-sans text-sm text-[#222E2C]/60 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Package Pricing */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {t("fullFridge.pricing.subheading")}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.pricing.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">
                {t("fullFridge.pricing.description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-10">
              <div className="flex flex-col gap-2">
                <span className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">Adults</span>
                <div className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => { const v = Math.max(1, adults - 1); setAdults(v); updatePackageCart(v + children, days); }}
                    className="size-10 rounded-xl border border-[#222E2C]/15 bg-white font-sans text-lg text-[#222E2C]/60 hover:bg-[#222E2C]/5 transition-colors flex items-center justify-center select-none"
                  >−</button>
                  <span className="font-sans text-2xl font-semibold text-[#5C3324] w-10 text-center">{adults}</span>
                  <button type="button"
                    disabled={totalGuests >= 10}
                    onClick={() => { const v = adults + 1; setAdults(v); updatePackageCart(v + children, days); }}
                    className="size-10 rounded-xl border border-[#222E2C]/15 bg-white font-sans text-lg text-[#222E2C]/60 hover:bg-[#222E2C]/5 transition-colors flex items-center justify-center select-none disabled:opacity-30 disabled:cursor-not-allowed"
                  >+</button>
                  <span className="font-sans text-sm text-[#222E2C]/45">adults</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">Children <span className="normal-case tracking-normal font-normal">(under 12)</span></span>
                <div className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => { const v = Math.max(0, children - 1); setChildren(v); updatePackageCart(adults + v, days); }}
                    className="size-10 rounded-xl border border-[#222E2C]/15 bg-white font-sans text-lg text-[#222E2C]/60 hover:bg-[#222E2C]/5 transition-colors flex items-center justify-center select-none"
                  >−</button>
                  <span className="font-sans text-2xl font-semibold text-[#5C3324] w-10 text-center">{children}</span>
                  <button type="button"
                    disabled={totalGuests >= 10}
                    onClick={() => { const v = children + 1; setChildren(v); updatePackageCart(adults + v, days); }}
                    className="size-10 rounded-xl border border-[#222E2C]/15 bg-white font-sans text-lg text-[#222E2C]/60 hover:bg-[#222E2C]/5 transition-colors flex items-center justify-center select-none disabled:opacity-30 disabled:cursor-not-allowed"
                  >+</button>
                  <span className="font-sans text-sm text-[#222E2C]/45">children</span>
                </div>
              </div>
              <div className="self-end pb-1 flex flex-col gap-0.5">
                <span className="font-sans text-xs text-[#222E2C]/35">{totalGuests} / 10 guests total</span>
                {totalGuests >= 10 && (
                  <span className="font-sans text-xs text-[#5C3324]/70">Max reached — contact us for larger groups</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">
                  {t("fullFridge.pricing.daysLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => { const v = Math.max(1, days - 1); setDays(v); updatePackageCart(totalGuests, v); }}
                    className="size-10 rounded-xl border border-[#222E2C]/15 bg-white font-sans text-lg text-[#222E2C]/60 hover:bg-[#222E2C]/5 transition-colors flex items-center justify-center select-none"
                  >−</button>
                  <span className="font-sans text-2xl font-semibold text-[#5C3324] w-10 text-center">{days}</span>
                  <button type="button"
                    onClick={() => { const v = days + 1; setDays(v); updatePackageCart(totalGuests, v); }}
                    className="size-10 rounded-xl border border-[#222E2C]/15 bg-white font-sans text-lg text-[#222E2C]/60 hover:bg-[#222E2C]/5 transition-colors flex items-center justify-center select-none"
                  >+</button>
                  <span className="font-sans text-sm text-[#222E2C]/45">days</span>
                </div>
              </div>
            </div>
            {nearestRow !== null && nearestCol !== null && (
              <div className="bg-[#E0D4C4] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-sans font-medium text-sm text-[#222E2C]">
                    {pricingColumns[nearestCol].label} · {pricingRows[nearestRow].label}
                  </p>
                  <p className="font-sans text-xs text-[#222E2C]/45 mt-0.5">{t("fullFridge.pricing.note")}</p>
                </div>
                <span className="font-sans font-bold text-xl text-[#222E2C] shrink-0">
                  ${pricingRows[nearestRow].priceValues[nearestCol].toLocaleString("en-US")}
                </span>
              </div>
            )}
          </div>

          {/* Build your fridge */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                  {t("fullFridge.produce.heading")}
                </h2>
                <p className="font-sans text-sm text-[#222E2C]/50 mt-1 max-w-2xl">
                  {t("fullFridge.produce.subheading")}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="shrink-0 font-sans text-sm font-medium text-[#5C3324] border border-[#5C3324]/30 rounded-full px-4 py-2 hover:bg-[#5C3324]/6 transition-colors duration-200"
              >
                {isAllSelected ? "Deselect all" : "Select all"}
              </button>
            </div>

            {/* Welcome pack */}
            {(() => {
              const wp = t("fullFridge.produce.welcomePack");
              if (!wp) return null;
              return (
                <div className="rounded-xl border border-[#222E2C]/10 px-5 py-4 flex flex-col gap-3 bg-white/50">
                  <div className="flex items-center gap-2">
                    <TbLeaf size={13} className="text-[#5C3324]/60 shrink-0" />
                    <p className="font-sans text-xs font-semibold text-[#5C3324]/70 uppercase tracking-widest">{wp.label}</p>
                  </div>
                  <p className="font-sans text-xs text-[#222E2C]/50">{wp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {wp.items.map((item, i) => (
                      <span key={i} className="flex items-center gap-1.5 font-sans text-xs text-[#222E2C]/65 bg-[#E0D4C4] rounded-full px-3 py-1.5">
                        <TbCheck size={11} className="text-[#5C3324]/60 shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Category grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.isArray(produceCategories) && produceCategories.map((cat, i) => {
                const selectedCount = cat.items.filter(item => selectedProduce.includes(`${cat.title}::${item}`)).length;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl overflow-hidden flex flex-col transition-all duration-200 ${
                      selectedCount > 0 ? "shadow-md ring-1 ring-[#5C3324]/20" : ""
                    }`}
                    style={{ backgroundColor: "#E0D4C4" }}
                  >
                    {/* Panoramic image header */}
                    <div className="relative h-28 shrink-0 bg-[#C4B4A0]">
                      <img
                        src={CATEGORY_IMAGES[i]}
                        alt={cat.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between gap-2">
                        <h3 className="font-sans font-semibold text-sm text-white leading-tight">{cat.title}</h3>
                        {selectedCount > 0 && (
                          <span className="font-sans text-xs font-semibold text-white bg-[#5C3324] rounded-full px-2.5 py-0.5 shrink-0">
                            {selectedCount} ✓
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="px-2 py-2 flex flex-col gap-0.5">
                      {cat.items.map((item, j) => {
                        const key = `${cat.title}::${item}`;
                        const checked = selectedProduce.includes(key);
                        return (
                          <button
                            key={j}
                            type="button"
                            onClick={() => toggleProduce(key)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-colors duration-150 group ${
                              checked ? "bg-[#5C3324]/10" : "hover:bg-[#222E2C]/6"
                            }`}
                          >
                            <span className={`shrink-0 size-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              checked
                                ? "border-[#5C3324] bg-[#5C3324]"
                                : "border-[#222E2C]/25 bg-white/60 group-hover:border-[#5C3324]/50"
                            }`}>
                              {checked && <span className="size-1.5 rounded-full bg-white" />}
                            </span>
                            <span className={`font-sans text-sm leading-snug transition-colors duration-150 ${
                              checked ? "text-[#5C3324] font-medium" : "text-[#222E2C]/65 group-hover:text-[#222E2C]"
                            }`}>{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Beverages */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.beverages.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-1">
                {t("fullFridge.beverages.subheading")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.isArray(beverages) && beverages.map((item, i) => {
                const id = `beverage-${i}`;
                const selected = cart.isSelected(id);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => cart.toggleItem(id, { label: item.title, price: item.priceValue })}
                    className={`text-left rounded-xl px-5 py-5 flex items-center justify-between gap-4 border-2 transition-colors duration-200 ${
                      selected ? "bg-[#5C3324] border-[#5C3324]" : "bg-[#E0D4C4] border-transparent"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className={`font-sans font-semibold text-sm ${selected ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{item.title}</p>
                      {item.description && (
                        <p className={`font-sans text-xs ${selected ? "text-[#D8DDB8]/70" : "text-[#222E2C]/55"}`}>{item.description}</p>
                      )}
                    </div>
                    <span className={`flex items-center gap-1.5 font-sans font-semibold text-sm whitespace-nowrap shrink-0 ${selected ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>
                      {selected && <TbCheck size={14} />}
                      {item.price}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="font-sans text-xs text-[#222E2C]/50 italic">{t("fullFridge.beverages.note")}</p>
          </div>

          {/* Guest Questionnaire */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-4 py-1.5 mb-3">
                <TbLeaf size={13} className="text-[#222E2C]" />
                <span className="font-sans text-xs text-[#222E2C]">{q.pill}</span>
              </div>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {q.heading}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-1 max-w-2xl">
                {q.subheading}
              </p>
            </div>

            <div className="rounded-2xl px-6 md:px-10 py-8 md:py-10 flex flex-col gap-4" style={{ backgroundColor: "#5C3324" }}>

              <div className="flex flex-col gap-2 pb-2">
                <span className="font-sans text-xs font-medium text-[#D8DDB8]/70">
                  {answeredCount} / {totalQuestions} {q.progressLabel}
                </span>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#D8DDB8] transition-all duration-500 ease-out"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              <QuestionCard icon={TbSalad} heading={q.dietary.heading} question={q.dietary.question} answered={answered.dietary}>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(q.dietary.options) && q.dietary.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.dietary.includes(opt)} onChange={() => updateList("dietary", opt)} />
                  ))}
                </div>
                <TextAreaField
                  label={q.dietary.allergiesLabel}
                  rows={2}
                  placeholder={q.dietary.allergiesPlaceholder}
                  value={form.dietaryOther}
                  onChange={(e) => update("dietaryOther", e.target.value)}
                />
              </QuestionCard>

              <QuestionCard icon={TbToolsKitchen2} heading={q.cooking.heading} question={q.cooking.question} answered={answered.cooking}>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {Array.isArray(q.cooking.options) && q.cooking.options.map((opt) => (
                    <RadioPill key={opt} dark label={opt} checked={form.cooking === opt} onChange={() => update("cooking", form.cooking === opt ? "" : opt)} />
                  ))}
                </div>
              </QuestionCard>

              <QuestionCard icon={TbShoppingCart} heading={q.groceries.heading} question={q.groceries.question} answered={answered.groceries}>
                <TextAreaField
                  rows={3}
                  placeholder={q.groceries.placeholder}
                  value={form.groceries}
                  onChange={(e) => update("groceries", e.target.value)}
                />
              </QuestionCard>

              <QuestionCard icon={TbCookie} heading={q.snacks.heading} question={q.snacks.question} answered={answered.snacks}>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(q.snacks.forOptions) && q.snacks.forOptions.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.snacksFor.includes(opt)} onChange={() => updateList("snacksFor", opt)} />
                  ))}
                </div>
                <TextField
                  label={q.snacks.preferredLabel}
                  type="text"
                  placeholder={q.snacks.placeholder}
                  value={form.preferredSnacks}
                  onChange={(e) => update("preferredSnacks", e.target.value)}
                  wrapClassName="sm:w-1/2"
                />
              </QuestionCard>

              {/* Notes */}
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="font-sans text-xs text-[#D8DDB8]/70">Additional notes</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything else we should know about your stay..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-[#D8DDB8] placeholder:text-[#D8DDB8]/30 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#D8DDB8]/20 resize-none"
                />
              </div>

              {/* Order summary */}
              <div className="rounded-xl bg-white/8 border border-white/10 px-5 py-4 flex flex-col gap-2 mt-2">
                <p className="font-sans text-xs font-semibold text-[#D8DDB8]/60 uppercase tracking-widest mb-1">Order summary</p>
                {cart.lines.length === 0 ? (
                  <p className="font-sans text-sm italic text-[#D8DDB8]/40">Select your package and any add-ons above to see your total here.</p>
                ) : (
                  <>
                    {cart.lines.map((line, i) => (
                      <div key={i} className="flex items-center justify-between gap-4">
                        <span className="font-sans text-sm text-[#D8DDB8]/80">{line.label}</span>
                        <span className="font-sans text-sm font-medium text-[#D8DDB8] shrink-0">${line.price.toLocaleString("en-US")}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/15 mt-1 pt-2 flex items-center justify-between">
                      <span className="font-sans text-sm font-semibold text-[#D8DDB8]">Total</span>
                      <span className="font-sans text-base font-bold text-[#D8DDB8]">${cart.total.toLocaleString("en-US")}</span>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                className="mt-2 self-start flex items-center gap-2.5 bg-[#D8DDB8] text-[#5C3324] font-sans font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-[#EDE5D8] transition-colors duration-200"
              >
                <TbShoppingCart size={16} />
                Add to cart
              </button>

            </div>
          </div>

          {/* Quote */}
          <div className="flex flex-col items-center text-center gap-5 py-8" data-aos="fade-up">
            <div className="w-10 h-px bg-[#222E2C]/25" />
            <blockquote className="text-2xl md:text-3xl text-[#213B2F]/80 leading-relaxed max-w-2xl italic" style={{ fontFamily: "var(--font-alpina)" }}>
              "Eating is an agricultural act."
            </blockquote>
            <p className="font-sans text-sm text-[#222E2C]/45">— Wendell Berry</p>
            <div className="w-10 h-px bg-[#222E2C]/25" />
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
