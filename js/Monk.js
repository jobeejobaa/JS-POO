const Character = require("./Character.js");

class Monk extends Character {
  constructor(name) {
    super(
      name,
      Character.DEFAULT_STATS.Monk.hp,
      Character.DEFAULT_STATS.Monk.dmg,
      Character.DEFAULT_STATS.Monk.mana
    );
  }

  specialAttack() {
    const cost = 25;
    if (!this.spendMana(cost)) return false;
    this.heal(8);
    return true;
  }
}

module.exports = Monk;
