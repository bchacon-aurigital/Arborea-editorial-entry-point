import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { I18nProvider } from "./context/I18nContext";
import LenisProvider from "@/components/LenisProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

import Script from "next/script";
import AOSInit from "@/components/AOSInit";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "",
    template: "%s | ",
  },
  description: "",
  keywords: [""],
  authors: [{ name: "", url: "" }],
  creator: "",
  publisher: "",
  metadataBase: new URL("https://welcome.arboreaexperiences.com"),
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/es",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "",
    title: "",
    description: "",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "",
    description: "",
    images: ["/og-image.jpg"],
    creator: "@",
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
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <I18nProvider>
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
