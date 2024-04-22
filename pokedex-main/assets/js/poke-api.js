
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)   
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return  pokemon
};


pokeApi.getPokemosDetail = (pokemon) => {
    return fetch(pokemon.url)
     .then((response) =>  response.json())
     .then(convertPokeApiDetailToPokemon)

};

pokeApi.getPokemos = (offset = 0 , limit = 6) => {
     
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
     return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemosDetail))
        .then((detailRequest) => Promise.all(detailRequest))
        .then((pokemonsDetails) => pokemonsDetails)
            
};

pokeApi.searchPokemonsByLetter = (letter) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${maxRecords}&offset=0`;
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.filter(pokemon => pokemon.name.startsWith(letter)))
        .then((filteredPokemons) => Promise.all(filteredPokemons.map(pokeApi.getPokemosDetail)));
};


let searchButton = document.querySelector('#searchButton');
let searchInput = document.querySelector('#searchInput');

searchButton.addEventListener('click', () => {
    searchInput.focus();
});

searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.trim().toLowerCase(); // Obtendo o texto digitado em minúsculas
    if (searchText === '') {
        loadPokemonItens(offset, limit); // Se o campo de busca estiver vazio, carrega os Pokémon normalmente
    } else {
        pokeApi.searchPokemonsByLetter(searchText)
            .then((pokemons) => {
                // Limpa a lista de Pokémon antes de adicionar os novos resultados
                apiList.innerHTML = '';
                pokemons.forEach(pokemon => {
                    apiList.innerHTML += `
                        <li class="pokemon ${pokemon.type}">
                            <span class="number">#${pokemon.number}</span>
                            <span class="name">${pokemon.name}</span>
                            <div class="detail">
                                <ol class="types">
                                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                                </ol>
                                <img src="${pokemon.photo}" alt="${pokemon.name}">
                            </div>
                        </li>`;
                });
            });
    }
});

