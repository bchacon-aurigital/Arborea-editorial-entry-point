"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import { TbArrowLeft, TbLeaf, TbCheck, TbBrandWhatsapp } from "react-icons/tb";

const WHATSAPP = "50685011042";

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
          ? "bg-[#213B2F] border-[#213B2F] text-[#D8DDB8]"
          : "bg-transparent border-[#222E2C]/20 text-[#222E2C]/70 hover:border-[#222E2C]/40"
      }`}
    >
      {checked && <TbCheck size={14} />}
      {label}
    </button>
  );
}

export default function FullFridgePage() {
  const { t } = useI18n();

  const produceCategories = t("fullFridge.produce.categories");
  const steps             = t("fullFridge.howItWorks.steps");
  const beverages         = t("fullFridge.beverages.items");
  const pricingColumns    = t("fullFridge.pricing.columns");
  const pricingRows       = t("fullFridge.pricing.rows");

  const q = t("fullFridge.questionnaire");

  const [form, setForm] = useState({
    adults: "",
    children: "",
    childrenAges: "",
    dietary: [],
    dietaryOther: "",
    cooking: "",
    groceries: "",
    beverageChoices: [],
    beveragesOther: "",
    fruits: "",
    breakfastItems: [],
    pantryItems: [],
    proteins: [],
    proteinsOther: "",
    snacksFor: [],
    preferredSnacks: "",
    budget: "",
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateList = (field, value) => setForm((prev) => ({ ...prev, [field]: toggleInArray(prev[field], value) }));

  const buildWhatsAppMessage = () => {
    const lines = [q.messageIntro, ""];

    const groupBits = [];
    if (form.adults) groupBits.push(`${form.adults} ${q.labels.adults}`);
    if (form.children) groupBits.push(`${form.children} ${q.labels.children}`);
    if (form.childrenAges) groupBits.push(`${q.labels.ages}: ${form.childrenAges}`);
    lines.push(`*${q.labels.group}:* ${groupBits.length ? groupBits.join(", ") : q.labels.none}`);

    const dietary = [...form.dietary, form.dietaryOther].filter(Boolean);
    lines.push(`*${q.labels.dietary}:* ${dietary.length ? dietary.join(", ") : q.labels.none}`);

    lines.push(`*${q.labels.cooking}:* ${form.cooking || q.labels.none}`);
    lines.push(`*${q.labels.groceries}:* ${form.groceries || q.labels.none}`);

    const bev = [...form.beverageChoices, form.beveragesOther].filter(Boolean);
    lines.push(`*${q.labels.beverages}:* ${bev.length ? bev.join(", ") : q.labels.none}`);

    lines.push(`*${q.labels.fruits}:* ${form.fruits || q.labels.none}`);
    lines.push(`*${q.labels.breakfastItems}:* ${form.breakfastItems.length ? form.breakfastItems.join(", ") : q.labels.none}`);
    lines.push(`*${q.labels.pantryItems}:* ${form.pantryItems.length ? form.pantryItems.join(", ") : q.labels.none}`);

    const proteins = [...form.proteins, form.proteinsOther].filter(Boolean);
    lines.push(`*${q.labels.proteins}:* ${proteins.length ? proteins.join(", ") : q.labels.none}`);

    lines.push(`*${q.labels.snacksFor}:* ${form.snacksFor.length ? form.snacksFor.join(", ") : q.labels.none}`);
    if (form.preferredSnacks) lines.push(`*${q.labels.preferredSnacks}:* ${form.preferredSnacks}`);
    lines.push(`*${q.labels.budget}:* ${form.budget || q.labels.none}`);

    return encodeURIComponent(lines.join("\n"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `https://wa.me/${WHATSAPP}?text=${buildWhatsAppMessage()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200 shrink-0 w-fit"
          >
            <TbBrandWhatsapp size={16} />
            {t("fullFridge.whatsapp")}
          </a>
        </div>

        <div className="px-8 md:px-16 flex flex-col gap-16 pb-24">

          {/* Concept */}
          <div className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col gap-4" data-aos="fade-up">
            <TbLeaf size={22} className="text-[#D8DDB8]/50" />
            <h2 className="font-sans font-semibold text-lg text-[#D8DDB8]">
              {t("fullFridge.concept.heading")}
            </h2>
            <p className="font-sans text-sm text-[#D8DDB8]/70 leading-relaxed whitespace-pre-line max-w-3xl">
              {t("fullFridge.concept.body")}
            </p>
          </div>

          {/* How it works */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.howItWorks.heading")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.isArray(steps) && steps.map((step, i) => (
                <div key={i} className="bg-[#E0D4C4] rounded-2xl px-6 py-7 flex flex-col gap-4">
                  <div className="size-9 rounded-full bg-[#213B2F] flex items-center justify-center shrink-0">
                    <span className="font-sans font-semibold text-sm text-[#D8DDB8]">{i + 1}</span>
                  </div>
                  <h3 className="font-sans font-semibold text-base text-[#222E2C]">{step.title}</h3>
                  <p className="font-sans text-sm text-[#222E2C]/60 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's in the fridge */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.produce.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-1">
                {t("fullFridge.produce.subheading")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.isArray(produceCategories) && produceCategories.map((cat, i) => (
                <div key={i} className="bg-[#E0D4C4] rounded-2xl px-6 py-6 flex flex-col gap-3">
                  <h3 className="font-sans font-semibold text-base text-[#222E2C]">{cat.title}</h3>
                  <div className="flex flex-col gap-2">
                    {cat.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <TbCheck size={14} className="text-[#222E2C]/40 shrink-0 mt-0.5" />
                        <span className="font-sans text-sm text-[#222E2C]/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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

            <form onSubmit={handleSubmit} className="bg-[#E0D4C4] rounded-2xl px-6 md:px-10 py-8 md:py-10 flex flex-col gap-9">

              {/* 1. Group */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.group.heading}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="font-sans text-xs text-[#222E2C]/50">{q.group.adults}</span>
                    <input
                      type="number"
                      min="0"
                      value={form.adults}
                      onChange={(e) => update("adults", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#222E2C]/15 font-sans text-sm text-[#222E2C] focus:outline-none focus:border-[#213B2F]/50 transition-colors duration-200"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="font-sans text-xs text-[#222E2C]/50">{q.group.children}</span>
                    <input
                      type="number"
                      min="0"
                      value={form.children}
                      onChange={(e) => update("children", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#222E2C]/15 font-sans text-sm text-[#222E2C] focus:outline-none focus:border-[#213B2F]/50 transition-colors duration-200"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="font-sans text-xs text-[#222E2C]/50">{q.group.childrenAges}</span>
                    <input
                      type="text"
                      value={form.childrenAges}
                      onChange={(e) => update("childrenAges", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#222E2C]/15 font-sans text-sm text-[#222E2C] focus:outline-none focus:border-[#213B2F]/50 transition-colors duration-200"
                    />
                  </label>
                </div>
              </div>

              {/* 2. Dietary */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.dietary.heading}</h3>
                <p className="font-sans text-xs text-[#222E2C]/50">{q.dietary.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.dietary.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.dietary.includes(opt)} onChange={() => updateList("dietary", opt)} />
                  ))}
                </div>
                <input
                  type="text"
                  placeholder={`${q.dietary.other}`}
                  value={form.dietaryOther}
                  onChange={(e) => update("dietaryOther", e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-white/60 border border-[#222E2C]/15 font-sans text-sm text-[#222E2C] placeholder:text-[#222E2C]/35 focus:outline-none focus:border-[#213B2F]/50 transition-colors duration-200"
                />
              </div>

              {/* 3. Cooking Plans */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.cooking.heading}</h3>
                <p className="font-sans text-xs text-[#222E2C]/50">{q.cooking.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.cooking.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.cooking === opt} onChange={() => update("cooking", form.cooking === opt ? "" : opt)} />
                  ))}
                </div>
              </div>

              {/* 4. Grocery Preferences */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.groceries.heading}</h3>
                <p className="font-sans text-xs text-[#222E2C]/50">{q.groceries.question}</p>
                <textarea
                  rows={3}
                  placeholder={q.groceries.placeholder}
                  value={form.groceries}
                  onChange={(e) => update("groceries", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#222E2C]/15 font-sans text-sm text-[#222E2C] placeholder:text-[#222E2C]/35 focus:outline-none focus:border-[#213B2F]/50 transition-colors duration-200 resize-none"
                />
              </div>

              {/* 5. Beverages */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.beverages.heading}</h3>
                <p className="font-sans text-xs text-[#222E2C]/50">{q.beverages.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.beverages.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.beverageChoices.includes(opt)} onChange={() => updateList("beverageChoices", opt)} />
                  ))}
                </div>
                <input
                  type="text"
                  placeholder={q.beverages.other}
                  value={form.beveragesOther}
                  onChange={(e) => update("beveragesOther", e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-white/60 border border-[#222E2C]/15 font-sans text-sm text-[#222E2C] placeholder:text-[#222E2C]/35 focus:outline-none focus:border-[#213B2F]/50 transition-colors duration-200"
                />
              </div>

              {/* 6. Fresh Tropical Fruits */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.fruits.heading}</h3>
                <p className="font-sans text-xs text-[#222E2C]/50">{q.fruits.question}</p>
                <p className="font-sans text-xs text-[#222E2C]/40 italic">{q.fruits.examples}</p>
                <div className="flex gap-2">
                  <CheckboxChip label={q.fruits.yes} checked={form.fruits === q.fruits.yes} onChange={() => update("fruits", q.fruits.yes)} />
                  <CheckboxChip label={q.fruits.no} checked={form.fruits === q.fruits.no} onChange={() => update("fruits", q.fruits.no)} />
                </div>
              </div>

              {/* 7. Breakfast Essentials */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.breakfastItems.heading}</h3>
                <p className="font-sans text-xs text-[#222E2C]/50">{q.breakfastItems.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.breakfastItems.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.breakfastItems.includes(opt)} onChange={() => updateList("breakfastItems", opt)} />
                  ))}
                </div>
              </div>

              {/* 8. Pantry Essentials */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.pantryItems.heading}</h3>
                <p className="font-sans text-xs text-[#222E2C]/50">{q.pantryItems.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.pantryItems.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.pantryItems.includes(opt)} onChange={() => updateList("pantryItems", opt)} />
                  ))}
                </div>
              </div>

              {/* 9. Proteins */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.proteins.heading}</h3>
                <p className="font-sans text-xs text-[#222E2C]/50">{q.proteins.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.proteins.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.proteins.includes(opt)} onChange={() => updateList("proteins", opt)} />
                  ))}
                </div>
                <input
                  type="text"
                  placeholder={q.proteins.other}
                  value={form.proteinsOther}
                  onChange={(e) => update("proteinsOther", e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-white/60 border border-[#222E2C]/15 font-sans text-sm text-[#222E2C] placeholder:text-[#222E2C]/35 focus:outline-none focus:border-[#213B2F]/50 transition-colors duration-200"
                />
              </div>

              {/* 10. Snacks */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.snacks.heading}</h3>
                <p className="font-sans text-xs text-[#222E2C]/50">{q.snacks.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.snacks.forOptions.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.snacksFor.includes(opt)} onChange={() => updateList("snacksFor", opt)} />
                  ))}
                </div>
                <label className="flex flex-col gap-1.5 sm:w-1/2">
                  <span className="font-sans text-xs text-[#222E2C]/50">{q.snacks.preferredLabel}</span>
                  <input
                    type="text"
                    placeholder={q.snacks.placeholder}
                    value={form.preferredSnacks}
                    onChange={(e) => update("preferredSnacks", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#222E2C]/15 font-sans text-sm text-[#222E2C] placeholder:text-[#222E2C]/35 focus:outline-none focus:border-[#213B2F]/50 transition-colors duration-200"
                  />
                </label>
              </div>

              {/* 11. Budget */}
              <div className="flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{q.budget.heading}</h3>
                <p className="font-sans text-xs text-[#222E2C]/50">{q.budget.question}</p>
                <input
                  type="text"
                  placeholder={q.budget.placeholder}
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-white/60 border border-[#222E2C]/15 font-sans text-sm text-[#222E2C] placeholder:text-[#222E2C]/35 focus:outline-none focus:border-[#213B2F]/50 transition-colors duration-200"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200 w-fit"
              >
                <TbBrandWhatsapp size={16} />
                {q.submit}
              </button>
            </form>
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
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr>
                    <th className="text-left pb-3 pr-4 font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-wider" />
                    {Array.isArray(pricingColumns) && pricingColumns.map((col, i) => (
                      <th key={i} className="text-left pb-3 px-3 font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-wider whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(pricingRows) && pricingRows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-[#E0D4C4]" : "bg-[#E0D4C4]/50"}>
                      <td className="rounded-l-xl py-3.5 pl-4 pr-4 font-sans font-semibold text-sm text-[#222E2C] whitespace-nowrap">
                        {row.label}
                      </td>
                      {row.prices.map((price, j) => (
                        <td key={j} className={`py-3.5 px-3 font-sans text-sm text-[#222E2C]/70${j === row.prices.length - 1 ? " rounded-r-xl" : ""}`}>
                          {price}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-sans text-xs text-[#222E2C]/40 italic">{t("fullFridge.pricing.note")}</p>
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
              {Array.isArray(beverages) && beverages.map((item, i) => (
                <div key={i} className="bg-[#E0D4C4] rounded-xl px-5 py-5 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-sans font-semibold text-sm text-[#222E2C]">{item.title}</p>
                    {item.description && (
                      <p className="font-sans text-xs text-[#222E2C]/55">{item.description}</p>
                    )}
                  </div>
                  <span className="font-sans font-semibold text-sm text-[#222E2C] whitespace-nowrap shrink-0">{item.price}</span>
                </div>
              ))}
            </div>
            <p className="font-sans text-xs text-[#222E2C]/50 italic">{t("fullFridge.beverages.note")}</p>
          </div>

          {/* About Seguras Farm Shop */}
          <div className="flex flex-col gap-5" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.farm.heading")}
              </h2>
            </div>
            <p className="font-sans text-base text-[#222E2C]/60 leading-relaxed whitespace-pre-line max-w-3xl">
              {t("fullFridge.farm.body")}
            </p>
          </div>

          {/* Bottom CTA */}
          <div
            className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            data-aos="fade-up"
          >
            <div className="flex flex-col gap-1.5">
              <h2 className="font-sans font-semibold text-xl text-[#D8DDB8]">
                {t("fullFridge.ctaHeading")}
              </h2>
              <p className="font-sans text-sm text-[#D8DDB8]/60">
                {t("fullFridge.ctaSubheading")}
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#D8DDB8] font-sans font-medium text-sm text-[#213B2F] hover:bg-[#D8DDB8]/90 transition-colors duration-200 shrink-0"
            >
              <TbBrandWhatsapp size={16} />
              {t("fullFridge.whatsapp")}
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
