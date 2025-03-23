"use client";

import TypingText from "@/components/static/text-type";
import {
  filterPokemonByType,
  getPokemonRoles,
} from "@/lib/services/api.service";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface FemalePageContentProps {
  initialTypes: string[];
}

interface PokemonRole {
  [key: string]: Array<{ name: string }>;
}

const FemalePageContent: React.FC<FemalePageContentProps> = ({
  initialTypes,
}) => {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableTypes] = useState<string[]>(initialTypes);
  const [viewMode, setViewMode] = useState<"types" | "roles">("types");
  const [pokemonData, setPokemonData] = useState(
    searchParams.get("data")
      ? JSON.parse(decodeURIComponent(searchParams.get("data")!))
      : null
  );
  const [rolesData, setRolesData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (viewMode === "roles") {
      const fetchRoles = async () => {
        setIsLoading(true);
        const roles = (await getPokemonRoles("female")) as PokemonRole;
        // Transform the object into an array of role objects
        const rolesArray = roles
          ? Object.entries(roles).map(([name, pokemon]) => ({
              name,
              pokemon: pokemon.map((p: any) => p.name),
              description: `${name} type Pokemon with specialized ${name.toLowerCase()} capabilities`,
            }))
          : [];
        setRolesData(rolesArray);
        setIsLoading(false);
      };
      fetchRoles();
    }
  }, [viewMode]);

  const handleTypeSelect = async (type: string) => {
    setIsLoading(true);
    setSelectedType(type);

    try {
      if (type === "") {
        setPokemonData(
          searchParams.get("data")
            ? JSON.parse(decodeURIComponent(searchParams.get("data")!))
            : null
        );
      } else {
        const filteredData = await filterPokemonByType("female", type);
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
          Female Pokémon
        </h1>
      </div>

      {/* View Mode Selector */}
      <div className="mb-8">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setViewMode("types")}
            className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer ${
              viewMode === "types"
                ? "bg-[#3B4CCA] text-white shadow-[0_0_20px_rgba(59,76,202,0.3)]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Filter by Types
          </button>
          <button
            onClick={() => setViewMode("roles")}
            className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer ${
              viewMode === "roles"
                ? "bg-[#3B4CCA] text-white shadow-[0_0_20px_rgba(59,76,202,0.3)]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            View by Roles
          </button>
          <Link
            href="/time-pokemon"
            className="px-6 py-2 text-black rounded-full transition-all duration-300 hover:bg-[#FFDE00] bg-[#FFDE00]"
          >
            Time-based Pokemon
          </Link>
        </div>
      </div>

      {viewMode === "types" ? (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-[#FFDE00]">
              Filter by Type:
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTypeSelect("")}
                className={`px-3 py-1 rounded transition-all duration-300 ${
                  selectedType === ""
                    ? "bg-[#3B4CCA] text-white shadow-[0_0_20px_rgba(59,76,202,0.3)]"
                    : "bg-white/10 text-white hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                }`}
              >
                All
              </button>
              {availableTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`px-3 py-1 rounded transition-all duration-300 ${
                    selectedType === type
                      ? "bg-[#3B4CCA] text-white shadow-[0_0_20px_rgba(59,76,202,0.3)]"
                      : "bg-white/10 text-white hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Add this hint text */}
          <div className="text-sm text-neutral-300 text-center mb-4">
            <TypingText
              text="Click on any Pokémon card to explore its type in detail"
              className="text-[#FFDE00]"
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B4CCA]"></div>
              <p className="mt-4 text-neutral-300">Loading Pokémon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pokemonData?.map((pokemon: any) => (
                <div
                  key={pokemon.name}
                  onClick={() =>
                    router.push(`/types/${pokemon.types[0].toLowerCase()}`)
                  }
                  className="border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,76,202,0.2)] cursor-pointer"
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
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B4CCA]"></div>
              <p className="mt-4 text-neutral-300">Loading Roles...</p>
            </div>
          ) : (
            rolesData?.map((role: any) => (
              <div
                key={role.name}
                className="border border-white/10 rounded-xl p-4 bg-white/5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,76,202,0.2)]"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {role.name}
                </h3>
                <p className="text-sm text-neutral-300">{role.description}</p>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-[#FFDE00] mb-2">
                    Pokémon in this role:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {role.pokemon.map((pokemon: any) => (
                      <span
                        key={pokemon}
                        className="px-2 py-1 bg-white/10 rounded text-xs"
                      >
                        {pokemon}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FemalePageContent;
