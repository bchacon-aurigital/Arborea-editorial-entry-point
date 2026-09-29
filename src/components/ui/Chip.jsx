"use client";

import { TbCheck } from "react-icons/tb";
import { cn } from "@/lib/utils";

/*
 * Unifies the two RadioPill implementations (FullFridgePage, PrivateChefPage) and
 * CheckboxChip. `type` drives both the a11y role and the selected indicator:
 * radio gets a ring+dot, checkbox gets a check mark.
 */

const TONES = {
  light: {
    on:  "bg-[#213B2F] border-[#213B2F] text-[#D8DDB8]",
    off: "bg-transparent border-[#222E2C]/20 text-[#222E2C]/70 hover:border-[#222E2C]/40",
    dotOn: "border-[#D8DDB8]",
    dotOff: "border-[#222E2C]/35",
    dotFill: "bg-[#D8DDB8]",
  },
  dark: {
    on:  "bg-[#D8DDB8] border-[#D8DDB8] text-[#213B2F]",
    off: "bg-transparent border-[#D8DDB8]/25 text-[#D8DDB8]/80 hover:border-[#D8DDB8]/50",
    dotOn: "border-[#213B2F]",
    dotOff: "border-[#D8DDB8]/40",
    dotFill: "bg-[#213B2F]",
  },
};

export default function Chip({
  label,
  selected = false,
  onClick,
  type = "checkbox",
  tone = "light",
  icon: Icon,
  disabled = false,
}) {
  const c = TONES[tone] ?? TONES.light;
  const isRadio = type === "radio";

  return (
    <button
      type="button"
      role={isRadio ? "radio" : undefined}
      aria-checked={isRadio ? selected : undefined}
      aria-pressed={isRadio ? undefined : selected}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-full border font-sans text-sm",
        "transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
        selected ? c.on : c.off
      )}
    >
      {isRadio && (
        <span
          className={cn(
            "flex items-center justify-center size-3.5 rounded-full border shrink-0",
            selected ? c.dotOn : c.dotOff
          )}
        >
          {selected && <span className={cn("size-1.5 rounded-full", c.dotFill)} />}
        </span>
      )}
      {!isRadio && selected && <TbCheck size={14} className="shrink-0" />}
      {Icon && <Icon size={14} className="shrink-0" />}
      {label}
    </button>
  );
}
