# Google Ads Pilot - V1 MVP

Application web de pilotage Google Ads orientée **audit**, **règles**, **alertes** et **validation humaine**.

## Architecture

### Stack technique
- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **Icônes**: Lucide React
- **Données**: Mock JSON (aucun backend)

### Structure du projet

```
google-ads-pilot/
├── app/                          # Pages Next.js (App Router)
│   ├── page.tsx                  # Dashboard (Overview)
│   ├── audit/page.tsx            # Page Audit
│   ├── alerts/page.tsx           # Page Alerts
│   ├── actions/page.tsx          # Page Actions (validation humaine)
│   ├── rules/page.tsx            # Page Rules
│   ├── history/page.tsx          # Page History
│   ├── layout.tsx                # Layout global avec Sidebar
│   └── globals.css               # Styles Tailwind
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Navigation principale
│   │   └── Header.tsx            # Header de page
│   ├── dashboard/
│   │   ├── KPICard.tsx           # Carte KPI
│   │   └── HealthScore.tsx       # Score de santé
│   ├── shared/
│   │   ├── Badge.tsx             # Badge P0/P1/P2
│   │   ├── Button.tsx            # Bouton personnalisé
│   │   ├── Card.tsx              # Carte conteneur
│   │   └── Table.tsx             # Table réutilisable
│   └── audit/
│       ├── CampaignTable.tsx     # Tableau campagnes
│       ├── Findings.tsx          # Résultats d'audit
│       └── ActionPlan.tsx        # Plan d'action
├── data/
│   └── mock.ts                   # Données mockées
├── types/
│   └── index.ts                  # Types TypeScript
└── Configuration (tailwind, tsconfig, etc.)
```

## Pages de l'application

### 1. Overview (Dashboard)
**Route**: `/`

- KPIs : Spend, Conversions, CPA, ROAS
- Health Score (0-100)
- Alertes critiques (P0)
- Actions en attente de validation

### 2. Audit
**Route**: `/audit`

**Fonctionnalités**:
- Boutons : Run Full Audit / Check ROAS / Find Wasted Spend
- Tableau des campagnes avec métriques
- Section "Findings" avec alertes P0/P1/P2
- Plan d'action généré

### 3. Alerts
**Route**: `/alerts`

**Fonctionnalités**:
- Liste des alertes avec filtres par sévérité (Critical / Warning / Info)
- Détails : campagne, métrique, seuil, recommandation
- Bouton "Créer une action"

### 4. Actions
**Route**: `/actions`

**Fonctionnalités**:
- Liste des actions proposées par le moteur
- Détails : cause, métrique, impact estimé
- Validation humaine : boutons **Valider** / **Refuser**
- Vue détail d'action

### 5. Rules
**Route**: `/rules`

**Fonctionnalités** (lecture seule V1):
- Tableau des règles (objectif, métrique, seuil, action, priorité)
- Statut Active/Inactive
- Répartition par priorité (P0 / P1 / P2)

### 6. History
**Route**: `/history`

**Fonctionnalités**:
- Timeline des audits et décisions
- Filtres par type : Audit / Action validée / Action refusée
- Statistiques globales

## Design System

### Couleurs

| Couleur | Usage | Classes Tailwind |
|---------|-------|------------------|
| **Primary** (Bleu) | Actions principales, P2 | `primary-500/600/700` |
| **Danger** (Rouge) | Alertes P0, critiques | `danger-500/600/700` |
| **Warning** (Orange) | Alertes P1, attention | `warning-500/600/700` |
| **Success** (Vert) | Validations, bon ROAS | `success-500/600/700` |
| **Gray** | Texte, bordures, backgrounds | `gray-50/100/200/...` |

### Composants

- **Badge**: P0 (rouge) / P1 (orange) / P2 (bleu)
- **Button**: Variants (primary, secondary, danger, success, ghost)
- **Card**: Conteneur avec titre et actions optionnels
- **Table**: Table réutilisable avec colonnes configurables
- **Sidebar**: Navigation fixe à gauche
- **Header**: Titre de page avec actions

## Installation & Lancement

### 1. Installer les dépendances

```bash
cd google-ads-pilot
npm install
```

### 2. Lancer en mode développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

### 3. Build de production

```bash
npm run build
npm start
```

## Données mockées

Toutes les données sont mockées dans `data/mock.ts`:

- **KPIs**: Spend, Conversions, CPA, ROAS
- **Campagnes**: 5 campagnes avec métriques complètes
- **Alertes**: 5 alertes (P0, P1, P2)
- **Actions**: 4 actions en attente de validation
- **Règles**: 6 règles configurées
- **Historique**: 6 événements

## Prochaines étapes (V2)

### Backend
- [ ] Connecter à FastAPI
- [ ] Intégration Google Ads API
- [ ] Airtable pour stockage des décisions

### Authentification
- [ ] Login / Logout
- [ ] Gestion des utilisateurs

### Fonctionnalités
- [ ] Édition des règles
- [ ] Export des données
- [ ] Notifications temps réel
- [ ] Graphiques de performance

## Technologies utilisées

- **Next.js 14**: Framework React avec App Router
- **TypeScript**: Typage fort
- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Icônes modernes
- **React Hooks**: useState pour la gestion d'état locale

## Notes importantes

- Pas d'authentification dans cette V1
- Application interne / MVP
- Toutes les données sont mockées (aucun appel API réel)
- Prêt à être branché sur FastAPI + Airtable
- Design SaaS moderne, clean et sobre

## Auteur

Développé par un Senior Frontend Engineer & UX Designer spécialisé en SaaS data/analytics tools.

---

**Version**: 1.0.0 - MVP
**Date**: 2024
**Licence**: Internal use only
