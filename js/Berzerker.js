const Character = require("./Character.js");

class Berzerker extends Character {
  constructor(name) {
    super(
      name,
      Character.DEFAULT_STATS.Berzerker.hp,
      Character.DEFAULT_STATS.Berzerker.dmg,
      Character.DEFAULT_STATS.Berzerker.mana
    );
  }

  specialAttack() {
    this.dmg += 1;
    this.takeDamage(1);
    return true;
  }
}

module.exports = Berzerker;
