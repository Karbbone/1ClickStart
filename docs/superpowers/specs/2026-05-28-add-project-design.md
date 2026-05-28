# Add Project — Design Spec

**Date** : 2026-05-28
**Scope** : Page de création de projet + persistance via tauri-plugin-store

## Contexte

Après avoir mis en place le shell (sidebar + page d'accueil avec liste de projets mockés), on implémente la création de projets. L'utilisateur peut ajouter un projet en sélectionnant un dossier. Le nom par défaut est le nom du dossier.

## Flux utilisateur

1. Sur la page d'accueil, clic sur le bouton "+" en dernière position dans la liste des projets
2. Navigation vers `/projects/new`
3. Clic sur "Parcourir" → dialogue natif de sélection de dossier (Tauri)
4. Le champ "Nom du projet" est auto-rempli avec le nom du dossier (ex: `1ClickProject`)
5. L'utilisateur peut modifier le nom s'il le souhaite
6. Clic sur "Créer" → le projet est persisté → retour à l'accueil
7. Le nouveau projet apparaît dans la liste

## Décisions techniques

### Persistance

- **tauri-plugin-store** — store clé-valeur persisté en JSON dans AppData
- Une seule clé `projects` contenant un tableau de projets
- Format : `{ id: string, name: string, path: string }`
- Pas de SQLite (YAGNI — c'est juste une liste)

### Backend (Rust / Tauri)

Architecture hexagonale :

- **Domain** : `Project` model (id, name, path), trait `ProjectRepository` (port)
- **Application** : commandes Tauri `create_project`, `list_projects`, `delete_project`
- **Infrastructure** : `StoreProjectRepository` implémente `ProjectRepository` via tauri-plugin-store

### Frontend

- **Route** : `/projects/new` → composant `NewProjectPage`
- **Bouton "+"** : ajouté en fin de liste dans `ProjectGrid` et `ProjectList`
- **Formulaire** : champ dossier (lecture seule + bouton parcourir) + champ nom (éditable, pré-rempli) + boutons annuler/créer
- **API Tauri** : `api.ts` dans la feature `projects` encapsule les `invoke()`
- **Dialog** : `@tauri-apps/plugin-dialog` pour le sélecteur de dossier natif
- **Données** : remplacer les mock data par les vrais appels backend

### Plugins Tauri requis

- `tauri-plugin-store` — persistance projets
- `tauri-plugin-dialog` — dialogue natif de sélection de dossier

### Capabilities Tauri requises

- `store:default` — accès au store
- `dialog:default` — accès aux dialogues natifs

## Page "Nouveau projet"

Layout simple :

- Header avec bouton retour (←) et titre "Nouveau projet"
- Champ "Dossier" : input lecture seule + bouton "Parcourir" qui ouvre le dialog natif
- Champ "Nom du projet" : input texte, pré-rempli avec le nom du dossier sélectionné
- Boutons en bas : "Annuler" (retour accueil) + "Créer" (sauvegarde + retour accueil)
- Validation : le dossier est obligatoire, le nom est obligatoire
- UI en français, composants DaisyUI

## Hors scope

- Configuration des services (Docker, VS Code, terminal, etc.)
- Format du fichier `1p.json`
- Édition d'un projet existant
- Suppression de projet (sera ajoutée plus tard)
