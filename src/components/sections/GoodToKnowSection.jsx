"use client";

import { TbDoor, TbBolt, TbCar, TbFridge, TbBulb } from "react-icons/tb";
import { useI18n } from "@/app/context/I18nContext";

const cards = [
  { key: "meshDoors", icon: TbDoor },
  { key: "powerOutages", icon: TbBolt },
  { key: "transportation", icon: TbCar },
  { key: "foodStorage", icon: TbFridge },
  { key: "nighttimeLighting", icon: TbBulb },
];

function InfoCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <div
      data-aos="zoom-in"
      data-aos-delay={delay}
      className="bg-[#eddac4] rounded-2xl px-8 py-10 flex flex-col justify-between gap-8 min-h-80 md:min-h-[420px]"
    >
      <div className="bg-[#381d14] rounded-xl p-2.5 size-14 flex items-center justify-center shrink-0">
        <Icon size={26} className="text-[#eddac4]" />
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-display font-semibold text-[#381d14] text-xl">{title}</p>
        <p className="font-sans font-medium text-[#381d14]/50 text-base leading-snug">{description}</p>
      </div>
    </div>
  );
}

export default function GoodToKnowSection() {
  const { t } = useI18n();

  return (
    <section className="w-full bg-[#381d14] rounded-3xl px-8 md:px-16 py-16 md:py-24 flex flex-col gap-16 md:gap-24">
      <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-8">
        <p className="font-sans font-medium text-[#eddac4] text-xl md:text-2xl leading-tight tracking-tight max-w-4xl">
          {t("goodToKnow.title")}
        </p>
        <div className="flex items-center gap-2 border border-white/[0.12] rounded-full px-4 py-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#eddac4]" />
          <span className="font-sans font-medium text-[#eddac4] text-sm whitespace-nowrap">
            {t("goodToKnow.badge")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cards.slice(0, 3).map(({ key, icon }, i) => (
            <InfoCard
              key={key}
              icon={icon}
              delay={i * 100}
              title={t(`goodToKnow.cards.${key}.title`)}
              description={t(`goodToKnow.cards.${key}.description`)}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cards.slice(3).map(({ key, icon }, i) => (
            <InfoCard
              key={key}
              icon={icon}
              delay={i * 100}
              title={t(`goodToKnow.cards.${key}.title`)}
              description={t(`goodToKnow.cards.${key}.description`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
