# Frontend Layout Design

**Date** : 2026-05-28
**Scope** : Shell layout, navigation, page d'accueil projets

## Contexte

1ClickProject est une app desktop (Tauri v2 + React 19 + DaisyUI 5) pour développeurs. L'utilisateur configure un projet, un clic, tout l'environnement de dev se lance. Ce spec couvre le layout global et la page d'accueil.

## Décisions de design

### Layout global

- **Sidebar icônes à gauche** (~48px de large), toujours en état "plié"
- Un seul état — pas de toggle ouvert/fermé
- Tooltip au hover sur chaque icône pour indiquer la page
- Navigation actuelle : **Accueil** (icône home) et **Paramètres** (icône settings)
- Possibilité d'un avatar/user en bas de la sidebar (à confirmer plus tard)

### Design visuel

- Noir et blanc, minimaliste
- Pas de thème custom pour l'instant — DaisyUI dark theme par défaut
- Pas de couleur accent sauf le vert pour l'action "lancer" (▶)

### Page Accueil — Liste des projets

- **Affichage hybride** : toggle grille/liste en haut de la page
- Chaque projet affiche : nom, stack/technologies
- **Hover sur une carte** : icônes ▶ (lancer) et ⚙ (configurer) apparaissent discrètement en **haut droite**
- **Clic sur ▶** : lancement direct de tout l'environnement, feedback temps réel (progression des services)
- **Clic sur ⚙** : ouvre la configuration du projet (à designer plus tard)
- **Bouton "+"** : ajouter un nouveau projet (à designer plus tard)
- Données projets **mockées en dur** pour cette itération

### Page Paramètres

- **Page vide placeholder** pour l'instant
- Contenu à designer plus tard

### Configuration projet

- À terme, un fichier `1p.json` versionné dans le repo git du projet
- Design du format et de l'éditeur de config reporté à une itération future

## Architecture technique

### Routing

- **React Router v7** pour la navigation entre pages
- 2 routes : `/` (accueil) et `/settings` (paramètres)

### Structure des fichiers

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Router setup
├── index.css                   # Tailwind + DaisyUI
├── features/
│   ├── shell/                  # Layout global
│   │   ├── components/
│   │   │   ├── AppLayout.tsx   # Sidebar + Outlet
│   │   │   ├── Sidebar.tsx     # Barre d'icônes
│   │   │   └── SidebarIcon.tsx # Icône + tooltip
│   │   └── index.ts            # Barrel export
│   ├── projects/               # Page accueil
│   │   ├── components/
│   │   │   ├── ProjectsPage.tsx    # Page principale
│   │   │   ├── ProjectGrid.tsx     # Vue grille
│   │   │   ├── ProjectList.tsx     # Vue liste
│   │   │   ├── ProjectCard.tsx     # Carte projet (grille)
│   │   │   ├── ProjectRow.tsx      # Ligne projet (liste)
│   │   │   └── ViewToggle.tsx      # Switch grille/liste
│   │   ├── types.ts                # Type Project
│   │   ├── data.ts                 # Données mockées
│   │   └── index.ts
│   └── settings/               # Page paramètres
│       ├── components/
│       │   └── SettingsPage.tsx # Placeholder vide
│       └── index.ts
└── components/                 # Composants partagés (vide pour l'instant)
```

### State management

- `useState` local pour le toggle grille/liste
- Pas de state management global (YAGNI)
- Données projets importées depuis `data.ts`

### Composants clés

**AppLayout** : Flex container horizontal. Sidebar fixe à gauche, `<Outlet />` à droite pour le contenu de la route active.

**Sidebar** : Colonne d'icônes empilées verticalement. Chaque icône est un `<NavLink>` avec tooltip DaisyUI au hover. Icône active visuellement distinguée (fond légèrement plus clair).

**ProjectCard / ProjectRow** : Affiche nom + stack. Au hover, overlay discret avec icônes ▶ et ⚙ en haut droite. Le ▶ est vert, le ⚙ est gris neutre.

**ViewToggle** : Deux icônes (grille/liste) avec état actif. Stocké en `useState` local.

## Hors scope

- Création/édition de projet
- Format du fichier `1p.json`
- Lancement effectif des services (backend Tauri)
- Thème clair / personnalisation
- Authentification / multi-utilisateur
