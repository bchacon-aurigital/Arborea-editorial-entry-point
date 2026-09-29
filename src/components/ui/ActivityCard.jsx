"use client";

import { useState } from "react";
import { TbPhoto, TbCirclePlus, TbCalendarEvent } from "react-icons/tb";

export default function ActivityCard({ activity }) {
  const [qty, setQty] = useState(0);
  const [date, setDate] = useState("");
  const { title, description, image, price, priceValue } = activity;
  const active = qty > 0;
  const total = priceValue && qty > 0 ? `$${(priceValue * qty).toLocaleString("en-US")}` : null;
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
      active ? "bg-[#213B2F] shadow-lg" : "bg-[#222E2C]/5"
    }`}>
      <div className="flex flex-row items-stretch min-h-[88px]">
        {/* Photo */}
        <div className="w-36 md:w-48 shrink-0 bg-[#222E2C]/10 flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          ) : (
            <TbPhoto size={24} className="text-[#222E2C]/30" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-4 flex flex-col justify-center gap-1 min-w-0">
          <p className={`font-sans font-medium text-base leading-snug ${active ? "text-[#D8DDB8]" : "text-[#222E2C]"}`}>{title}</p>
          <p className={`font-sans text-sm leading-relaxed line-clamp-1 ${active ? "text-[#D8DDB8]/60" : "text-[#222E2C]/55"}`}>{description}</p>
          {active && (total || price) && (
            <p className="font-sans font-bold text-lg text-[#EDE5D8] mt-1">{total ?? price}</p>
          )}
        </div>

        {/* Price + counter */}
        <div className="shrink-0 flex flex-col items-end justify-center gap-2 px-5 py-4">
          {!active && price && (
            <span className="font-sans text-sm font-semibold text-[#222E2C]/50">{price}</span>
          )}
          {active ? (
            <div className="flex items-center rounded-xl overflow-hidden border border-white/15 bg-white/10">
              <button type="button" onClick={() => setQty(q => Math.max(0, q - 1))}
                className="w-9 h-9 flex items-center justify-center font-sans text-lg leading-none text-[#D8DDB8]/70 hover:bg-white/10 transition-colors select-none">−</button>
              <span className="w-8 text-center font-sans text-sm font-bold text-[#EDE5D8]">{qty}</span>
              <button type="button" onClick={() => setQty(q => q + 1)}
                className="w-9 h-9 flex items-center justify-center font-sans text-lg leading-none text-[#D8DDB8]/70 hover:bg-white/10 transition-colors select-none">+</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setQty(1)}
              className="flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-sm font-medium transition-colors duration-200 whitespace-nowrap bg-[#222E2C] text-white hover:bg-[#213B2F]"
            >
              <TbCirclePlus size={15} />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Preferred date — shown when active */}
      {active && (
        <div className="px-5 pb-4 pt-1 border-t border-white/10 flex items-center gap-3">
          <label className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-[#D8DDB8]/50 cursor-default shrink-0">
            <TbCalendarEvent size={11} />
            Preferred date
            <span className="font-normal normal-case tracking-normal text-[#D8DDB8]/35">(optional)</span>
          </label>
          <input
            type="date"
            min={todayIso}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="font-sans text-sm rounded-xl px-4 py-2 bg-white/12 border border-white/15 text-[#D8DDB8] focus:outline-none focus:ring-2 focus:ring-white/25 [color-scheme:dark] transition-all"
          />
        </div>
      )}
    </div>
  );
}
