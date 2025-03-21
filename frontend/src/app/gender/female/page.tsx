"use client";

import { filterPokemonByType } from "@/lib/services/api.service";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

const FemalePage: React.FC = () => {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [pokemonData, setPokemonData] = useState(
    searchParams.get("data")
      ? JSON.parse(decodeURIComponent(searchParams.get("data")!))
      : null
  );

  const handleTypeSelect = async (type: string) => {
    setIsLoading(true);
    setSelectedType(type);
    const filteredData = await filterPokemonByType("female", type);
    setPokemonData(filteredData);
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Filter by Type:</h2>
        <div className="flex flex-wrap gap-2">
          {POKEMON_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              disabled={isLoading}
              className={`px-3 py-1 rounded transition-all duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              } ${
                selectedType === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading Pokémon...</p>
          </div>
        ) : pokemonData && pokemonData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pokemonData.map((pokemon: any) => (
              <div
                key={pokemon.name}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-24 h-24 mx-auto"
                />
                <h3 className="text-lg font-semibold capitalize text-center">
                  {pokemon.name}
                </h3>
                <div className="text-sm text-gray-600">
                  <p>Types: {pokemon.types.join(", ")}</p>
                  <p>Abilities: {pokemon.abilities.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        ) : selectedType ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              No female Pokémon found of type {selectedType}.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Try selecting a different type!
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FemalePage;
