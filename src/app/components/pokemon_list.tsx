"use client";
import { useEffect, useState } from "react";
import { fetchPokemon } from "@/hooks/useFetchPokemon";
import { Pokemon } from "@/types/pokemon";
import PokemonCard from "./pokemon_card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
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

  // FILTER LOGIC
  // FIXED FILTER LOGIC
  const filteredPokemonList = () => {
    let filtered = [...pokemonList];

    // Apply type filter if selected
    if (selectedType) {
      filtered = filtered.filter((pokemon) => {
        return pokemon.types.some((type) => {
          const matches =
            type.type.name ===
            selectedType.charAt(0).toLowerCase() + selectedType.slice(1);
          return matches;
        });
      });
    }

    // Apply search query filter (regardless of type selection)
    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(searchQuery) ||
          pokemon.id.toString().includes(searchQuery)
      );
    }

    return filtered;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Pokemon List</h1>
      {/* Filters */}
      <div className="flex flex-row items-center gap-2 mb-4 te">
        <div>
          <Input
            type="text"
            placeholder="Search Pokemon or ID..."
            className="w-full max-w-xs text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="border border-white rounded-md text-lg h-9  pl-10 pr-10 text-white">
              {selectedType ? selectedType : "Select Type"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-lg">
                Select Type
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                "Bug",
                "Dark",
                "Dragon",
                "Electric",
                "Fairy",
                "Fighting",
                "Fire",
                "Ghost",
                "Grass",
                "Ice",
                "Normal",
                "Psychic",
                "Rock",
                "Steel",
                "Water",
              ].map((type) => (
                <DropdownMenuItem
                  key={type}
                  className="text-lg"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                className="text-lg text-red-500"
                onClick={() => setSelectedType(null)}
              >
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-white">
            {filteredPokemonList().map((pokemon: Pokemon) => (
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
