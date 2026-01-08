import Character from "./Character.js";
import { DEFAULT_STATS } from "./stats.js";

export default class Berzerker extends Character {
  constructor(name) {
    super(name, DEFAULT_STATS.Berzerker.hp, DEFAULT_STATS.Berzerker.dmg, DEFAULT_STATS.Berzerker.mana);
  }

  specialAttack() {
    const cost = 0;
    if (!this.spendMana(cost)) return false;
    this.dmg += 1;
    this.takeDamage(1);
    return true;
  }
}
