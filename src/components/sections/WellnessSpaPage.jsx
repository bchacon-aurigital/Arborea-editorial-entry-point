"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import { useOrderCart } from "@/hooks/useOrderCart";
import { submitOrder } from "@/lib/orderApi";
import {
  TbArrowLeft, TbCircleCheck, TbBrandWhatsapp, TbPhoto,
  TbSparkles, TbDroplet, TbFlame, TbLeaf, TbWind, TbSun, TbCalendarEvent,
  TbHandClick, TbAdjustments, TbCirclePlus, TbSend,
  TbCheck, TbAlertCircle, TbLoader2, TbNotes, TbAlertTriangle,
} from "react-icons/tb";

const WHATSAPP = "50685011042";
const SPA_COLOR = "#8B5A3C";

/* ── helpers ─────────────────────────────────────────────── */

function buildLabel(name, qty, date) {
  const qtyStr = qty > 1 ? ` × ${qty}` : "";
  const dateStr = date ? ` · ${date}` : "";
  return `${name}${qtyStr}${dateStr}`;
}

function DateInput({ value, onChange, disabled, dark = false }) {
  const labelCls = dark ? "text-[#D8DDB8]/55" : "text-[#222E2C]/45";
  const inputCls = dark
    ? "text-[#D8DDB8] bg-white/8 border border-white/15 focus:ring-white/20 [color-scheme:dark]"
    : "text-[#222E2C] bg-[#222E2C]/6 border border-[#222E2C]/12 focus:ring-[#C9974F]/30 [color-scheme:light]";

  return (
    <div className="flex flex-col gap-1.5">
      <label className={`flex items-center gap-1.5 font-sans text-[10px] font-semibold uppercase tracking-widest ${labelCls}`}>
        <TbCalendarEvent size={11} />
        Preferred date (optional)
      </label>
      <input
        type="date"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`font-sans text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-0 ${inputCls}`}
      />
    </div>
  );
}

function Stepper({ value, onChange, dark = false }) {
  const bg   = dark ? "bg-white/10"      : "bg-[#222E2C]/8";
  const btn  = dark ? "text-[#EDE5D8]/70 hover:bg-white/10" : "text-[#222E2C]/65 hover:bg-[#222E2C]/10";
  const num  = dark ? "text-[#EDE5D8]"   : "text-[#222E2C]";
  return (
    <div className={`flex items-center gap-0.5 ${bg} rounded-xl p-0.5`}>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className={`size-8 flex items-center justify-center rounded-lg font-sans text-lg leading-none transition-colors select-none ${btn}`}>−</button>
      <span className={`w-8 text-center font-sans text-sm font-semibold ${num}`}>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} className={`size-8 flex items-center justify-center rounded-lg font-sans text-lg leading-none transition-colors select-none ${btn}`}>+</button>
    </div>
  );
}

/* ── sub-components ───────────────────────────────────────── */

function MassageCard({ name, description, image, groupId, durations, cart }) {
  const selected = cart.items[groupId];
  const qty = selected?.qty ?? 1;
  const date = selected?.date ?? "";

  const pick = (d) => {
    if (selected && selected.duration === d.label) {
      cart.removeItem(groupId);
    } else {
      cart.setItem(groupId, {
        label: buildLabel(`${name} (${d.label})`, qty, ""),
        price: d.priceValue * qty,
        priceValue: d.priceValue,
        duration: d.label,
        qty,
        date: "",
      });
    }
  };

  const changeQty = (newQty) => {
    if (!selected) return;
    if (newQty < 1) return;
    cart.setItem(groupId, {
      ...selected,
      label: buildLabel(`${name} (${selected.duration})`, newQty, selected.date ?? ""),
      price: selected.priceValue * newQty,
      qty: newQty,
    });
  };

  const changeDate = (newDate) => {
    if (!selected) return;
    cart.setItem(groupId, {
      ...selected,
      label: buildLabel(`${name} (${selected.duration})`, qty, newDate),
      date: newDate,
    });
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
              <Stepper value={qty} onChange={changeQty} dark />
            </div>
            <DateInput value={date} onChange={changeDate} dark />
          </div>
        )}
      </div>
    </div>
  );
}

const ADDON_ICONS = [TbSparkles, TbDroplet, TbFlame, TbLeaf, TbWind, TbSun];

