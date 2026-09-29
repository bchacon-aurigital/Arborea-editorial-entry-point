"use client";

import { cn } from "@/lib/utils";

/*
 * Replaces the 13 hand-rolled −/+ steppers that lived across the service pages.
 * Each of those clamped differently (0, 1 or 2) and sized its buttons differently;
 * `min`/`max` and `size` make that explicit instead of implicit.
 *
 * variant="grouped"  — segmented control, value inside the same pill as the buttons
 * variant="detached" — buttons separated from a large value, for prominent counters
 */

const SIZES = {
  sm: { btn: "size-7", text: "text-base", value: "w-6 text-xs" },
  md: { btn: "size-9", text: "text-lg",   value: "w-8 text-sm" },
  lg: { btn: "size-10", text: "text-xl",  value: "w-10 text-sm" },
};

const TONES = {
  light: {
    wrap:  "bg-[#222E2C]/8",
    btn:   "text-[#222E2C]/65 hover:bg-[#222E2C]/10",
    value: "text-[#222E2C]",
    ring:  "border-[#222E2C]/15 bg-white text-[#222E2C]/60 hover:bg-[#222E2C]/5",
  },
  dark: {
    wrap:  "bg-white/10 border border-white/15",
    btn:   "text-[#D8DDB8]/70 hover:bg-white/10",
    value: "text-[#EDE5D8]",
    ring:  "border-white/20 bg-white/10 text-[#D8DDB8]/70 hover:bg-white/15",
  },
};

export default function QtyStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  size = "md",
  tone = "light",
  variant = "grouped",
  accent,
  suffix,
  disabled = false,
  label,
}) {
  const s = SIZES[size] ?? SIZES.md;
  const c = TONES[tone] ?? TONES.light;

  const clamp = (n) => Math.min(max, Math.max(min, n));
  const step = (delta) => {
    if (disabled) return;
    const next = clamp(value + delta);
    if (next !== value) onChange(next);
  };

  const btnBase = cn(
    "flex items-center justify-center font-sans leading-none select-none transition-colors",
    "disabled:opacity-30 disabled:cursor-not-allowed",
    s.btn,
    s.text
  );

  const decDisabled = disabled || value <= min;
  const incDisabled = disabled || value >= max;

  if (variant === "detached") {
    return (
      <div className="flex items-center gap-3" role="group" aria-label={label}>
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={decDisabled}
          aria-label="Decrease"
          className={cn(btnBase, "rounded-xl border", c.ring)}
        >
          −
        </button>
        <span
          className={cn("font-sans text-2xl font-semibold text-center", s.value.split(" ")[0])}
          style={accent ? { color: accent } : undefined}
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={incDisabled}
          aria-label="Increase"
          className={cn(btnBase, "rounded-xl border", c.ring)}
        >
          +
        </button>
        {suffix && <span className="font-sans text-sm text-[#222E2C]/45">{suffix}</span>}
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center rounded-xl overflow-hidden w-fit", c.wrap)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={decDisabled}
        aria-label="Decrease"
        className={cn(btnBase, c.btn)}
      >
        −
      </button>
      <span
        className={cn("text-center font-sans font-semibold", s.value, c.value)}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={incDisabled}
        aria-label="Increase"
        className={cn(btnBase, c.btn)}
      >
        +
      </button>
    </div>
  );
}
