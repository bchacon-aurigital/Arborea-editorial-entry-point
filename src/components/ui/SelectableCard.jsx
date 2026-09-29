"use client";

import { cn } from "@/lib/utils";

/*
 * Container only — deliberately has no opinion about the card's contents.
 *
 * The "card turns into the service colour when selected" treatment is repeated in
 * the chef service picker, chef dish cards, fishing packages, fridge beverages and
 * every spa card. Only the container styling is actually shared; the inner layouts
 * differ enough that generalising them would need a dozen props and fight every
 * caller. So this owns the selected/idle surface and nothing else.
 *
 * Renders a <button> when `onClick` is given, a <div> otherwise.
 */

export default function SelectableCard({
  selected = false,
  onClick,
  color,
  idleClassName = "bg-white border-[#222E2C]/10 hover:border-[#222E2C]/30",
  className,
  disabled = false,
  children,
  ...rest
}) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      {...(onClick && { type: "button", onClick, "aria-pressed": selected, disabled })}
      style={selected && color ? { backgroundColor: color, borderColor: color } : undefined}
      className={cn(
        "rounded-2xl border-2 transition-all duration-200 overflow-hidden",
        onClick && "text-left",
        selected ? "shadow-md" : idleClassName,
        disabled && "opacity-45 cursor-not-allowed",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
