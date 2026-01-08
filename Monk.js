const Character = require("./Character.js");
const { DEFAULT_STATS } = require("./stats.js");

class Monk extends Character {
  constructor(name) {
    super(name, DEFAULT_STATS.Monk.hp, DEFAULT_STATS.Monk.dmg, DEFAULT_STATS.Monk.mana);
  }

  specialAttack() {
    const cost = 25;
    if (!this.spendMana(cost)) return false;
    this.heal(8);
    return true;
  }
}

module.exports = Monk;
