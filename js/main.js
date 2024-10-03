"use strict";
const $textInput = document.querySelector('.text-input');
const $form = document.querySelector('form');
const $guessRow = document.querySelector('.guess-row');
const $scrollbox = document.querySelector('.scrollbox');
if (!$textInput)
    throw new Error('$textInput query failed');
if (!$form)
    throw new Error('$form query failed');
if (!$guessRow)
    throw new Error('$guessRow query failed');
if (!$scrollbox)
    throw new Error('$scrollbox query failed');
const guessPokemon = {};
const guesses = [];
const guessBGColor = {
    pokemonBGColor: '',
    type1BGColor: '',
    type2BGColor: '',
    weightBG: '',
    heightBG: '',
    generationBG: '',
    evoStageBG: '',
};
const backgrounds = {
    red: '',
};
const randomNum = Math.random();
const randomPokeNum = (randomNum * 1000).toFixed(0);
async function fetchData(pokemon, pokeId) {
    try {
        const fetchResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
        if (!fetchResponse.ok) {
            throw new Error(`HTTP Error! Status: ${fetchResponse}`);
        }
        const data = (await fetchResponse.json());
        const { id, name, height, weight, types, sprites } = data;
        const typeNames = types.map((typeInfo) => typeInfo.type.name);
        pokemon.name = name;
        pokemon.height = height;
        pokemon.weight = weight;
        pokemon.types = typeNames;
        pokemon.sprites = sprites.front_default;
        if (pokemon.types.length < 2) {
            pokemon.types.push('N/A');
        }
        handleRegion(id, pokemon);
        await fetchEvoChain(`https://pokeapi.co/api/v2/pokemon-species/${id}/`, name, pokemon);
        mysteryPokemonLocalStorage();
    }
    catch (error) {
        console.error('Error: ', error);
    }
}
async function fetchEvoChain(evoSpeciesUrl, name, pokemon) {
    try {
        const chainResponse = await fetch(evoSpeciesUrl);
        if (!chainResponse.ok) {
            throw new Error(`HTTP Error! Status: ${chainResponse}`);
        }
        const EvoChainData = (await chainResponse.json());
        await fetchEvoStage(EvoChainData.evolution_chain.url, name, pokemon);
    }
    catch (error) {
        console.error('Error: ', error);
    }
}
async function fetchEvoStage(evoChainUrl, name, pokemon) {
    try {
        const chainResponse = await fetch(evoChainUrl);
        if (!chainResponse.ok) {
            throw new Error(`HTTP Error! Status: ${chainResponse}`);
        }
        const speciesData = (await chainResponse.json());
        let stageNum = 1;
        if (speciesData.chain.species.name &&
            speciesData.chain.species.name === name) {
            // const firstStage = speciesData.chain.species.name;
            stageNum = 1;
            pokemon.stage = stageNum;
        }
        if (speciesData.chain.evolves_to[0].species.name &&
            speciesData.chain.evolves_to[0].species.name === name) {
            // const secondStage = speciesData.chain.evolves_to[0].species.name;
            stageNum = 2;
            pokemon.stage = stageNum;
        }
        if (speciesData.chain.evolves_to[0].evolves_to[0].species.name &&
            speciesData.chain.evolves_to[0].evolves_to[0].species.name === name) {
            // const thirdStage =
            //   speciesData.chain.evolves_to[0].evolves_to[0].species.name;
            stageNum = 3;
            pokemon.stage = stageNum;
        }
    }
    catch (error) {
        console.error('Error: ', error);
    }
}
function handleRegion(num, pokemon) {
    let generation = 0;
    if (num >= 1 && num <= 151) {
        generation = 1;
    }
    else if (num >= 152 && num <= 251) {
        generation = 2;
    }
    else if (num >= 252 && num <= 386) {
        generation = 3;
    }
    else if (num >= 387 && num <= 493) {
        generation = 4;
    }
    else if (num >= 494 && num <= 649) {
        generation = 5;
    }
    else if (num >= 650 && num <= 719) {
        generation = 6;
    }
    else if (num >= 722 && num <= 809) {
        generation = 7;
    }
    else if (num >= 810 && num <= 905) {
        generation = 8;
    }
    else if (num >= 906 && num <= 1025) {
        generation = 9;
    }
    pokemon.generation = generation;
}
function mysteryPokemonLocalStorage() {
    if (!mysteryPokemon.isSolved) {
        mysteryPokemon.isSolved = false;
        writeData(mysteryPokemon);
        console.log('mysteryPokemon isSolved === undefined: ', mysteryPokemon);
    }
    else if (mysteryPokemon.isSolved === true) {
        mysteryPokemon.isSolved = false;
        writeData(mysteryPokemon);
        console.log('mysteryPokemon isSolved === true: ', mysteryPokemon);
    }
}
$form.addEventListener('submit', handleSubmit);
async function handleSubmit(event) {
    event.preventDefault();
    const guessPokemonText = $textInput.value;
    $textInput.value = '';
    await fetchData(guessPokemon, guessPokemonText);
    console.log('guessPokemon: ', guessPokemon);
    compareAnswer(mysteryPokemon, guessPokemon);
}
document.addEventListener('DOMContentLoaded', () => {
    if (mysteryPokemon.isSolved === undefined) {
        fetchData(mysteryPokemon, randomPokeNum);
    }
});
function compareAnswer(mysteryPokemon, guessPokemon) {
    if (guessPokemon.name === mysteryPokemon.name) {
        guessBGColor.pokemonBGColor = 'green';
    }
    else {
        guessBGColor.pokemonBGColor = 'red';
    }
    if ((guessPokemon.types[0] &&
        guessPokemon.types[0] === mysteryPokemon.types[0]) ||
        guessPokemon.types[0] === mysteryPokemon.types[1]) {
        guessBGColor.type1BGColor = 'green';
    }
    else {
        guessBGColor.type1BGColor = 'red';
    }
    if ((guessPokemon.types[1] &&
        guessPokemon.types[1] === mysteryPokemon.types[0]) ||
        guessPokemon.types[1] === mysteryPokemon.types[1]) {
        guessBGColor.type2BGColor = 'green';
    }
    else {
        guessBGColor.type2BGColor = 'red';
    }
    if (guessPokemon.weight === mysteryPokemon.weight) {
        guessBGColor.weightBG = 'green';
    }
    else if (guessPokemon.weight > mysteryPokemon.weight) {
        guessBGColor.weightBG = 'redDown';
    }
    else if (guessPokemon.weight < mysteryPokemon.weight) {
        guessBGColor.weightBG = 'redUp';
    }
    if (guessPokemon.height === mysteryPokemon.height) {
        guessBGColor.heightBG = 'green';
    }
    else if (guessPokemon.height > mysteryPokemon.height) {
        guessBGColor.heightBG = 'redDown';
    }
    else if (guessPokemon.height < mysteryPokemon.height) {
        guessBGColor.heightBG = 'redUp';
    }
    if (guessPokemon.generation === mysteryPokemon.generation) {
        guessBGColor.generationBG = 'green';
    }
    else if (guessPokemon.generation > mysteryPokemon.generation) {
        guessBGColor.generationBG = 'redDown';
    }
    else if (guessPokemon.generation < mysteryPokemon.generation) {
        guessBGColor.generationBG = 'redUp';
    }
    if (guessPokemon.stage === mysteryPokemon.stage) {
        guessBGColor.evoStageBG = 'green';
    }
    else if (guessPokemon.stage > mysteryPokemon.stage) {
        guessBGColor.evoStageBG = 'redDown';
    }
    else if (guessPokemon.stage < mysteryPokemon.stage) {
        guessBGColor.evoStageBG = 'redUp';
    }
    console.log('guessBGColor', guessBGColor);
}
function renderGuess() {
    const $divGuessRow = document.createElement('div');
    $divGuessRow.setAttribute('class', 'row guess-row');
    const $divGuessName = document.createElement('div');
    $divGuessName.textContent = 'eiuqeuqoieuqoequowiqu';
    $divGuessRow.append($scrollbox);
    $divGuessName.append($divGuessRow);
    return $divGuessRow;
}
renderGuess();
