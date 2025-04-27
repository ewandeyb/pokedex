import { Pokemon, PokemonPhoto } from "../types/pokemon";
const BASE_URL = "https://pokeapi.co/api/v2";
const PHOTO_URL =
  "https://assets.pokemon.com/assets/cms2/img/pokedex/full/{id}.png"; // replace {id} with the pokemon id 0-> 001

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

export async function getPokemonPhoto(id: number): Promise<PokemonPhoto> {
  const formattedId = String(id).padStart(3, "0"); // Format the ID to 3 digits
  try {
    const response = await fetch(`${PHOTO_URL}/pokemon/${formattedId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
    throw error;
  }
}
// add a function to fetch pokemon by name
