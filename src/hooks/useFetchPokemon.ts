import type { Pokemon } from "../types/pokemon";

const API_BASE_URL = "https://pokeapi.co/api/v2";
export async function fetchPokemon(offset = 0, limit = 10): Promise<Pokemon[]> {
  try {
    // First, get the list of Pokemon with pagination
    const response = await fetch(
      `${API_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
    }

    const data = await response.json();

    // Then fetch detailed information for each Pokemon
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon: { url: string }) => {
        const detailResponse = await fetch(pokemon.url);

        if (!detailResponse.ok) {
          throw new Error(
            `Failed to fetch Pokemon details: ${detailResponse.status}`
          );
        }

        return detailResponse.json();
      })
    );

    return pokemonDetails;
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    throw error;
  }
}

export async function fetchPokemonById(id: string): Promise<Pokemon> {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching Pokemon #${id}:`, error);
    throw error;
  }
}

export async function fetchPokemonSpecies(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon-species/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon species: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching Pokemon species #${id}:`, error);
    throw error;
  }
}
