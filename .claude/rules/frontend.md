---
paths:
  - "src/**/*"
---

# Frontend — Architecture Feature-Based

## Structure

```
src/
├── features/               # Chaque feature = un dossier autonome
│   └── <feature>/
│       ├── components/      # Composants React propres à la feature
│       ├── hooks/           # Hooks custom de la feature
│       ├── types.ts         # Types/interfaces de la feature
│       ├── api.ts           # Appels Tauri (invoke) de la feature
│       └── index.ts         # Barrel export public
├── components/              # Composants partagés (UI réutilisable)
├── hooks/                   # Hooks partagés
├── lib/                     # Utilitaires partagés
├── types/                   # Types globaux
├── App.tsx
├── main.tsx
└── index.css
```

## Règles

- **Une feature = un dossier isolé.** Tout ce qui est spécifique à une feature vit dans `features/<nom>/`.
- **Pas d'import croisé entre features.** Si deux features ont besoin du même code, il remonte dans `components/`, `hooks/` ou `lib/`.
- **Barrel exports** : chaque feature expose son API publique via `index.ts`. On importe depuis `@/features/projects` jamais depuis `@/features/projects/components/ProjectCard`.
- **Appels Tauri** : les `invoke()` sont encapsulés dans le fichier `api.ts` de la feature, jamais appelés directement dans les composants.
- **Composants DaisyUI** : utiliser les classes DaisyUI en priorité, pas de CSS custom sauf nécessité absolue.
- **Nommage** : PascalCase pour les composants, camelCase pour les hooks/utilitaires, kebab-case pour les fichiers non-composants.
- **Imports** : toujours utiliser l'alias `@/` pour les imports (`@/features/...`, `@/components/...`). Jamais de chemins relatifs comme `../../`.
- **UI en français** : tout texte affiché à l'utilisateur est en français.
