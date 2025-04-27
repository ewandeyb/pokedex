import Link from "next/link";
import { fetchPokemonById } from "@/hooks/useFetchPokemon";
export default async function PokemonDetailedPage({
  params,
}: {
  params: { id: string };
}) {
  const pokemon = await fetchPokemonById(params.id);
  return (
    <div>
      <Link href="/">Back to Pokedex</Link>
    </div>
  );
}