function AddonCard({ name, id, Icon, cart, addonPrice, disabled = false }) {
  const cartItem = cart.items[id];
  const qty = cartItem?.qty ?? 0;
  const active = qty > 0;

  const changeQty = (newQty) => {
    if (disabled) return;
    if (newQty <= 0) { cart.removeItem(id); return; }
    cart.setItem(id, {
      label: buildLabel(name, newQty, ""),
      price: addonPrice * newQty,
      priceValue: addonPrice,
      qty: newQty,
    });
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
      <div className={`flex items-center gap-0 rounded-lg overflow-hidden shrink-0 ${active ? "bg-white/10" : "bg-[#222E2C]/8"}`}>
        <button type="button" onClick={() => changeQty(qty - 1)} disabled={disabled} className={`size-7 flex items-center justify-center font-sans text-base leading-none hover:bg-black/10 transition-colors ${active ? "text-[#EDE5D8]/70" : "text-[#222E2C]/65"}`}>−</button>
        <span className={`w-6 text-center font-sans text-sm font-semibold ${active ? "text-[#EDE5D8]" : "text-[#222E2C]"}`}>{qty}</span>
        <button type="button" onClick={() => changeQty(qty + 1)} disabled={disabled} className={`size-7 flex items-center justify-center font-sans text-base leading-none hover:bg-black/10 transition-colors ${active ? "text-[#EDE5D8]/70" : "text-[#222E2C]/65"}`}>+</button>
      </div>
    </div>
  );
}

function FacialItemCard({ item, id, cart }) {
  const cartItem = cart.items[id];
  const qty = cartItem?.qty ?? 0;
  const date = cartItem?.date ?? "";
  const selected = qty > 0;

  const changeQty = (newQty) => {
    if (newQty <= 0) { cart.removeItem(id); return; }
    cart.setItem(id, {
      label: buildLabel(item.name, newQty, cartItem?.date ?? ""),
      price: item.priceValue * newQty,
      priceValue: item.priceValue,
      qty: newQty,
      date: cartItem?.date ?? "",
    });
  };

  const changeDate = (newDate) => {
    if (!cartItem) return;
    cart.setItem(id, { ...cartItem, label: buildLabel(item.name, qty, newDate), date: newDate });
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
            <Stepper value={qty} onChange={changeQty} dark={selected} />
          </div>
          {selected && <DateInput value={date} onChange={changeDate} dark />}
        </div>
      </div>
    </div>
  );
}

function PackageCard({ pkg, qty, onQtyChange, cartItem, onDateChange }) {
  const selected = qty > 0;
  const date = cartItem?.date ?? "";

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
        <div className={`flex items-center gap-0 rounded-xl overflow-hidden shrink-0 ${selected ? "bg-white/10" : "bg-[#222E2C]/8"}`}>
          <button type="button" onClick={() => onQtyChange(qty - 1)} className={`size-9 flex items-center justify-center font-sans text-xl leading-none hover:bg-black/10 transition-colors select-none ${selected ? "text-[#EDE5D8]/70" : "text-[#222E2C]/65"}`}>−</button>
          <span className={`w-8 text-center font-sans text-sm font-semibold ${selected ? "text-[#EDE5D8]" : "text-[#222E2C]"}`}>{qty}</span>
          <button type="button" onClick={() => onQtyChange(qty + 1)} className={`size-9 flex items-center justify-center font-sans text-xl leading-none hover:bg-black/10 transition-colors select-none ${selected ? "text-[#EDE5D8]/70" : "text-[#222E2C]/65"}`}>+</button>
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
          <DateInput value={date} onChange={onDateChange} dark />
        </div>
      )}
    </div>
  );
}

