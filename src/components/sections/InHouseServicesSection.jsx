"use client";

import { TbSparkles, TbCircleCheck, TbArrowRight } from "react-icons/tb";
import { useI18n } from "@/app/context/I18nContext";
import Link from "next/link";

function ServiceCard({ category, title, description, features = [], href, cta }) {
  const content = (
    <div className={`bg-[#E0D4C4] rounded-2xl px-8 py-11 flex flex-col gap-0 h-full${href ? " hover:bg-[#D8CCBB] transition-colors duration-200" : ""}`}>
      <div className="border-b border-[#222E2C]/10 pb-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="font-sans font-semibold text-base text-[#222E2C]/60">{category}</p>
          <p className="font-sans font-medium text-xl text-[#222E2C]">{title}</p>
        </div>
        <p className="font-sans text-sm text-[#222E2C]/50 leading-relaxed">{description}</p>
      </div>
      <div className="pt-5 flex flex-wrap gap-2 flex-1">
        {features.map((feat, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border border-[#222E2C]/10 rounded-full px-3 py-2"
          >
            <TbCircleCheck size={18} className="text-[#222E2C]/50 shrink-0" />
            <span className="font-sans font-medium text-base text-[#222E2C]/50 whitespace-nowrap">{feat}</span>
          </div>
        ))}
      </div>
      {href && cta && (
        <div className="pt-6 mt-auto">
          <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-sm text-[#222E2C]">
            {cta}
            <TbArrowRight size={15} />
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="h-full">{content}</Link>;
  }
  return content;
}

export default function InHouseServicesSection() {
  const { t } = useI18n();
  const services = t("inhouse.services");

  return (
    <section className="flex flex-col px-8 md:px-16 pb-24 gap-16">

      <div className="flex flex-col gap-5" data-aos="fade-up">
        <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-4 py-2">
          <TbSparkles size={16} className="text-[#222E2C]" />
          <span className="font-sans text-base text-[#222E2C]">{t("inhouse.pill")}</span>
        </div>
        <h2
          className="text-4xl md:text-5xl text-[#222E2C] tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-alpina)" }}
        >
          {t("inhouse.title")}
        </h2>
      </div>

      {Array.isArray(services) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {services.map((svc, i) => (
            <ServiceCard key={i} {...svc} />
          ))}
        </div>
      )}

    </section>
  );
}
