# Guide du développeur - Google Ads Pilot

## Démarrage rapide

```bash
cd google-ads-pilot
npm install
npm run dev
```

Ouvrir http://localhost:3000

## Structure des dossiers

### `/app` - Pages Next.js
Utilise le **App Router** de Next.js 14.

Chaque dossier = une route :
- `app/page.tsx` → `/`
- `app/audit/page.tsx` → `/audit`
- `app/alerts/page.tsx` → `/alerts`

### `/components` - Composants React

#### `components/shared/` - Composants réutilisables
Composants génériques utilisables partout.

**Badge.tsx**
```tsx
<Badge variant="P0">P0</Badge>
<Badge variant="success">Validé</Badge>
```

**Button.tsx**
```tsx
<Button variant="primary" size="md" icon={<Play />}>
  Run Audit
</Button>
```

**Card.tsx**
```tsx
<Card title="Mon titre" actions={<Button>Action</Button>}>
  Contenu...
</Card>
```

**Table.tsx**
```tsx
<Table
  data={items}
  columns={columns}
  keyExtractor={(item) => item.id}
/>
```

#### `components/layout/` - Layout global

**Sidebar.tsx**
Navigation principale. Modifier `navItems` pour ajouter une page.

**Header.tsx**
Header de page avec titre + actions.

#### `components/dashboard/` - Composants spécifiques

**KPICard.tsx** - Carte KPI avec trend
**HealthScore.tsx** - Score de santé du compte

#### `components/audit/` - Composants d'audit

**CampaignTable.tsx** - Tableau campagnes
**Findings.tsx** - Résultats d'audit
**ActionPlan.tsx** - Plan d'action

### `/data` - Données mockées

**mock.ts** contient toutes les données.

```typescript
export const mockCampaigns: Campaign[] = [...]
export const mockAlerts: Alert[] = [...]
export const mockActions: Action[] = [...]
```

### `/types` - Types TypeScript

**index.ts** contient tous les types.

```typescript
export type Priority = 'P0' | 'P1' | 'P2';
export interface Campaign { ... }
export interface Alert { ... }
```

## Ajouter une nouvelle page

### 1. Créer le fichier de page

```bash
# Créer le dossier
mkdir app/ma-page

# Créer le fichier page.tsx
touch app/ma-page/page.tsx
```

### 2. Code de base

```tsx
import Header from '@/components/layout/Header';
import Card from '@/components/shared/Card';

export default function MaPage() {
  return (
    <div>
      <Header
        title="Ma Page"
        subtitle="Description de ma page"
      />

      <Card title="Mon contenu">
        <p>Hello World</p>
      </Card>
    </div>
  );
}
```

### 3. Ajouter à la Sidebar

Éditer `components/layout/Sidebar.tsx` :

```tsx
const navItems = [
  // ... items existants
  { href: '/ma-page', label: 'Ma Page', icon: Star },
];
```

## Ajouter des données mockées

### 1. Définir le type

Dans `types/index.ts` :

```typescript
export interface MonType {
  id: string;
  name: string;
  value: number;
}
```

### 2. Créer les données

Dans `data/mock.ts` :

```typescript
import type { MonType } from '@/types';

export const mockMonType: MonType[] = [
  { id: '1', name: 'Item 1', value: 100 },
  { id: '2', name: 'Item 2', value: 200 },
];
```

### 3. Utiliser dans une page

```tsx
import { mockMonType } from '@/data/mock';

export default function MaPage() {
  return (
    <div>
      {mockMonType.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## Utiliser les composants partagés

### Badge

```tsx
<Badge variant="P0">Critique</Badge>
<Badge variant="success">Validé</Badge>
<Badge variant="warning">En attente</Badge>
```

Variants disponibles: `P0`, `P1`, `P2`, `critical`, `warning`, `info`, `success`, `default`

### Button

```tsx
<Button variant="primary" size="md">
  Cliquez ici
</Button>

<Button variant="danger" icon={<X />} onClick={handleClick}>
  Refuser
</Button>
```

Variants: `primary`, `secondary`, `danger`, `success`, `ghost`
Sizes: `sm`, `md`, `lg`

### Card

```tsx
<Card title="Titre" actions={<Button>Action</Button>}>
  Contenu de la carte
</Card>

<Card padding={false}>
  Contenu sans padding
</Card>
```

### Table

```tsx
const columns = [
  {
    key: 'name',
    header: 'Nom',
    render: (item) => <strong>{item.name}</strong>
  },
  {
    key: 'value',
    header: 'Valeur'
  }
];

<Table
  data={items}
  columns={columns}
  keyExtractor={(item) => item.id}
/>
```

## Gestion de l'état

Pour l'instant, on utilise `useState` local.

```tsx
'use client'; // Important pour les hooks

