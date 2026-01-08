import Fighter from "./Fighter.js";
import Paladin from "./Paladin.js";
import Monk from "./Monk.js";
import Berzerker from "./Berzerker.js";
import Assassin from "./Assassin.js";
import Jobee from "./Jobee.js";
import Wizard from "./Wizard.js";

const classTypes = [Fighter, Paladin, Monk, Berzerker, Assassin, Jobee, Wizard];
const namePool = ["Aragorn", "Uther", "Tenzin", "Ragnar", "Shade"];

const newGameBtn = document.getElementById("new-game");
const turnPill = document.getElementById("turn-pill");
const currentPlayerEl = document.getElementById("current-player");
const targetSelect = document.getElementById("target-select");
const attackNormalBtn = document.getElementById("attack-normal");
const attackSpecialBtn = document.getElementById("attack-special");
const playersGrid = document.getElementById("players-grid");
const logEntries = document.getElementById("log-entries");

let players = [];
let turn = 1;
let turnsLeft = 10;
let order = [];
let orderIndex = 0;

function shuffle(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function log(message) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.textContent = message;
  logEntries.prepend(entry);
}

function alivePlayers() {
  return players.filter((p) => !p.isLoser());
}

function specialCostFor(player) {
  if (player instanceof Fighter) return 20;
  if (player instanceof Paladin) return 40;
  if (player instanceof Monk) return 25;
  if (player instanceof Assassin) return 20;
  if (player instanceof Jobee) return 30;
  if (player instanceof Wizard) return 25;
  return 0;
}

function createRandomPlayers() {
  const shuffledClasses = shuffle(classTypes);
  return namePool.map((name, index) => {
    const PlayerClass = shuffledClasses[index % shuffledClasses.length];
    return new PlayerClass(name);
  });
}

function updateTurnPill() {
  turnPill.textContent = `Tour ${turn} · ${turnsLeft} restants`;
}

function renderPlayers() {
  playersGrid.innerHTML = "";
  players.forEach((player) => {
    const card = document.createElement("div");
    card.className = `card ${player.isLoser() ? "dead" : ""}`;
    card.innerHTML = `
      <h3>${player.name}</h3>
      <div class="class">${player.constructor.name}</div>
      <div class="stats">
        <div class="stat">PV<br>${player.hp}</div>
        <div class="stat">Mana<br>${player.mana}</div>
        <div class="stat">Dégâts<br>${player.dmg}</div>
      </div>
    `;
    playersGrid.appendChild(card);
  });
}

function updateTargetOptions(currentPlayer) {
  const enemies = alivePlayers().filter((p) => p !== currentPlayer);
  targetSelect.innerHTML = "";
  enemies.forEach((enemy) => {
    const option = document.createElement("option");
    option.value = enemy.name;
    option.textContent = `${enemy.name} (${enemy.hp} PV)`;
    targetSelect.appendChild(option);
  });
  targetSelect.disabled = enemies.length === 0;
  attackNormalBtn.disabled = enemies.length === 0;
  attackSpecialBtn.disabled = enemies.length === 0;
}

function currentPlayer() {
  return order[orderIndex];
}

function advanceOrder() {
  if (order.length === 0) return;
  let safety = order.length + 1;
  do {
    orderIndex += 1;
    if (orderIndex >= order.length) {
      turnsLeft -= 1;
      turn += 1;
      order = shuffle(alivePlayers());
      orderIndex = 0;
    }
    safety -= 1;
  } while (order.length > 0 && currentPlayer() && currentPlayer().isLoser() && safety > 0);
}

function endGameIfNeeded() {
  const alive = alivePlayers();
  if (turnsLeft <= 0 || alive.length <= 1) {
    if (alive.length === 0) {
      log("Personne ne survit à l'arène.");
    } else if (alive.length === 1) {
      log(`🏆 ${alive[0].name} remporte la partie.`);
    } else {
      const maxHp = Math.max(...alive.map((p) => p.hp));
      const winners = alive.filter((p) => p.hp === maxHp);
      if (winners.length === 1) {
        log(`🏆 ${winners[0].name} remporte la partie.`);
      } else {
        log(`🏆 Égalité entre ${winners.map((p) => p.name).join(", ")}.`);
      }
    }
    attackNormalBtn.disabled = true;
    attackSpecialBtn.disabled = true;
    targetSelect.disabled = true;
    currentPlayerEl.textContent = "Partie terminée.";
    return true;
  }
  return false;
}

function syncUI() {
  renderPlayers();
  updateTurnPill();
  const player = currentPlayer();
  if (!player || player.isLoser()) {
    advanceOrder();
  }
  const activePlayer = currentPlayer();
  if (!activePlayer) return;
  currentPlayerEl.textContent = `Au tour de ${activePlayer.name} (${activePlayer.constructor.name})`;
  updateTargetOptions(activePlayer);
  const canSpecial = activePlayer.mana >= specialCostFor(activePlayer);
  attackSpecialBtn.disabled = !canSpecial || targetSelect.disabled;
}

function findTargetByName(name) {
  return players.find((p) => p.name === name);
}

function handleAttack(useSpecial) {
  const player = currentPlayer();
  if (!player || player.isLoser()) {
    syncUI();
    return;
  }

  const target = findTargetByName(targetSelect.value);
  if (!target) return;

  const beforeHp = target.hp;
  if (useSpecial) {
    if (player instanceof Monk || player instanceof Berzerker) {
      player.specialAttack();
    } else {
      player.specialAttack(target);
    }
    log(`${player.name} utilise une attaque spéciale.`);
  } else {
    player.dealDamage(target);
    log(`${player.name} attaque ${target.name}.`);
  }

  const damage = Math.max(0, beforeHp - target.hp);
  if (damage === 0 && target instanceof Jobee) {
    log(`Absorption vitale : ${target.name} gagne ${target.hp - beforeHp} PV.`);
  } else if (damage > 0) {
    log(`${target.name} perd ${damage} PV (${target.hp} restants).`);
  }

  advanceOrder();
  syncUI();
  endGameIfNeeded();
}

function startGame() {
  players = createRandomPlayers();
  turn = 1;
  turnsLeft = 10;
  order = shuffle(alivePlayers());
  orderIndex = 0;
  logEntries.innerHTML = "";
  log("Nouvelle partie. Les classes sont tirées au hasard.");
  renderPlayers();
  syncUI();
}

newGameBtn.addEventListener("click", () => {
  startGame();
});

attackNormalBtn.addEventListener("click", () => {
  handleAttack(false);
});

attackSpecialBtn.addEventListener("click", () => {
  handleAttack(true);
});

startGame();
