"use client";

import { useState } from "react";
import { TbPhone, TbChevronDown } from "react-icons/tb";
import { useI18n } from "@/app/context/I18nContext";

const VISIBLE_COUNT = 7; // 1 featured + 6 in grid (2 full rows of 3)

function FeaturedCard({ title, subtitle, rows }) {
  return (
    <div className="bg-[#213B2F] rounded-2xl px-8 md:px-12 py-10 flex flex-col md:flex-row md:items-start gap-8 md:gap-16 w-full">
      <div className="flex flex-col gap-3 md:max-w-xs shrink-0">
        <p className="font-sans font-semibold text-2xl text-white/90 leading-snug">{title}</p>
        {subtitle && (
          <p className="font-sans text-sm text-white/50 leading-relaxed">{subtitle}</p>
        )}
      </div>
      <div className="flex flex-col gap-3 w-full">
        {(rows || []).map((row, i) => {
          const number = row.label.replace(":", "").trim();
          const href = `tel:${number}`;
          return (
            <a
              key={i}
              href={href}
              className="flex items-center gap-4 group"
            >
              <span className="bg-white/10 group-hover:bg-white/20 transition-colors duration-200 rounded-xl w-16 h-12 flex items-center justify-center shrink-0">
                <span className="font-sans font-bold text-lg text-white tracking-tight">{number}</span>
              </span>
              <span className="font-sans text-base text-white/70 group-hover:text-white/90 transition-colors duration-200 leading-snug">
                {row.value}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function ContactCard({ title, subtitle, rows }) {
  return (
    <div className="bg-[#222E2C]/[0.04] border border-[#222E2C]/20 rounded-2xl px-8 py-10 flex flex-col gap-0">
      <div className="border-b border-black/10 pb-5 flex flex-col gap-4">
        <p className="font-sans font-medium text-xl text-[#222E2C] leading-snug">{title}</p>
        {subtitle && (
          <p className="font-sans text-base text-[#222E2C]/50 leading-normal">{subtitle}</p>
        )}
      </div>
      <div className="pt-5 flex flex-col gap-3">
        {(rows || []).map((row, i) => {
          const isWhatsApp = row.label.toLowerCase().includes("whatsapp");
          const isPhone = row.label.toLowerCase().includes("phone") ||
                          row.label.toLowerCase().includes("teléfono") ||
                          isWhatsApp ||
                          /^\d{3}:/.test(row.label);
          const href = isWhatsApp
            ? `https://wa.me/${row.value.replace(/\D/g, "")}`
            : `tel:${row.value.split("/")[0].replace(/\s/g, "")}`;
          return (
            <div key={i} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-sans text-base tracking-tight">
              <span className="font-semibold text-[#222E2C] shrink-0">{row.label}</span>
              {isPhone ? (
                <span className="flex flex-col gap-0.5">
                  <a href={href} className="text-[#222E2C]/50 hover:text-[#222E2C] transition-colors duration-200">
                    {row.value}
                  </a>
                  {isWhatsApp && (
                    <span className="text-xs text-[#213B2F]/60 font-medium">↗ click to WhatsApp</span>
                  )}
                </span>
              ) : (
                <span className="text-[#222E2C]/50">{row.value}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EmergencyContactsSection() {
  const { t } = useI18n();
  const contacts = t("emergency.contacts");
  const [expanded, setExpanded] = useState(false);

  const featured = Array.isArray(contacts) ? contacts[0] : null;
  const visible  = Array.isArray(contacts) ? contacts.slice(1, VISIBLE_COUNT) : [];
  const hidden   = Array.isArray(contacts) ? contacts.slice(VISIBLE_COUNT) : [];

  return (
    <section id="emergencias" className="flex flex-col px-8 md:px-16 pb-24 gap-16">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6" data-aos="fade-up">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-3 py-1.5">
            <TbPhone size={14} className="text-[#222E2C]/60" />
            <span className="font-sans text-xs text-[#222E2C]/60 tracking-wide">
              {t("emergency.pill")}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl text-[#222E2C] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-alpina)" }}
          >
            {t("emergency.title")}
          </h2>
        </div>
        <p className="font-sans text-base text-[#222E2C]/50 leading-relaxed max-w-lg">
          {t("emergency.description")}
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">

        {/* Featured full-width card */}
        {featured && <FeaturedCard {...featured} />}

        {/* Visible grid — 6 cards = 2 full rows of 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {visible.map((c, i) => (
            <ContactCard key={i} {...c} />
          ))}
        </div>

        {/* Peek + expand */}
        {hidden.length > 0 && (
          <div className="relative">
            {/* Peeking hidden cards */}
            <div
              className="overflow-hidden transition-all duration-700 ease-in-out"
              style={{ maxHeight: expanded ? "2000px" : "130px" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {hidden.map((c, i) => (
                  <ContactCard key={i} {...c} />
                ))}
              </div>
            </div>

            {/* Gradient + button */}
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-5 transition-opacity duration-500"
              style={{
                height: expanded ? 0 : "180px",
                opacity: expanded ? 0 : 1,
                pointerEvents: expanded ? "none" : "auto",
                background: "linear-gradient(to bottom, transparent 0%, rgba(237,229,216,0.7) 45%, #EDE5D8 80%)",
              }}
            >
              <button
                onClick={() => setExpanded(true)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#213B2F] font-sans font-semibold text-sm text-[#D8DDB8] shadow-lg hover:bg-[#213B2F]/90 transition-all duration-300"
              >
                {t("emergency.seeMore") || "See more contacts"}
                <TbChevronDown size={16} />
              </button>
            </div>
          </div>
        )}

        {/* See less */}
        {hidden.length > 0 && expanded && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setExpanded(false)}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#222E2C]/20 font-sans font-medium text-sm text-[#222E2C]/60 hover:text-[#222E2C] hover:border-[#222E2C]/40 transition-all duration-300"
            >
              {t("emergency.seeLess") || "See less"}
              <TbChevronDown size={16} className="rotate-180" />
            </button>
          </div>
        )}

      </div>

    </section>
  );
}
