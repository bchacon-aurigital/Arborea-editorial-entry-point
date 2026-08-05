"use client";

import { useState } from "react";
import { useI18n } from "@/app/context/I18nContext";
import OrderCheckoutForm from "@/components/sections/OrderCheckoutForm";
import { TbSteeringWheel, TbUsers, TbManualGearbox, TbGasStation, TbCalendarWeek, TbBrandWhatsapp } from "react-icons/tb";

const DAILY_RATE = 200;
const WHATSAPP = "50685011042";
const SPEC_ICONS = [TbUsers, TbManualGearbox, TbGasStation, TbCalendarWeek];

export default function MulaRentalSection() {
  const { t } = useI18n();
  const [days, setDays] = useState(1);
  const [notes, setNotes] = useState("");

  const m = t("mulaRental");
  const specs = Array.isArray(m.specs) ? m.specs : [];
  const total = days * DAILY_RATE;
  const dayWord = days === 1 ? m.dayLabel : m.daysLabelPlural;
  const lines = [{ label: `${m.vehicle} · ${days} ${dayWord}`, price: total }];

  const waMessage = encodeURIComponent(`Hi! I'm interested in: *${m.vehicle}*`);
  const waUrl = `https://wa.me/${WHATSAPP}?text=${waMessage}`;

  const stepper = (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex flex-col gap-2">
        <span className="font-sans text-xs font-semibold text-[#D8DDB8]/60 uppercase tracking-widest">
          {m.daysLabel}
        </span>
        <div className="flex items-center gap-1.5 w-fit pl-1.5 pr-1.5 py-1.5 rounded-xl bg-white/10 border border-white/10">
          <button
            type="button"
            onClick={() => setDays((d) => Math.max(1, d - 1))}
            className="size-9 flex items-center justify-center rounded-lg text-[#D8DDB8] hover:bg-white/10 transition-colors duration-150 font-sans text-lg"
          >
            −
          </button>
          <span className="font-sans text-base text-[#D8DDB8] font-semibold w-8 text-center">{days}</span>
          <button
            type="button"
            onClick={() => setDays((d) => d + 1)}
            className="size-9 flex items-center justify-center rounded-lg text-[#D8DDB8] hover:bg-white/10 transition-colors duration-150 font-sans text-lg"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="font-sans text-xs text-[#D8DDB8]/60">{m.totalLabel}</span>
        <span className="font-sans font-semibold text-3xl text-[#D8DDB8]">${total.toLocaleString("en-US")}</span>
      </div>
    </div>
  );

  return (
    <section className="flex flex-col px-8 md:px-16 pb-24 gap-8">

      <div className="flex flex-col gap-4" data-aos="fade-up">
        <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-3 py-1.5">
          <TbSteeringWheel size={14} className="text-[#222E2C]/60" />
          <span className="font-sans text-xs text-[#222E2C]/60 tracking-wide">{m.pill}</span>
        </div>
        <h2
          className="text-4xl md:text-5xl text-[#222E2C] tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-alpina)" }}
        >
          {m.title}
        </h2>
        <p className="font-sans text-sm text-[#222E2C]/50 max-w-2xl">{m.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch" data-aos="fade-up">

        <div className="bg-[#4B4D40] rounded-2xl px-8 pt-10 pb-8 flex flex-col h-full">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="bg-white/10 rounded-2xl size-12 flex items-center justify-center shrink-0">
              <TbSteeringWheel size={22} className="text-[#D8DDB8]" />
            </div>
            <div className="bg-[#D8DDB8] rounded-full px-4 py-1.5">
              <span className="font-sans font-semibold text-xs text-[#213B2F] whitespace-nowrap">{m.priceTag}</span>
            </div>
          </div>

          <div className="pb-6 border-b border-white/15 flex flex-col gap-2">
            <h3 className="font-sans font-medium text-xl text-white tracking-tight">{m.vehicle}</h3>
            <p className="font-sans text-sm text-white/60 leading-relaxed">{m.terms}</p>
          </div>

          <div className="pt-6 flex flex-col gap-3">
            {specs.map((spec, i) => {
              const Icon = SPEC_ICONS[i % SPEC_ICONS.length];
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-white/10 rounded-xl size-8 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-white/70" />
                  </div>
                  <span className="font-sans text-sm text-white/70">{spec}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/10 my-6 pt-6">{stepper}</div>

          <div className="border-t border-white/10 pt-5 mt-auto flex items-center justify-between">
            <span className="font-sans text-sm font-medium text-white/50">{m.footerLabel}</span>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors duration-200 rounded-full px-3.5 py-2"
            >
              <TbBrandWhatsapp size={14} className="text-[#D8DDB8]" />
              <span className="font-sans text-xs font-semibold text-[#D8DDB8]">WhatsApp</span>
            </a>
          </div>
        </div>

        <OrderCheckoutForm
          service="Mula Rental"
          lines={lines}
          total={total}
          notes={notes}
          onNotesChange={setNotes}
          compact
        />
      </div>

    </section>
  );
}