import { useState } from 'react';

export default function MaPage() {
  const [count, setCount] = useState(0);

  return (
    <Button onClick={() => setCount(count + 1)}>
      Count: {count}
    </Button>
  );
}
```

## Styling avec Tailwind

### Classes utiles

**Espacements**
```tsx
p-4   // padding: 1rem
px-6  // padding left/right: 1.5rem
gap-4 // gap: 1rem
```

**Couleurs**
```tsx
text-gray-900      // Texte sombre
bg-primary-600     // Background bleu
border-danger-200  // Bordure rouge claire
```

**Typography**
```tsx
text-sm font-medium   // Petit texte medium
text-3xl font-bold    // Grand titre bold
```

**Layout**
```tsx
flex items-center justify-between
grid grid-cols-3 gap-6
```

### Couleurs du design system

**Primary (Bleu)**: `primary-50/100/500/600/700`
**Danger (Rouge)**: `danger-50/100/500/600/700`
**Warning (Orange)**: `warning-50/100/500/600/700`
**Success (Vert)**: `success-50/100/500/600/700`
**Gray**: `gray-50/100/200/.../900`

## Icônes (Lucide React)

```tsx
import { Play, AlertTriangle, Check } from 'lucide-react';

<Play size={18} className="text-primary-600" />
<AlertTriangle size={20} />
```

Voir toutes les icônes : https://lucide.dev/icons/

## Debug & Troubleshooting

### Erreur de compilation TypeScript

Vérifier les imports :
```tsx
// ✅ Bon
import type { Campaign } from '@/types';

// ❌ Mauvais
import { Campaign } from '@/types';  // sans "type"
```

### Composant ne s'affiche pas

Vérifier si `'use client'` est nécessaire (pour useState, useEffect, onClick, etc.)

```tsx
'use client';  // En haut du fichier

import { useState } from 'react';
```

### Styles Tailwind ne fonctionnent pas

1. Vérifier que le fichier est dans `content` de `tailwind.config.ts`
2. Relancer le serveur : `npm run dev`

### Les données mockées ne s'affichent pas

Vérifier l'import :
```tsx
import { mockCampaigns } from '@/data/mock';  // ✅
import { mockCampaigns } from '../data/mock'; // ❌
```

## Préparer pour le backend

### Remplacer les mocks par des API calls

**Avant (mock):**
```tsx
import { mockCampaigns } from '@/data/mock';

export default function MaPage() {
  const campaigns = mockCampaigns;
  // ...
}
```

**Après (API):**
```tsx
'use client';

import { useState, useEffect } from 'react';

export default function MaPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => setCampaigns(data));
  }, []);

  // ...
}
```

### Créer une API route Next.js

```typescript
// app/api/campaigns/route.ts
export async function GET() {
  const response = await fetch('https://your-fastapi.com/campaigns');
  const data = await response.json();
  return Response.json(data);
}
```

## Variables d'environnement

Créer `.env.local` :

```bash
NEXT_PUBLIC_API_URL=https://your-api.com
API_SECRET_KEY=your-secret
```

Utiliser :
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Build & Deploy

### Build local

```bash
npm run build
npm start
```

### Deploy sur Vercel

1. Push sur GitHub
2. Connecter le repo à Vercel
3. Deploy automatique

### Variables d'environnement sur Vercel

Settings → Environment Variables → Ajouter les clés

## Bonnes pratiques

### 1. Typage strict

Toujours typer les props :

```tsx
interface MyComponentProps {
  title: string;
  count: number;
  onSubmit: () => void;
}

export default function MyComponent({ title, count, onSubmit }: MyComponentProps) {
  // ...
}
```

### 2. Composants purs

Préférer les composants sans état quand possible :

```tsx
// ✅ Bon
export default function KPICard({ kpi }: { kpi: KPI }) {
  return <div>{kpi.value}</div>;
}

// ❌ Éviter si pas nécessaire
export default function KPICard() {
  const [kpi, setKpi] = useState(...);
  return <div>{kpi.value}</div>;
}
```

### 3. Nommage

- Composants : PascalCase (`KPICard.tsx`)
- Fichiers utilitaires : camelCase (`mock.ts`)
- Types : PascalCase (`Campaign`, `Alert`)

### 4. Organisation des imports

```tsx
// 1. Librairies externes
import { useState } from 'react';
import Link from 'next/link';

// 2. Composants internes
import Header from '@/components/layout/Header';
import Badge from '@/components/shared/Badge';

// 3. Types
import type { Campaign } from '@/types';

// 4. Data
import { mockCampaigns } from '@/data/mock';
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

Pour toute question, consulter :
- README.md : Vue d'ensemble
- ARCHITECTURE.md : Design & UX
- Ce fichier : Développement

---

**Happy coding!** 🚀
