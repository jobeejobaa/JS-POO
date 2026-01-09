const Character = require("./Character.js");
const { DEFAULT_STATS } = require("./stats.js");

class Assassin extends Character {
  constructor(name) {
    super(name, DEFAULT_STATS.Assassin.hp, DEFAULT_STATS.Assassin.dmg, DEFAULT_STATS.Assassin.mana);
  }

  specialAttack(target) {
    const cost = 20;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(7);
    if (!target.isLoser()) {
      this.takeDamage(7);
    }
    return true;
  }
}

module.exports = Assassin;
