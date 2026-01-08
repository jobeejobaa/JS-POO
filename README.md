# Gladiator Arena

Petit jeu de gladiateurs en JavaScript avec deux modes:
- Console (Node.js, CommonJS)
- Navigateur (HTML + JS pour l'UI)

## Prerequis
- Node.js installe (pour le mode console)
- Un navigateur web (pour le mode UI)

## Mode console
Lance la partie en terminal:

```bash
node "Dev 3/jeu gladiator/index.js"
```

Ce mode utilise CommonJS (require/module.exports) pour fonctionner sans package.json.

## Mode navigateur (UI)
L'interface est definie dans:
- `index.html`
- `styles.css`
- `ui.js`

Ouvre `index.html` dans ton navigateur.

Note: le navigateur ne comprend pas `require`. Pour l'UI, une version ESM des
classes se trouve dans `esm/` et `ui.js` les importe.

## Structure rapide
- `Game.js`: logique principale du tour par tour.
- `Character.js`: classe de base (pv, degats, mana, statut).
- `Fighter.js`, `Paladin.js`, `Monk.js`, `Berzerker.js`, `Assassin.js`, `Jobee.js`, `Wizard.js`: classes de personnages.
- `stats.js`: valeurs de base (hp, dmg, mana).
- `index.js`: point d'entree console.
- `ui.js`: logique de l'interface web.

## Notes
- Console: CommonJS (require/module.exports), pas besoin de package.json.
- UI: le navigateur aime ESM (import/export) avec `<script type="module">`.
