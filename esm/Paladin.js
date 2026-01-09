import Character from "./Character.js";

export default class Paladin extends Character {
  constructor(name) {
    super(
      name,
      Character.DEFAULT_STATS.Paladin.hp,
      Character.DEFAULT_STATS.Paladin.dmg,
      Character.DEFAULT_STATS.Paladin.mana
    );
  }

  specialAttack(target) {
    const cost = 40;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(4);
    this.heal(5);
    return true;
  }
}
