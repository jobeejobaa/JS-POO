import Character from "./Character.js";

export default class Wizard extends Character {
  constructor(name) {
    super(
      name,
      Character.DEFAULT_STATS.Wizard.hp,
      Character.DEFAULT_STATS.Wizard.dmg,
      Character.DEFAULT_STATS.Wizard.mana
    );
  }

  specialAttack(target) {
    const cost = 25;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(4);
    return true;
  }
}
