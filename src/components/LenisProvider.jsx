"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId;
    let pointerTimeout;

    lenis.on("scroll", () => {
      document.body.style.pointerEvents = "none";
      clearTimeout(pointerTimeout);
      pointerTimeout = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 150);
    });

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(pointerTimeout);
      document.body.style.pointerEvents = "";
      lenis.destroy();
    };
  }, []);

  return null;
}
