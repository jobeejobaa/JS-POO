const Character = require("./Character.js");
const { DEFAULT_STATS } = require("./stats.js");

class Paladin extends Character {
  constructor(name) {
    super(name, DEFAULT_STATS.Paladin.hp, DEFAULT_STATS.Paladin.dmg, DEFAULT_STATS.Paladin.mana);
  }

  specialAttack(target) {
    const cost = 40;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(4);
    this.heal(5);
    return true;
  }
}

module.exports = Paladin;
