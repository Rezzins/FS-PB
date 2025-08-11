const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "2507-PUPPIES";
const API = `${BASE}/${COHORT}`;

const app = document.getElementById("app");

let players = [];
let selectedPlayer = null;

async function fetchAllPlayers() {
  try {
    const res = await fetch(`${API}/players`);
    const data = await res.json();
    players = data.data.players;
    renderAllPlayers();
  } catch (error) {
    console.error("failed to fetch players", error);
  }
}

async function fetchSinglePlayer(id) {
  try {
    const res = await fetch(`${API}/players/${id}`);
    const data = await res.json();
    selectedPlayer = data.data.player;
    app.innerHTML = "";
    renderSinglePlayer();
  } catch (error) {
    console.error("failed to fetch player", error);
  }
}

async function removePlayer(id) {
  try {
    await fetch(`${API}/players/${id}`, {
      method: "DELETE",
    });
    selectedPlayer = null;
    await fetchAllPlayers();
    renderNoPlayerSelected();
  } catch (error) {
    console.error("issue removing player", error);
  }
}

async function addNewPlayer(playerObj) {
  try {
    await fetch(`${API}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerObj),
    });
    await fetchAllPlayers();
  } catch (error) {
    console.error("Failed to add a player", error);
  }
}

function renderAllPlayers() {
  app.innerHTML = "";
  const roster = document.createElement("div");
  roster.id = "roster";

  players.forEach((player) => {
    const card = document.createElement("div");
    card.classList.add("player-card");

    const img = document.createElement("img");
    img.src = player.imageUrl;
    img.alt = `${player.name} the ${player.breed}`;
    img.style.width = "125px";

    const name = document.createElement("h3");
    name.textContent = player.name;

    card.appendChild(img);
    card.appendChild(name);
    card.addEventListener("click", () => {
      fetchSinglePlayer(player.id);
    });

    roster.appendChild(card);
  });

  app.appendChild(roster);
  renderAddPlayerForm();
}

function renderSinglePlayer() {
  const details = document.createElement("div");
  details.id = "player-details";

  details.innerHTML = `
    <h2>${selectedPlayer.name}</h2>
    <img src="${selectedPlayer.imageUrl}" alt="${selectedPlayer.name} the ${
    selectedPlayer.breed
  }">
    <p><strong>ID:</strong> ${selectedPlayer.id}</p>
    <p><strong>Breed:</strong> ${selectedPlayer.breed}</p>
    <p><strong>Status:</strong> ${selectedPlayer.status}</p>
    <p><strong>Team:</strong> ${selectedPlayer.team?.name || "No team"}</p>
    `;

  const removeBtm = document.createElement("button");
  removeBtm.textContent = "Remove from roster";
  removeBtm.addEventListener("click", () => removePlayer(selectedPlayer.id));
  details.appendChild(removeBtm);
  app.appendChild(details);
}

function renderNoPlayerSelected() {
  const message = document.createElement("p");
  message.textContent = "Select a player to view.";
  app.appendChild(message);
}

function renderAddPlayerForm() {
  const form = document.createElement("form");
  form.id = "add-player-form";

  form.innerHTML = `
    <h3>Add New Player</h3>
    <input type="text" name="name" placeholder="Name" required>
    <input type="text" name="breed" placeholder="Breed" required>
    <button type="submit">Add Player</button>
    `;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    const breed = formData.get("breed");

    await addNewPlayer({ name, breed });
    form.reset();
  });
  app.appendChild(form);
}

fetchAllPlayers();
