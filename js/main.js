'use strict';
const $textInput = document.querySelector('.text-input');
if (!$textInput) throw new Error('$textInput query failed');
const mysteryPokemon = {};
const guessPokemon = {};
const randomNum = Math.random();
const randomPokeNum = (randomNum * 1000).toFixed(0);
console.log('pokeNum: ', randomPokeNum);
// handleRegion(parseInt(randomPokeNum));
async function fetchData(pokemon, pokeId) {
  try {
    const fetchResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokeId}`,
    );
    if (!fetchResponse.ok) {
      throw new Error(`HTTP Error! Status: ${fetchResponse}`);
    }
    const data = await fetchResponse.json();
    const { id, name, height, weight, types, sprites } = data;
    const typeNames = types.map((typeInfo) => typeInfo.type.name);
    pokemon.name = name;
    pokemon.height = height;
    pokemon.weight = weight;
    pokemon.types = typeNames;
    pokemon.sprites = sprites.front_default;
    handleRegion(id, pokemon);
    fetchEvoChain(
      `https://pokeapi.co/api/v2/pokemon-species/${id}/`,
      name,
      pokemon,
    );
    console.log(pokemon);
  } catch (error) {
    console.error('Error: ', error);
  }
}
async function fetchEvoChain(evoSpeciesUrl, name, pokemon) {
  try {
    const chainResponse = await fetch(evoSpeciesUrl);
    if (!chainResponse.ok) {
      throw new Error(`HTTP Error! Status: ${chainResponse}`);
    }
    const EvoChainData = await chainResponse.json();
    fetchEvoStage(EvoChainData.evolution_chain.url, name, pokemon);
  } catch (error) {
    console.error('Error: ', error);
  }
}
async function fetchEvoStage(evoChainUrl, name, pokemon) {
  try {
    const chainResponse = await fetch(evoChainUrl);
    if (!chainResponse.ok) {
      throw new Error(`HTTP Error! Status: ${chainResponse}`);
    }
    const speciesData = await chainResponse.json();
    let stageNum = 0;
    if (
      speciesData.chain.species.name &&
      speciesData.chain.species.name === name
    ) {
      // const firstStage = speciesData.chain.species.name;
      stageNum = 1;
      pokemon.stage = stageNum;
      return;
    }
    if (
      speciesData.chain.evolves_to[0].species.name &&
      speciesData.chain.evolves_to[0].species.name === name
    ) {
      // const secondStage = speciesData.chain.evolves_to[0].species.name;
      stageNum = 2;
      pokemon.stage = stageNum;
      return;
    }
    if (
      speciesData.chain.evolves_to[0].evolves_to[0].species.name &&
      speciesData.chain.evolves_to[0].evolves_to[0].species.name === name
    ) {
      // const thirdStage =
      //   speciesData.chain.evolves_to[0].evolves_to[0].species.name;
      stageNum = 3;
      pokemon.stage = stageNum;
      return;
    }
    console.log('stageNum: ', stageNum);
  } catch (error) {
    console.error('Error: ', error);
  }
}
function handleRegion(num, pokemon) {
  let generation = '';
  if (num >= 1 && num <= 151) {
    generation = 'Gen 1';
  } else if (num >= 152 && num <= 251) {
    generation = 'Gen 2';
  } else if (num >= 252 && num <= 386) {
    generation = 'Gen 3';
  } else if (num >= 387 && num <= 493) {
    generation = 'Gen 4';
  } else if (num >= 494 && num <= 649) {
    generation = 'Gen 5';
  } else if (num >= 650 && num <= 719) {
    generation = 'Gen 6';
  } else if (num >= 722 && num <= 809) {
    generation = 'Gen 7';
  } else if (num >= 810 && num <= 905) {
    generation = 'Gen 8';
  } else if (num >= 906 && num <= 1025) {
    generation = 'Gen 9';
  }
  pokemon.generation = generation;
}
fetchData(mysteryPokemon, randomPokeNum);
fetchData(guessPokemon, 6);
