"use strict";
/* exported data, writeData, readData */
let mysteryPokemon = readData();
function writeData(Pokemon) {
    const dataJSON = JSON.stringify(Pokemon);
    localStorage.setItem('pokemon-storage', dataJSON);
}
function readData() {
    const pokemonStorage = localStorage.getItem('pokemon-storage');
    if (typeof pokemonStorage === typeof '' && pokemonStorage !== null) {
        console.log('JSON.parse(pokemonStorage)', JSON.parse(pokemonStorage));
        return JSON.parse(pokemonStorage);
    }
    else {
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
