export interface Pokemon {
  name: string;
  types: string[];
  abilities: string[];
  stats: Record<string, number>;
  sprite: string;
}