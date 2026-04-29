"use client";

import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/sections/HeroSection";
import ToursActivitiesSection from "@/components/sections/ToursActivitiesSection";
import EmergencyContactsSection from "@/components/sections/EmergencyContactsSection";
import GoodToKnowSection from "@/components/sections/GoodToKnowSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ToursActivitiesSection />
        <EmergencyContactsSection />
        <GoodToKnowSection />
      </main>
      <Footer />
    </>
  );
}
