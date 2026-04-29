import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { I18nProvider } from "./context/I18nContext";
import LenisProvider from "@/components/LenisProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


import Script from "next/script";
import AOSInit from "@/components/AOSInit";
import JsonLd from "@/components/JsonLd";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: {
    default: "Arbórea Experiences | Villas en la Península de Osa, Costa Rica",
    template: "%s | Arbórea Experiences",
  },
  description: "Villas privadas de lujo en la Península de Osa, Costa Rica. Rodeadas de selva tropical y con vistas al Océano Pacífico. Reserva tu experiencia única en naturaleza.",
  keywords: ["villas Costa Rica", "Península de Osa", "alquiler villa lujo", "Arborea Experiences", "casas vacaciones Costa Rica", "Pacífico Sur Costa Rica"],
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
    title: "Arbórea Experiences | Villas en la Península de Osa, Costa Rica",
    description: "Villas privadas de lujo en la Península de Osa, Costa Rica. Rodeadas de selva tropical y con vistas al Océano Pacífico.",
    images: [
      {
        url: "/assets/cover.png",
        width: 1200,
        height: 630,
        alt: "Arbórea Experiences — Villas privadas en la Península de Osa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arbórea Experiences | Villas en la Península de Osa",
    description: "Villas privadas de lujo en la Península de Osa, Costa Rica. Rodeadas de selva tropical y con vistas al Pacífico.",
    images: ["/assets/cover.png"],
    creator: "@arboreavillas",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
        <I18nProvider>
            <SplashScreen />
            <LenisProvider />
            <AOSInit />
            {children}
        </I18nProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-');
          `}
        </Script>
      </body>
    </html>
  );
}
