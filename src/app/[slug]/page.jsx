import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import PropertyPage from "@/components/sections/PropertyPage";

export function generateStaticParams() {
  return Object.keys(properties).map((slug) => ({ slug }));
}

export default function Page({ params }) {
  const property = properties[params.slug];
  if (!property) notFound();
  return <PropertyPage property={property} />;
}
