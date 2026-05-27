# 1ClickProject

App desktop (Tauri v2 + React 19 + DaisyUI 5) pour développeurs : configurer un projet, un bouton, tout l'environnement de dev se lance (conteneurs Docker, VS Code, terminal, serveur dev, navigateur).

## Stack

- **Frontend** : React 19 + TypeScript + Vite — architecture feature-based (voir `.claude/rules/frontend.md`)
- **Backend** : Tauri v2 + Rust — architecture hexagonale (voir `.claude/rules/tauri.md`)
- **UI** : Tailwind CSS v4 + DaisyUI 5
- **Package manager** : bun

## Commandes

```bash
bun run tauri dev       # Dev complet
bun run tauri build     # Build production
```

## Conventions

- `bun` uniquement (jamais npm/yarn/pnpm)
- Préfixer les commandes shell avec `rtk`
- Code/commentaires techniques en anglais, UI en français

## Principes de développement

- **KISS** (Keep It Simple, Stupid) — Privilégier la solution la plus simple. Pas de sur-ingénierie, pas d'abstraction prématurée. Si c'est compliqué, c'est probablement mal conçu.
- **SOLID** — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Chaque module/composant a une seule raison de changer.
- **DRY** (Don't Repeat Yourself) — Factoriser le code dupliqué, mais seulement quand la duplication est réelle (pas quand deux bouts de code se ressemblent par hasard).
- **YAGNI** (You Aren't Gonna Need It) — Ne pas coder de fonctionnalité "au cas où". Implémenter uniquement ce qui est demandé maintenant.
- **Separation of Concerns** — Chaque couche a son rôle. Le frontend affiche, le backend orchestre, le domaine contient la logique métier.
- **Fail Fast** — Valider tôt, échouer explicitement. Pas d'erreurs silencieuses, pas de valeurs par défaut qui masquent des bugs.
- **Composition over Inheritance** — Préférer la composition (traits en Rust, hooks/composants en React) à l'héritage.
- **Clean Code** — Noms explicites, fonctions courtes, pas de commentaires pour expliquer du mauvais code — réécrire le code à la place.
