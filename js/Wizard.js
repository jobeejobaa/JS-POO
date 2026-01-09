const Character = require("./Character.js");
const { DEFAULT_STATS } = require("./stats.js");

class Wizard extends Character {
  constructor(name) {
    super(name, DEFAULT_STATS.Wizard.hp, DEFAULT_STATS.Wizard.dmg, DEFAULT_STATS.Wizard.mana);
  }

  specialAttack(target) {
    const cost = 25;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(7);
    return true;
  }
}

module.exports = Wizard;
