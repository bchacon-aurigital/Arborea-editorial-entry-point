"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import OrderCheckoutForm from "@/components/sections/OrderCheckoutForm";
import { useOrderCart } from "@/hooks/useOrderCart";
import {
  TbArrowLeft, TbLeaf, TbCheck, TbBrandWhatsapp,
  TbUsers, TbSalad, TbToolsKitchen2, TbApple, TbShoppingCart, TbGlassFull, TbEgg, TbBasket, TbMeat, TbCookie, TbCoin,
} from "react-icons/tb";

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
            <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-[#213B2F] border-2 border-[#213B2F] flex items-center justify-center">
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

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span
        className="text-sm text-[#D8DDB8]/70 whitespace-nowrap"
        style={{ fontFamily: "var(--font-alpina)" }}
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-[#D8DDB8]/15" />
    </div>
  );
}

function Stepper({ label, value, onChange, min = 0 }) {
  const num = Number(value) || 0;
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-xs text-[#D8DDB8]/70">{label}</span>
      <div className="flex items-center justify-between gap-2 pl-2 pr-1.5 py-1.5 rounded-xl bg-white border border-[#222E2C]/12 shadow-sm">
        <button
          type="button"
          onClick={() => onChange(String(Math.max(min, num - 1)))}
          className="size-8 flex items-center justify-center rounded-lg text-[#222E2C]/60 hover:bg-[#222E2C]/6 transition-colors duration-150 font-sans text-base"
        >
          −
        </button>
        <span className="font-sans text-sm text-[#222E2C] font-medium w-6 text-center">{num}</span>
        <button
          type="button"
          onClick={() => onChange(String(num + 1))}
          className="size-8 flex items-center justify-center rounded-lg text-[#222E2C]/60 hover:bg-[#222E2C]/6 transition-colors duration-150 font-sans text-base"
        >
          +
        </button>
      </div>
    </label>
  );
}

