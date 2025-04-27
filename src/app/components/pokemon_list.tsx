"use client";
import { useEffect, useState } from "react";
import { fetchPokemon } from "@/hooks/useFetchPokemon";
import { Pokemon } from "@/types/pokemon";
import PokemonCard from "./pokemon_card";
import { Button } from "@/components/ui/button";
export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    async function getPokemon() {
      try {
        const offset = (page - 1) * 10;
        const data = await fetchPokemon(offset, 10);
        setPokemonList((prevList) => [...prevList, ...data]);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    }
    getPokemon();
  }, [page]);
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
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
      <Button variant="default" className="mt-10 p-10 mb-10" onClick={loadMore}>
        Load More
      </Button>
    </div>
  );
}
