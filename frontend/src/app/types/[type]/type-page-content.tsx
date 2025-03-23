"use client";

import React, { useState } from "react";
import { filterPokemonByAbility } from "@/lib/services/api.service";

interface TypePageContentProps {
  type: string;
  initialPokemonData: any[];
  availableAbilities: string[];
}

const TypePageContent = ({
  type,
  initialPokemonData,
  availableAbilities,
}: TypePageContentProps) => {
  const [pokemonData, setPokemonData] = useState(initialPokemonData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState<string>("");

  const handleAbilitySelect = async (ability: string) => {
    setIsLoading(true);
    setSelectedAbility(ability);

    try {
      if (ability === "") {
        setPokemonData(initialPokemonData);
      } else {
        const filteredData = await filterPokemonByAbility(type, ability);
        setPokemonData(filteredData || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#111C44] to-[#0B0F2F] text-white p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black uppercase animate-fade-in-up delay-200 bg-gradient-to-r from-[#3B4CCA] via-[#FFDE00] to-[#FF0000] text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          {type} Pokémon
        </h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#FFDE00]">
          Filter by Ability:
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAbilitySelect("")}
            className={`px-3 py-1 rounded transition-all duration-300 ${
              selectedAbility === ""
                ? "bg-[#3B4CCA] text-white shadow-[0_0_20px_rgba(59,76,202,0.3)]"
                : "bg-white/10 text-white hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            }`}
          >
            All
          </button>
          {availableAbilities.map((ability) => (
            <button
              key={ability}
              onClick={() => handleAbilitySelect(ability)}
              className={`px-3 py-1 rounded transition-all duration-300 ${
                selectedAbility === ability
                  ? "bg-[#3B4CCA] text-white shadow-[0_0_20px_rgba(59,76,202,0.3)]"
                  : "bg-white/10 text-white hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              }`}
            >
              {ability
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B4CCA]"></div>
          <p className="mt-4 text-neutral-300">Loading Pokémon...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pokemonData.map((pokemon) => (
            <div
              key={pokemon.name}
              className="border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,76,202,0.2)]"
            >
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                className="w-24 h-24 mx-auto"
              />
              <h3 className="text-lg font-semibold capitalize text-center text-white mt-2">
                {pokemon.name}
              </h3>
              <div className="text-sm text-neutral-300">
                <p>Types: {pokemon.types.join(", ")}</p>
                <p>Abilities: {pokemon.abilities.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypePageContent;
