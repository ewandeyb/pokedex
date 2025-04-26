export interface Ability {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  order: number;
  weight: number;
  abilities: Ability[];
  sprites: {
    official_artwork: {
      front_default: string;
      front_shiny: string;
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  };
}
