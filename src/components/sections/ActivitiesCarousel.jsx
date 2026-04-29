"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import "swiper/css";

import ActivityCard from "@/components/ui/ActivityCard";
import { useI18n } from "@/app/context/I18nContext";

export default function ActivitiesCarousel({ swiperRef }) {
  const { t } = useI18n();
  const activities = t("tours.activities");

  if (!Array.isArray(activities)) return null;

  return (
    <Swiper
      modules={[A11y]}
      slidesPerView={1}
      spaceBetween={12}
      breakpoints={{
        768: { slidesPerView: 2, spaceBetween: 12 },
        1280: { slidesPerView: 3, spaceBetween: 12 },
      }}
      onSwiper={(swiper) => { if (swiperRef) swiperRef.current = swiper; }}
      className="hero-swiper"
    >
      {activities.map((activity, i) => (
        <SwiperSlide key={i}>
          <ActivityCard activity={activity} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
