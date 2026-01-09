import Character from "./Character.js";
import { DEFAULT_STATS } from "./stats.js";

export default class Fighter extends Character {
  constructor(name) {
    super(name, DEFAULT_STATS.Fighter.hp, DEFAULT_STATS.Fighter.dmg, DEFAULT_STATS.Fighter.mana);
  }

  specialAttack(target) {
    const cost = 20;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(5);
    return true;
  }
}