function SpaCheckout({ lines, total, allergies, onAllergiesChange, notes, onNotesChange }) {
  const { locale } = useI18n();
  const [status, setStatus] = useState("idle");

  const handleSubmit = async () => {
    if (lines.length === 0) return;
    setStatus("submitting");
    const infoLines = allergies.trim()
      ? [{ label: `Allergies / considerations: ${allergies.trim()}`, price: 0 }]
      : [];
    const result = await submitOrder({
      submissionId: crypto.randomUUID(),
      service: "Wellness Spa & Massages",
      name: "",
      casa: "",
      dateNeeded: "",
      items: [...lines, ...infoLines].map(({ label, price }) => ({ label, price })),
      total,
      currency: "USD",
      notes: notes || "",
      locale,
    });
    setStatus(result?.ok ? "success" : "error");
  };

  return (
    <div id="checkout" className="scroll-mt-24 flex flex-col gap-6" data-aos="fade-up">
      <div className="border-b border-[#213B2F]/15 pb-4">
        <p className="font-sans text-xs font-semibold text-[#213B2F]/50 uppercase tracking-widest mb-1">Order Summary</p>
        <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#213B2F] tracking-tight">Review & Submit</h2>
        <p className="font-sans text-sm text-[#213B2F]/55 mt-2 max-w-2xl">
          Review your selected treatments, add any allergies or notes, then submit — we'll confirm everything before your stay.
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
                  <span className="font-sans font-medium text-sm whitespace-nowrap text-[#EDE5D8]">
                    ${(line.price || 0).toLocaleString("en-US")}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/10">
                <span className="font-sans font-semibold text-sm text-[#EDE5D8]">Total</span>
                <span className="font-sans font-semibold text-base text-[#EDE5D8]">${total.toLocaleString("en-US")}</span>
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

        {status === "success" && (
          <div className="flex items-center gap-2 rounded-xl border px-4 py-3 bg-white/15 border-white/25">
            <TbCheck size={16} className="shrink-0 text-[#EDE5D8]" />
            <p className="font-sans text-sm font-medium text-[#EDE5D8]">Order received — we'll be in touch to confirm before your stay.</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-400/30 px-4 py-3">
            <TbAlertCircle size={16} className="text-red-300 shrink-0" />
            <p className="font-sans text-sm text-red-200">Something went wrong — please try again or reach out on WhatsApp.</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "submitting" || lines.length === 0}
          style={{ color: SPA_COLOR }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#EDE5D8] hover:bg-[#EDE5D8]/90 font-sans font-medium text-sm shadow-sm transition-all duration-200 w-fit disabled:opacity-50"
        >
          {status === "submitting" && <TbLoader2 size={16} className="animate-spin" />}
          {status === "submitting" ? "Sending…" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

/* ── main page ────────────────────────────────────────────── */

export default function WellnessSpaPage() {
  const { t } = useI18n();
  const cart = useOrderCart();
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");

  const hasOtherService = Object.keys(cart.items).some((k) => !k.startsWith("addon-"));

  const massageItems    = t("wellnessSpa.massages.items");
  const durationPricing = t("wellnessSpa.massages.durationPricing");
  const fourHands       = t("wellnessSpa.massages.fourHands");
  const facialItems     = t("wellnessSpa.facials.items");
  const addonItems      = t("wellnessSpa.facials.addons.items");
  const addonPrice      = t("wellnessSpa.facials.addons.priceValue");
  const packages        = t("wellnessSpa.packages.items");

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
                  groupId={`massage-${i}`} durations={Array.isArray(durationPricing) ? durationPricing : []} cart={cart} />
              ))}
              {fourHands && (
                <MassageCard name={fourHands.label} description={fourHands.description} image={fourHands.image}
                  groupId="four-hands" durations={Array.isArray(fourHands.durationPricing) ? fourHands.durationPricing : []} cart={cart} />
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
                <FacialItemCard key={i} item={item} id={`facial-${i}`} cart={cart} />
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
                  cart={cart} addonPrice={addonPrice} disabled={!hasOtherService} />
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
                const pkgItem = cart.items[`package-${i}`];
                const pkgQty = pkgItem?.qty ?? 0;

                const handleQtyChange = (newQty) => {
                  if (newQty <= 0) { cart.removeItem(`package-${i}`); return; }
                  cart.setItem(`package-${i}`, {
                    label: buildLabel(`${pkg.name} (${pkg.duration})`, newQty, pkgItem?.date ?? ""),
                    price: pkg.priceValue * newQty,
                    priceValue: pkg.priceValue,
                    qty: newQty,
                    date: pkgItem?.date ?? "",
                  });
                };

                const handleDateChange = (newDate) => {
                  if (!pkgItem) return;
                  cart.setItem(`package-${i}`, {
                    ...pkgItem,
                    label: buildLabel(`${pkg.name} (${pkg.duration})`, pkgQty, newDate),
                    date: newDate,
                  });
                };

                return (
                  <PackageCard key={i} pkg={pkg} qty={pkgQty} onQtyChange={handleQtyChange}
                    cartItem={pkgItem} onDateChange={handleDateChange} />
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
          <SpaCheckout
            lines={cart.lines}
            total={cart.total}
            allergies={allergies}
            onAllergiesChange={setAllergies}
            notes={notes}
            onNotesChange={setNotes}
          />

        </div>
      </main>
      <Footer />
    </>
  );
}
