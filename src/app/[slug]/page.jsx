import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import PropertyPage from "@/components/sections/PropertyPage";

export function generateStaticParams() {
  return Object.keys(properties).map((slug) => ({ slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const property = properties[slug];
  if (!property) notFound();
  return <PropertyPage property={property} />;
}
