import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { I18nProvider } from "./context/I18nContext";
import LenisProvider from "@/components/LenisProvider";
import { GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "Arbórea Experiences | Casas en la Península de Osa, Costa Rica",
    template: "%s | Arbórea Experiences",
  },
  description: "Casas privadas de lujo en la Península de Osa, Costa Rica. Rodeadas de selva tropical y con vistas al Océano Pacífico. Reserva tu experiencia única en naturaleza.",
  keywords: ["casas Costa Rica", "Península de Osa", "alquiler casa lujo", "Arborea Experiences", "casas vacaciones Costa Rica", "Pacífico Sur Costa Rica"],
  authors: [{ name: "Arbórea Experiences", url: "https://welcome.arboreaexperiences.com" }],
  creator: "Arbórea Experiences",
  publisher: "Arbórea Experiences",
  metadataBase: new URL("https://welcome.arboreaexperiences.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: "/",
    siteName: "Arbórea Experiences",
    title: "Arbórea Experiences | Casas en la Península de Osa, Costa Rica",
    description: "Casas privadas de lujo en la Península de Osa, Costa Rica. Rodeadas de selva tropical y con vistas al Océano Pacífico.",
    images: [
      {
        url: "/assets/cover.png",
        width: 1200,
        height: 630,
        alt: "Arbórea Experiences — Casas privadas en la Península de Osa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arbórea Experiences | Casas en la Península de Osa",
    description: "Casas privadas de lujo en la Península de Osa, Costa Rica. Rodeadas de selva tropical y con vistas al Pacífico.",
    images: ["/assets/cover.png"],
    creator: "@arboreaexperiences",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <GoogleTagManager gtmId="GTM-W7KC623M" />
        <I18nProvider>
            <LenisProvider />
            {children}
        </I18nProvider>
      </body>
    </html>
  );
}
