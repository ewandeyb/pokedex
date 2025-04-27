import React, { useEffect, useState } from "react";
import { fetchPokemonById, fetchPokemonPhoto } from "@/hooks/useFetchPokemon";
import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
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
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Pokemon Card{" "}
        <span className="text-gray-600">
          # {id.toString().padStart(3, "0")}
        </span>
      </h1>
      <div className="flex items-center bg-white shadow-md rounded-lg p-4 mb-4 w-80">
        <Image
          src={photoUrl}
          alt={`Pokemon #${id}`}
          width={100}
          height={100}
          className="mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold">{pokemon.name}</h2>
          <p>Height: {pokemon.height}</p>
          <p>Weight: {pokemon.weight}</p>
        </div>
      </div>
    </div>
  );
}
