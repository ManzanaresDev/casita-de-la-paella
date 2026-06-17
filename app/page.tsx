// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/images/logo.png";
import { useEffect, useState } from "react";

export default function HeroPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="z-10 text-center flex flex-col items-center justify-center min-h-screen bg-black">
      <Link href="/accueil" className="inline-block">
        <div
          className={`
    transition-opacity duration-1500 ease-out delay-1000
    ${visible ? "opacity-100" : "opacity-0"}
  `}
        >
          <Image
            src={Logo}
            width={500}
            height={500}
            alt="La Casita de la Paella"
            priority
            className="drop-shadow-2xl"
          />
        </div>
      </Link>

      <p
        className={`
    transition-opacity duration-1000 ease-out
    ${visible ? "opacity-100" : "opacity-0"}
    mt-6 text-stone-300 tracking-[0.3em] uppercase text-sm
    flex flex-col items-center gap-3
  `}
      >
        Pour tous moments conviviaux
        <br></br> la cuisine espagnole entre chez vous...
        <Image
          src="/images/spain.png"
          alt="drapeau Espagne"
          width={40}
          height={40}
          className="object-contain"
        />
      </p>
    </div>
  );
}
