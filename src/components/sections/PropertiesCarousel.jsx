"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import PropertyCard from "@/components/ui/PropertyCard";
import { useI18n } from "@/app/context/I18nContext";
import { properties } from "@/data/properties";

const propertyKeys = [
  { key: "casaMango",   images: ["/assets/CasaMango/CasaMango3.avif", "/assets/CasaMango/CasaMango1.avif", "/assets/CasaMango/CasaMango2.avif", "/assets/CasaMango/CasaMango6.avif"], guests: 10, bedrooms: 5, baths: 6,   href: "/casa-mango",            slug: "casa-mango" },
  { key: "casaRonRon",  images: ["/assets/CasaRonRon/5.avif", "/assets/CasaRonRon/6.avif", "/assets/CasaRonRon/7.avif", "/assets/CasaRonRon/8.avif"],                               guests: 8,  bedrooms: 4, baths: 1.5, href: "/casa-ron-ron",          slug: "casa-ron-ron" },
  { key: "casaCeiba",   images: ["/assets/CasaCeiba/9.avif", "/assets/CasaCeiba/10.avif", "/assets/CasaCeiba/11.avif", "/assets/CasaCeiba/12.avif"],                                guests: 2,  bedrooms: 1, baths: 1,   href: "/casa-ceiba",            slug: "casa-ceiba" },
  { key: "casaCorteza", images: ["/assets/CasaCortezaAmarilla/13.avif", "/assets/CasaCortezaAmarilla/14.avif", "/assets/CasaCortezaAmarilla/15.avif", "/assets/CasaCortezaAmarilla/16.avif"], guests: 8,  bedrooms: 5, baths: 2,   href: "/casa-corteza-amarilla", slug: "casa-corteza-amarilla" },
  { key: "casaPalmera", images: ["/assets/CasaPalmera/17.avif", "/assets/CasaPalmera/18.avif", "/assets/CasaPalmera/19.avif", "/assets/CasaPalmera/20.avif"],                       guests: 8,  bedrooms: 4, baths: 2,   href: "/casa-palmera",          slug: "casa-palmera" },
];

export default function PropertiesCarousel({ swiperRef }) {
  const { t } = useI18n();

  return (
    <Swiper
      modules={[Navigation, A11y, Autoplay]}
      slidesPerView={1}
      spaceBetween={12}
      breakpoints={{
        768: { slidesPerView: 2, spaceBetween: 12 },
        1024: { slidesPerView: 3, spaceBetween: 12 },
      }}
      autoplay={{ delay: 10000, disableOnInteraction: true }}
      loop={true}
      onSwiper={(swiper) => { if (swiperRef) swiperRef.current = swiper; }}
      className="hero-swiper !pb-2"
    >
      {propertyKeys.map(({ key, images, guests, bedrooms, baths, href, slug }) => (
        <SwiperSlide key={key}>
          <PropertyCard
            name={t(`properties.${key}.name`)}
            description={t(`properties.${key}.description`)}
            images={images}
            guests={guests}
            bedrooms={bedrooms}
            baths={baths}
            href={href}
            directionsUrl={properties[slug]?.directionsUrl}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
