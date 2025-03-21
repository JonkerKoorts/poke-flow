const API_URL = "http://127.0.0.1:8000"

export const fetchPokemonByGender = async (gender: string) => {
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
