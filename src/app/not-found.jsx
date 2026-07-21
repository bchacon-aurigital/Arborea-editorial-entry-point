"use client";

import Link from "next/link";
import { TbArrowNarrowLeft } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#EDE5D8] flex flex-col items-center justify-center px-8 gap-10">

      <object
        type="image/svg+xml"
        data="/assets/logos/LogoHero.svg"
        aria-label="Arbórea Experiences"
        className="w-[180px] max-w-full h-auto pointer-events-none opacity-60"
      />

      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <p className="font-sans text-xs text-[#222E2C]/40 tracking-widest uppercase">
          Error 404
        </p>
        <h1 className="font-sans font-semibold text-4xl text-[#222E2C] tracking-tight leading-tight">
          Página no encontrada
        </h1>
        <p className="font-sans text-base text-[#222E2C]/50 leading-relaxed">
          La página que buscas no existe o ha sido movida.
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#222E2C] font-sans font-medium text-sm text-[#222E2C] hover:bg-[#222E2C]/5 transition-colors duration-200"
      >
        <TbArrowNarrowLeft size={16} />
        Volver al inicio
      </Link>

    </div>
  );
}
