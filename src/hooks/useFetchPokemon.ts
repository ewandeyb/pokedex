import { Pokemon } from "../types/pokemon";
const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(limit = 100): Promise<Pokemon[]> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json(); // access name in pokemon
    console.log("Fetched Pokemon data:", data); // Log the fetched data
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const detailResponse = await fetch(pokemon.url);

        if (!detailResponse.ok) {
          throw new Error(
            `Failed to fetch Pokemon details: ${detailResponse.status}`
          );
        }

        const details = await detailResponse.json();
        return { name: pokemon.name, ...details }; // Include the name in the result
      })
    );

    return pokemonDetails;
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
    throw error;
  }
}
