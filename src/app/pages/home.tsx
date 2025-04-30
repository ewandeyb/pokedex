import FeaturedPokemon from "../components/featured_pokemon";
import { fetchPokemonById } from "@/hooks/useFetchPokemon";
import PokemonList from "../components/pokemon_list";
export default async function Home() {
  const randomizer = Math.floor(Math.random() * 1008) + 1;
  const pokemon = await fetchPokemonById(randomizer.toString());

  return (
    <main className=" bg-[#111]">
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">Pokédex</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore the world of Pokémon! Discover, catch, and train your
            favorite!
          </p>
        </div>

        {/* Featured Pokémon - pokemon */}
        <section className="mx-auto flex flex-col justify-center w-[75%]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Featured Pokémon
            </h2>
          </div>
          <FeaturedPokemon pokemon={pokemon} />
        </section>

        {/* Pokémon List */}
        <PokemonList />
      </div>
    </main>
  );
}
