"use client";
import { useEffect, useState } from "react";
import { fetchPokemon } from "@/hooks/useFetchPokemon";
import { Pokemon } from "@/types/pokemon";
import PokemonCard from "./pokemon_card";
import { Button } from "@/components/ui/button";
import { Filter, Loader2, Search, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function PokemonList() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<"name" | "id">("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
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

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortOption === "name") {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a.id - b.id;
      }
      return order === "asc" ? comparison : -comparison;
    });

    return filtered;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-5xl font-bold mb-8 text-white">Pokemon List</h1>

      {/* Filters */}
      <div className="w-full max-w-5xl bg-white/20 rounded-xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-4 h-6 w-6 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Pokemon or ID..."
              className="w-full text-white text-lg h-14 pl-12 pr-4 rounded-lg border-2  focus:border-white transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="flex-1 min-w-[200px]">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full bg-white/20 border-2 border-gray-600 hover:border-white rounded-lg text-lg h-14 px-4 text-white flex items-center justify-between transition-colors">
                <div className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  <span>{selectedType ? selectedType : "Select Type"}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel className="text-lg">
                  Pokemon Types
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
                    className="text-lg cursor-pointer"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-lg text-red-500 cursor-pointer"
                  onClick={() => setSelectedType(null)}
                >
                  Clear Filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sort By */}
          <div className="flex-1 min-w-[200px]">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full bg-white/20 border-2 border-gray-600 hover:border-white rounded-lg text-lg h-14 px-4 text-white flex items-center justify-between transition-colors">
                <div className="flex items-center">
                  <span>Sort by: {sortOption === "name" ? "Name" : "ID"}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel className="text-lg">
                  Sort Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-lg cursor-pointer"
                  onClick={() => setSortOption("name")}
                >
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-lg cursor-pointer"
                  onClick={() => setSortOption("id")}
                >
                  ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Order */}
          <div className="flex-1 min-w-[200px]">
            <Button
              className="w-full bg-white/20 border-2 border-gray-600 hover:border-white rounded-lg text-lg h-14 text-white flex items-center justify-between transition-colors"
              onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
            >
              <div className="flex items-center">
                {order === "asc" ? (
                  <SortAsc className="mr-2 h-5 w-5" />
                ) : (
                  <SortDesc className="mr-2 h-5 w-5" />
                )}
                <span>{order === "asc" ? "Ascending" : "Descending"}</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Selected filters display */}
        {(selectedType || query) && (
          <div className="mt-4 flex items-center">
            <span className="text-gray-400 mr-2">Active filters:</span>
            {selectedType && (
              <div className="bg-blue-800/50 text-white rounded-full px-3 py-1 text-sm mr-2 flex items-center">
                Type: {selectedType}
                <button
                  className="ml-2 text-white hover:text-red-300"
                  onClick={() => setSelectedType(null)}
                >
                  ×
                </button>
              </div>
            )}
            {query && (
              <div className="bg-purple-800/50 text-white rounded-full px-3 py-1 text-sm flex items-center">
                Search: {query}
                <button
                  className="ml-2 text-white hover:text-red-300"
                  onClick={() => setQuery("")}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
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
            className="mt-10 py-6 px-12 mb-10 text-xl rounded-xl"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <Skeleton />
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
