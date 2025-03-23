"use client";

import React, { useState, useEffect } from "react";
import { getTimeBasedPokemon } from "@/lib/services/api.service";

interface TimePokemonContentProps {
  initialData: any;
}

const TimePokemonContent: React.FC<TimePokemonContentProps> = ({
  initialData,
}) => {
  const [pokemonData, setPokemonData] = useState(
    initialData || { time_period: "day", pokemon: [] }
  );
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isError, setIsError] = useState(
    !initialData || initialData.pokemon.length === 0
  );

  const spinRandomPokemon = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    let spins = 0;
    const maxSpins = 20; // Number of visual "spins" before stopping
    const interval = 100; // Initial interval in ms

    const spin = () => {
      const randomIndex = Math.floor(
        Math.random() * pokemonData.pokemon.length
      );
      setSelectedPokemon(pokemonData.pokemon[randomIndex]);

      spins++;
      if (spins < maxSpins) {
        // Gradually increase interval for slowdown effect
        const nextInterval = interval * (1 + spins / maxSpins);
        setTimeout(spin, nextInterval);
      } else {
        setIsSpinning(false);
      }
    };

    spin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#111C44] to-[#0B0F2F] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#FFDE00] mb-8">
          {pokemonData.time_period.charAt(0).toUpperCase() +
            pokemonData.time_period.slice(1)}{" "}
          Pokemon
        </h1>

        {isError ? (
          <div className="text-center text-red-400 mb-8">
            <p>Unable to load Pokemon data. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <button
                onClick={spinRandomPokemon}
                disabled={isSpinning || pokemonData.pokemon.length === 0}
                className={`px-8 py-4 bg-[#3B4CCA] text-white rounded-xl font-bold 
                  transition-all duration-300 hover:bg-[#2A3BBB] 
                  ${
                    isSpinning || pokemonData.pokemon.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-[0_0_20px_rgba(59,76,202,0.5)]"
                  }`}
              >
                {isSpinning ? "Spinning..." : "Spin for Random Pokemon!"}
              </button>
            </div>

            {selectedPokemon && (
              <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm animate-fade-in">
                <img
                  src={selectedPokemon.sprite}
                  alt={selectedPokemon.name}
                  className="w-64 h-64 object-contain animate-bounce-slow"
                />
                <h2 className="text-3xl font-bold text-white mt-4 capitalize">
                  {selectedPokemon.name}
                </h2>
                <div className="flex gap-2 mt-4">
                  {selectedPokemon.types.map((type: string) => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full text-sm font-semibold bg-white/10"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4 mt-8">
              {pokemonData.pokemon.map((pokemon: any) => (
                <div
                  key={pokemon.name}
                  className={`p-2 rounded-lg bg-white/5 transition-all duration-300 
                      ${
                        selectedPokemon?.name === pokemon.name
                          ? "ring-2 ring-[#FFDE00]"
                          : ""
                      }`}
                >
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="w-16 h-16 mx-auto"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TimePokemonContent;
