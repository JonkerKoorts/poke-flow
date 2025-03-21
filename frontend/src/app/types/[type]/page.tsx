"use client";

import {
  getPokemonByType,
  getAvailableAbilities,
  filterPokemonByAbility,
} from "@/lib/services/api.service";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const TypePage = () => {
  const params = useParams();
  const type = params.type as string;
  const [pokemonData, setPokemonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAbility, setSelectedAbility] = useState<string>("");
  const [availableAbilities, setAvailableAbilities] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [data, abilities] = await Promise.all([
        getPokemonByType(type),
        getAvailableAbilities(type),
      ]);
      setPokemonData(data || []);
      setAvailableAbilities(abilities || []);
      setIsLoading(false);
    };
    fetchData();
  }, [type]);

  const handleAbilitySelect = async (ability: string) => {
    setIsLoading(true);
    setSelectedAbility(ability);
    if (ability === "") {
      const data = await getPokemonByType(type);
      setPokemonData(data || []);
    } else {
      const filteredData = await filterPokemonByAbility(type, ability);
      setPokemonData(filteredData || []);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 capitalize">{type} Pokémon</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filter by Ability:</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAbilitySelect("")}
            className={`px-3 py-1 rounded transition-all duration-200 ${
              selectedAbility === ""
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {availableAbilities.map((ability) => (
            <button
              key={ability}
              onClick={() => handleAbilitySelect(ability)}
              className={`px-3 py-1 rounded transition-all duration-200 ${
                selectedAbility === ability
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading Pokémon...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pokemonData.map((pokemon) => (
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
      )}
    </div>
  );
};

export default TypePage;
