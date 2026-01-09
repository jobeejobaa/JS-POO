const DEFAULT_STATS = {
  Fighter: { hp: 12, dmg: 4, mana: 40 },
  Paladin: { hp: 16, dmg: 3, mana: 160 },
  Monk: { hp: 8, dmg: 2, mana: 200 },
  Berzerker: { hp: 8, dmg: 4, mana: 0 },
  Assassin: { hp: 6, dmg: 6, mana: 20 },
  Jobee: { hp: 14, dmg: 2, mana: 150 },
  Wizard: { hp: 10, dmg: 2, mana: 200 },
};

class Character {
  constructor(name, hp, dmg, mana) {
    this.name = name;
    this.hp = hp;
    this.dmg = dmg;
    this.mana = mana;
    this.status = "playing";
  }

  isLoser() {
    return this.status === "loser";
  }

  takeDamage(amount) {
    if (this.isLoser()) return;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.status = "loser";
    }
  }

  dealDamage(target) {
    if (this.isLoser()) return false;
    target.takeDamage(this.dmg);
    return true;
  }

  spendMana(cost) {
    if (this.mana < cost) return false;
    this.mana -= cost;
    return true;
  }

  heal(amount) {
    if (this.isLoser()) return;
    this.hp += amount;
  }

  info() {
    return `${this.name} (${this.constructor.name}) hp:${this.hp} dmg:${this.dmg} mana:${this.mana} status:${this.status}`;
  }
}

Character.DEFAULT_STATS = DEFAULT_STATS;

module.exports = Character;
