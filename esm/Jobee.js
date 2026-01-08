import Character from "./Character.js";
import { DEFAULT_STATS } from "./stats.js";

export default class Jobee extends Character {
  constructor(name) {
    super(name, DEFAULT_STATS.Jobee.hp, DEFAULT_STATS.Jobee.dmg, DEFAULT_STATS.Jobee.mana);
  }

  takeDamage(amount) {
    if (this.isLoser()) return;
    const absorbed = Math.min(2, amount);
    if (absorbed > 0) {
      this.heal(absorbed);
    }
    super.takeDamage(Math.max(0, amount - absorbed));
  }

  specialAttack(target) {
    const cost = 30;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(6);
    return true;
  }
}
