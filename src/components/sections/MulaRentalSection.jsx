"use client";

import { useState, useEffect } from "react";
import { TbUsers, TbRoute, TbCirclePlus, TbCircleCheck, TbPhoto, TbTrash } from "react-icons/tb";
import { useCart } from "@/app/context/CartContext";
import { useI18n } from "@/app/context/I18nContext";
import { lineIdOf } from "@/lib/sku";
import { money } from "@/lib/format";
import QtyStepper from "@/components/ui/QtyStepper";
import DateField from "@/components/ui/DateField";

const VEHICLES = [
  {
    id: "sidebyside",
    name: "Yamaha Side-by-Side 700",
    type: "Off-road · Automatic",
    seats: 5,
    drive: "4WD",
    idealFor: "Couples or small groups who want to explore Arborea's trails, viewpoints, and jungle paths — without leaving the property.",
    dailyRate: 200,
    badge: "Arborea exclusive",
    image: "/assets/transporte/sidebyside.avif",
  },
  {
    id: "rav4",
    name: "Toyota RAV4",
    type: "SUV · Automatic",
    seats: 5,
    drive: "4x4",
    idealFor: "Families of 4–5 planning day trips to waterfalls, beaches, or nearby towns — comfortable, reliable, and easy to drive.",
    dailyRate: 85,
    image: "/assets/transporte/rav4.avif",
  },
  {
    id: "jimny",
    name: "Suzuki Jimny",
    type: "Compact 4x4 · Manual",
    seats: 4,
    drive: "Full-time 4WD",
    idealFor: "Couples or duos who enjoy a mix of on-property time and adventurous back-road driving. Agile in tight jungle tracks.",
    dailyRate: 70,
    image: "/assets/transporte/jimny.avif",
  },
  {
    id: "landcruiser",
    name: "Toyota Land Cruiser",
    type: "Full-size SUV · Automatic",
    seats: 8,
    drive: "4WD Low Range",
    idealFor: "Large groups of up to 8 who need one vehicle for everything — national parks, multi-day road trips, or heavy off-road terrain.",
    dailyRate: 150,
    image: "/assets/transporte/lc.avif",
  },
  {
    id: "prado",
    name: "Toyota Prado",
    type: "Mid-size SUV · Automatic",
    seats: 7,
    drive: "4x4",
    idealFor: "Families with kids who want comfort and confidence on longer regional trips — spacious, capable, and stress-free.",
    dailyRate: 120,
    image: "/assets/transporte/prado.avif",
  },
  {
    id: "tucson",
    name: "Hyundai Tucson",
    type: "Crossover · Automatic",
    seats: 5,
    drive: "AWD",
    idealFor: "Couples or small groups doing town runs, restaurant visits, and casual coastal drives — practical and fuel-efficient.",
    dailyRate: 75,
    image: "/assets/transporte/tucson.avif",
  },
];

const initConfigs = Object.fromEntries(VEHICLES.map((v) => [v.id, { days: 1, date: "" }]));

