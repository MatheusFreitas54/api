const pokeApi = {};

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
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemos = (offset = 0 , limit = 6) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemosDetail))
        .then((detailRequest) => Promise.all(detailRequest))
        .then((pokemonsDetails) => pokemonsDetails);
};

pokeApi.searchPokemonsByLetter = (letter) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${maxRecords}&offset=0`;
    // console.log(url);
    
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((detailRequest) => Promise.all(detailRequest))
        .then((pokemonsDetails) => pokemonsDetails)
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
                // console.log(pokemons);
                apiList.innerHTML = ''; // Limpa a lista de Pokémon antes de adicionar os novos resultados
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

// Função para abrir o modal com os detalhes do Pokémon
function openModal(pokemon) {
    // console.log(pokemon);
    const modal = document.getElementById('modal');
    const modalContent = `
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-close" >
                    <span class="close" onclick="closeModal()">&times;</span>
                </div>
                <div class="modal-poke">  
                    <img id="modal-image" src="${pokemon.photo}" alt="Imagem do Pokémon">
                    <div id="modal-details">
                        <div class="poke-name">
                            <h2 id="modal-name">${pokemon.name}</h2>
                            <span id="modal-number">#${pokemon.number}</span>
                        </div>
                        <ol class="types modal-types">
                            ${pokemon.type.map((type) => `<li class="type ${type} modal-type">${type}</li>`).join('')}
                        </ol>
                        <p id="modal-description">Mussum Ipsum, cacilds vidis litro abertis. Quem manda na minha terra sou euzis! Per aumento de cachacis, eu reclamis. Detraxit consequat et quo num tendi nada.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    modal.innerHTML = modalContent;
    modal.style.display = 'block';
}


// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Evento de clique nos cards de Pokémon para abrir o modal
document.getElementById('apiList').addEventListener('click', (event) => {
    const target = event.target.closest('.pokemon');
    if (target) {
        const pokemonNumber = target.querySelector('.number').textContent.slice(1);
        const pokemonName = target.querySelector('.name').textContent;
        const UpperCaseName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
        const pokemonPhoto = target.querySelector('img').src;
        const pokemonTypesElements = target.querySelectorAll('.type');
        const pokemonTypes = Array.from(pokemonTypesElements).map(typeElement => typeElement.textContent);
        // console.log(pokemonTypesElements[0]);

        const pokemon = {
            number: pokemonNumber,
            name: UpperCaseName,
            photo: pokemonPhoto,
            type: pokemonTypes
        };

        openModal(pokemon);

        const modalContent = document.querySelector('.modal-content');
        switch(pokemonTypesElements[0].textContent) {
            case 'normal':
                modalContent.style.backgroundColor = '#e0e0e0';
                break;
            case 'grass':
                modalContent.style.backgroundColor = '#a1db86';
                break;
            case 'fire':
                modalContent.style.backgroundColor = '#ffac33';
                break;
            case 'water':
                modalContent.style.backgroundColor = '#76bdfe';
                break;
            case 'electric':
                modalContent.style.backgroundColor = '#ffdd57';
                break;
            case 'ice':
                modalContent.style.backgroundColor = '#a3e7fd';
                break;
            case 'ground':
                modalContent.style.backgroundColor = '#e0c068';
                break;
            case 'flying':
                modalContent.style.backgroundColor = '#c6a1e7';
                break;
            case 'poison':
                modalContent.style.backgroundColor = '#b46bda';
                break;
            case 'fighting':
                modalContent.style.backgroundColor = '#e57373';
                break;
            case 'psychic':
                modalContent.style.backgroundColor = '#ff8b8b';
                break;
            case 'dark':
                modalContent.style.backgroundColor = '#7b6e65';
                break;
            case 'rock':
                modalContent.style.backgroundColor = '#d4c08c';
                break;
            case 'bug':
                modalContent.style.backgroundColor = '#c2d21d';
                break;
            case 'ghost':
                modalContent.style.backgroundColor = '#9b7ca0';
                break;
            case 'steel':
                modalContent.style.backgroundColor = '#d1d1e0';
                break;
            case 'dragon':
                modalContent.style.backgroundColor = '#96a8f9';
                break;
            case 'fairy':
                modalContent.style.backgroundColor = '#fdb9c2';
                break;
            default:
                modalContent.style.backgroundColor = '#fefefe';
                break;
        }
    }

});
