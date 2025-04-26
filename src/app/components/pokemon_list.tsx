"use client";
import { useEffect, useState } from "react";
import { fetchPokemonList } from "@/hooks/useFetchPokemon";
import { Pokemon } from "@/types/pokemon";
export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  useEffect(() => {
    async function getPokemon() {
      try {
        const data = await fetchPokemonList(10);
        setPokemonList(data);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    }
    getPokemon();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Pokemon List</h1>
      <div className="text-lg text-gray-700">
        {pokemonList ? (
          <div>
            <p>Pokemon Data</p>
            <pre>{JSON.stringify(pokemonList, null, 2)}</pre>
          </div>
        ) : (
          <div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
