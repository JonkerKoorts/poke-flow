import { Metadata } from "next";
import {
  getPokemonByType,
  getAvailableAbilities,
} from "@/lib/services/api.service";
import TypePageContent from "./type-page-content";

export const metadata: Metadata = {
  title: "Pokemon by Type",
};

interface PageProps {
  params: {
    type: string;
  };
}

const TypePage = async ({ params }: PageProps) => {
  const type = params.type;

  const [initialPokemonData, availableAbilities] = await Promise.all([
    getPokemonByType(type),
    getAvailableAbilities(type),
  ]);

  return (
    <TypePageContent
      type={type}
      initialPokemonData={initialPokemonData || []}
      availableAbilities={availableAbilities || []}
    />
  );
};

export default TypePage;
