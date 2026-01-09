import Character from "./Character.js";
import { DEFAULT_STATS } from "./stats.js";

export default class Wizard extends Character {
  constructor(name) {
    super(name, DEFAULT_STATS.Wizard.hp, DEFAULT_STATS.Wizard.dmg, DEFAULT_STATS.Wizard.mana);
  }

  specialAttack(target) {
    const cost = 25;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(4);
    return true;
  }
}
