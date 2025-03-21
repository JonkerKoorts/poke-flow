"use client";

import {
  filterPokemonByType,
  getAvailableTypes,
  getPokemonRoles,
} from "@/lib/services/api.service";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const FemalePage: React.FC = () => {
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
      const types = await getAvailableTypes("female");
      setAvailableTypes(types);
    };
    fetchAvailableTypes();
  }, []);

  useEffect(() => {
    if (viewMode === "roles") {
      const fetchRoles = async () => {
        setIsLoading(true);
        const roles = await getPokemonRoles("female");
        setRolesData(roles);
        setIsLoading(false);
      };
      fetchRoles();
    }
  }, [viewMode]);

  const handleTypeSelect = async (type: string) => {
    setIsLoading(true);
    setSelectedType(type);
    const filteredData = await filterPokemonByType("female", type);
    setPokemonData(filteredData);
    setIsLoading(false);
  };

  const renderTypesView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Filter by Type:</h2>
        {availableTypes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableTypes.map((type) => (
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
        ) : (
          <div className="flex items-center justify-center h-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
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
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
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
    </>
  );

  const renderRolesView = () => (
    <div className="mt-4">
      {rolesData && (
        <div className="space-y-8">
          {Object.entries(rolesData).map(([role, pokemons]: [string, any]) => (
            <div key={role} className="border-b pb-6">
              <h2 className="text-2xl font-bold mb-4">{role}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pokemons.map((pokemon: any) => (
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
    <div className="p-4">
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-200">
          <button
            onClick={() => setViewMode("types")}
            className={`px-4 py-2 rounded-l-lg ${
              viewMode === "types"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Types
          </button>
          <button
            onClick={() => setViewMode("roles")}
            className={`px-4 py-2 rounded-r-lg ${
              viewMode === "roles"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Battle Roles
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading Pokémon...</p>
        </div>
      ) : viewMode === "types" ? (
        renderTypesView()
      ) : (
        renderRolesView()
      )}
    </div>
  );
};

export default FemalePage;
