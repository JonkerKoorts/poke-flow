"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-[#0B0F2F] via-[#111C44] to-[#0B0F2F] text-white animate-fade-in">
      {/* Epic background grid pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/poke-bg.svg')] bg-repeat opacity-[0.03]" />
      </div>

      {/* Epic glowing Pokéball */}
      <div className="z-10 animate-bounce">
        <img
          src="/pokeball.png"
          alt="Pokéball"
          className="w-36 h-46 drop-shadow-[0_0_40px_rgba(59,76,202,0.9)]"
        />
      </div>

      {/* Title */}
      <div className="z-10 mt-6 text-center">
        <p className="text-base tracking-wider uppercase text-[#FFDE00] animate-fade-in-up delay-100 font-bold">
          Trainer, welcome to
        </p>
        <h1 className="text-7xl font-black uppercase animate-fade-in-up delay-200 bg-gradient-to-r from-[#3B4CCA] via-[#FFDE00] to-[#FF0000] text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          POKE-FLOW
        </h1>
        <p className="mt-4 text-lg font-medium tracking-wide text-neutral-300 animate-fade-in-up delay-300">
          Real-time Pokémon data. Intense battles. Legendary choices.
        </p>
      </div>

      {/* CTA */}
      {showText && (
        <Link
          href="/gender"
          className="z-10 mt-10 px-8 py-3 text-lg font-extrabold tracking-widest uppercase transition-all duration-300 border-2 border-[#3B4CCA] text-white rounded-xl hover:bg-[#3B4CCA] hover:border-[#FFDE00] hover:shadow-[0_0_30px_#3B4CCA] animate-fade-in-up delay-500"
        >
          Begin Your Journey
        </Link>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 text-xs text-neutral-400 z-10 animate-fade-in-up delay-700">
        Gotta fetch 'em all ⚡ Powered by PokéAPI
      </div>
    </div>
  );
}
