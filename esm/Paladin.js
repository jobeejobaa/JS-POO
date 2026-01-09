import Character from "./Character.js";
import { DEFAULT_STATS } from "./stats.js";

export default class Paladin extends Character {
  constructor(name) {
    super(name, DEFAULT_STATS.Paladin.hp, DEFAULT_STATS.Paladin.dmg, DEFAULT_STATS.Paladin.mana);
  }

  specialAttack(target) {
    const cost = 40;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(4);
    this.heal(5);
    return true;
  }
}
