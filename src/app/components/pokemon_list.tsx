"use client";
import { useEffect, useState } from "react";
import { fetchPokemon } from "@/hooks/useFetchPokemon";
import { Pokemon } from "@/types/pokemon";
import PokemonCard from "./pokemon_card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  // Function to load Pokemon data
  const loadPokemon = async (currentOffset: number, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const data = await fetchPokemon(currentOffset, limit);

      if (append) {
        setPokemonList((prevList) => [...prevList, ...data]);
      } else {
        setPokemonList(data);
      }
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPokemon(0);

    // Clean up when component unmounts
    return () => {
      setPokemonList([]);
      setOffset(0);
    };
  }, []);

  // Handle "Load More" button click
  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    loadPokemon(newOffset, true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Pokemon List</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-white">
            {pokemonList.map((pokemon) => (
              <div key={pokemon.id} className="mb-4">
                <PokemonCard id={pokemon.id} />
              </div>
            ))}
          </div>

          <Button
            variant="default"
            className="mt-10 py-6 px-8 mb-10"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
