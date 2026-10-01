"use client";

import Link from "next/link";
import { TbArrowLeft, TbShoppingBag, TbArrowRight, TbPencil, TbTrash } from "react-icons/tb";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/app/context/CartContext";
import { useI18n } from "@/app/context/I18nContext";
import { money, describeLine } from "@/lib/format";
import { describeServiceForm } from "@/lib/serviceForm";
import QtyStepper from "@/components/ui/QtyStepper";

/*
 * Order review. The guest-details form and the single submit land here in the
 * next phase — see docs/ORDERS-BACKEND.md for the payload this page will build.
 */

export default function CheckoutPage() {
  const { linesByService, subtotal, count, setQty, removeLine, serviceForms, hydrated } = useCart();
  const { t, locale } = useI18n();

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="px-8 md:px-16 pt-8 pb-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 w-fit mb-3 text-sm font-sans font-medium text-[#222E2C]/50 hover:text-[#222E2C] transition-colors duration-200"
          >
            <TbArrowLeft size={16} />
            {t("common.back")}
          </Link>
          <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
            {t("checkout.eyebrow")}
          </p>
          <h1
            className="text-4xl md:text-5xl text-[#213B2F] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-alpina)" }}
          >
            {t("checkout.title")}
          </h1>
          <p className="font-sans text-sm text-[#222E2C]/55 mt-2 max-w-2xl leading-relaxed">
            {t("checkout.subtitle")}
          </p>
        </div>

        <div className="px-8 md:px-16 pb-24">
          {/* `hydrated` keeps the prerendered HTML from flashing the empty state
              before sessionStorage has been read. */}
          {!hydrated ? (
            <div className="h-64" />
          ) : count === 0 ? (
            <EmptyState t={t} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start max-w-6xl">
              {/* Review */}
              <div className="flex flex-col gap-4">
                <h2 className="font-sans font-semibold text-lg text-[#222E2C] tracking-tight pb-3 border-b border-[#222E2C]/15">
                  {t("checkout.yourOrder")}
                </h2>

                {linesByService.map(({ service, lines, subtotal: groupTotal }) => {
                  const Icon = service.icon;
                  const prefRows = describeServiceForm(serviceForms[service.id], t);

                  return (
                    <section key={service.id} className="rounded-2xl bg-white/60 border border-[#222E2C]/8 overflow-hidden">
                      <div
                        className="flex items-center gap-3 px-5 py-3.5"
                        style={{ backgroundColor: `${service.color}12` }}
                      >
                        <span
                          className="size-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: service.color }}
                        >
                          <Icon size={15} className="text-[#EDE5D8]" />
                        </span>
                        <h3 className="font-sans font-semibold text-sm text-[#222E2C] flex-1 min-w-0">
                          {t(service.labelKey)}
                        </h3>
                        <Link
                          href={service.href}
                          className="inline-flex items-center gap-1 font-sans text-xs font-medium text-[#222E2C]/55 hover:text-[#213B2F] transition-colors shrink-0"
                        >
                          <TbPencil size={12} />
                          {t("cart.editPreferences")}
                        </Link>
                        <span className="font-sans font-semibold text-sm text-[#222E2C] tabular-nums shrink-0 ml-1">
                          {money(groupTotal)}
                        </span>
                      </div>

                      <ul className="divide-y divide-[#222E2C]/8">
                        {lines.map((line) => {
                          const caption = describeLine(line, locale);
                          return (
                            <li key={line.lineId} className="px-5 py-4 flex flex-wrap items-center gap-4">
                              <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                                <p className="font-sans font-medium text-sm text-[#222E2C] leading-snug">
                                  {line.title}
                                </p>
                                {caption && (
                                  <p className="font-sans text-xs text-[#222E2C]/50">{caption}</p>
                                )}
                              </div>

                              <QtyStepper
                                value={line.qty}
                                onChange={(n) => setQty(line.lineId, n)}
                                min={0}
                                size="sm"
                                tone="light"
                                label={`${t("cart.quantity")} — ${line.title}`}
                              />

                              <div className="flex flex-col items-end leading-tight w-20 shrink-0">
                                <span className="font-sans font-semibold text-sm text-[#222E2C] tabular-nums">
                                  {money(line.lineTotal)}
                                </span>
                                {line.qty > 1 && (
                                  <span className="font-sans text-[11px] text-[#222E2C]/40 tabular-nums">
                                    {money(line.unitPrice)} {t("cart.each")}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => removeLine(line.lineId)}
                                aria-label={`${t("cart.remove")} — ${line.title}`}
                                className="shrink-0 size-8 rounded-full flex items-center justify-center text-[#222E2C]/30 hover:text-red-700 hover:bg-red-700/8 transition-colors"
                              >
                                <TbTrash size={15} />
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {prefRows.length > 0 && (
                        <div className="px-5 py-4 border-t border-[#222E2C]/8 bg-[#222E2C]/3">
                          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#222E2C]/40 mb-3">
                            {t("cart.formLabels.preferencesHeading")}
                          </p>
                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                            {prefRows.map((row) => (
                              <div key={row.key} className="flex flex-col gap-0.5 min-w-0">
                                <dt className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[#222E2C]/45">
                                  {row.label}
                                </dt>
                                <dd className="font-sans text-sm leading-snug text-[#222E2C]/75 break-words">
                                  {row.value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>

              {/* Totals */}
              <aside className="lg:sticky lg:top-28 rounded-2xl bg-[#213B2F] px-6 py-6 flex flex-col gap-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-sans font-semibold text-sm text-[#D8DDB8]">
                    {t("cart.subtotal")}
                  </span>
                  <span className="font-sans font-bold text-3xl text-[#EDE5D8] tabular-nums">
                    {money(subtotal)}
                  </span>
                </div>
                <p className="font-sans text-sm text-[#D8DDB8]/60 tabular-nums">
                  {count} {count === 1 ? t("cart.itemsOne") : t("cart.itemsMany")}
                </p>
                <div className="h-px bg-[#D8DDB8]/15" />
                <p className="font-sans text-xs leading-relaxed text-[#D8DDB8]/60">
                  {t("cart.estimateNote")}
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function EmptyState({ t }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-24">
      <span className="size-16 rounded-full bg-[#222E2C]/6 flex items-center justify-center">
        <TbShoppingBag size={28} className="text-[#222E2C]/30" />
      </span>
      <p className="font-sans font-medium text-lg text-[#222E2C]">{t("checkout.empty")}</p>
      <Link
        href="/#experiences"
        className="mt-1 inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-[#213B2F] font-sans text-sm font-medium text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors"
      >
        {t("checkout.emptyCta")}
        <TbArrowRight size={15} />
      </Link>
    </div>
  );
}
