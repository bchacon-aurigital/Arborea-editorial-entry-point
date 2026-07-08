"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import { TbArrowLeft, TbLeaf, TbCheck, TbBrandWhatsapp } from "react-icons/tb";

const WHATSAPP = "50685011042";

export default function FullFridgePage() {
  const { t } = useI18n();
  const router = useRouter();

  const produceCategories = t("fullFridge.produce.categories");
  const steps             = t("fullFridge.howItWorks.steps");
  const beverages         = t("fullFridge.beverages.items");
  const pricingColumns    = t("fullFridge.pricing.columns");
  const pricingRows       = t("fullFridge.pricing.rows");

  return (
    <>
      <Navbar />
      <main className="pt-24">

        {/* Header */}
        <div className="px-8 md:px-16 pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1" data-aos="fade-up">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 w-fit mb-3 text-sm font-sans font-medium text-[#222E2C]/50 hover:text-[#222E2C] transition-colors duration-200"
            >
              <TbArrowLeft size={16} />
              {t("common.back")}
            </button>
            <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-4 py-2 mb-3">
              <TbLeaf size={15} className="text-[#222E2C]" />
              <span className="font-sans text-sm text-[#222E2C]">{t("fullFridge.pill")}</span>
            </div>
            <h1
              className="text-4xl md:text-5xl text-[#213B2F] tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-alpina)" }}
            >
              {t("fullFridge.title")}
            </h1>
            <p className="font-sans text-sm text-[#222E2C]/50 mt-1">{t("fullFridge.subtitle")}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200 shrink-0 w-fit"
          >
            <TbBrandWhatsapp size={16} />
            {t("fullFridge.whatsapp")}
          </a>
        </div>

        <div className="px-8 md:px-16 flex flex-col gap-16 pb-24">

          {/* Concept */}
          <div className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col gap-4" data-aos="fade-up">
            <TbLeaf size={22} className="text-[#D8DDB8]/50" />
            <h2 className="font-sans font-semibold text-lg text-[#D8DDB8]">
              {t("fullFridge.concept.heading")}
            </h2>
            <p className="font-sans text-sm text-[#D8DDB8]/70 leading-relaxed whitespace-pre-line max-w-3xl">
              {t("fullFridge.concept.body")}
            </p>
          </div>

          {/* How it works */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.howItWorks.heading")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.isArray(steps) && steps.map((step, i) => (
                <div key={i} className="bg-[#E0D4C4] rounded-2xl px-6 py-7 flex flex-col gap-4">
                  <div className="size-9 rounded-full bg-[#213B2F] flex items-center justify-center shrink-0">
                    <span className="font-sans font-semibold text-sm text-[#D8DDB8]">{i + 1}</span>
                  </div>
                  <h3 className="font-sans font-semibold text-base text-[#222E2C]">{step.title}</h3>
                  <p className="font-sans text-sm text-[#222E2C]/60 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's in the fridge */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.produce.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-1">
                {t("fullFridge.produce.subheading")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.isArray(produceCategories) && produceCategories.map((cat, i) => (
                <div key={i} className="bg-[#E0D4C4] rounded-2xl px-6 py-6 flex flex-col gap-3">
                  <h3 className="font-sans font-semibold text-base text-[#222E2C]">{cat.title}</h3>
                  <div className="flex flex-col gap-2">
                    {cat.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <TbCheck size={14} className="text-[#222E2C]/40 shrink-0 mt-0.5" />
                        <span className="font-sans text-sm text-[#222E2C]/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Pricing */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {t("fullFridge.pricing.subheading")}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.pricing.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">
                {t("fullFridge.pricing.description")}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr>
                    <th className="text-left pb-3 pr-4 font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-wider" />
                    {Array.isArray(pricingColumns) && pricingColumns.map((col, i) => (
                      <th key={i} className="text-left pb-3 px-3 font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-wider whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(pricingRows) && pricingRows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-[#E0D4C4]" : "bg-[#E0D4C4]/50"}>
                      <td className="rounded-l-xl py-3.5 pl-4 pr-4 font-sans font-semibold text-sm text-[#222E2C] whitespace-nowrap">
                        {row.label}
                      </td>
                      {row.prices.map((price, j) => (
                        <td key={j} className={`py-3.5 px-3 font-sans text-sm text-[#222E2C]/70${j === row.prices.length - 1 ? " rounded-r-xl" : ""}`}>
                          {price}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-sans text-xs text-[#222E2C]/40 italic">{t("fullFridge.pricing.note")}</p>
          </div>

          {/* Optional Beverages */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.beverages.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-1">
                {t("fullFridge.beverages.subheading")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.isArray(beverages) && beverages.map((item, i) => (
                <div key={i} className="bg-[#E0D4C4] rounded-xl px-5 py-5 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-sans font-semibold text-sm text-[#222E2C]">{item.title}</p>
                    {item.description && (
                      <p className="font-sans text-xs text-[#222E2C]/55">{item.description}</p>
                    )}
                  </div>
                  <span className="font-sans font-semibold text-sm text-[#222E2C] whitespace-nowrap shrink-0">{item.price}</span>
                </div>
              ))}
            </div>
            <p className="font-sans text-xs text-[#222E2C]/50 italic">{t("fullFridge.beverages.note")}</p>
          </div>

          {/* About Seguras Farm Shop */}
          <div className="flex flex-col gap-5" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("fullFridge.farm.heading")}
              </h2>
            </div>
            <p className="font-sans text-base text-[#222E2C]/60 leading-relaxed whitespace-pre-line max-w-3xl">
              {t("fullFridge.farm.body")}
            </p>
          </div>

          {/* Bottom CTA */}
          <div
            className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            data-aos="fade-up"
          >
            <div className="flex flex-col gap-1.5">
              <h2 className="font-sans font-semibold text-xl text-[#D8DDB8]">
                {t("fullFridge.ctaHeading")}
              </h2>
              <p className="font-sans text-sm text-[#D8DDB8]/60">
                {t("fullFridge.ctaSubheading")}
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#D8DDB8] font-sans font-medium text-sm text-[#213B2F] hover:bg-[#D8DDB8]/90 transition-colors duration-200 shrink-0"
            >
              <TbBrandWhatsapp size={16} />
              {t("fullFridge.whatsapp")}
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
