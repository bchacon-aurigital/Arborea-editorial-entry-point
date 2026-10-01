"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import { useDraft, useSeedDraftFromCart } from "@/hooks/useDraft";
import { useCart } from "@/app/context/CartContext";
import { skuOf, lineIdOf } from "@/lib/sku";
import { money } from "@/lib/format";
import QtyStepper from "@/components/ui/QtyStepper";
import DateField from "@/components/ui/DateField";
import {
  TbArrowLeft, TbCircleCheck, TbBrandWhatsapp, TbPhoto,
  TbSparkles, TbDroplet, TbFlame, TbLeaf, TbWind, TbSun,
  TbHandClick, TbAdjustments, TbCirclePlus, TbSend,
  TbCheck, TbNotes, TbAlertTriangle, TbShoppingBag,
} from "react-icons/tb";

const WHATSAPP = "50685011042";
const SPA_COLOR = "#8B5A3C";

/* ── sub-components ───────────────────────────────────────── */

function MassageCard({ name, description, image, groupId, durations, draft }) {
  const selected = draft.get(groupId);
  const qty = selected?.qty ?? 1;
  const date = selected?.date ?? "";

  /* Picking the already-selected duration clears the card. */
  const pick = (d) => {
    if (selected && selected.duration === d.label) {
      draft.remove(groupId);
    } else {
      draft.replace(groupId, { qty, date, duration: d.label, unitPrice: d.priceValue });
    }
  };

  const changeQty = (newQty) => {
    if (!selected || newQty < 1) return;
    draft.set(groupId, { qty: newQty });
  };

  const changeDate = (newDate) => {
    if (!selected) return;
    draft.set(groupId, { date: newDate });
  };

  return (
    <div
      style={selected ? { backgroundColor: SPA_COLOR } : undefined}
      className={`rounded-2xl overflow-hidden flex flex-col h-full border transition-all duration-200 ${selected ? "border-[#C9974F]/40 ring-1 ring-[#C9974F]/20" : "bg-white border-[#213B2F]/10"}`}
    >
      <div className="h-44 bg-[#D8CEBC] flex items-center justify-center shrink-0 overflow-hidden">
        {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : <TbPhoto size={28} className="text-[#222E2C]/20" />}
      </div>

      <div className="px-5 pt-5 pb-5 flex flex-col gap-3 flex-1">
        <h3 className={`font-sans font-semibold text-base tracking-tight ${selected ? "text-[#EDE5D8]" : "text-[#222E2C]"}`}>{name}</h3>
        {description && <p className={`font-sans text-xs leading-relaxed ${selected ? "text-[#EDE5D8]/65" : "text-[#222E2C]/60"}`}>{description}</p>}

        <div className="flex gap-2 mt-auto pt-3" role="radiogroup">
          {durations.map((d, i) => {
            const active = selected?.duration === d.label;
            return (
              <button key={i} type="button" role="radio" aria-checked={active} onClick={() => pick(d)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl border font-sans transition-colors duration-200 ${
                  active
                    ? "bg-white/20 border-white/30 text-white"
                    : selected
                      ? "border-white/20 text-[#EDE5D8]/65 hover:border-white/35"
                      : "border-[#C9974F]/30 text-[#222E2C]/65 hover:border-[#C9974F]/55"
                }`}
              >
                <span className="font-semibold text-sm">${d.priceValue}</span>
                <span className={`text-[10px] uppercase tracking-wide ${active ? "opacity-90" : "opacity-60"}`}>{d.label}</span>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-[#EDE5D8]/55">Quantity</span>
              <QtyStepper value={qty} onChange={changeQty} min={1} size="sm" tone="dark" label="Quantity" />
            </div>
            <DateField value={date} onChange={changeDate} optional tone="dark" />
          </div>
        )}
      </div>
    </div>
  );
}

const ADDON_ICONS = [TbSparkles, TbDroplet, TbFlame, TbLeaf, TbWind, TbSun];

function AddonCard({ name, id, Icon, draft, addonPrice, disabled = false }) {
  const entry = draft.get(id);
  const qty = entry?.qty ?? 0;
  const active = qty > 0;

  const changeQty = (newQty) => {
    if (disabled) return;
    if (newQty <= 0) { draft.remove(id); return; }
    draft.replace(id, { qty: newQty, unitPrice: addonPrice, date: "" });
  };

  return (
    <div
      style={active ? { backgroundColor: SPA_COLOR } : undefined}
      className={`flex items-center gap-3 px-4 py-4 rounded-xl border transition-all duration-200 ${
        disabled
          ? "border-[#213B2F]/6 bg-white/50 opacity-45 cursor-not-allowed select-none"
          : active
            ? "border-[#C9974F]/40 ring-1 ring-[#C9974F]/20"
            : "border-[#213B2F]/10 bg-white"
      }`}
    >
      <span className={`flex items-center justify-center size-9 rounded-xl shrink-0 transition-colors duration-200 ${active ? "bg-white/15" : "bg-[#213B2F]/6"}`}>
        <Icon size={16} className={active ? "text-[#EDE5D8]" : "text-[#213B2F]/50"} />
      </span>
      <span className="flex flex-col gap-0 min-w-0 flex-1">
        <span className={`font-sans font-medium text-sm ${active ? "text-[#EDE5D8]" : "text-[#222E2C]"}`}>{name}</span>
        <span className={`font-sans text-xs ${active ? "text-[#EDE5D8]/55" : "text-[#222E2C]/50"}`}>20 min · $40</span>
      </span>
      <div className="shrink-0">
        <QtyStepper value={qty} onChange={changeQty} min={0} size="sm"
          tone={active ? "dark" : "light"} disabled={disabled} label={name} />
      </div>
    </div>
  );
}

function FacialItemCard({ item, id, draft }) {
  const entry = draft.get(id);
  const qty = entry?.qty ?? 0;
  const date = entry?.date ?? "";
  const selected = qty > 0;

  const changeQty = (newQty) => {
    if (newQty <= 0) { draft.remove(id); return; }
    draft.set(id, { qty: newQty, unitPrice: item.priceValue });
  };

  const changeDate = (newDate) => {
    if (!entry) return;
    draft.set(id, { date: newDate });
  };

  return (
    <div
      style={selected ? { backgroundColor: SPA_COLOR } : undefined}
      className={`rounded-2xl overflow-hidden flex flex-col h-full border transition-all duration-200 ${selected ? "border-[#C9974F]/40 ring-1 ring-[#C9974F]/20" : "bg-white border-[#213B2F]/10"}`}
    >
      <div className="h-52 bg-[#D8CEBC] flex items-center justify-center shrink-0 overflow-hidden">
        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <TbPhoto size={28} className="text-[#222E2C]/20" />}
      </div>
      <div className="px-6 pt-6 pb-6 flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-2">
          <h3 className={`font-sans font-semibold text-xl tracking-tight ${selected ? "text-[#EDE5D8]" : "text-[#222E2C]"}`}>{item.name}</h3>
          <p className={`font-sans text-sm leading-relaxed ${selected ? "text-[#EDE5D8]/65" : "text-[#222E2C]/65"}`}>{item.description}</p>
        </div>
        {Array.isArray(item.features) && (
          <div className="flex flex-col gap-1.5">
            {item.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <TbCircleCheck size={13} className={`shrink-0 ${selected ? "text-[#EDE5D8]/70" : "text-[#C9974F]/70"}`} />
                <span className={`font-sans text-sm ${selected ? "text-[#EDE5D8]/80" : "text-[#222E2C]/65"}`}>{f}</span>
              </div>
            ))}
          </div>
        )}
        <div className={`mt-auto pt-4 border-t flex flex-col gap-3 ${selected ? "border-white/10" : "border-[#C9974F]/15"}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className={`font-sans font-bold text-2xl ${selected ? "text-[#EDE5D8]" : "text-[#C9974F]"}`}>${item.priceValue}</span>
              <p className={`font-sans text-xs uppercase tracking-wide ${selected ? "text-[#EDE5D8]/50" : "text-[#222E2C]/45"}`}>{item.duration}</p>
            </div>
            <QtyStepper value={qty} onChange={changeQty} min={0} size="sm" tone={selected ? "dark" : "light"} label="Quantity" />
          </div>
          {selected && <DateField value={date} onChange={changeDate} optional tone="dark" />}
        </div>
      </div>
    </div>
  );
}

function PackageCard({ pkg, qty, onQtyChange, entry, onDateChange }) {
  const selected = qty > 0;
  const date = entry?.date ?? "";

  return (
    <div
      style={selected ? { backgroundColor: SPA_COLOR } : undefined}
      className={`rounded-2xl px-6 py-6 flex flex-col gap-5 h-full transition-all duration-200 border ${
        selected
          ? "border-[#C9974F]/40 ring-1 ring-[#C9974F]/20"
          : "bg-white border-[#213B2F]/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`font-sans text-xs mb-0.5 ${selected ? "text-[#EDE5D8]/55" : "text-[#222E2C]/50"}`}>{pkg.duration} · ${pkg.priceValue} each</p>
          <h3 className={`font-sans font-semibold text-lg leading-snug ${selected ? "text-[#EDE5D8]" : "text-[#222E2C]"}`}>{pkg.name}</h3>
        </div>
        <div className="shrink-0">
          <QtyStepper value={qty} onChange={onQtyChange} min={0} size="md" tone={selected ? "dark" : "light"} label="Quantity" />
        </div>
      </div>

      {pkg.description && (
        <p className={`font-sans text-sm leading-relaxed -mt-2 ${selected ? "text-[#EDE5D8]/65" : "text-[#222E2C]/60"}`}>{pkg.description}</p>
      )}

      <div className="flex flex-col gap-2.5 flex-1">
        {pkg.includes.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <TbCircleCheck size={16} className={`shrink-0 mt-0.5 ${selected ? "text-[#EDE5D8]" : "text-[#C9974F]/70"}`} />
            <span className={`font-sans text-sm font-medium leading-snug ${selected ? "text-[#EDE5D8]/85" : "text-[#222E2C]/75"}`}>{item}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="pt-4 border-t border-white/10">
          <DateField value={date} onChange={onDateChange} optional tone="dark" />
        </div>
      )}
    </div>
  );
}

/*
 * End-of-page summary. This is the whole page's draft rendered back, and the single
 * "Add to cart" is the only thing that writes to the global cart — nothing above
 * touches it. Submitting the order happens on /checkout/, never here.
 */
function SpaSummary({ lines, total, allergies, onAllergiesChange, notes, onNotesChange, onAddToCart, inCart }) {
  const { t } = useI18n();

  return (
    <div id="checkout" className="scroll-mt-24 flex flex-col gap-6">
      <div className="border-b border-[#213B2F]/15 pb-4">
        <p className="font-sans text-xs font-semibold text-[#213B2F]/50 uppercase tracking-widest mb-1">Order Summary</p>
        <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#213B2F] tracking-tight">Review your selection</h2>
        <p className="font-sans text-sm text-[#213B2F]/55 mt-2 max-w-2xl">
          Review your selected treatments and add any allergies or notes, then add it all to your order. You'll fill in your details at checkout.
        </p>
      </div>

      <div className="rounded-2xl px-6 md:px-10 py-8 flex flex-col gap-8" style={{ backgroundColor: SPA_COLOR }}>

        {/* Selected services */}
        <div className="flex flex-col gap-3">
          <h3 className="font-sans font-semibold text-sm text-[#EDE5D8]">Your Selection</h3>
          {lines.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/20 px-4 py-5 text-center">
              <p className="font-sans text-sm italic text-[#EDE5D8]/40">No services selected yet — browse the sections above.</p>
            </div>
          ) : (
            <div className="rounded-xl bg-white/8 divide-y divide-white/10 overflow-hidden">
              {lines.map((line, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <span className="font-sans text-sm text-[#EDE5D8]/85">{line.label}</span>
                  <span className="font-sans font-medium text-sm whitespace-nowrap text-[#EDE5D8] tabular-nums">
                    {money(line.price)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/10">
                <span className="font-sans font-semibold text-sm text-[#EDE5D8]">Total</span>
                <span className="font-sans font-semibold text-base text-[#EDE5D8] tabular-nums">{money(total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Allergies / considerations */}
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs font-medium text-[#EDE5D8]/60 flex items-center gap-1.5">
            <TbAlertTriangle size={12} />
            Allergies or things to consider
          </span>
          <textarea
            rows={2}
            value={allergies}
            onChange={(e) => onAllergiesChange(e.target.value)}
            placeholder="Skin sensitivities, medical conditions, injuries, or anything the therapist should know…"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 font-sans text-sm text-[#EDE5D8] placeholder:text-[#EDE5D8]/35 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-transparent transition-all duration-200 resize-none"
          />
        </label>

        {/* Notes */}
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs font-medium text-[#EDE5D8]/60 flex items-center gap-1.5">
            <TbNotes size={12} />
            Additional notes
          </span>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Any other preferences or special requests…"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 font-sans text-sm text-[#EDE5D8] placeholder:text-[#EDE5D8]/35 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-transparent transition-all duration-200 resize-none"
          />
        </label>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={lines.length === 0}
          style={{ color: SPA_COLOR }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#EDE5D8] hover:bg-[#EDE5D8]/90 font-sans font-semibold text-sm shadow-sm transition-all duration-200 w-fit disabled:opacity-50"
        >
          {inCart ? <TbCheck size={16} /> : <TbShoppingBag size={16} />}
          {inCart ? t("cart.update") : t("cart.addToCart")}
        </button>

        {inCart && (
          <p className="font-sans text-xs text-[#EDE5D8]/60 -mt-4">
            {t("cart.inOrder")} — {t("cart.estimateNote")}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── main page ────────────────────────────────────────────── */

const SERVICE = "wellness-spa";

export default function WellnessSpaPage() {
  const { t } = useI18n();
  const draft = useDraft();
  const { setLine, clearService, setServiceForm, openCart, linesByService, lines, serviceForms, hydrated } = useCart();
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");

  /* Enhancements only make sense alongside a real treatment. Scoped to this page's
   * draft — checking the global cart instead would let a rental car unlock them. */
  const hasOtherService = draft.ids.some((k) => !k.startsWith("addon-"));

  const massageItems    = t("wellnessSpa.massages.items");
  const durationPricing = t("wellnessSpa.massages.durationPricing");
  const fourHands       = t("wellnessSpa.massages.fourHands");
  const facialItems     = t("wellnessSpa.facials.items");
  const addonItems      = t("wellnessSpa.facials.addons.items");
  const addonPrice      = t("wellnessSpa.facials.addons.priceValue");
  const packages        = t("wellnessSpa.packages.items");

  const inCart = linesByService.some((g) => g.service.id === SERVICE);

  /* sku -> draft key, the inverse of what buildLines() produces. Used to restore
   * this page when the guest arrives via the cart's "Edit" link. */
  const skuToDraftId = useMemo(() => {
    const map = {};
    if (Array.isArray(massageItems)) {
      massageItems.forEach((_, i) => { map[skuOf("wellnessSpa.massages.items", i, "name")] = `massage-${i}`; });
    }
    map["four-hands-massage"] = "four-hands";
    if (Array.isArray(facialItems)) {
      facialItems.forEach((_, i) => { map[skuOf("wellnessSpa.facials.items", i, "name")] = `facial-${i}`; });
    }
    if (Array.isArray(addonItems)) {
      addonItems.forEach((_, i) => { map[skuOf("wellnessSpa.facials.addons.items", i)] = `addon-${i}`; });
    }
    if (Array.isArray(packages)) {
      packages.forEach((_, i) => { map[skuOf("wellnessSpa.packages.items", i, "name")] = `package-${i}`; });
    }
    return map;
  }, [massageItems, facialItems, addonItems, packages]);

  useSeedDraftFromCart({
    hydrated,
    lines,
    service: SERVICE,
    skuToId: (line) => skuToDraftId[line.sku],
    setItems: draft.setItems,
    onSeed: () => {
      const form = serviceForms[SERVICE];
      if (form?.allergies) setAllergies(form.allergies);
      if (form?.notes) setNotes(form.notes);
    },
  });

  /*
   * Turns each draft entry into a cart line. `title` and `sku` come from the i18n
   * arrays; the draft only ever held quantity, date, duration and unit price.
   * Duration goes in `options` as a label, never concatenated into the title —
   * see describeLine() in lib/format.js.
   */
  const buildLines = () => {
    const out = [];
    const push = (id, sku, title, options = {}) => {
      const entry = draft.get(id);
      if (!entry?.qty) return;
      out.push({
        lineId: lineIdOf(SERVICE, sku, entry.duration),
        service: SERVICE,
        sku,
        title,
        qty: entry.qty,
        unitPrice: entry.unitPrice ?? 0,
        date: entry.date ?? "",
        options: { ...options, ...(entry.duration ? { duration: entry.duration } : {}) },
      });
    };

    if (Array.isArray(massageItems)) {
      massageItems.forEach((item, i) =>
        push(`massage-${i}`, skuOf("wellnessSpa.massages.items", i, "name"), item.name)
      );
    }
    if (fourHands) push("four-hands", "four-hands-massage", fourHands.label);

    if (Array.isArray(facialItems)) {
      facialItems.forEach((item, i) =>
        push(`facial-${i}`, skuOf("wellnessSpa.facials.items", i, "name"), item.name, {
          duration: item.duration,
        })
      );
    }
    if (Array.isArray(addonItems)) {
      addonItems.forEach((name, i) =>
        push(`addon-${i}`, skuOf("wellnessSpa.facials.addons.items", i), name)
      );
    }
    if (Array.isArray(packages)) {
      packages.forEach((pkg, i) =>
        push(`package-${i}`, skuOf("wellnessSpa.packages.items", i, "name"), pkg.name, {
          duration: pkg.duration,
        })
      );
    }
    return out;
  };

  /* Summary rows: same data the cart will get, shaped for the existing markup. */
  const summaryLines = buildLines().map((l) => ({
    label: l.options.duration ? `${l.title} (${l.options.duration})` : l.title,
    price: l.qty * l.unitPrice,
    qty: l.qty,
  }));
  const summaryTotal = summaryLines.reduce((sum, l) => sum + l.price, 0);

  const addToCart = () => {
    const lines = buildLines();
    if (!lines.length) return;

    /* Replace rather than append: re-submitting after deselecting something must
     * not leave the removed line behind. */
    clearService(SERVICE);
    lines.forEach(setLine);

    const form = {};
    if (allergies.trim()) form.allergies = allergies.trim();
    if (notes.trim()) form.notes = notes.trim();
    if (Object.keys(form).length) setServiceForm(SERVICE, form);

    openCart();
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 bg-[#EDE5D8]">

        {/* Header */}
        <div className="px-8 md:px-16 pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1" data-aos="fade-up">
            <Link href="/" className="flex items-center gap-1.5 w-fit mb-3 text-sm font-sans font-medium text-[#213B2F]/50 hover:text-[#213B2F] transition-colors duration-200">
              <TbArrowLeft size={16} />
              {t("common.back")}
            </Link>
            <div className="flex items-center gap-2 w-fit border border-[#213B2F]/20 rounded-full px-4 py-2 mb-3">
              <TbSparkles size={15} className="text-[#213B2F]" />
              <span className="font-sans text-sm text-[#213B2F]">{t("wellnessSpa.pill")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl text-[#213B2F] tracking-tight leading-tight" style={{ fontFamily: "var(--font-alpina)" }}>
              {t("wellnessSpa.title")}
            </h1>
            <p className="font-sans text-sm text-[#213B2F]/55 mt-1">{t("wellnessSpa.subtitle")}</p>
          </div>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200 shrink-0 w-fit">
            <TbBrandWhatsapp size={16} />
            {t("wellnessSpa.whatsapp")}
          </a>
        </div>

        <div className="px-8 md:px-16 flex flex-col gap-16 pb-24">

          {/* Story */}
          <div className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:h-[420px]" style={{ backgroundColor: SPA_COLOR }} data-aos="fade-up">
            <div className="flex flex-col justify-center gap-5 px-8 md:px-12 py-12 lg:py-0 order-2 lg:order-1">
              <TbSparkles size={22} className="text-[#D8DDB8]/60" />
              <h2 className="text-3xl md:text-4xl text-[#EDE5D8] tracking-tight leading-tight" style={{ fontFamily: "var(--font-alpina)" }}>
                {t("wellnessSpa.story.heading")}
              </h2>
              <div className="w-12 h-px bg-[#D8DDB8]/40" />
              <p className="font-sans text-sm text-[#D8DDB8]/65 leading-relaxed whitespace-pre-line max-w-md">{t("wellnessSpa.story.body")}</p>
            </div>
            <div className="h-56 lg:h-full order-1 lg:order-2 overflow-hidden">
              <img src="/assets/Massages/PseudoHeroSection.avif" alt={t("wellnessSpa.story.heading")} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* How it works */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="flex flex-col gap-2 max-w-xl">
              <h2 className="text-3xl md:text-4xl text-[#213B2F] tracking-tight leading-tight" style={{ fontFamily: "var(--font-alpina)" }}>
                How to book your treatments
              </h2>
              <p className="font-sans text-sm text-[#213B2F]/55 leading-relaxed">
                Browse, customize, and submit — we'll take care of the rest before your stay.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {[
                { Icon: TbHandClick,  step: "Browse treatments",   body: "Scroll through massages, facials, packages, and enhancements below." },
                { Icon: TbAdjustments, step: "Choose your options", body: "Pick a duration, set the quantity, and add an optional preferred date." },
                { Icon: TbCirclePlus,  step: "Add to your request", body: "Select as many services as you'd like — they'll all appear in your order summary." },
                { Icon: TbSend,        step: "Review & submit",     body: "Scroll to the order summary at the bottom, add any allergies or notes, and submit — we'll confirm before your stay." },
              ].map(({ Icon, step, body }, i) => (
                <div key={i} className="flex-1 flex flex-col gap-3 bg-white rounded-2xl px-5 py-5 border border-[#213B2F]/8">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[#213B2F] flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-[#D8DDB8]" />
                    </div>
                    <span className="font-sans text-xs font-semibold text-[#213B2F]/40 uppercase tracking-widest">Step {i + 1}</span>
                  </div>
                  <p className="font-sans text-base font-medium text-[#213B2F] leading-snug">{step}</p>
                  <p className="font-sans text-sm text-[#213B2F]/55 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Massages */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#213B2F]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#213B2F]/50 uppercase tracking-widest mb-1">{t("wellnessSpa.massages.subheading")}</p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#213B2F] tracking-tight">{t("wellnessSpa.massages.heading")}</h2>
              <p className="font-sans text-sm text-[#213B2F]/55 mt-2 max-w-2xl">{t("wellnessSpa.massages.description")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.isArray(massageItems) && massageItems.map((item, i) => (
                <MassageCard key={i} name={item.name} description={item.description} image={item.image}
                  groupId={`massage-${i}`} durations={Array.isArray(durationPricing) ? durationPricing : []} draft={draft} />
              ))}
              {fourHands && (
                <MassageCard name={fourHands.label} description={fourHands.description} image={fourHands.image}
                  groupId="four-hands" durations={Array.isArray(fourHands.durationPricing) ? fourHands.durationPricing : []} draft={draft} />
              )}
            </div>
          </div>

          {/* Facial Treatments */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#213B2F]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#213B2F]/50 uppercase tracking-widest mb-1">{t("wellnessSpa.facials.subheading")}</p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#213B2F] tracking-tight">{t("wellnessSpa.facials.heading")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.isArray(facialItems) && facialItems.map((item, i) => (
                <FacialItemCard key={i} item={item} id={`facial-${i}`} draft={draft} />
              ))}
            </div>
          </div>

          {/* Enhancements */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#213B2F]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#213B2F]/50 uppercase tracking-widest mb-1">{t("wellnessSpa.facials.addons.heading")}</p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#213B2F] tracking-tight">Enhancements</h2>
            </div>

            <div className="flex flex-col items-center gap-4 text-center py-6">
              <p className="font-sans text-2xl md:text-3xl text-[#C9974F] leading-snug max-w-2xl" style={{ fontFamily: "var(--font-alpina)" }}>
                {t("wellnessSpa.facials.addons.tagline")}
              </p>
              <div className="w-16 h-px bg-[#C9974F]/40" />
            </div>

            {!hasOtherService && (
              <p className="font-sans text-xs text-[#213B2F]/45 italic text-center">
                Select a massage, facial, or package above to unlock enhancements.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Array.isArray(addonItems) && addonItems.map((name, i) => (
                <AddonCard key={i} name={name} id={`addon-${i}`} Icon={ADDON_ICONS[i % ADDON_ICONS.length]}
                  draft={draft} addonPrice={addonPrice} disabled={!hasOtherService} />
              ))}
            </div>
          </div>

          {/* Spa Packages */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#213B2F]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#213B2F]/50 uppercase tracking-widest mb-1">{t("wellnessSpa.packages.subheading")}</p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#213B2F] tracking-tight">{t("wellnessSpa.packages.heading")}</h2>
              <p className="font-sans text-sm text-[#213B2F]/55 mt-2 max-w-2xl">{t("wellnessSpa.packages.description")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.isArray(packages) && packages.map((pkg, i) => {
                const pkgId = `package-${i}`;
                const pkgItem = draft.get(pkgId);
                const pkgQty = pkgItem?.qty ?? 0;

                const handleQtyChange = (newQty) => {
                  if (newQty <= 0) { draft.remove(pkgId); return; }
                  draft.set(pkgId, { qty: newQty, unitPrice: pkg.priceValue });
                };

                const handleDateChange = (newDate) => {
                  if (!pkgItem) return;
                  draft.set(pkgId, { date: newDate });
                };

                return (
                  <PackageCard key={i} pkg={pkg} qty={pkgQty} onQtyChange={handleQtyChange}
                    entry={pkgItem} onDateChange={handleDateChange} />
                );
              })}
            </div>
          </div>

          {/* Closing quote */}
          <div className="flex flex-col items-center text-center gap-5 py-8" data-aos="fade-up">
            <div className="w-10 h-px bg-[#213B2F]/25" />
            <blockquote className="text-2xl md:text-3xl text-[#213B2F]/80 leading-relaxed max-w-2xl italic" style={{ fontFamily: "var(--font-alpina)" }}>
              "The trees are sanctuaries. Whoever knows how to speak to them, whoever knows how to listen to them, can learn the truth."
            </blockquote>
            <p className="font-sans text-sm text-[#213B2F]/45">— Hermann Hesse</p>
            <div className="w-10 h-px bg-[#213B2F]/25" />
          </div>

          {/* Order Summary & Submit */}
          <SpaSummary
            lines={summaryLines}
            total={summaryTotal}
            allergies={allergies}
            onAllergiesChange={setAllergies}
            notes={notes}
            onNotesChange={setNotes}
            onAddToCart={addToCart}
            inCart={inCart}
          />

        </div>
      </main>
      <Footer />
    </>
  );
}
