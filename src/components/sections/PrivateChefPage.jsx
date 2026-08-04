"use client";

import Link from "next/link";
import { useI18n } from "@/app/context/I18nContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import {
  TbArrowLeft, TbLeaf, TbCircleCheck, TbBrandWhatsapp,
  TbPlant2, TbFlame, TbSoup, TbSeedling, TbFish,
} from "react-icons/tb";

const WHATSAPP = "50685011042";

export default function PrivateChefPage() {
  const { t } = useI18n();

  const breakfastItems  = t("privateChef.breakfast.items");
  const breakfastExtras = t("privateChef.breakfast.extras");
  const lunchItems      = t("privateChef.lunch.items");
  const dinnerItems     = t("privateChef.dinner.items");
  const dessertsItems   = t("privateChef.desserts.items");
  const bakeryItems     = t("privateChef.bakery.items");
  const themedNights    = t("privateChef.themedNights.nights");
  const pricingPS       = t("privateChef.pricing.perService.items");
  const pricingTN       = t("privateChef.pricing.themedNights.items");
  const pricingBar      = t("privateChef.pricing.bartender.items");

  return (
    <>
      <Navbar />
      <main className="pt-24">

        {/* Header */}
        <div className="px-8 md:px-16 pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1" data-aos="fade-up">
            <Link
              href="/"
              className="flex items-center gap-1.5 w-fit mb-3 text-sm font-sans font-medium text-[#222E2C]/50 hover:text-[#222E2C] transition-colors duration-200"
            >
              <TbArrowLeft size={16} />
              {t("common.back")}
            </Link>
            <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-4 py-2 mb-3">
              <TbLeaf size={15} className="text-[#222E2C]" />
              <span className="font-sans text-sm text-[#222E2C]">{t("privateChef.pill")}</span>
            </div>
            <h1
              className="text-4xl md:text-5xl text-[#213B2F] tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-alpina)" }}
            >
              {t("privateChef.title")}
            </h1>
            <p className="font-sans text-sm text-[#222E2C]/50 mt-1">{t("privateChef.subtitle")}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-200 shrink-0 w-fit"
          >
            <TbBrandWhatsapp size={16} />
            {t("privateChef.whatsapp")}
          </a>
        </div>

        <div className="px-8 md:px-16 flex flex-col gap-16 pb-24">

          {/* Story */}
          <div className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col gap-4" data-aos="fade-up">
            <TbLeaf size={22} className="text-[#D8DDB8]/50" />
            <h2 className="font-sans font-semibold text-lg text-[#D8DDB8]">
              {t("privateChef.story.heading")}
            </h2>
            <p className="font-sans text-sm text-[#D8DDB8]/70 leading-relaxed whitespace-pre-line max-w-3xl">
              {t("privateChef.story.body")}
            </p>
          </div>

          {/* Breakfast */}
          <MenuSection
            heading={t("privateChef.breakfast.heading")}
            subheading={t("privateChef.breakfast.subheading")}
            items={Array.isArray(breakfastItems) ? breakfastItems : []}
            note={t("privateChef.breakfast.note")}
            extras={Array.isArray(breakfastExtras) ? breakfastExtras : []}
            extrasHeading={t("privateChef.breakfast.extrasHeading")}
            extrasSubheading={t("privateChef.breakfast.extrasSubheading")}
          />

          {/* Lunch */}
          <MenuSection
            heading={t("privateChef.lunch.heading")}
            subheading={t("privateChef.lunch.subheading")}
            items={Array.isArray(lunchItems) ? lunchItems : []}
          />

          {/* Dinner */}
          <MenuSection
            heading={t("privateChef.dinner.heading")}
            subheading={t("privateChef.dinner.subheading")}
            items={Array.isArray(dinnerItems) ? dinnerItems : []}
          />

          {/* Themed Nights */}
          <div className="flex flex-col gap-6" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {t("privateChef.themedNights.subheading")}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("privateChef.themedNights.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">
                {t("privateChef.themedNights.description")}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {Array.isArray(themedNights) && themedNights.map((night, i) => (
                <ThemedNightCard key={i} night={night} colorIndex={i} />
              ))}
            </div>
          </div>

          {/* Desserts + Bakery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16" data-aos="fade-up">
            <SimpleMenuSection
              heading={t("privateChef.desserts.heading")}
              subheading={t("privateChef.desserts.subheading")}
              items={Array.isArray(dessertsItems) ? dessertsItems : []}
            />
            <SimpleMenuSection
              heading={t("privateChef.bakery.heading")}
              subheading={t("privateChef.bakery.subheading")}
              items={Array.isArray(bakeryItems) ? bakeryItems : []}
            />
          </div>

          {/* Pricing */}
          <div className="flex flex-col gap-8" data-aos="fade-up">
            <div className="border-b border-[#222E2C]/15 pb-4">
              <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
                {t("privateChef.pricing.subheading")}
              </p>
              <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
                {t("privateChef.pricing.heading")}
              </h2>
              <p className="font-sans text-sm text-[#222E2C]/50 mt-2 max-w-2xl">
                {t("privateChef.pricing.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="font-sans font-semibold text-base text-[#222E2C]">
                    {t("privateChef.pricing.perService.heading")}
                  </h3>
                  <p className="font-sans text-xs text-[#222E2C]/50 mt-0.5">
                    {t("privateChef.pricing.perService.subheading")}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {Array.isArray(pricingPS) && pricingPS.map((item, i) => (
                    <PriceRow key={i} label={item.label} price={item.price} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="font-sans font-semibold text-base text-[#222E2C]">
                    {t("privateChef.pricing.themedNights.heading")}
                  </h3>
                  <p className="font-sans text-xs text-[#222E2C]/50 mt-0.5">
                    {t("privateChef.pricing.themedNights.subheading")}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {Array.isArray(pricingTN) && pricingTN.map((item, i) => (
                    <PriceRow key={i} label={item.label} price={item.price} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-sans font-semibold text-base text-[#222E2C]">
                {t("privateChef.pricing.bartender.heading")}
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                {Array.isArray(pricingBar) && pricingBar.map((item, i) => (
                  <PriceRow key={i} label={item.label} price={item.price} />
                ))}
              </div>
            </div>

            <p className="font-sans text-xs text-[#222E2C]/40 italic">
              {t("privateChef.pricing.note")}
            </p>
          </div>

          {/* Bottom CTA */}
          <div
            className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            data-aos="fade-up"
          >
            <div className="flex flex-col gap-1.5">
              <h2 className="font-sans font-semibold text-xl text-[#D8DDB8]">
                {t("privateChef.ctaHeading")}
              </h2>
              <p className="font-sans text-sm text-[#D8DDB8]/60">
                {t("privateChef.ctaSubheading")}
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#D8DDB8] font-sans font-medium text-sm text-[#213B2F] hover:bg-[#D8DDB8]/90 transition-colors duration-200 shrink-0"
            >
              <TbBrandWhatsapp size={16} />
              {t("privateChef.whatsapp")}
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function MenuSection({ heading, subheading, items, note, extras, extrasHeading, extrasSubheading }) {
  return (
    <div className="flex flex-col gap-5" data-aos="fade-up">
      <div className="border-b border-[#222E2C]/15 pb-4">
        <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
          {subheading}
        </p>
        <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
          {heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <div key={i} className="bg-[#E0D4C4] rounded-xl px-5 py-5 flex flex-col gap-2">
            {item.tag && (
              <span className="inline-flex w-fit items-center gap-1 bg-[#213B2F]/10 text-[#213B2F] text-xs font-semibold px-2.5 py-1 rounded-full">
                🇨🇷 {item.tag}
              </span>
            )}
            <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{item.title}</h3>
            <p className="font-sans text-sm text-[#222E2C]/60 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
      {note && (
        <p className="font-sans text-sm text-[#222E2C]/50 italic">{note}</p>
      )}
      {extras && extras.length > 0 && (
        <div className="flex flex-col gap-3 pt-2">
          <div>
            <p className="font-sans font-semibold text-sm text-[#222E2C]">{extrasHeading}</p>
            {extrasSubheading && (
              <p className="font-sans text-xs text-[#222E2C]/50 mt-0.5">{extrasSubheading}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {extras.map((extra, i) => (
              <div key={i} className="border border-[#222E2C]/10 rounded-xl px-4 py-3.5 flex flex-col gap-1 flex-1">
                <p className="font-sans font-semibold text-sm text-[#222E2C]">{extra.title}</p>
                <p className="font-sans text-xs text-[#222E2C]/55 leading-relaxed">{extra.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleMenuSection({ heading, subheading, items }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-[#222E2C]/15 pb-3">
        <p className="font-sans text-xs font-semibold text-[#222E2C]/40 uppercase tracking-widest mb-1">
          {subheading}
        </p>
        <h2 className="font-sans font-semibold text-lg text-[#222E2C] tracking-tight">{heading}</h2>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-1">
            <h3 className="font-sans font-semibold text-sm text-[#222E2C]">{item.title}</h3>
            <p className="font-sans text-sm text-[#222E2C]/60 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Each night: bg color + two text tiers (title solid, body readable) + border + icon
const NIGHT_THEMES = [
  // Garden Taco — dark olive (light text)
  { bg: "#4B4D40", title: "#EDE5D8", body: "rgba(237,229,216,0.88)", subtle: "rgba(237,229,216,0.72)", border: "rgba(237,229,216,0.25)", icon: TbPlant2 },
  // Smokehouse — dark warm brown (light peach text)
  { bg: "#59493B", title: "#FFEAD8", body: "rgba(255,234,216,0.88)", subtle: "rgba(255,234,216,0.72)", border: "rgba(255,234,216,0.25)", icon: TbFlame },
  // Tico Dinner — warm terracotta (dark text)
  { bg: "#A5886D", title: "#3D1A08", body: "rgba(61,26,8,0.82)", subtle: "rgba(61,26,8,0.65)", border: "rgba(61,26,8,0.20)", icon: TbSoup },
  // Vegan — deep forest green (light text)
  { bg: "#345B49", title: "#EDEFDF", body: "rgba(237,239,223,0.88)", subtle: "rgba(237,239,223,0.72)", border: "rgba(237,239,223,0.25)", icon: TbSeedling },
  // Ocean Dinner — coastal sage-olive (dark text)
  { bg: "#8C8F77", title: "#1E2312", body: "rgba(30,35,18,0.82)", subtle: "rgba(30,35,18,0.65)", border: "rgba(30,35,18,0.20)", icon: TbFish },
];

function ThemedNightCard({ night, colorIndex = 0 }) {
  const theme = NIGHT_THEMES[colorIndex] ?? NIGHT_THEMES[0];
  const Icon = theme.icon;
  return (
    <div style={{ backgroundColor: theme.bg }} className="rounded-2xl px-6 py-7 flex flex-col md:flex-row gap-6">
      {/* Left: icon + title block */}
      <div className="md:w-56 shrink-0 flex flex-col gap-3">
        <Icon size={26} style={{ color: theme.subtle }} />
        <div>
          <h3 className="font-sans font-semibold text-lg" style={{ color: theme.title }}>{night.title}</h3>
          <p className="font-sans text-sm mt-1" style={{ color: theme.body }}>{night.subtitle}</p>
          {night.description && (
            <p className="font-sans text-sm mt-2" style={{ color: theme.body }}>{night.description}</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ backgroundColor: theme.border }} className="w-full h-px md:w-px md:h-auto md:self-stretch" />

      {/* Right: includes + dessert */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {night.includes.map((item, i) => (
            <div
              key={i}
              style={{ borderColor: theme.border }}
              className="flex items-center gap-1.5 border rounded-full px-2.5 py-1"
            >
              <TbCircleCheck size={12} style={{ color: theme.subtle }} className="shrink-0" />
              <span className="font-sans text-xs font-medium" style={{ color: theme.body }}>{item}</span>
            </div>
          ))}
        </div>
        {night.dessert && (
          <div style={{ borderTopColor: theme.border }} className="border-t pt-3 mt-auto">
            <p className="font-sans text-sm" style={{ color: theme.body }}>
              <span className="font-semibold" style={{ color: theme.title }}>Dessert: </span>
              {night.dessert}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PriceRow({ label, price }) {
  return (
    <div className="bg-[#E0D4C4] rounded-xl px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 flex-1">
      <span className="font-sans text-sm text-[#222E2C]/70">{label}</span>
      <span className="font-sans font-semibold text-sm text-[#222E2C] sm:whitespace-nowrap">{price}</span>
    </div>
  );
}
