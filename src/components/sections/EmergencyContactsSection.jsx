"use client";

import { TbPhone } from "react-icons/tb";
import { useI18n } from "@/app/context/I18nContext";

function ContactCard({ title, subtitle, rows }) {
  return (
    <div className="bg-[#381d14]/[0.04] border border-[#381d14]/20 rounded-2xl px-8 py-10 flex flex-col gap-0">
      <div className="border-b border-black/10 pb-5 flex flex-col gap-4">
        <p className="font-sans font-medium text-xl text-[#381d14] leading-snug">{title}</p>
        {subtitle && (
          <p className="font-sans text-base text-[#381d14]/50 leading-normal">{subtitle}</p>
        )}
      </div>
      <div className="pt-5 flex flex-col gap-3">
        {(rows || []).map((row, i) => {
          const isPhone = row.label.toLowerCase().includes("phone") ||
                          row.label.toLowerCase().includes("teléfono") ||
                          row.label.toLowerCase().includes("whatsapp") ||
                          /^\d{3}:/.test(row.label);
          const cleanNumber = row.value.replace(/[^0-9+\-/\s]/g, "").trim();
          const href = row.label.toLowerCase().includes("whatsapp")
            ? `https://wa.me/${row.value.replace(/\D/g, "")}`
            : `tel:${row.value.split("/")[0].replace(/\s/g, "")}`;
          return (
            <div key={i} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-sans text-base tracking-tight">
              <span className="font-semibold text-[#381d14] shrink-0">{row.label}</span>
              {isPhone ? (
                <a href={href} className="text-[#381d14]/50 hover:text-[#381d14] transition-colors duration-200">
                  {row.value}
                </a>
              ) : (
                <span className="text-[#381d14]/50">{row.value}</span>
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

  return (
    <section id="emergencias" className="flex flex-col px-8 md:px-16 pb-24 gap-16">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6" data-aos="fade-up">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 w-fit border border-[#381d14]/20 rounded-full px-3 py-1.5">
            <TbPhone size={14} className="text-[#381d14]/60" />
            <span className="font-sans text-xs text-[#381d14]/60 tracking-wide">
              {t("emergency.pill")}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl text-[#381d14] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-alpina)" }}
          >
            {t("emergency.title")}
          </h2>
        </div>
        <p className="font-sans text-base text-[#381d14]/50 leading-relaxed max-w-lg">
          {t("emergency.description")}
        </p>
      </div>

      {/* Grid */}
      {Array.isArray(contacts) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {contacts.map((c, i) => (
            <ContactCard key={i} {...c} />
          ))}
        </div>
      )}

    </section>
  );
}
