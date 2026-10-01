"use client";

import { TbShoppingBag } from "react-icons/tb";
import { useCart } from "@/app/context/CartContext";
import { useI18n } from "@/app/context/I18nContext";
import { money } from "@/lib/format";

/*
 * Persistent "view your order" control, top-right, always visible.
 *
 * Positioned as its own fixed element rather than inside <Navbar>'s header on
 * purpose: that header retracts on scroll-down (navbar.jsx tracks scroll
 * direction), and this button has to stay reachable at all times. It sits to the
 * left of the hamburger (.hamburger-nav: top 1.25rem, right 2rem / 4rem at md,
 * 3.5em wide) and matches its vertical rhythm.
 *
 * On small screens it collapses to just the icon and count so it keeps the
 * hamburger's footprint and can't crowd the logo on the left; the total appears
 * from md up.
 *
 * `pointer-events-auto` is required, not cosmetic: LenisProvider sets
 * `document.body.style.pointerEvents = "none"` during scroll and clears it 150ms
 * after it stops, which would otherwise make this dead to clicks for most of the
 * time the guest is scrolling. Only one class per Tailwind utility family here —
 * see the note in CLAUDE.md.
 */

export default function CartButton() {
  const { count, subtotal, openCart, hydrated, isOpen } = useCart();
  const { t } = useI18n();

  return (
    <div
      inert={isOpen}
      className={`fixed top-5 right-[6.25rem] md:right-[8.25rem] z-[450] pointer-events-auto transition-opacity duration-200 ${
        isOpen ? "opacity-0" : "opacity-100"
      }`}
    >
      <button
        type="button"
        onClick={openCart}
        aria-label={
          count > 0
            ? `${t("cart.open")} — ${count} ${count === 1 ? t("cart.itemsOne") : t("cart.itemsMany")}`
            : t("cart.open")
        }
        className="flex items-center gap-2 rounded-xl bg-[#213B2F] px-3.5 py-2.5 shadow-sm hover:bg-[#213B2F]/85 active:scale-[0.98] transition-all duration-200"
      >
        <span className="relative shrink-0 flex items-center">
          <TbShoppingBag size={18} className="text-[#D8DDB8]" />
          {/* Rendered only after hydration, so the prerendered HTML (which always
            * has an empty cart) can't flash a stale count. */}
          {hydrated && count > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#D8DDB8] flex items-center justify-center font-sans text-[10px] font-bold text-[#213B2F] tabular-nums">
              {count}
            </span>
          )}
        </span>
        {hydrated && count > 0 && (
          <span className="hidden md:inline font-sans text-sm font-semibold text-[#D8DDB8] tabular-nums">
            {money(subtotal)}
          </span>
        )}
      </button>
    </div>
  );
}