export default function FullFridgePage() {
  const { t } = useI18n();
  const cart = useOrderCart();
  const [notes, setNotes] = useState("");

  const produceCategories = t("fullFridge.produce.categories");
  const steps              = t("fullFridge.howItWorks.steps");
  const beverages          = t("fullFridge.beverages.items");
  const pricingColumns     = t("fullFridge.pricing.columns");
  const pricingRows        = t("fullFridge.pricing.rows");

  const q = t("fullFridge.questionnaire");

  const [dayIdx, setDayIdx] = useState(null);
  const [groupIdx, setGroupIdx] = useState(null);

  const pickDay = (i) => {
    setDayIdx(i);
    if (groupIdx !== null && Array.isArray(pricingRows)) {
      cart.setItem("package", {
        label: `${pricingRows[i].label} · ${pricingColumns[groupIdx].label}`,
        price: pricingRows[i].priceValues[groupIdx],
      });
    }
  };

  const pickGroup = (j) => {
    setGroupIdx(j);
    if (dayIdx !== null && Array.isArray(pricingRows)) {
      cart.setItem("package", {
        label: `${pricingRows[dayIdx].label} · ${pricingColumns[j].label}`,
        price: pricingRows[dayIdx].priceValues[j],
      });
    }
  };

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

  const answered = {
    group: Boolean(form.adults || form.children || form.childrenAges),
    dietary: Boolean(form.dietary.length || form.dietaryOther),
    cooking: Boolean(form.cooking),
    groceries: Boolean(form.groceries),
    beverages: Boolean(form.beverageChoices.length || form.beveragesOther),
    fruits: Boolean(form.fruits),
    breakfastItems: Boolean(form.breakfastItems.length),
    pantryItems: Boolean(form.pantryItems.length),
    proteins: Boolean(form.proteins.length || form.proteinsOther),
    snacks: Boolean(form.snacksFor.length || form.preferredSnacks),
    budget: Boolean(form.budget),
  };
  const answeredCount = Object.values(answered).filter(Boolean).length;
  const totalQuestions = Object.keys(answered).length;

  const buildInfoLines = () => {
    const lines = [];

    const groupBits = [];
    if (form.adults) groupBits.push(`${form.adults} ${q.labels.adults}`);
    if (form.children) groupBits.push(`${form.children} ${q.labels.children}`);
    if (form.childrenAges) groupBits.push(`${q.labels.ages}: ${form.childrenAges}`);
    if (groupBits.length) lines.push({ label: `${q.labels.group}: ${groupBits.join(", ")}`, price: 0 });

    const dietary = [...form.dietary, form.dietaryOther].filter(Boolean);
    if (dietary.length) lines.push({ label: `${q.labels.dietary}: ${dietary.join(", ")}`, price: 0 });

    if (form.cooking) lines.push({ label: `${q.labels.cooking}: ${form.cooking}`, price: 0 });
    if (form.groceries) lines.push({ label: `${q.labels.groceries}: ${form.groceries}`, price: 0 });

    const bev = [...form.beverageChoices, form.beveragesOther].filter(Boolean);
    if (bev.length) lines.push({ label: `${q.labels.beverages}: ${bev.join(", ")}`, price: 0 });

    if (form.fruits) lines.push({ label: `${q.labels.fruits}: ${form.fruits}`, price: 0 });
    if (form.breakfastItems.length) lines.push({ label: `${q.labels.breakfastItems}: ${form.breakfastItems.join(", ")}`, price: 0 });
    if (form.pantryItems.length) lines.push({ label: `${q.labels.pantryItems}: ${form.pantryItems.join(", ")}`, price: 0 });

    const proteins = [...form.proteins, form.proteinsOther].filter(Boolean);
    if (proteins.length) lines.push({ label: `${q.labels.proteins}: ${proteins.join(", ")}`, price: 0 });

    if (form.snacksFor.length || form.preferredSnacks) {
      const bits = [...form.snacksFor];
      if (form.preferredSnacks) bits.push(form.preferredSnacks);
      lines.push({ label: `${q.labels.snacksFor}: ${bits.join(", ")}`, price: 0 });
    }
    if (form.budget) lines.push({ label: `${q.labels.budget}: ${form.budget}`, price: 0 });

    return lines;
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
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">
                  {t("fullFridge.pricing.daysLabel")}
                </span>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {Array.isArray(pricingRows) && pricingRows.map((row, i) => (
                    <RadioPill
                      key={i}
                      label={groupIdx !== null ? `${row.label} · $${row.priceValues[groupIdx]}` : row.label}
                      checked={dayIdx === i}
                      onChange={() => pickDay(i)}
                    />
                  ))}
                </div>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">
                  {t("fullFridge.pricing.groupLabel")}
                </span>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {Array.isArray(pricingColumns) && pricingColumns.map((col, j) => (
                    <RadioPill
                      key={j}
                      label={dayIdx !== null ? `${col.label} · $${pricingRows[dayIdx].priceValues[j]}` : col.label}
                      checked={groupIdx === j}
                      onChange={() => pickGroup(j)}
                    />
                  ))}
                </div>
              </label>
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
              {Array.isArray(beverages) && beverages.map((item, i) => {
                const id = `beverage-${i}`;
                const selected = cart.isSelected(id);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => cart.toggleItem(id, { label: item.title, price: item.priceValue })}
                    className={`text-left rounded-xl px-5 py-5 flex items-center justify-between gap-4 border-2 transition-colors duration-200 ${
                      selected ? "bg-[#213B2F] border-[#213B2F]" : "bg-[#E0D4C4] border-transparent"
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

            <div className="bg-[#213B2F] rounded-2xl px-6 md:px-10 py-8 md:py-10 flex flex-col gap-4">

              <div className="flex flex-col gap-2 pb-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-sans text-xs font-medium text-[#D8DDB8]/70">
                    {answeredCount} / {totalQuestions} {q.progressLabel}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#D8DDB8] transition-all duration-500 ease-out"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              <SectionLabel>{q.sections.basics}</SectionLabel>

              <QuestionCard icon={TbUsers} heading={q.group.heading} answered={answered.group}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Stepper label={q.group.adults} value={form.adults} onChange={(v) => update("adults", v)} min={0} />
                  <Stepper label={q.group.children} value={form.children} onChange={(v) => update("children", v)} min={0} />
                  <TextField
                    label={q.group.childrenAges}
                    type="text"
                    value={form.childrenAges}
                    onChange={(e) => update("childrenAges", e.target.value)}
                  />
                </div>
              </QuestionCard>

              <QuestionCard icon={TbSalad} heading={q.dietary.heading} question={q.dietary.question} answered={answered.dietary}>
                <div className="flex flex-wrap gap-2">
                  {q.dietary.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.dietary.includes(opt)} onChange={() => updateList("dietary", opt)} />
                  ))}
                </div>
                <TextField
                  type="text"
                  placeholder={`${q.dietary.other}`}
                  value={form.dietaryOther}
                  onChange={(e) => update("dietaryOther", e.target.value)}
                  wrapClassName="sm:w-1/2"
                />
              </QuestionCard>

              <SectionLabel>{q.sections.menu}</SectionLabel>

              <QuestionCard icon={TbToolsKitchen2} heading={q.cooking.heading} question={q.cooking.question} answered={answered.cooking}>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {q.cooking.options.map((opt) => (
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

              <QuestionCard icon={TbGlassFull} heading={q.beverages.heading} question={q.beverages.question} answered={answered.beverages}>
                <div className="flex flex-wrap gap-2">
                  {q.beverages.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.beverageChoices.includes(opt)} onChange={() => updateList("beverageChoices", opt)} />
                  ))}
                </div>
                <TextField
                  type="text"
                  placeholder={q.beverages.other}
                  value={form.beveragesOther}
                  onChange={(e) => update("beveragesOther", e.target.value)}
                  wrapClassName="sm:w-1/2"
                />
              </QuestionCard>

              <QuestionCard icon={TbApple} heading={q.fruits.heading} question={q.fruits.question} answered={answered.fruits}>
                <p className="font-sans text-xs text-[#D8DDB8]/45 italic">{q.fruits.examples}</p>
                <div className="flex gap-2" role="radiogroup">
                  <RadioPill dark label={q.fruits.yes} checked={form.fruits === q.fruits.yes} onChange={() => update("fruits", q.fruits.yes)} />
                  <RadioPill dark label={q.fruits.no} checked={form.fruits === q.fruits.no} onChange={() => update("fruits", q.fruits.no)} />
                </div>
              </QuestionCard>

              <QuestionCard icon={TbEgg} heading={q.breakfastItems.heading} question={q.breakfastItems.question} answered={answered.breakfastItems}>
                <div className="flex flex-wrap gap-2">
                  {q.breakfastItems.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.breakfastItems.includes(opt)} onChange={() => updateList("breakfastItems", opt)} />
                  ))}
                </div>
              </QuestionCard>

              <QuestionCard icon={TbBasket} heading={q.pantryItems.heading} question={q.pantryItems.question} answered={answered.pantryItems}>
                <div className="flex flex-wrap gap-2">
                  {q.pantryItems.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.pantryItems.includes(opt)} onChange={() => updateList("pantryItems", opt)} />
                  ))}
                </div>
              </QuestionCard>

              <QuestionCard icon={TbMeat} heading={q.proteins.heading} question={q.proteins.question} answered={answered.proteins}>
                <div className="flex flex-wrap gap-2">
                  {q.proteins.options.map((opt) => (
                    <CheckboxChip key={opt} label={opt} checked={form.proteins.includes(opt)} onChange={() => updateList("proteins", opt)} />
                  ))}
                </div>
                <TextField
                  type="text"
                  placeholder={q.proteins.other}
                  value={form.proteinsOther}
                  onChange={(e) => update("proteinsOther", e.target.value)}
                  wrapClassName="sm:w-1/2"
                />
              </QuestionCard>

              <SectionLabel>{q.sections.extras}</SectionLabel>

              <QuestionCard icon={TbCookie} heading={q.snacks.heading} question={q.snacks.question} answered={answered.snacks}>
                <div className="flex flex-wrap gap-2">
                  {q.snacks.forOptions.map((opt) => (
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

              <QuestionCard icon={TbCoin} heading={q.budget.heading} question={q.budget.question} answered={answered.budget}>
                <TextField
                  type="text"
                  placeholder={q.budget.placeholder}
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                  wrapClassName="sm:w-1/2"
                />
              </QuestionCard>

            </div>
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

          <OrderCheckoutForm
            service="Full Fridge"
            lines={cart.lines}
            infoLines={buildInfoLines()}
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
