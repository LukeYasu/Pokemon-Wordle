/* exported mysteryPokemon, writeData, readData */

const mysteryPokemon: GamePokemon = readData();

function writeData(Pokemon: GamePokemon): void {
  const dataJSON = JSON.stringify(Pokemon);
  localStorage.setItem('pokemon-storage', dataJSON);
}

function readData(): GamePokemon {
  const pokemonStorage = localStorage.getItem('pokemon-storage');
  if (pokemonStorage !== null) {
    return JSON.parse(pokemonStorage);
  } else {
    return {
      name: '',
      height: 0,
      weight: 0,
      types: [''],
      generation: '',
      stage: 0,
      sprites: '',
    };
  }
}
