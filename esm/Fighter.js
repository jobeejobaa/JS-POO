import Character from "./Character.js";

export default class Fighter extends Character {
  constructor(name) {
    super(
      name,
      Character.DEFAULT_STATS.Fighter.hp,
      Character.DEFAULT_STATS.Fighter.dmg,
      Character.DEFAULT_STATS.Fighter.mana
    );
  }

  specialAttack(target) {
    const cost = 20;
    if (!this.spendMana(cost)) return false;
    target.takeDamage(5);
    return true;
  }
}
