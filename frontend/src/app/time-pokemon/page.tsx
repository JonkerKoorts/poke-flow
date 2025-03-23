import { getTimeBasedPokemon } from "@/lib/services/api.service";
import TimePokemonContent from "./time-pokemon-content";

const TimePokemonPage = async () => {
  const initialData = await getTimeBasedPokemon();
  return <TimePokemonContent initialData={initialData} />;
};

export default TimePokemonPage;
