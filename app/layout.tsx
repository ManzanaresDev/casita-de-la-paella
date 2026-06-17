import { Playfair_Display, Lato } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "La caita de la paella",
  description: "Commande et livraison de paellas à domicile et reunions",
  keywords: [],
  authors: [{ name: "Manzanares Marcos" }],
  creator: "Manzanares Marcos",
  publisher: "La casita de la paella",
  metadataBase: new URL("https://casita-de-la-paella.vercel.app/"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "La casita de la paella",
    description: "Commande et livraison de paellas à domicile et reunions",
    url: "https://casita-de-la-paella.vercel.app/",
    siteName: "La casita de la paella",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "images/og-image.jpg",
        width: 60,
        height: 60,
        alt: "La casita de la paella",
      },
    ],
  },
  // twitter: {},
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${lato.variable}`}>
      <body className="font-lato">{children}</body>
    </html>
  );
}
