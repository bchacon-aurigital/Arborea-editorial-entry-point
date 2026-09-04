"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TbWifi, TbMapPin } from "react-icons/tb";
import { IoPeopleOutline, IoBedOutline } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";
import { useI18n } from "@/app/context/I18nContext";

export default function PropertyCard({
  name = "",
  description = "",
  images = [],
  guests,
  bedrooms,
  baths,
  href = "#",
  directionsUrl = "",
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);
  const isMobile = useRef(false);

  const next = () => setCurrent((c) => (c + 1) % images.length);

  const startCycle = (ms) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, ms);
  };

  const stopCycle = () => {
    clearInterval(intervalRef.current);
    setCurrent(0);
  };

  useEffect(() => {
    isMobile.current = window.innerWidth < 768;
    if (isMobile.current && images.length > 1) startCycle(2000);
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  const amenities = [
    { key: "wifi", icon: TbWifi, iconSize: 18, label: t("common.wifi"), value: null, show: true },
    { key: "guests", icon: IoPeopleOutline, iconSize: 16, label: t("common.guests"), value: guests, show: Boolean(guests) },
    { key: "bedrooms", icon: IoBedOutline, iconSize: 18, label: t("common.bedrooms"), value: bedrooms, show: Boolean(bedrooms) },
    { key: "baths", icon: PiBathtub, iconSize: 18, label: t("common.baths"), value: baths, show: Boolean(baths) },
  ].filter((item) => item.show);

  return (
    <div
      className="bg-[#E0D4C4] flex flex-col rounded-2xl p-3 h-full cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
      onClick={() => router.push(href)}
    >
      {/* Carrusel de imágenes */}
      <div
        className="relative h-[321px] rounded-xl overflow-hidden flex items-end justify-center p-4 shrink-0"
        onMouseEnter={() => { if (!isMobile.current && images.length > 1) startCycle(2000); }}
        onMouseLeave={() => { if (!isMobile.current) stopCycle(); }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${name} ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 rounded-xl ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {images.length > 1 && (
          <div className="relative z-10 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-white scale-110" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 pt-5 pb-5 px-3">

        {/* Nombre */}
        <p className="font-sans font-medium text-xl text-[#222E2C] mb-5">{name}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center gap-2 bg-[#222E2C]/6 rounded-full px-3.5 py-2"
              >
                <Icon size={item.iconSize} className="text-[#222E2C]/50 shrink-0" />
                <span className="font-sans text-sm text-[#222E2C]/70">
                  {item.value == null
                    ? item.label
                    : <><span className="font-semibold text-[#222E2C]">{item.value}</span> {item.label}</>}
                </span>
              </div>
            );
          })}
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex sm:flex-1 items-center justify-center gap-2 h-12 px-5 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-300"
            >
              <TbMapPin size={15} />
              {t("common.getDirections")}
            </a>
          )}

          <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="flex sm:flex-1 items-center justify-center h-12 px-5 rounded-full border-2 border-[#222E2C]/20 font-sans font-medium text-sm text-[#222E2C] hover:border-[#222E2C]/50 hover:bg-[#222E2C]/5 transition-all duration-300"
          >
            {t("common.seeMore")}
          </Link>
        </div>
      </div>
    </div>
  );
}
