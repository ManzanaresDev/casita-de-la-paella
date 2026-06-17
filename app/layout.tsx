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
  title: "La Casita de la Paella – Paëlla artisanale cuite au feu de bois",
  description:
    "Commandez votre paëlla artisanale à Dunkerque : valencienne, fruits de mer ou mixte, cuisinée au feu de bois et livrée à domicile ou pour vos événements.",
  keywords: [
    "paella",
    "paella Dunkerque",
    "paella artisanale",
    "paella feu de bois",
    "paella à domicile",
    "paella sur commande",
    "paella valencienne",
    "paella fruits de mer",
    "traiteur espagnol Dunkerque",
    "paella événement",
    "paella mariage",
    "cuisine espagnole",
    "la casita de la paella",
    "paella Nord",
    "paella fait maison",
  ],
  authors: [{ name: "Manzanares Marcos" }],
  creator: "Manzanares Marcos",
  publisher: "La Casita de la Paella",
  metadataBase: new URL("https://casita-de-la-paella.vercel.app/"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "La Casita de la Paella – Paëlla artisanale cuite au feu de bois",
    description:
      "Commandez votre paëlla artisanale à Dunkerque : valencienne, fruits de mer ou mixte, cuisinée au feu de bois et livrée à domicile ou pour vos événements.",
    url: "https://casita-de-la-paella.vercel.app/",
    siteName: "La Casita de la Paella",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "La Casita de la Paella – paëlla artisanale cuite au feu de bois à Dunkerque",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Casita de la Paella – Paëlla artisanale à Dunkerque",
    description:
      "Paëlla valencienne, fruits de mer ou mixte, cuisinée au feu de bois. Livraison à domicile et sur événements.",
    images: ["/images/og-image.jpg"],
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
