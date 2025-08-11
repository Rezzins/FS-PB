const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/"; "2507-PUPPIES";
const API = BASE + COHORT;

let players = [];
let selectedPlayer = null;

async function fetchAllPlayers() {
    const res = await fetch(`${API}/players`);
    const data = await res.json();
    return data.data.players;
}

async function fetchSinglePlayer(id) {
    const res = await fetch(`${API}/players/${id}`);
    const data = await res.json();
    return data.data.players;
}

