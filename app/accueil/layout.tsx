import { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Carte – La Casita de la Paella",
  alternates: { canonical: "/accueil" },
  openGraph: {
    url: "https://casita-de-la-paella.vercel.app/accueil",
  },
};

export default function BasiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen w-full flex flex-col  overflow-x-hidden bg-black"
      style={{
        background:
          "linear-gradient(to right, rgb(12, 10, 9), rgb(68, 64, 60))",
      }}
    >
      {children}
    </main>
  );
}
