import Fighter from "../../esm/Fighter.js";
import Paladin from "../../esm/Paladin.js";
import Monk from "../../esm/Monk.js";
import Berzerker from "../../esm/Berzerker.js";
import Assassin from "../../esm/Assassin.js";
import Jobee from "../../esm/Jobee.js";
import Wizard from "../../esm/Wizard.js";

const classTypes = [Fighter, Paladin, Monk, Berzerker, Assassin, Jobee, Wizard];
const namePool = ["Aragorn", "Uther", "Tenzin", "Ragnar", "Shade"];

const newGameBtn = document.getElementById("new-game");
const turnPill = document.getElementById("turn-pill");
const currentPlayerEl = document.getElementById("current-player");
const playerSelect = document.getElementById("player-select");
const confirmPlayerBtn = document.getElementById("confirm-player");
const targetSelect = document.getElementById("target-select");
const attackNormalBtn = document.getElementById("attack-normal");
const attackSpecialBtn = document.getElementById("attack-special");
const attackNormalInfo = document.getElementById("attack-normal-info");
const attackSpecialInfo = document.getElementById("attack-special-info");
const playersGrid = document.getElementById("players-grid");
const logEntries = document.getElementById("log-entries");

let players = [];
let turn = 1;
let turnsLeft = 10;
let order = [];
let orderIndex = 0;
let mainPlayerName = null;
let aiRunning = false;

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

function updateMainPlayerOptions() {
  const alive = alivePlayers();
  const previous = playerSelect.value;
  playerSelect.innerHTML = "";
  alive.forEach((player) => {
    const option = document.createElement("option");
    option.value = player.name;
    option.textContent = `${player.name} (${player.constructor.name})`;
    playerSelect.appendChild(option);
  });
  if (alive.length === 0) {
    playerSelect.disabled = true;
    return;
  }
  playerSelect.disabled = Boolean(mainPlayerName);
  if (!mainPlayerName && previous && alive.some((player) => player.name === previous)) {
    playerSelect.value = previous;
  } else {
    playerSelect.value = alive[0].name;
  }
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

function specialDamageInfo(player) {
  if (player instanceof Fighter) return "Dégâts: 5";
  if (player instanceof Paladin) return "Dégâts: 4 (+5 PV)";
  if (player instanceof Monk) return "Effet: +8 PV";
  if (player instanceof Berzerker) return "Effet: +1 dégâts, -1 PV";
  if (player instanceof Assassin) return "Dégâts: 7 (retour 7 si la cible survit)";
  if (player instanceof Jobee) return "Dégâts: 6";
  if (player instanceof Wizard) return "Dégâts: 7";
  return "Dégâts: —";
}

function updateDamageHints(player, isMainTurn) {
  if (!player || !isMainTurn) {
    attackNormalInfo.textContent = "Dégâts: —";
    attackSpecialInfo.textContent = "Dégâts: —";
    return;
  }
  attackNormalInfo.textContent = `Dégâts: ${player.dmg}`;
  attackSpecialInfo.textContent = specialDamageInfo(player);
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

function isMainPlayerTurn(player) {
  return player && mainPlayerName && player.name === mainPlayerName;
}

function chooseAiTarget(player) {
  const enemies = alivePlayers().filter((p) => p !== player);
  if (enemies.length === 0) return null;
  const index = Math.floor(Math.random() * enemies.length);
  return enemies[index];
}

function runAiTurn(player) {
  if (!player || player.isLoser()) return;
  const target = chooseAiTarget(player);
  if (!target) return;

  const beforeHp = target.hp;
  const canSpecial = player.mana >= specialCostFor(player);
  const useSpecial = canSpecial && Math.random() < 0.4;
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
  if (endGameIfNeeded()) return;
  syncUI();
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
  updateMainPlayerOptions();
  confirmPlayerBtn.disabled = Boolean(mainPlayerName) || playerSelect.disabled;
  if (!mainPlayerName) {
    currentPlayerEl.textContent = "Choisis ton gladiateur principal.";
    targetSelect.disabled = true;
    attackNormalBtn.disabled = true;
    attackSpecialBtn.disabled = true;
    updateDamageHints(null, false);
    return;
  }
  const activePlayer = currentPlayer();
  if (!activePlayer || activePlayer.isLoser()) {
    advanceOrder();
  }
  const resolvedPlayer = currentPlayer();
  if (!resolvedPlayer) return;
  currentPlayerEl.textContent = `Au tour de ${resolvedPlayer.name} (${resolvedPlayer.constructor.name})`;
  updateTargetOptions(resolvedPlayer);
  const canSpecial = resolvedPlayer.mana >= specialCostFor(resolvedPlayer);
  const isMainTurn = isMainPlayerTurn(resolvedPlayer);
  attackNormalBtn.disabled = !isMainTurn || targetSelect.disabled;
  attackSpecialBtn.disabled = !isMainTurn || !canSpecial || targetSelect.disabled;
  updateDamageHints(resolvedPlayer, isMainTurn);

  if (!isMainTurn && !aiRunning && !endGameIfNeeded()) {
    aiRunning = true;
    setTimeout(() => {
      aiRunning = false;
      runAiTurn(resolvedPlayer);
    }, 400);
  }
}

function findTargetByName(name) {
  return players.find((p) => p.name === name);
}

function handleAttack(useSpecial) {
  const player = currentPlayer();
  if (!player || player.isLoser() || !isMainPlayerTurn(player)) {
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
  if (endGameIfNeeded()) return;
  syncUI();
}

function startGame() {
  players = createRandomPlayers();
  turn = 1;
  turnsLeft = 10;
  order = shuffle(alivePlayers());
  orderIndex = 0;
  mainPlayerName = null;
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

confirmPlayerBtn.addEventListener("click", () => {
  if (playerSelect.disabled) return;
  mainPlayerName = playerSelect.value || null;
  if (mainPlayerName) {
    log(`Tu incarnes ${mainPlayerName}. Les autres gladiateurs sont en IA.`);
  }
  syncUI();
});

startGame();
