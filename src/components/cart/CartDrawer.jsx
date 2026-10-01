"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { TbX, TbTrash, TbShoppingBag, TbArrowRight, TbPencil, TbPlus, TbChevronRight } from "react-icons/tb";
import { useCart } from "@/app/context/CartContext";
import { useI18n } from "@/app/context/I18nContext";
import { money, describeLine } from "@/lib/format";
import { describeServiceForm } from "@/lib/serviceForm";
import QtyStepper from "@/components/ui/QtyStepper";

/*
 * Slide-over order panel, mounted once in the root layout so it is available on
 * every page.
 *
 * Editing here is deliberately limited to quantity and removal — the two things
 * that are unambiguous out of context. Dates, durations and preference forms are
 * edited on the service page (the "Edit" link per group) or on /checkout/, where
 * there is room to show what a change actually affects.
 */

export default function CartDrawer() {
  const {
    isOpen, closeCart, linesByService, subtotal, count,
    setQty, removeLine, clear, serviceForms,
  } = useCart();
  const { t, locale } = useI18n();

  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const restoreFocusRef = useRef(null);

  /* Escape to close, and a focus trap so Tab can't wander behind the overlay. */
  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeCart();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      /* Only restore focus if it is still inside the panel — otherwise the guest
       * has already clicked somewhere else and we'd be yanking it back. */
      const active = document.activeElement;
      if (!active || active === document.body || panelRef.current?.contains(active)) {
        restoreFocusRef.current?.focus?.();
      }
    };
  }, [isOpen, closeCart]);

  /* Freeze the page behind the overlay. LenisProvider separately stops its smooth
   * scrolling while the drawer is open; this covers touch and keyboard scrolling
   * that Lenis does not intercept. */
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);

  const handleClear = () => {
    if (window.confirm(t("cart.clearConfirm"))) clear();
  };

  return (
    <>
      {/* Overlay.
        * Never put `pointer-events-auto` in the static half of the class list:
        * Tailwind emits `.pointer-events-auto` AFTER `.pointer-events-none`, so
        * with both present auto wins regardless of the order they appear in the
        * attribute — which turns this into an invisible full-screen click trap
        * while the drawer is closed. Exactly one of the two, from the ternary. */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[600] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
        /* The panel stays mounted and slides off-screen, so without `inert` its
         * links and buttons remain tabbable and screen-reader visible while the
         * drawer is closed. */
        inert={!isOpen}
        className={`fixed top-0 right-0 z-[601] h-full w-full max-w-[440px] bg-[#EDE5D8] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Header */}
        <header className="shrink-0 flex items-start justify-between gap-4 px-6 pt-6 pb-5 border-b border-[#222E2C]/12">
          <div className="flex flex-col gap-0.5">
            <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest">
              {t("cart.eyebrow")}
            </p>
            <h2
              className="text-2xl text-[#213B2F] tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-alpina)" }}
            >
              {t("cart.title")}
            </h2>
            {count > 0 && (
              <p className="font-sans text-sm text-[#222E2C]/50 mt-0.5 tabular-nums">
                {count} {count === 1 ? t("cart.itemsOne") : t("cart.itemsMany")}
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label={t("cart.close")}
            className="shrink-0 size-9 rounded-full border border-[#222E2C]/15 flex items-center justify-center text-[#222E2C]/60 hover:bg-[#222E2C]/6 hover:text-[#222E2C] transition-colors"
          >
            <TbX size={17} />
          </button>
        </header>

        {/* Body — data-lenis-prevent stops Lenis from hijacking the wheel here */}
        <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
          {linesByService.length === 0 ? (
            <EmptyState t={t} onClose={closeCart} />
          ) : (
            <div className="flex flex-col">
              {linesByService.map(({ service, lines, subtotal: groupTotal }) => {
                const Icon = service.icon;
                const prefRows = describeServiceForm(serviceForms[service.id], t);

                return (
                  <section key={service.id} className="border-b border-[#222E2C]/10 last:border-b-0">
                    {/* Group header */}
                    <div className="flex items-center gap-2.5 px-6 pt-5 pb-3">
                      <span
                        className="size-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: service.color }}
                      >
                        <Icon size={14} className="text-[#EDE5D8]" />
                      </span>
                      <h3 className="font-sans font-semibold text-sm text-[#222E2C] flex-1 min-w-0 truncate">
                        {t(service.labelKey)}
                      </h3>
                      <span className="font-sans text-sm font-medium text-[#222E2C]/50 tabular-nums shrink-0">
                        {money(groupTotal)}
                      </span>
                    </div>

                    {/* Lines */}
                    <ul className="flex flex-col gap-1 px-4 pb-2">
                      {lines.map((line) => (
                        <LineRow
                          key={line.lineId}
                          line={line}
                          locale={locale}
                          t={t}
                          onQty={(n) => setQty(line.lineId, n)}
                          onRemove={() => removeLine(line.lineId)}
                        />
                      ))}
                    </ul>

                    {/* Preferences captured for this service — the actual answers,
                      * not just a "saved" badge, so the guest can confirm that e.g.
                      * their allergies really were recorded. */}
                    <div className="px-6 pb-5 pt-1 flex flex-col gap-2">
                      {prefRows.length > 0 && (
                        <details className="group rounded-xl bg-[#213B2F]/6 px-3 py-2">
                          <summary className="flex items-center gap-1.5 cursor-pointer list-none font-sans text-xs font-medium text-[#213B2F] marker:content-none">
                            <TbChevronRight
                              size={13}
                              className="shrink-0 transition-transform duration-200 group-open:rotate-90"
                            />
                            {t("cart.preferencesSaved")} ({prefRows.length})
                          </summary>
                          <dl className="mt-2 pt-2 border-t border-[#213B2F]/10 flex flex-col gap-1.5">
                            {prefRows.map((row) => (
                              <div key={row.key} className="flex flex-col gap-0.5">
                                <dt className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[#222E2C]/45">
                                  {row.label}
                                </dt>
                                <dd className="font-sans text-xs leading-snug text-[#222E2C]/75">
                                  {row.value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </details>
                      )}
                      <Link
                        href={service.href}
                        onClick={closeCart}
                        className="inline-flex items-center gap-1 w-fit font-sans text-xs font-medium text-[#222E2C]/50 hover:text-[#213B2F] transition-colors"
                      >
                        <TbPencil size={12} />
                        {t("cart.editPreferences")}
                      </Link>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <footer className="shrink-0 border-t border-[#222E2C]/12 bg-[#E0D4C4]/60 px-6 py-5 flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-sans font-semibold text-sm text-[#222E2C]">
                {t("cart.subtotal")}
              </span>
              <span className="font-sans font-bold text-2xl text-[#213B2F] tabular-nums">
                {money(subtotal)}
              </span>
            </div>

            <p className="font-sans text-xs leading-relaxed text-[#222E2C]/50">
              {t("cart.estimateNote")}
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Returns to the experiences without touching the cart — the whole
                * point of this button is that nothing is cleared. */}
              <Link
                href="/#experiences"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full border border-[#213B2F]/25 font-sans font-semibold text-sm text-[#213B2F] hover:bg-[#213B2F]/6 transition-colors duration-200"
              >
                <TbPlus size={15} />
                {t("cart.keepAdding")}
              </Link>

              <Link
                href="/checkout/"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full bg-[#213B2F] font-sans font-semibold text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200"
              >
                {t("cart.proceed")}
                <TbArrowRight size={16} />
              </Link>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="font-sans text-xs text-[#222E2C]/45 hover:text-[#222E2C]/80 transition-colors self-center"
            >
              {t("cart.clear")}
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}

function LineRow({ line, locale, t, onQty, onRemove }) {
  const caption = describeLine(line, locale);

  return (
    <li className="rounded-xl bg-white/60 px-4 py-3.5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex flex-col gap-0.5">
          <p className="font-sans font-medium text-sm text-[#222E2C] leading-snug">{line.title}</p>
          {caption && (
            <p className="font-sans text-xs text-[#222E2C]/50 leading-snug">{caption}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${t("cart.remove")} — ${line.title}`}
          className="shrink-0 size-7 rounded-full flex items-center justify-center text-[#222E2C]/35 hover:text-red-700 hover:bg-red-700/8 transition-colors"
        >
          <TbTrash size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <QtyStepper
          value={line.qty}
          onChange={onQty}
          min={0}
          size="sm"
          tone="light"
          label={`${t("cart.quantity")} — ${line.title}`}
        />
        <div className="flex flex-col items-end leading-tight">
          <span className="font-sans font-semibold text-sm text-[#222E2C] tabular-nums">
            {money(line.lineTotal)}
          </span>
          {line.qty > 1 && (
            <span className="font-sans text-[11px] text-[#222E2C]/40 tabular-nums">
              {money(line.unitPrice)} {t("cart.each")}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function EmptyState({ t, onClose }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-4 px-8 py-16">
      <span className="size-14 rounded-full bg-[#222E2C]/6 flex items-center justify-center">
        <TbShoppingBag size={24} className="text-[#222E2C]/30" />
      </span>
      <p className="font-sans font-medium text-base text-[#222E2C]">{t("cart.empty")}</p>
      <p className="font-sans text-sm text-[#222E2C]/50 leading-relaxed max-w-[28ch]">
        {t("cart.emptyHint")}
      </p>
      <Link
        href="/#experiences"
        onClick={onClose}
        className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#213B2F]/25 font-sans text-sm font-medium text-[#213B2F] hover:bg-[#213B2F]/6 transition-colors"
      >
        {t("cart.browse")}
        <TbArrowRight size={15} />
      </Link>
    </div>
  );
}