function VehicleCard({ vehicle, days, date, cartLine, onDaysChange, onDateChange, onCommit, onRemove }) {
  const { t } = useI18n();
  const total = days * vehicle.dailyRate;

  /* A committed line is "dirty" once the draft no longer matches it, which turns
   * the CTA from a confirmation into an update. */
  const dirty = cartLine
    ? cartLine.unitPrice !== total || cartLine.date !== date
    : true;

  return (
    <div
      className={`flex flex-col rounded-2xl overflow-hidden transition-all duration-300 h-full bg-[#213B2F] ${
        cartLine
          ? "ring-2 ring-[#D8DDB8]/50 shadow-lg"
          : "ring-1 ring-white/10 hover:ring-white/20 hover:shadow-md"
      }`}
    >
      {/* Photo */}
      <div className="h-52 shrink-0 overflow-hidden bg-[#1a2e24] flex items-center justify-center relative">
        {vehicle.image ? (
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <TbPhoto size={28} className="text-[#D8DDB8]/30" />
        )}
        {vehicle.badge && (
          <span className="absolute top-3 left-3 bg-[#D8DDB8] text-[#213B2F] font-sans text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
            {vehicle.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-5 pt-5 pb-4 flex flex-col gap-4 flex-1">

        {/* Name + type */}
        <div className="flex flex-col gap-0.5">
          <h3 className="font-sans font-semibold text-base text-white leading-snug">{vehicle.name}</h3>
          <p className="font-sans text-xs text-[#D8DDB8]/60">{vehicle.type}</p>
        </div>

        {/* Specs chips */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-2.5 py-1">
            <TbUsers size={12} className="text-[#D8DDB8]/70 shrink-0" />
            <span className="font-sans text-xs font-medium text-[#D8DDB8]/85">{vehicle.seats} seats</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-2.5 py-1">
            <TbRoute size={12} className="text-[#D8DDB8]/70 shrink-0" />
            <span className="font-sans text-xs font-medium text-[#D8DDB8]/85">{vehicle.drive}</span>
          </span>
        </div>

        {/* Ideal for */}
        <div className="bg-white/8 rounded-xl px-3.5 py-3 flex flex-col gap-1">
          <p className="font-sans text-[10px] font-bold text-[#D8DDB8]/45 uppercase tracking-widest">Ideal for</p>
          <p className="font-sans text-xs text-[#D8DDB8]/85 leading-relaxed">{vehicle.idealFor}</p>
        </div>
      </div>

      {/* Booking controls */}
      <div className="px-5 pt-4 pb-5 flex flex-col gap-4 border-t border-white/10 bg-black/15">

        {/* Days + Date side by side */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="font-sans text-[10px] font-semibold text-[#D8DDB8]/50 uppercase tracking-wide">
              {t("cart.days")}
            </label>
            <QtyStepper value={days} onChange={onDaysChange} min={1} size="md" tone="dark" label={t("cart.days")} />
          </div>
          <div className="flex-1 min-w-0">
            <DateField value={date} onChange={onDateChange} label={t("cart.pickupDate")} tone="dark" />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0">
            <p className="font-sans text-[10px] text-[#D8DDB8]/50">{money(vehicle.dailyRate)}/day</p>
            <p className="font-sans font-bold text-2xl leading-tight text-[#D8DDB8] tabular-nums">
              {money(total)}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {cartLine && (
              <button
                type="button"
                onClick={onRemove}
                aria-label={`${t("cart.remove")} — ${vehicle.name}`}
                className="size-9 rounded-full flex items-center justify-center text-[#D8DDB8]/50 hover:text-red-300 hover:bg-red-400/10 transition-colors"
              >
                <TbTrash size={15} />
              </button>
            )}

            {dirty ? (
              <button
                type="button"
                onClick={onCommit}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-sans text-sm font-semibold transition-all duration-200 whitespace-nowrap bg-[#D8DDB8] text-[#213B2F] hover:bg-[#c8cda8]"
              >
                <TbCirclePlus size={15} />
                {cartLine ? t("cart.update") : t("cart.addToCart")}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-sans text-sm font-semibold whitespace-nowrap bg-white/12 text-[#D8DDB8]">
                <TbCircleCheck size={15} />
                {t("cart.inOrder")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MulaRentalSection() {
  const { getLine, setLine, removeLine, openCart, hydrated } = useCart();
  const [configs, setConfigs] = useState(initConfigs);

  /*
   * Restore each card's day count and pickup date from the cart once hydration
   * finishes, so coming back to the home page doesn't show "1 day" for a vehicle
   * already booked for five. Days are recovered as unitPrice / dailyRate, which is
   * exact because that is how the line was priced.
   *
   * Depends only on `hydrated`: adding `getLine` would re-run this on every cart
   * change and fight the guest's in-progress edits.
   */
  useEffect(() => {
    if (!hydrated) return;
    setConfigs((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const vehicle of VEHICLES) {
        const line = getLine(lineIdOf("transport", vehicle.id));
        if (!line) continue;
        const days = Math.max(1, Math.round(line.unitPrice / vehicle.dailyRate));
        if (next[vehicle.id].days !== days || next[vehicle.id].date !== line.date) {
          next[vehicle.id] = { days, date: line.date };
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [hydrated]);

  const updateDays = (id, val) =>
    setConfigs((prev) => ({ ...prev, [id]: { ...prev[id], days: val } }));

  const updateDate = (id, val) =>
    setConfigs((prev) => ({ ...prev, [id]: { ...prev[id], date: val } }));

  /*
   * qty is the number of VEHICLES, not days — so the drawer's stepper reads as
   * "two of this vehicle" rather than silently changing the rental length. The
   * day count is folded into unitPrice (days x dailyRate) and surfaced as an
   * option label, which is why `options.days` is a string: describeLine() joins
   * option values and hides the keys, so a bare number would render as "3".
   */
  const commit = (vehicle) => {
    const { days, date } = configs[vehicle.id];
    setLine({
      lineId: lineIdOf("transport", vehicle.id),
      service: "transport",
      sku: vehicle.id,
      title: vehicle.name,
      qty: 1,
      unitPrice: days * vehicle.dailyRate,
      date,
      options: { days: `${days} ${days === 1 ? "day" : "days"}` },
    });
    openCart();
  };

  return (
    <section id="transport" className="flex flex-col px-8 md:px-16 pb-24 gap-12">

      {/* Header */}
      <div className="flex flex-col gap-3" data-aos="fade-up">
        <h2
          className="text-4xl md:text-5xl text-[#222E2C] tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-alpina)" }}
        >
          Transportation
        </h2>
        <p className="font-sans text-base text-[#222E2C]/60 max-w-2xl leading-relaxed">
          Explore the region on your own terms. Pick a vehicle, set how many days you need it, and we'll have it ready at the property on your preferred date.
        </p>
      </div>

      {/* Vehicle grid. No section summary or submit here by design — vehicles go
          straight into the cart, and the drawer is the only place they're reviewed. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VEHICLES.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            days={configs[vehicle.id].days}
            date={configs[vehicle.id].date}
            cartLine={getLine(lineIdOf("transport", vehicle.id))}
            onDaysChange={(val) => updateDays(vehicle.id, val)}
            onDateChange={(val) => updateDate(vehicle.id, val)}
            onCommit={() => commit(vehicle)}
            onRemove={() => removeLine(lineIdOf("transport", vehicle.id))}
          />
        ))}
      </div>

    </section>
  );
}
