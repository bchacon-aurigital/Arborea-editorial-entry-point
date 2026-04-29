"use client";

import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import PropertyPage from "@/components/sections/PropertyPage";

export default function Page({ params }) {
  const property = properties[params.slug];
  if (!property) notFound();
  return <PropertyPage property={property} />;
}
