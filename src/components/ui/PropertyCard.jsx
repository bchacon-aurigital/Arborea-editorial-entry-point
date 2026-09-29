"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TbWifi, TbMapPin } from "react-icons/tb";
import { useI18n } from "@/app/context/I18nContext";

export default function PropertyCard({
  name = "",
  description = "",
  images = [],
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

  return (
    <div
      className="bg-[#E0D4C4] flex flex-col rounded-2xl p-3 h-full cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
      onClick={() => router.push(href)}
    >
      {/* Carrusel de imágenes */}
      <div
        className="relative h-[321px] rounded-xl overflow-hidden flex items-end justify-between p-4 shrink-0"
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

        {/* Gradient overlay for title legibility */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Título */}
        <p className="relative z-10 font-sans font-semibold text-2xl text-white leading-tight">{name}</p>

        {/* Dots */}
        {images.length > 1 && (
          <div className="relative z-10 flex gap-1.5 self-end">
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

      {/* Botones */}
      <div className="flex flex-col gap-2 pt-3 pb-2 px-3">
        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full items-center justify-center gap-2 h-12 px-5 rounded-full bg-[#213B2F] font-sans font-medium text-sm text-[#D8DDB8] hover:bg-[#213B2F]/90 transition-colors duration-300"
          >
            <TbMapPin size={15} />
            {t("common.getDirections")}
          </a>
        )}
        <Link
          href={href}
          onClick={(e) => e.stopPropagation()}
          className="flex w-full items-center justify-center gap-2 h-12 px-5 rounded-full border-2 border-[#222E2C]/20 font-sans font-medium text-sm text-[#222E2C] hover:border-[#222E2C]/50 hover:bg-[#222E2C]/5 transition-all duration-300"
        >
          <TbWifi size={15} />
          {t("propertyPage.wifiAndMore")}
        </Link>
      </div>
    </div>
  );
}
