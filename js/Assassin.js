const Character = require("./Character.js");

class Assassin extends Character {
  constructor(name) {
    super(
      name,
      Character.DEFAULT_STATS.Assassin.hp,
      Character.DEFAULT_STATS.Assassin.dmg,
      Character.DEFAULT_STATS.Assassin.mana
    );
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
