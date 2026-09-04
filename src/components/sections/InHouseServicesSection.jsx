"use client";

import { TbSparkles, TbPhoto, TbArrowRight } from "react-icons/tb";
import { useI18n } from "@/app/context/I18nContext";
import Link from "next/link";

function ServiceCard({ category, title, description, image, href, cta }) {
  const content = (
    <div className={`bg-[#E0D4C4] rounded-2xl overflow-hidden flex flex-col h-full${href ? " hover:bg-[#D8CCBB] transition-colors duration-200" : ""}`}>
      <div className="h-56 bg-[#222E2C]/5 flex items-center justify-center shrink-0 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <TbPhoto size={26} className="text-[#222E2C]/20" />
        )}
      </div>
      <div className="px-6 py-6 flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1.5">
          <p className="font-sans font-semibold text-sm text-[#222E2C]/60">{category}</p>
          <p className="font-sans font-medium text-lg text-[#222E2C]">{title}</p>
        </div>
        <p className="font-sans text-sm text-[#222E2C]/50 leading-relaxed">{description}</p>
        {href && cta && (
          <div className="pt-2 mt-auto">
            <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-sm text-[#222E2C]">
              {cta}
              <TbArrowRight size={15} />
            </span>
          </div>
        )}
      </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {services.map((svc, i) => (
            <ServiceCard key={i} {...svc} />
          ))}
        </div>
      )}

    </section>
  );
}
