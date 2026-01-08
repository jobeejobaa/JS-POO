import Character from "./Character.js";
import { DEFAULT_STATS } from "./stats.js";

export default class Monk extends Character {
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
