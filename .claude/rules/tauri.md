---
paths:
  - "src-tauri/**/*"
---

# Backend Tauri — Architecture Hexagonale

## Structure

```
src-tauri/src/
├── domain/                  # Coeur métier — aucune dépendance externe
│   ├── models/              # Entités et value objects
│   ├── ports/               # Traits (interfaces) — driven & driving
│   └── services/            # Logique métier pure
├── application/             # Use cases / orchestration
│   ├── commands/            # Commandes Tauri (#[tauri::command])
│   └── dto/                 # Data Transfer Objects (serde)
├── infrastructure/          # Adapters — implémentations concrètes
│   ├── docker/              # Adapter Docker (Bollard ou CLI)
│   ├── shell/               # Adapter exécution de processus
│   ├── filesystem/          # Adapter lecture/écriture fichiers config
│   ├── editor/              # Adapter ouverture VS Code / éditeurs
│   └── browser/             # Adapter ouverture navigateur
├── lib.rs                   # Point d'entrée, wiring des dépendances
└── main.rs                  # Entry point desktop
```

## Règles

- **Le domaine ne dépend de rien.** Pas de crate externe dans `domain/`, pas de `tauri::`, pas de `std::process`. Uniquement des structs, enums et traits purs.
- **Les ports sont des traits.** Le domaine définit ce dont il a besoin via des traits dans `domain/ports/`. L'infrastructure les implémente.
- **Sens des dépendances** : `infrastructure → application → domain`. Jamais l'inverse.
- **Commandes Tauri** : déclarées dans `application/commands/`, elles orchestrent les use cases. Elles ne contiennent pas de logique métier.
- **DTOs** : les structs sérialisées avec `serde` pour la communication frontend ↔ backend vivent dans `application/dto/`. Le domaine n'utilise pas serde.
- **Injection de dépendances** : le wiring se fait dans `lib.rs` via Tauri State. Les adapters sont injectés au démarrage.
- **Gestion d'erreurs** : un type `AppError` dans `domain/` avec `thiserror`. Les adapters convertissent leurs erreurs en `AppError`.
- **Nommage Rust** : snake_case partout, noms de modules explicites, pas d'abréviations.
