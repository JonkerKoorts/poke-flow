import { Pokemon } from '@/types/pokemon';

const API_URL = "http://127.0.0.1:8000"

export const fetchPokemonByGender = async (gender: string): Promise<Pokemon[] | null> => {
  try {
    const res = await fetch(`${API_URL}/pokemon-by-gender/${gender}`);
    if (!res.ok) throw new Error(`Failed to fetch Pokémon for ${gender}`);
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    return null;
  }
};

export const filterPokemonByType = async (gender: string, type: string) => {
  try {
    const res = await fetch(`${API_URL}/pokemon-by-gender/${gender}/filter/${type}`);
    if (!res.ok) throw new Error(`Failed to filter ${gender} Pokémon by ${type}`);
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error filtering Pokémon:", error);
    return null;
  }
};

export const getAvailableTypes = async (gender: string) => {
  try {
    const res = await fetch(`${API_URL}/available-types/${gender}`);
    if (!res.ok) throw new Error(`Failed to fetch available types for ${gender}`);
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching available types:", error);
    return [];
  }
};

export const getPokemonByType = async (type: string) => {
  try {
    const res = await fetch(`${API_URL}/pokemon-by-type/${type}`);
    if (!res.ok) throw new Error(`Failed to fetch Pokémon of type ${type}`);
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokémon by type:", error);
    return null;
  }
};

export const getPokemonRoles = async (gender: string) => {
  try {
    const res = await fetch(`${API_URL}/pokemon-roles/${gender}`);
    if (!res.ok) throw new Error(`Failed to fetch Pokémon roles for ${gender}`);
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokémon roles:", error);
    return null;
  }
};

export const getAvailableAbilities = async (type: string) => {
  try {
    const res = await fetch(`${API_URL}/available-abilities/${type}`);
    if (!res.ok) throw new Error(`Failed to fetch available abilities for ${type}`);
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching available abilities:", error);
    return [];
  }
};

export const filterPokemonByAbility = async (type: string, ability: string) => {
  try {
    const res = await fetch(`${API_URL}/pokemon-by-type/${type}/filter/${ability}`);
    if (!res.ok) throw new Error(`Failed to filter ${type} Pokémon by ${ability}`);
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error filtering Pokémon:", error);
    return null;
  }
};
