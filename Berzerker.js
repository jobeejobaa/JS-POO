const Character = require("./Character.js");
const { DEFAULT_STATS } = require("./stats.js");

class Berzerker extends Character {
  constructor(name) {
    super(name, DEFAULT_STATS.Berzerker.hp, DEFAULT_STATS.Berzerker.dmg, DEFAULT_STATS.Berzerker.mana);
  }

  specialAttack() {
    this.dmg += 1;
    this.takeDamage(1);
    return true;
  }
}

module.exports = Berzerker;
