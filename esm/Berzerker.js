import Character from "./Character.js";

export default class Berzerker extends Character {
  constructor(name) {
    super(
      name,
      Character.DEFAULT_STATS.Berzerker.hp,
      Character.DEFAULT_STATS.Berzerker.dmg,
      Character.DEFAULT_STATS.Berzerker.mana
    );
  }

  specialAttack() {
    const cost = 0;
    if (!this.spendMana(cost)) return false;
    this.dmg += 1;
    this.takeDamage(1);
    return true;
  }
}
