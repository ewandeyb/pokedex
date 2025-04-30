import { useEffect, useState } from "react";
import { fetchPokemonById, fetchPokemonPhoto } from "@/hooks/useFetchPokemon";
import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { typeColors } from "@/types/pokemonTypes";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PokemonCard({ id }: { id: number }) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedPokemon = await fetchPokemonById(id.toString());
        const fetchedPhotoUrl = await fetchPokemonPhoto(id);
        setPokemon(fetchedPokemon);
        setPhotoUrl(fetchedPhotoUrl);
      } catch (err) {
        setError("Failed to load Pokemon data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!pokemon || !photoUrl) {
    return <p>No data available.</p>;
  }

  return (
    <Link href={`/pokemon/${id}`}>
      <div className="flex justify-center">
        <Card className="bg-white/2 text-white w-96 p-4 hover:bg-white/20">
          {" "}
          {/* Increased card width and added padding */}
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-center text-xl font-bold">
              {" "}
              {/* Increased font size and made it bold */}
              {pokemon?.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              <span className="text-lg text-gray-500">
                {" "}
                {/* Increased font size for the ID */} #
                {id.toString().padStart(3, "0")}
              </span>
            </CardTitle>
            <CardDescription className="border border-gray-300 rounded-lg p-2 mt-2">
              <Image
                src={photoUrl}
                alt={`Pokemon #${id}`}
                width={150}
                height={150}
                className="mx-auto"
              />
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            {pokemon.types.map((type) => {
              const typeName = type.type.name;
              const typeClass =
                typeColors[typeName] || "bg-gray-200 text-black"; // Default color
              return (
                <Badge
                  key={typeName}
                  variant="outline"
                  className={`text-xl font-semibold mr-2 ${typeClass}`}
                >
                  {typeName.charAt(0).toUpperCase() + typeName.slice(1)}
                </Badge>
              );
            })}
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
}
