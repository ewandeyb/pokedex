"use client";
import { useEffect, useState } from "react";
import { fetchPokemon } from "@/hooks/useFetchPokemon";
import { Pokemon } from "@/types/pokemon";
import PokemonCard from "./pokemon_card";
export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  useEffect(() => {
    async function getPokemon() {
      try {
        const data = await fetchPokemon();
        setPokemonList(data);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    }
    getPokemon();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <h1 className="text-3xl font-bold mb-4 text-white">Pokemon List</h1>
      <div className="grid grid-cols-5 text-lg gap-10  text-white">
        {pokemonList.map((pokemon) => (
          <div key={pokemon.id} className="mb-4">
            <PokemonCard id={pokemon.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
