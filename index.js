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
    renderLayout();
  } catch (error) {
    console.error("failed to fetch players", error);
  }
}

async function fetchSinglePlayer(id) {
  try {
    const res = await fetch(`${API}/players/${id}`);
    const data = await res.json();
    selectedPlayer = data.data.player;
    renderSinglePlayer();
  } catch (error) {
    console.error("failed to fetch player", error);
  }
}

async function removePlayer(id) {
  try {
    await fetch(`${API}/players/${id}`, { method: "DELETE" });
    selectedPlayer = null;
    await fetchAllPlayers();
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

function renderLayout() {
  app.innerHTML = `
    <div class="layout">
      <div id="roster-container" class="roster"></div>
      <div id="details-container" class="details"></div>
    </div>
  `;
  renderAllPlayers();
  renderNoPlayerSelected();
}

function renderAllPlayers() {
  const roster = document.createElement("div");
  roster.className = "roster-list";

  players.forEach((player) => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
      <img src="${player.imageUrl}" alt="${player.name}">
      <h3>${player.name}</h3>
    `;
    card.addEventListener("click", () => {
      fetchSinglePlayer(player.id);
    });
    roster.appendChild(card);
  });

  const rosterContainer = document.getElementById("roster-container");
  rosterContainer.innerHTML = "";
  rosterContainer.appendChild(roster);
  renderAddPlayerForm();
}

function renderSinglePlayer() {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
    <div class="player-details">
      <h2>${selectedPlayer.name}</h2>
      <img src="${selectedPlayer.imageUrl}" alt="${selectedPlayer.name}">
      <p><strong>ID:</strong> ${selectedPlayer.id}</p>
      <p><strong>Breed:</strong> ${selectedPlayer.breed}</p>
      <p><strong>Status:</strong> ${selectedPlayer.status}</p>
      <p><strong>Team:</strong> ${selectedPlayer.team?.name || "No team"}</p>
      <button class="remove-btn">Remove from roster</button>
    </div>
  `;
  detailsContainer.querySelector(".remove-btn").addEventListener("click", () => removePlayer(selectedPlayer.id));
}

function renderNoPlayerSelected() {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `<p class="placeholder">Select a player to view.</p>`;
}

function renderAddPlayerForm() {
  const form = document.createElement("form");
  form.className = "add-player-form";
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

  document.getElementById("roster-container").appendChild(form);
}

fetchAllPlayers();