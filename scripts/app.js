import { saveLS, getLS, removeLS } from "./localstorage.js";
export { searchCall, genList };
let monData;
let dexData;
let evoData;
let locData;

//call APIs
const searchCall = async (value) => {

    const monPromise = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`);
    monData = await monPromise.json();

    const dexPromise = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${value}`);
    dexData = await dexPromise.json();

    const locPromise = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}/encounters`);
    locData = await locPromise.json();

    const evoPromise = await fetch(`${dexData.evolution_chain.url}`);
    evoData = await evoPromise.json();

    return monData, dexData, evoData, locData;
}

const populate = async () => {

    //Clear all Variables
    searchval.value = '';
    let typeArray = [];
    let abiArray = [];
    let moveArray = [];
    let evoArray = [];
    let enIndex;
    evolutions.innerHTML = '';



    //Location
    let location = document.getElementById('location')

    if (locData.length > 0) {
        let locArray = locData[0].location_area.name.split('-').slice(0, -1).join(' ');
        location.innerText = `You can find this Pokemon at ${locArray}`;
    }
    else {
        location.innerText = `You cannot find this Pokemon in the wild.`
    }

    //Types
    monData.types.map(value => {
        typeArray.push(value.type.name);
    })
    var typeJoined = typeArray.join(', ');

    //Abilities
    monData.abilities.map(value => {
        abiArray.push(value.ability.name);
    })
    var abiJoined = abiArray.join(', ');

    //Moves
    monData.moves.map(value => {
        moveArray.push(value.move.name);
    })
    var moveJoined = moveArray.join(', ')


    //Set all Variables
    pkmName.textContent = `${monData.name} - ${monData.id}`;
    pkmImg.src = monData.sprites.other['official-artwork'].front_default;
    hp.textContent = `HP: ${monData.stats[0].base_stat}`;
    atk.textContent = `Atk: ${monData.stats[1].base_stat}`;
    def.textContent = `Def: ${monData.stats[2].base_stat}`;
    satk.textContent = `SAtk: ${monData.stats[3].base_stat}`;
    sdef.textContent = `SDef: ${monData.stats[4].base_stat}`;
    spd.textContent = `Spd: ${monData.stats[5].base_stat}`;
    types.textContent = `Types: ${typeJoined}`
    abilities.textContent = `Abilities: ${abiJoined}`
    move.textContent = `Moves: ${moveJoined}`;

    //Grab English PokeDex
    dexData.flavor_text_entries.map(value => {
        if (value.language.name == 'en') {
            enIndex = value.flavor_text;
        }
    })
    pokedexData.textContent = enIndex;


    //Evolution Stuff
    if (evoData.chain.evolves_to.length === 0) {
    } else {
        evoArray = [evoData.chain.species.name];
        const seeEvos = (chain) => {
            if (chain.evolves_to.length === 0) return;
            chain.evolves_to.forEach((evo) => {
                evoArray.push(evo.species.name);
                seeEvos(evo);
            });
        };
        seeEvos(evoData.chain);
    }

    const grabEvos = async () => {
        if (evoArray.length > 0) {
            evoArray.map(async evo => {
                const evoCall = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo}`)
                const data = await evoCall.json();

                //create the div
                let div = document.createElement('div');
                div.setAttribute('id', `${evo}`)
                div.classList.add('flex', 'flex-col', 'text-center')
                document.getElementById('evolutions').appendChild(div);

                //create the img
                let img = document.createElement('img');
                img.src = data.sprites.other['official-artwork'].front_default;
                img.style.height = `${(document.getElementById('evolutions').clientHeight / 3) - (24)}px`;
                document.getElementById(`${evo}`).appendChild(img);

                //create the nametag
                let p = document.createElement('p');
                p.textContent = data.name;
                document.getElementById(`${evo}`).appendChild(p);
            })
        }
        else {
            let p = document.createElement('p');
            p.textContent = data.name;
            document.getElementById(`${evo}`).appendChild(p);
        }
    }

    evolutions.classList.add("animate-pulse");
    await grabEvos();
    evolutions.classList.remove("animate-pulse");

    localStorage.getItem('favorites').includes(monData.name) ? favoriteBtn.textContent = "Unfavorite this Pokemon" : favoriteBtn.textContent = "Favorite this Pokemon";

}

//Buttons
search.addEventListener('click', async () => {
    pkmImg.classList.add("animate-pulse");
    await searchCall(searchval.value.toLowerCase());
    pkmImg.classList.remove("animate-pulse");
    populate();
})

random.addEventListener('click', async () => {
    let rand = Math.round(Math.random() * 650);
    pkmImg.classList.add("animate-pulse");
    await searchCall(rand);
    pkmImg.classList.remove("animate-pulse");
    populate();
})

shinyBtn.addEventListener('click', () => {
    if (pkmImg.src == monData.sprites.other['official-artwork'].front_default) {
        shinyBtn.textContent = 'Shiny form'
        pkmImg.src = monData.sprites.other['official-artwork'].front_shiny;
    }
    else {
        shinyBtn.textContent = 'Normal form'
        pkmImg.src = monData.sprites.other['official-artwork'].front_default;
    }
})

favoriteBtn.addEventListener('click', () => {
    saveLS(monData.name);
})

const genList = (array) => {
    array.map(favs => {
        let li = document.createElement('li');
        li.id = 'favItem';
        li.classList.add("capitalize", "hover:brightness-50")
        li.innerText = favs;
        li.addEventListener('click', async () => {
            await searchCall(li.innerText.toLowerCase());
            populate();
        })
        favList.appendChild(li);
    })
}

//Favorites Array Check
favoriteBtn.textContent = "Favorite this Pokemon";
saveLS('');