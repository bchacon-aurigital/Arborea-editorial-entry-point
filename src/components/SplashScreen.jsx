"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1600);
    const hideTimer = setTimeout(() => setVisible(false), 2300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#EDDAC4] flex items-center justify-center transition-opacity duration-700"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <object
        type="image/svg+xml"
        data="/assets/logos/LogoHero.svg"
        aria-label="Arbórea Experiences"
        className="w-[220px] max-w-full h-auto pointer-events-none"
      />
    </div>
  );
}
