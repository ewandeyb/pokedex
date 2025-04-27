import { fetchPokemonById, fetchPokemonSpecies } from "@/hooks/useFetchPokemon";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Info, Activity, Swords } from "lucide-react";
import { typeColors } from "@/types/typeColors";

export default async function PokemonDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const pokemon = await fetchPokemonById(id);
  const species = await fetchPokemonSpecies(id);

  // Get English flavor text
  const flavorText = species.flavor_text_entries
    .find(
      (entry: { language: { name: string }; flavor_text: string }) =>
        entry.language.name === "en"
    )
    ?.flavor_text.replace(/\f/g, " ")
    .replace(/\u00ad\n/g, "")
    .replace(/\u00ad/g, "")
    .replace(/\n/g, " ");

  // Get genus (category)
  const genus = species.genera.find(
    (g: { language: { name: string }; genus: string }) =>
      g.language.name === "en"
  )?.genus;

  // Format height and weight
  const heightInMeters = pokemon.height / 10;
  const weightInKg = pokemon.weight / 10;

  // Get primary type for theming
  const primaryType = pokemon.types[0]?.type.name || "normal";

  return (
    <main className="min-h-screen pb-16 bg-primary">
      {/* Hero Section with Pokemon Image and Basic Info */}
      <div
        className={`type-${primaryType} relative pt-16 pb-32 overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Pokédex
          </Link>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl transform scale-90"></div>
              <div className="relative z-10">
                <Image
                  src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.id
                    .toString()
                    .padStart(3, "0")}.png`}
                  alt={pokemon.name}
                  width={350}
                  height={350}
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left text-white">
              <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start mb-4">
                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <h1 className="text-4xl lg:text-5xl font-bold capitalize">
                      {pokemon.name}
                    </h1>
                    <span className="text-xl font-semibold opacity-80">
                      #{pokemon.id.toString().padStart(3, "0")}
                    </span>
                  </div>
                  <p className="text-xl mb-4 opacity-90">{genus}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                {pokemon.types.map((type) => {
                  const typeName = type.type.name;
                  const typeClass =
                    typeColors[typeName] || "bg-gray-200 text-black"; // Default color
                  return (
                    <Badge
                      key={typeName}
                      variant="outline"
                      className={`text-xl font-semibold ${typeClass}`}
                    >
                      {typeName.charAt(0).toUpperCase() + typeName.slice(1)}
                    </Badge>
                  );
                })}
              </div>

              <p className="text-lg mb-8 max-w-2xl opacity-90">{flavorText}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm opacity-80 mb-1">Height</p>
                  <p className="font-semibold text-lg">{heightInMeters} m</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm opacity-80 mb-1">Weight</p>
                  <p className="font-semibold text-lg">{weightInKg} kg</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm opacity-80 mb-1">Habitat</p>
                  <p className="font-semibold text-lg capitalize">
                    {species.habitat?.name || "Unknown"}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm opacity-80 mb-1">Color</p>
                  <p className="font-semibold text-lg capitalize">
                    {species.color.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 bg-white/20 rounded-2xl">
        <div className="rounded-2xl shadow-xl p-6 md:p-8 text-white">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 w-full">
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Stats</span>
              </TabsTrigger>
              <TabsTrigger
                value="abilities"
                className="flex items-center gap-2"
              >
                <Swords className="h-4 w-4" />
                <span className="hidden sm:inline">Abilities</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Base Stats</h2>
              <div className="grid gap-6">
                {pokemon.stats.map((stat) => {
                  const statName = stat.stat.name.replace("-", " ");
                  const percentage = (stat.base_stat / 255) * 100;

                  // Get color based on stat value
                  let statColor = "bg-red-500";
                  if (stat.base_stat >= 80) statColor = "bg-green-500";
                  else if (stat.base_stat >= 50) statColor = "bg-yellow-500";

                  return (
                    <div
                      key={stat.stat.name}
                      className="grid grid-cols-[120px_1fr] gap-4 items-center"
                    >
                      <p className="font-medium capitalize">{statName}</p>
                      <div className="flex items-center gap-3">
                        <div className="h-3 bg-gray-100 rounded-full flex-1">
                          <div
                            className={`h-3 ${statColor} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">
                          {stat.base_stat}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="abilities" className="space-y-6 text-black">
              <h2 className="text-2xl font-bold mb-6 text-white">Abilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg capitalize">
                        {ability.ability.name.replace("-", " ")}
                      </h3>
                      {ability.is_hidden && (
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200"
                        >
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 text-gray-600">
                      {/* Placeholder for ability description */}
                      This ability allows the Pokémon to perform special actions
                      in battle and in the overworld.
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Pokémon Details</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Physical Characteristics
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between py-2 border-b">
                      <span>Height</span>
                      <span className="font-medium">{heightInMeters} m</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span>Weight</span>
                      <span className="font-medium">{weightInKg} kg</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span>Color</span>
                      <span className="font-medium capitalize">
                        {species.color.name}
                      </span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span>Shape</span>
                      <span className="font-medium capitalize">
                        {species.shape?.name || "Unknown"}
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Training</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between py-2 border-b">
                      <span>Base Experience</span>
                      <span className="font-medium">
                        {pokemon.base_experience || "Unknown"}
                      </span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span>Base Happiness</span>
                      <span className="font-medium">
                        {species.base_happiness || "Unknown"}
                      </span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span>Capture Rate</span>
                      <span className="font-medium">
                        {species.capture_rate || "Unknown"}
                      </span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                      <span>Growth Rate</span>
                      <span className="font-medium capitalize">
                        {species.growth_rate?.name || "Unknown"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
