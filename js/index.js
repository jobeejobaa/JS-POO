const readline = require("readline");
const Game = require("./Game.js");
const Fighter = require("./Fighter.js");
const Paladin = require("./Paladin.js");
const Monk = require("./Monk.js");
const Berzerker = require("./Berzerker.js");
const Assassin = require("./Assassin.js");
const Jobee = require("./Jobee.js");
const Wizard = require("./Wizard.js");

function shuffle(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createRandomPlayers(count) {
  const classTypes = [Fighter, Paladin, Monk, Berzerker, Assassin, Jobee, Wizard];
  const namePool = ["Aragorn", "Uther", "Tenzin", "Ragnar", "Shade"];

  const players = [];
  const limit = Math.min(count, namePool.length, classTypes.length);
  const shuffledClasses = shuffle(classTypes);
  for (let i = 0; i < limit; i += 1) {
    const PlayerClass = shuffledClasses[i];
    players.push(new PlayerClass(namePool[i]));
  }
  return players;
}

function runGame() {
  const players = createRandomPlayers(5);

  console.log("Game starting with players:");
  players.forEach((p) => console.log(p.info()));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const game = new Game(players);
  game.startGame(rl).then(() => {
    console.log("Game ended. Final stats:");
    game.watchStats();
    rl.close();
  });
}

module.exports = {
  createRandomPlayers,
  runGame,
  Game,
  Fighter,
  Paladin,
  Monk,
  Berzerker,
  Assassin,
  Jobee,
  Wizard,
};

runGame();
