import { useEffect, useState } from "react";
import { fetchPokemonById, fetchPokemonPhoto } from "@/hooks/useFetchPokemon";
import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { typeColors } from "@/types/typeColors";
import {
  Card,
  CardContent,
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
      <div>
        <Card className="bg-white/2 text-white">
          <CardHeader>
            <CardTitle>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              <span className="text-sm text-gray-500">
                {" "}
                #{id.toString().padStart(3, "0")}
              </span>
            </CardTitle>
            <CardDescription>
              <Image
                src={photoUrl}
                alt={`Pokemon #${id}`}
                width={100}
                height={100}
                className="mr-4"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
          </CardContent>
          <CardFooter>
            {pokemon.types.map((type) => {
              const typeName = type.type.name;
              const typeClass =
                typeColors[typeName] || "bg-gray-200 text-black"; // Default color
              return (
                <Badge
                  key={typeName}
                  variant="outline"
                  className={`mr-2 ${typeClass}`}
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
