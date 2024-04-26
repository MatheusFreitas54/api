const apiList = document.getElementById('apiList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 12;
let offset = 0;


 
function loadPokemonItens(offset, limit){

  pokeApi.getPokemos(offset, limit).then((pokemons = []) => {
    
    const newHtml =   pokemons.map((pokemon) =>`
      <li class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
          <ol class="types">
          ${pokemon.types.map((type) => `<li class = "type ${type}">${type}</li>`).join('')}
          </ol>
          <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
      </li>
    `).join('')
    apiList.innerHTML +=  newHtml
    
  });
};

loadPokemonItens(offset, limit);
   
loadMoreButton.addEventListener('click',()=>{
  offset += limit

  const qtdRecordsWithNexPage = offset + limit

  if (qtdRecordsWithNexPage >= maxRecords){
    const newLimit = maxRecords - offset
    loadPokemonItens(offset, newLimit)

    loadMoreButton.parentElement.removeChild(loadMoreButton)
  }else{
    loadPokemonItens(offset, limit)
  }
});
   
// Função para abrir o modal com os detalhes do Pokémon
function openModal(pokemon) {
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  const modalNumber = document.getElementById('modal-number');
  const modalName = document.getElementById('modal-name');
  const modalDescription = document.getElementById('modal-description');

  modalImage.src = pokemon.photo;
  modalNumber.textContent = `#${pokemon.number}`;
  modalName.textContent = pokemon.name;
  modalDescription.textContent = 'Breve descrição do Pokémon';

  modal.style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Evento de clique no botão de fechar do modal
document.querySelector('.close').addEventListener('click', closeModal);

// Evento de clique nos cards de Pokémon para abrir o modal
document.getElementById('apiList').addEventListener('click', (event) => {
  const target = event.target.closest('.pokemon');
  if (target) {
      const pokemonNumber = target.querySelector('.number').textContent.slice(1);
      const pokemonName = target.querySelector('.name').textContent;
      const pokemonPhoto = target.querySelector('img').src;

      const pokemon = {
          number: pokemonNumber,
          name: pokemonName,
          photo: pokemonPhoto
      };

      openModal(pokemon);
  }
});
