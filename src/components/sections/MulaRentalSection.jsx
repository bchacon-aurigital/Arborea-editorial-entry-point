"use client";

import { useState } from "react";
import { TbUsers, TbRoute, TbCirclePlus, TbCircleCheck, TbPhoto } from "react-icons/tb";
import OrderCheckoutForm from "@/components/sections/OrderCheckoutForm";

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

function Stepper({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1 w-fit">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="size-9 flex items-center justify-center rounded-lg text-[#D8DDB8] hover:bg-white/15 active:bg-white/20 transition-colors font-sans text-xl leading-none select-none"
      >
        −
      </button>
      <span className="w-9 text-center font-sans text-base font-semibold text-[#D8DDB8]">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="size-9 flex items-center justify-center rounded-lg text-[#D8DDB8] hover:bg-white/15 active:bg-white/20 transition-colors font-sans text-xl leading-none select-none"
      >
        +
      </button>
    </div>
  );
}

function VehicleCard({ vehicle, days, date, inCart, onDaysChange, onDateChange, onToggle }) {
  const total = days * vehicle.dailyRate;

  return (
    <div
      className={`flex flex-col rounded-2xl overflow-hidden transition-all duration-300 h-full bg-[#213B2F] ${
        inCart
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
            <label className="font-sans text-[10px] font-semibold text-[#D8DDB8]/50 uppercase tracking-wide">Days</label>
            <Stepper value={days} onChange={onDaysChange} />
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="font-sans text-[10px] font-semibold text-[#D8DDB8]/50 uppercase tracking-wide">Pickup date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full font-sans text-sm text-[#D8DDB8] bg-white/10 border border-white/15 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D8DDB8]/30 focus:border-transparent transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0">
            <p className="font-sans text-[10px] text-[#D8DDB8]/50">${vehicle.dailyRate}/day</p>
            <p className="font-sans font-bold text-2xl leading-tight text-[#D8DDB8]">
              ${total.toLocaleString("en-US")}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-sans text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              inCart
                ? "bg-[#D8DDB8] text-[#213B2F] hover:bg-[#c8cda8]"
                : "bg-[#D8DDB8]/20 text-[#D8DDB8] hover:bg-[#D8DDB8]/30 border border-[#D8DDB8]/25"
            }`}
          >
            {inCart ? <TbCircleCheck size={15} /> : <TbCirclePlus size={15} />}
            {inCart ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MulaRentalSection() {
  const [configs, setConfigs] = useState(initConfigs);
  const [cartIds, setCartIds] = useState(new Set());
  const [notes, setNotes] = useState("");

  const updateDays = (id, val) =>
    setConfigs((prev) => ({ ...prev, [id]: { ...prev[id], days: val } }));

  const updateDate = (id, val) =>
    setConfigs((prev) => ({ ...prev, [id]: { ...prev[id], date: val } }));

  const toggleCart = (id) =>
    setCartIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const cartVehicles = VEHICLES.filter((v) => cartIds.has(v.id));
  const lines = cartVehicles.map((v) => {
    const { days, date } = configs[v.id];
    const dateStr = date ? ` · pickup ${date}` : "";
    return {
      label: `${v.name} · ${days} day${days !== 1 ? "s" : ""}${dateStr}`,
      price: days * v.dailyRate,
    };
  });
  const total = lines.reduce((sum, l) => sum + l.price, 0);

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

      {/* Vehicle grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-aos="fade-up">
        {VEHICLES.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            days={configs[vehicle.id].days}
            date={configs[vehicle.id].date}
            inCart={cartIds.has(vehicle.id)}
            onDaysChange={(val) => updateDays(vehicle.id, val)}
            onDateChange={(val) => updateDate(vehicle.id, val)}
            onToggle={() => toggleCart(vehicle.id)}
          />
        ))}
      </div>

      {/* Checkout — visible only when cart has items */}
      {cartIds.size > 0 && (
        <div data-aos="fade-up">
          <OrderCheckoutForm
            service="Transportation"
            lines={lines}
            total={total}
            notes={notes}
            onNotesChange={setNotes}
            compact
          />
        </div>
      )}

    </section>
  );
}
