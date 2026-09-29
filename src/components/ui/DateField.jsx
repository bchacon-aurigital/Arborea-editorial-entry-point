"use client";

import { TbCalendarEvent } from "react-icons/tb";
import { cn } from "@/lib/utils";

/*
 * Replaces the 6 one-off `type="date"` inputs across the service pages.
 *
 * Those used `new Date().toISOString().slice(0, 10)` for `min`, which is UTC —
 * in Costa Rica (UTC-6) that rolls over to tomorrow at 6pm local, so a guest
 * browsing in the evening could not pick the current day. todayLocal() fixes it
 * in one place.
 */

export function todayLocal() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const TONES = {
  light: {
    label: "text-[#222E2C]/45",
    input:
      "bg-white border border-[#222E2C]/12 text-[#222E2C] shadow-sm focus:ring-[#213B2F]/30 [color-scheme:light]",
  },
  dark: {
    label: "text-[#D8DDB8]/55",
    input:
      "bg-white/10 border border-white/15 text-[#D8DDB8] focus:ring-white/25 [color-scheme:dark]",
  },
};

export default function DateField({
  value,
  onChange,
  label = "Preferred date",
  optional = false,
  tone = "light",
  min = todayLocal(),
  disabled = false,
  className,
}) {
  const c = TONES[tone] ?? TONES.light;

  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span
        className={cn(
          "flex items-center gap-1.5 font-sans text-[10px] font-semibold uppercase tracking-widest",
          c.label
        )}
      >
        <TbCalendarEvent size={11} className="shrink-0" />
        {label}
        {optional && (
          <span className="font-normal normal-case tracking-normal opacity-70">(optional)</span>
        )}
      </span>
      <input
        type="date"
        value={value}
        min={min}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "font-sans text-sm rounded-xl px-3 py-2 transition-all",
          "focus:outline-none focus:ring-2 focus:border-transparent",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          c.input
        )}
      />
    </label>
  );
}
