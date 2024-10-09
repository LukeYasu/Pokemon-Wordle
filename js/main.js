'use strict';
/* global mysteryPokemon, writeData */
const $textInput = document.querySelector('.text-input');
const $form = document.querySelector('form');
const $guessRow = document.querySelector('.guess-row');
const $scrollbox = document.querySelector('.scrollbox');
const $winModal = document.querySelector('.win-modal');
const $modalSprite = document.querySelector('.modal-sprite');
const $modalName = document.querySelector('.modal-name');
const $closeModalButton = document.querySelector('.close-modal');
const $modalPlayAgain = document.querySelector('.modal-play-again');
const $gameContent = document.querySelector('.game-content');
const $hintBox = document.querySelector('.hint-box');
const $hintsClose = document.querySelector('.hints-close');
const $hintButton = document.querySelector('.hint-button');
const $hintOpenButton1 = document.querySelector('.hint-open-button1');
const $hintOpenButton2 = document.querySelector('.hint-open-button2');
const $hintOpenButton3 = document.querySelector('.hint-open-button3');
const $hintOpenButton4 = document.querySelector('.hint-open-button4');
const $hintAnswer1Box = document.querySelector('.hint-answer1-box');
const $hintAnswer2Box = document.querySelector('.hint-answer2-box');
const $hintAnswer3Box = document.querySelector('.hint-answer3-box');
const $hintAnswer4Box = document.querySelector('.hint-answer4-box');
const $hint1Sprite = document.querySelector('.hint-sprite-1');
const $hint2 = document.querySelector('.hint2');
const $hint4 = document.querySelector('.hint4');
const $hint3Sprite = document.querySelector('.hint-sprite-3');
const $hintModalBackground = document.querySelector('.hint-modal-background');
const $giveUpButton = document.querySelector('.give-up-button');
const $newGameButton = document.querySelector('.new-game-button');
const $dropdownScrollbox = document.querySelector('.dropdown-scrollbox');
const $dropdownULElement = document.querySelector('.text-input-dropdown');
if (!$textInput) throw new Error('$textInput query failed');
if (!$form) throw new Error('$form query failed');
if (!$guessRow) throw new Error('$guessRow query failed');
if (!$scrollbox) throw new Error('$scrollbox query failed');
if (!$winModal) throw new Error('$winModal query failed');
if (!$modalSprite) throw new Error('$modalSprite query failed');
if (!$modalName) throw new Error('$modalName query failed');
if (!$closeModalButton) throw new Error('$closeModalButton query failed');
if (!$modalPlayAgain) throw new Error('$modalPlayAgain query failed');
if (!$gameContent) throw new Error('$gameContent query selector failed');
if (!$hintBox) throw new Error('$hintBox query failed');
if (!$hintsClose) throw new Error('$hintsClose query failed');
if (!$hintButton) throw new Error('$hintButton query failed');
if (!$hintOpenButton1) throw new Error('$hintOpenButton1 query failed');
if (!$hintOpenButton2) throw new Error('$hintOpenButton2 query failed');
if (!$hintOpenButton3) throw new Error('$hintOpenButton3 query failed');
if (!$hintOpenButton4) throw new Error('$hintOpenButton4 query failed');
if (!$hintAnswer1Box) throw new Error('$hintAnswer1Box query failed');
if (!$hintAnswer2Box) throw new Error('$hintAnswer2Box query failed');
if (!$hintAnswer3Box) throw new Error('$hintAnswer3Box query failed');
if (!$hintAnswer4Box) throw new Error('$hintAnswer4Box query failed');
if (!$hint1Sprite) throw new Error('$hint1Sprite query failed');
if (!$hint2) throw new Error('$hint2 query failed');
if (!$hint4) throw new Error('$hint4 query failed');
if (!$hint3Sprite) throw new Error('$hint3Sprite query failed');
if (!$hintModalBackground) throw new Error('$hintModalbackground query failed');
if (!$giveUpButton) throw new Error('$giveUpButton query failed');
if (!$newGameButton) throw new Error('$newGameButton query failed');
if (!$dropdownScrollbox) throw new Error('$dropdownScrollbox query failed');
if (!$dropdownULElement) throw new Error('$dropdownULElement query failed');
const guessPokemon = {};
const guessBGColor = {
  pokemonBGColor: '',
  type1BGColor: '',
  type2BGColor: '',
  weightBG: '',
  heightBG: '',
  generationBG: '',
  evoStageBG: '',
};
const allPokemonArray = [];
const randomNum = Math.random();
const randomPokeNum = (randomNum * 1000).toFixed(0);
$textInput.addEventListener('input', () => {
  const currentTextInput = $textInput.value.trim();
  while ($dropdownScrollbox.firstChild) {
    $dropdownScrollbox.removeChild($dropdownScrollbox.firstChild);
  }
  if (currentTextInput === '') {
    return;
  }
  const $dropdownULElement = document.createElement('ul');
  $dropdownULElement.setAttribute('class', 'text-input-dropdown');
  for (let i = 0; i < allPokemonArray.length; i++) {
    if (
      currentTextInput ===
      allPokemonArray[i].name.slice(0, currentTextInput.length)
    ) {
      $dropdownScrollbox.append($dropdownULElement);
      $dropdownULElement.append(
        renderDropdown(allPokemonArray[i].sprite, allPokemonArray[i].name),
      );
    }
  }
});
$dropdownScrollbox.addEventListener('click', (event) => {
  const eventTarget = event.target;
  if (
    eventTarget.matches(
      '.dropdown-list-element, .dropdown-name, .text-input-dropdown-img',
    )
  ) {
    const listElement = eventTarget.closest('.dropdown-list-element');
    if (listElement && listElement.textContent) {
      $textInput.value = listElement?.textContent;
      $textInput.focus();
    }
  }
  const inputEvent = new Event('input', { bubbles: true });
  $textInput.dispatchEvent(inputEvent);
});
$winModal.addEventListener('click', (event) => {
  const eventTarget = event.target;
  if (eventTarget === $closeModalButton) {
    $winModal.remove();
  }
  if (eventTarget === $modalPlayAgain) {
    location.reload();
  }
});
$hintButton.addEventListener('click', (event) => {
  const eventTarget = event.target;
  if (eventTarget === $hintButton) {
    $hintBox.setAttribute('class', 'hint-box');
    $hintModalBackground.setAttribute('class', 'hint-modal-background');
  }
});
$hintBox.addEventListener('click', (event) => {
  const eventTarget = event.target;
  if (eventTarget === $hintsClose) {
    $hintBox.setAttribute('class', 'hidden hint-box');
    $hintModalBackground.setAttribute('class', 'hint-modal-background hidden');
  }
  if (eventTarget === $hintOpenButton1 && $hintAnswer1Box.matches('.hidden')) {
    $hintAnswer1Box.setAttribute('class', 'hint-answer hint-answer1-box');
  } else if (
    eventTarget === $hintOpenButton1 &&
    !$hintAnswer1Box.matches('.hidden')
  ) {
    $hintAnswer1Box.setAttribute(
      'class',
      'hidden hint-answer hint-answer1-box',
    );
  }
  if (eventTarget === $hintOpenButton2 && $hintAnswer2Box.matches('.hidden')) {
    $hintAnswer2Box.setAttribute('class', 'hint-answer2-box hint-answer hint2');
  } else if (
    eventTarget === $hintOpenButton2 &&
    !$hintAnswer2Box.matches('.hidden')
  ) {
    $hintAnswer2Box.setAttribute(
      'class',
      'hint-answer2-box hint-answer hidden',
    );
  }
  if (eventTarget === $hintOpenButton3 && $hintAnswer3Box.matches('.hidden')) {
    $hintAnswer3Box.setAttribute('class', 'hint-answer hint-answer-3-box');
  } else if (
    eventTarget === $hintOpenButton3 &&
    !$hintAnswer3Box.matches('.hidden')
  ) {
    $hintAnswer3Box.setAttribute(
      'class',
      'hint-answer3-box hint-answer hidden',
    );
  }
  if (eventTarget === $hintOpenButton4 && $hintAnswer4Box.matches('.hidden')) {
    $hintAnswer4Box.setAttribute('class', 'hint-answer2-box hint-answer hint2');
  } else if (
    eventTarget === $hintOpenButton4 &&
    !$hintAnswer4Box.matches('.hidden')
  ) {
    $hintAnswer4Box.setAttribute(
      'class',
      'hint-answer2-box hint-answer hidden',
    );
  }
  if (eventTarget === $giveUpButton) {
    $textInput.value = mysteryPokemon.name;
  }
});
$newGameButton.addEventListener('click', () => {
  location.reload();
});
document.addEventListener('DOMContentLoaded', () => {
  $winModal.setAttribute('class', 'hidden win-modal');
  if (mysteryPokemon.isSolved === undefined) {
    fetchData(mysteryPokemon, randomPokeNum);
  }
  getHints();
});
fetchAllPokemon();
$form.addEventListener('submit', handleSubmit);
async function handleSubmit(event) {
  event.preventDefault();
  $textInput.focus();
  while ($dropdownScrollbox.firstChild) {
    $dropdownScrollbox.removeChild($dropdownScrollbox.firstChild);
  }
  const guessPokemonText = $textInput.value;
  const fetchSuccess = await fetchData(guessPokemon, guessPokemonText);
  $textInput.placeholder = '';
  if (fetchSuccess === false) {
    $textInput.placeholder = ' Enter Valid Pokemon';
    $form.reset();
    return;
  }
  $form.reset();
  compareAnswer(mysteryPokemon, guessPokemon);
  winModal(guessBGColor.pokemonBGColor);
}
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
    if (pokemon.types.length < 2) {
      pokemon.types.push('N/A');
    }
    handleRegion(id, pokemon);
    await fetchEvoChain(
      `https://pokeapi.co/api/v2/pokemon-species/${id}/`,
      name,
      pokemon,
    );
    mysteryPokemonLocalStorage();
    return true;
  } catch (error) {
    console.error('Error: ', error);
    return false;
  }
}
async function fetchEvoChain(evoSpeciesUrl, name, pokemon) {
  try {
    const chainResponse = await fetch(evoSpeciesUrl);
    if (!chainResponse.ok) {
      throw new Error(`HTTP Error! Status: ${chainResponse}`);
    }
    const EvoChainData = await chainResponse.json();
    await fetchEvoStage(EvoChainData.evolution_chain.url, name, pokemon);
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
    let stageNum = 1;
    if (
      speciesData.chain.species.name &&
      speciesData.chain.species.name === name
    ) {
      stageNum = 1;
      pokemon.stage = stageNum;
    }
    if (
      speciesData.chain.evolves_to[0].species.name &&
      speciesData.chain.evolves_to[0].species.name === name
    ) {
      stageNum = 2;
      pokemon.stage = stageNum;
    }
    if (
      speciesData.chain.evolves_to[0].evolves_to[0].species.name &&
      speciesData.chain.evolves_to[0].evolves_to[0].species.name === name
    ) {
      stageNum = 3;
      pokemon.stage = stageNum;
    }
  } catch (error) {
    console.error('Error: ', error);
  }
}
function handleRegion(num, pokemon) {
  let generation = '';
  if (num >= 1 && num <= 151) {
    generation = '1 Kanto';
  } else if (num >= 152 && num <= 251) {
    generation = '2 Jhoto';
  } else if (num >= 252 && num <= 386) {
    generation = '3 Hoenn';
  } else if (num >= 387 && num <= 493) {
    generation = '4 Sinnoh';
  } else if (num >= 494 && num <= 649) {
    generation = '5 Unova';
  } else if (num >= 650 && num <= 721) {
    generation = '6 Kalos';
  } else if (num >= 722 && num <= 809) {
    generation = '7 Alola';
  } else if (num >= 810 && num <= 905) {
    generation = '8 Galar';
  } else if (num >= 906 && num <= 1025) {
    generation = '9 Paldea';
  }
  pokemon.generation = generation;
}
function mysteryPokemonLocalStorage() {
  if (!mysteryPokemon.isSolved) {
    mysteryPokemon.isSolved = false;
    writeData(mysteryPokemon);
  } else if (mysteryPokemon.isSolved === true) {
    mysteryPokemon.isSolved = false;
    writeData(mysteryPokemon);
  }
}
function compareAnswer(mysteryPokemon, guessPokemon) {
  if (guessPokemon.name === mysteryPokemon.name) {
    guessBGColor.pokemonBGColor = 'green-background';
  } else {
    guessBGColor.pokemonBGColor = 'red-background';
  }
  if (
    (guessPokemon.types[0] &&
      guessPokemon.types[0] === mysteryPokemon.types[0]) ||
    guessPokemon.types[0] === mysteryPokemon.types[1]
  ) {
    guessBGColor.type1BGColor = 'green-background';
  } else {
    guessBGColor.type1BGColor = 'red-background';
  }
  if (
    (guessPokemon.types[1] &&
      guessPokemon.types[1] === mysteryPokemon.types[0]) ||
    guessPokemon.types[1] === mysteryPokemon.types[1]
  ) {
    guessBGColor.type2BGColor = 'green-background';
  } else {
    guessBGColor.type2BGColor = 'red-background';
  }
  if (guessPokemon.weight === mysteryPokemon.weight) {
    guessBGColor.weightBG = 'green-background';
  } else if (guessPokemon.weight > mysteryPokemon.weight) {
    guessBGColor.weightBG = 'red-down-background';
  } else if (guessPokemon.weight < mysteryPokemon.weight) {
    guessBGColor.weightBG = 'red-up-background';
  }
  if (guessPokemon.height === mysteryPokemon.height) {
    guessBGColor.heightBG = 'green-background';
  } else if (guessPokemon.height > mysteryPokemon.height) {
    guessBGColor.heightBG = 'red-down-background';
  } else if (guessPokemon.height < mysteryPokemon.height) {
    guessBGColor.heightBG = 'red-up-background';
  }
  if (guessPokemon.generation === mysteryPokemon.generation) {
    guessBGColor.generationBG = 'green-background';
  } else if (guessPokemon.generation[0] > mysteryPokemon.generation[0]) {
    guessBGColor.generationBG = 'red-down-background';
  } else if (guessPokemon.generation[0] < mysteryPokemon.generation[0]) {
    guessBGColor.generationBG = 'red-up-background';
  }
  if (guessPokemon.stage === mysteryPokemon.stage) {
    guessBGColor.evoStageBG = 'green-background';
  } else if (guessPokemon.stage > mysteryPokemon.stage) {
    guessBGColor.evoStageBG = 'red-down-background';
  } else if (guessPokemon.stage < mysteryPokemon.stage) {
    guessBGColor.evoStageBG = 'red-up-background';
  }
  renderGuess(guessPokemon);
  winModal(guessBGColor.pokemonBGColor);
}
function renderGuess(pokemon) {
  const $divGuessRow = document.createElement('div');
  $divGuessRow.setAttribute('class', 'row guess-row');
  const $divGuessName = document.createElement('div');
  $divGuessName.setAttribute('class', 'guess-name');
  $divGuessName.textContent = pokemon.name;
  const $divGuessSprite = document.createElement('div');
  $divGuessSprite.setAttribute(
    'class',
    `guess-square sprite ${guessBGColor.pokemonBGColor}`,
  );
  $divGuessSprite.style.backgroundImage = `url("${guessPokemon.sprites}")`;
  const $divGuessSquareTypes = document.createElement('div');
  $divGuessSquareTypes.setAttribute('class', 'guess-square types');
  const $divType1 = document.createElement('div');
  $divType1.setAttribute('class', `type1 ${guessBGColor.type1BGColor}`);
  $divType1.textContent = pokemon.types[0];
  if (guessPokemon.types[0].length > 7) {
    $divType1.setAttribute(
      'class',
      `large-text-type type1 ${guessBGColor.type1BGColor}`,
    );
  }
  const $divType2 = document.createElement('div');
  $divType2.setAttribute('class', `type2 ${guessBGColor.type2BGColor}`);
  $divType2.textContent = pokemon.types[1];
  if (guessPokemon.types[1].length > 7) {
    $divType2.setAttribute(
      'class',
      `large-text-type type2 ${guessBGColor.type2BGColor}`,
    );
  }
  const $divGuessSquareWeight = document.createElement('div');
  $divGuessSquareWeight.setAttribute(
    'class',
    `guess-square weight ${guessBGColor.weightBG}`,
  );
  $divGuessSquareWeight.textContent = `${(pokemon.weight * 0.1).toFixed(1)} kg`;
  const $divGuessSquareHeight = document.createElement('div');
  $divGuessSquareHeight.setAttribute(
    'class',
    `guess-square height ${guessBGColor.heightBG}`,
  );
  $divGuessSquareHeight.textContent = `${(pokemon.height * 0.1).toFixed(2)} meters`;
  const $divGuessSquareGen = document.createElement('div');
  $divGuessSquareGen.setAttribute(
    'class',
    `guess-square gen ${guessBGColor.generationBG}`,
  );
  $divGuessSquareGen.textContent = `Gen ${pokemon.generation}`;
  const $divGuessSquareStage = document.createElement('div');
  $divGuessSquareStage.setAttribute(
    'class',
    `guess-square stage ${guessBGColor.evoStageBG}`,
  );
  $divGuessSquareStage.textContent = `Stage ${pokemon.stage}`;
  $scrollbox.prepend($divGuessRow);
  $divGuessRow.append($divGuessName);
  $divGuessRow.append($divGuessSprite);
  $divGuessRow.append($divGuessSquareTypes);
  $divGuessSquareTypes.append($divType1);
  $divGuessSquareTypes.append($divType2);
  $divGuessRow.append($divGuessSquareWeight);
  $divGuessRow.append($divGuessSquareHeight);
  $divGuessRow.append($divGuessSquareGen);
  $divGuessRow.append($divGuessSquareStage);
  $scrollbox.scrollTop = 0;
  return $divGuessRow;
}
function renderModal() {
  $modalSprite.src = mysteryPokemon.sprites;
  $modalName.textContent = mysteryPokemon.name;
}
function winModal(winColor) {
  if (winColor === 'green-background') {
    renderModal();
    $winModal.setAttribute('class', 'win-modal');
    $winModal.showModal();
    mysteryPokemon.isSolved = true;
    fetchData(mysteryPokemon, randomPokeNum);
    $newGameButton.setAttribute('class', 'new-game-button');
    $giveUpButton.remove();
  }
}
function getHints() {
  let hint2answer = '';
  let hint4answer = '';
  const alphabet = /^[a-zA-Z]$/;
  if (mysteryPokemon.isSolved === false) {
    $hint1Sprite.src = mysteryPokemon.sprites;
    $hint3Sprite.src = mysteryPokemon.sprites;
  }
  for (let i = 0; i < mysteryPokemon.name.length; i++) {
    if (!alphabet.test(mysteryPokemon.name[i])) {
      hint2answer += `${mysteryPokemon.name[i]} `;
    } else if (i === 1) {
      hint2answer += `${mysteryPokemon.name[i]} `;
    } else if (i === mysteryPokemon.name.length - 1) {
      hint2answer += mysteryPokemon.name[i];
    } else {
      hint2answer += '_ ';
    }
  }
  for (let i = 0; i < mysteryPokemon.name.length; i++) {
    if (i % 2 === 0) {
      hint4answer += `${mysteryPokemon.name[i]} `;
    } else {
      hint4answer += '_ ';
    }
  }
  $hint4.textContent = hint4answer;
  $hint2.textContent = hint2answer;
}
async function fetchPokemon(pokeId) {
  try {
    const fetchResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokeId}`,
    );
    if (!fetchResponse.ok) {
      throw new Error(`HTTP Error! Status: ${fetchResponse}`);
    }
    const pokemonNameSprite = { name: '', sprite: '' };
    const data = await fetchResponse.json();
    const { name, sprites } = data;
    pokemonNameSprite.name = name;
    pokemonNameSprite.sprite = sprites.front_default;
    allPokemonArray.push(pokemonNameSprite);
  } catch (error) {
    console.error(error);
  }
}
async function fetchAllPokemon() {
  const fetchPromises = [];
  for (let i = 1; i <= 1025; i++) {
    fetchPromises.push(fetchPokemon(i));
  }
  await Promise.all(allPokemonArray);
  return allPokemonArray;
}
function renderDropdown(pokemonImg, pokemonName) {
  const $dropdownListElement = document.createElement('li');
  $dropdownListElement.setAttribute('class', 'dropdown-list-element');
  const $dropdownImage = document.createElement('img');
  $dropdownImage.setAttribute('class', 'text-input-dropdown-img');
  $dropdownImage.src = pokemonImg;
  const $dropdownSpan = document.createElement('span');
  $dropdownSpan.setAttribute('class', 'dropdown-name');
  $dropdownSpan.textContent = pokemonName;
  $dropdownListElement.append($dropdownImage);
  $dropdownListElement.append($dropdownSpan);
  return $dropdownListElement;
}
