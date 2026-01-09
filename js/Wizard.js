const Character = require("./Character.js");

class Wizard extends Character {
  constructor(name) {
    super(
      name,
      Character.DEFAULT_STATS.Wizard.hp,
      Character.DEFAULT_STATS.Wizard.dmg,
      Character.DEFAULT_STATS.Wizard.mana
    );
  }

  specialAttack(target) {
    const cost = 25;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(7);
    return true;
  }
}

module.exports = Wizard;
