const Character = require("./Character.js");

class Jobee extends Character {
  constructor(name) {
    super(
      name,
      Character.DEFAULT_STATS.Jobee.hp,
      Character.DEFAULT_STATS.Jobee.dmg,
      Character.DEFAULT_STATS.Jobee.mana
    );
  }

  takeDamage(amount) {
    if (this.isLoser()) return;
    this.hp += amount;
  }

  specialAttack(target) {
    const cost = 30;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(6);
    return true;
  }
}

module.exports = Jobee;
