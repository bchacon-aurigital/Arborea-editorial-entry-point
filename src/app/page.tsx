"use client";

import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/sections/HeroSection";
import ToursActivitiesSection from "@/components/sections/ToursActivitiesSection";
import MulaRentalSection from "@/components/sections/MulaRentalSection";
import InHouseServicesSection from "@/components/sections/InHouseServicesSection";
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
        <MulaRentalSection />
        <InHouseServicesSection />
        <EmergencyContactsSection />
        <GoodToKnowSection />
      </main>
      <Footer />
    </>
  );
}
