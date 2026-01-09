const Fighter = require("./Fighter.js");
const Paladin = require("./Paladin.js");
const Monk = require("./Monk.js");
const Berzerker = require("./Berzerker.js");
const Assassin = require("./Assassin.js");
const Jobee = require("./Jobee.js");
const Wizard = require("./Wizard.js");

class Game {
  constructor(players, turnLeft = 10) {
    this.players = players;
    this.turnLeft = turnLeft;
    this.turn = 1;
  }

  alivePlayers() {
    return this.players.filter((p) => !p.isLoser());
  }

  shufflePlayers(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  skipTurn() {
    this.turnLeft -= 1;
  }

  watchStats() {
    this.players.forEach((p) => {
      console.log(p.info());
    });
  }

  logAttack(attacker, target, damage) {
    console.log(
      `${attacker.name} is attacking ${target.name}. He deals him ${damage} damages. ${target.name} got ${target.hp} lifepoints left.`
    );
  }

  logSpecial(attacker) {
    console.log(`${attacker.name} uses a special attack.`);
  }

  specialCostFor(player) {
    if (player instanceof Fighter) return 20;
    if (player instanceof Paladin) return 40;
    if (player instanceof Monk) return 25;
    if (player instanceof Assassin) return 20;
    if (player instanceof Jobee) return 30;
    if (player instanceof Wizard) return 25;
    return 0;
  }

  ask(rlInstance, question) {
    return new Promise((resolve) => {
      rlInstance.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async chooseTarget(rlInstance, player, enemies) {
    console.log("Targets:");
    enemies.forEach((e, i) => {
      console.log(`${i + 1}. ${e.name} (hp:${e.hp})`);
    });
    while (true) {
      const answer = await this.ask(rlInstance, "Choose target number: ");
      const index = Number(answer) - 1;
      if (Number.isInteger(index) && enemies[index]) return enemies[index];
      console.log("Invalid choice.");
    }
  }

  async chooseAttackType(rlInstance, player) {
    const canSpecial = player.mana >= this.specialCostFor(player);
    console.log(`Mana: ${player.mana}`);
    while (true) {
      const answer = await this.ask(
        rlInstance,
        canSpecial ? "Choose attack: 1) normal 2) special: " : "Choose attack: 1) normal: "
      );
      if (answer === "1") return false;
      if (answer === "2" && canSpecial) return true;
      console.log("Invalid choice.");
    }
  }

  async startTurn(rl) {
    console.log(`It's turn ${this.turn}`);
    const order = this.shufflePlayers(this.alivePlayers());
    for (const player of order) {
      if (player.isLoser()) return;
      console.log(`It's time for ${player.name} to play`);
      const enemies = this.alivePlayers().filter((p) => p !== player);
      if (enemies.length === 0) return;
      const target = await this.chooseTarget(rl, player, enemies);
      const useSpecial = await this.chooseAttackType(rl, player);
      if (useSpecial) {
        this.logSpecial(player);
        const beforeHp = target.hp;
        if (player instanceof Monk || player instanceof Berzerker) {
          player.specialAttack();
        } else {
          player.specialAttack(target);
        }
        const damage = Math.max(0, beforeHp - target.hp);
        if (damage > 0) this.logAttack(player, target, damage);
      } else {
        const beforeHp = target.hp;
        player.dealDamage(target);
        const damage = Math.max(0, beforeHp - target.hp);
        this.logAttack(player, target, damage);
      }
    }
    this.watchStats();
    this.skipTurn();
    this.turn += 1;
  }

  endGameWinners() {
    const alive = this.alivePlayers();
    if (alive.length === 0) return;
    const maxHp = Math.max(...alive.map((p) => p.hp));
    alive.forEach((p) => {
      if (p.hp === maxHp) p.status = "winner";
    });
  }

  async startGame(rl) {
    while (this.turnLeft > 0 && this.alivePlayers().length > 1) {
      await this.startTurn(rl);
    }
    this.endGameWinners();
  }
}

module.exports = Game;
