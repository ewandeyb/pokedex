import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Pokemon } from "@/types/pokemon";
import { typeColors } from "@/types/pokemonTypes";

interface FeaturedPokemonProps {
  pokemon: Pokemon;
}

export default function FeaturedPokemon({ pokemon }: FeaturedPokemonProps) {
  // Format ID with leading zeros
  const formattedId = `#${pokemon.id.toString().padStart(3, "0")}`;

  return (
    <div className="rounded-3xl overflow-hidden">
      <div className={`relative pt-12 pb-24`}>
        <div className="absolute  bg-gradient-to-b from-black/30 to-transparent"></div>

        {/* Pokemon ID and Name on top */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <span className="text-2xl font-bold text-white/80">
              {formattedId}
            </span>
            <div className="flex gap-2">
              {pokemon.types.map((type) => {
                const typeName = type.type.name;
                const typeClass =
                  typeColors[typeName] || "bg-gray-200 text-black";
                return (
                  <Badge
                    key={typeName}
                    variant="outline"
                    className={`text-xl font-semibold px-3 py-1 ${typeClass}`}
                  >
                    {typeName.charAt(0).toUpperCase() + typeName.slice(1)}
                  </Badge>
                );
              })}
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold capitalize text-white text-center mb-10">
            {pokemon.name}
          </h2>
        </div>

        {/* Centered Pokemon Image that overflows into the white section */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2">
          <div
            className={`absolute inset-0 rounded-full blur-3xl opacity-20 scale-75`}
          ></div>
          <Image
            src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.id
              .toString()
              .padStart(3, "0")}.png`}
            alt={pokemon.name}
            width={300}
            height={300}
            className="relative z-20 object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Card Body with Pokemon Details */}
      <div className="bg-white/10 dark:bg-gray-900 pt-40 pb-8 px-6 md:px-10 rounded-b-3xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-500 mb-1 font-black">Base XP</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {pokemon.base_experience}
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-500 mb-1 font-black">Weight</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {pokemon.weight / 10} kg
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-500 mb-1 font-black">Height</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {pokemon.height / 10} m
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-xs text-gray-500 mb-1 font-black">Ability</p>
            <p className="font-bold text-gray-900 dark:text-white capitalize text-center">
              {pokemon.abilities[0]?.ability.name.replace("-", " ")}
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href={`/pokemon/${pokemon.id}`}>
            <Button className={`hover:opacity-90 transition-opacity`}>
              View Complete Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
