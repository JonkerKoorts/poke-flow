"use client";

import {
  filterPokemonByType,
  getAvailableTypes,
  getPokemonRoles,
} from "@/lib/services/api.service";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const MalePage: React.FC = () => {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"types" | "roles">("types");
  const [pokemonData, setPokemonData] = useState(
    searchParams.get("data")
      ? JSON.parse(decodeURIComponent(searchParams.get("data")!))
      : null
  );
  const [rolesData, setRolesData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAvailableTypes = async () => {
      const types = await getAvailableTypes("male");
      setAvailableTypes(types);
    };
    fetchAvailableTypes();
  }, []);

  useEffect(() => {
    if (viewMode === "roles") {
      const fetchRoles = async () => {
        setIsLoading(true);
        const roles = await getPokemonRoles("male");
        setRolesData(roles);
        setIsLoading(false);
      };
      fetchRoles();
    }
  }, [viewMode]);

  const handleTypeSelect = async (type: string) => {
    setIsLoading(true);
    setSelectedType(type);
    const filteredData = await filterPokemonByType("male", type);
    setPokemonData(filteredData);
    setIsLoading(false);
  };

  const renderTypesView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-[#FFDE00]">
          Filter by Type:
        </h2>
        {availableTypes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeSelect(type)}
                disabled={isLoading}
                className={`px-3 py-1 rounded transition-all duration-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  selectedType === type
                    ? "bg-[#3B4CCA] text-white shadow-[0_0_20px_rgba(59,76,202,0.3)]"
                    : "bg-white/10 text-white hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3B4CCA]"></div>
          </div>
        )}
      </div>

      <div className="mt-4">
        {pokemonData && pokemonData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pokemonData.map((pokemon: any) => (
              <div
                key={pokemon.name}
                onClick={() => router.push(`/types/${pokemon.types[0]}`)}
                className="border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(59,76,202,0.2)]"
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
    </>
  );

  const renderRolesView = () => (
    <div className="mt-4">
      {rolesData && (
        <div className="space-y-8">
          {Object.entries(rolesData).map(([role, pokemons]: [string, any]) => (
            <div key={role} className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-bold mb-4 text-[#FFDE00]">{role}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pokemons.map((pokemon: any) => (
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
                      <div className="mt-2">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(pokemon.stats).map(
                            ([stat, value]: [string, any]) => (
                              <div key={stat} className="text-xs">
                                <span className="font-medium">{stat}: </span>
                                {value}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#111C44] to-[#0B0F2F] text-white p-8 animate-fade-in">
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl border border-white/20">
          <button
            onClick={() => setViewMode("types")}
            className={`px-6 py-3 rounded-l-xl transition-all duration-300 font-bold ${
              viewMode === "types"
                ? "bg-[#3B4CCA] text-white shadow-[0_0_20px_rgba(59,76,202,0.3)]"
                : "text-white hover:bg-white/10"
            }`}
          >
            Types
          </button>
          <button
            onClick={() => setViewMode("roles")}
            className={`px-6 py-3 rounded-r-xl transition-all duration-300 font-bold ${
              viewMode === "roles"
                ? "bg-[#3B4CCA] text-white shadow-[0_0_20px_rgba(59,76,202,0.3)]"
                : "text-white hover:bg-white/10"
            }`}
          >
            Battle Roles
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B4CCA]"></div>
          <p className="mt-4 text-neutral-300">Loading Pokémon...</p>
        </div>
      ) : viewMode === "types" ? (
        renderTypesView()
      ) : (
        renderRolesView()
      )}
    </div>
  );
};

export default MalePage;
