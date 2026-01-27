# 🚀 Quickstart V1.5 - Multi-channel

## ✅ Ce qui a été fait

L'application **Google Ads Pilot** a été transformée en **Marketing Command Center** avec support multi-channel (SEA / SEO / META).

### Changements principaux

1. **Architecture multi-channel**
   - Nouveau type `Channel = 'sea' | 'seo' | 'meta'`
   - Context global pour le channel sélectionné
   - Tous les types enrichis avec `channel`

2. **Composants nouveaux**
   - `ChannelSelector` : Dropdown pour sélectionner le channel
   - `ComingSoon` : Badge pour les channels inactifs

3. **Données mockées**
   - KPIs différents par channel (SEA / SEO / META)
   - Health Score par channel
   - Types d'audit par channel

4. **Page Overview migrée** ✅
   - KPIs dynamiques selon le channel
   - Coming Soon pour SEO/META
   - Filtrage des alertes et actions par channel

## 🧪 Tester l'application

```bash
cd google-ads-pilot
npm install  # Si nouvelles dépendances
npm run dev
```

Ouvrir http://localhost:3000

### Test 1 : Channel SEA (actif)

1. La page Overview charge avec les KPIs SEA
2. Tu vois le ChannelSelector en haut avec 3 boutons
3. SEA est sélectionné par défaut
4. Toutes les données s'affichent normalement

### Test 2 : Channel SEO (inactif)

1. Cliquer sur le bouton "SEO" (avec icône 🔍)
2. Tu vois un badge "Coming Soon"
3. Message : "Le dashboard SEO sera disponible prochainement"
4. Les KPIs SEO sont visibles dans le code mais coming soon

### Test 3 : Channel META (inactif)

1. Cliquer sur le bouton "Meta Ads" (avec icône 📱)
2. Tu vois un badge "Coming Soon"
3. Message similaire pour META

### Test 4 : Navigation

1. Reste sur SEA
2. Va sur "Audit" dans la sidebar
3. ⚠️ **Audit n'est pas encore migrée** → tu verras toutes les données (pas de filtre channel)
4. Reviens sur Overview → SEA est toujours sélectionné (state persiste)

## 📁 Nouveaux fichiers créés

```
google-ads-pilot/
├── contexts/
│   └── ChannelContext.tsx          ← Context pour le channel sélectionné
├── components/shared/
│   ├── ChannelSelector.tsx         ← Dropdown de sélection
│   └── ComingSoon.tsx              ← Badge "Coming Soon"
├── data/
│   └── mockByChannel.ts            ← Données par channel (KPIs, etc.)
├── MIGRATION_V1_5.md               ← Guide complet de migration
└── QUICKSTART_V1_5.md              ← Ce fichier
```

## 📝 Fichiers modifiés

### Types
- [types/index.ts](types/index.ts)
  - Ajout de `Channel` type
  - Ajout du champ `channel` partout

### Données
- [data/mock.ts](data/mock.ts)
  - Tous les objets ont maintenant `channel: 'sea'`

### Layout
- [app/layout.tsx](app/layout.tsx)
  - Ajout du `ChannelProvider`
  - Titre changé

- [components/layout/Sidebar.tsx](components/layout/Sidebar.tsx)
  - Titre changé

### Pages
- [app/page.tsx](app/page.tsx) ✅ **MIGRÉE**
  - Utilise `useChannel()`
  - KPIs dynamiques
  - Coming Soon pour channels inactifs

## 🚧 Pages restantes à migrer

Les pages suivantes affichent encore toutes les données sans filtre de channel :

- [ ] [app/audit/page.tsx](app/audit/page.tsx)
- [ ] [app/alerts/page.tsx](app/alerts/page.tsx)
- [ ] [app/actions/page.tsx](app/actions/page.tsx)
- [ ] [app/rules/page.tsx](app/rules/page.tsx)
- [ ] [app/history/page.tsx](app/history/page.tsx)

**Voir [MIGRATION_V1_5.md](MIGRATION_V1_5.md) pour les instructions détaillées de migration.**

## 🎯 Comment migrer une page

Template à suivre pour chaque page :

```typescript
'use client';

import { useChannel } from '@/contexts/ChannelContext';
import ChannelSelector from '@/components/shared/ChannelSelector';
import ComingSoon from '@/components/shared/ComingSoon';
import { CHANNELS } from '@/types';

export default function MyPage() {
  const { selectedChannel } = useChannel();
  const channelInfo = CHANNELS[selectedChannel];

  return (
    <div>
      <ChannelSelector />
      <Header title="Ma Page" subtitle={channelInfo.label} />

      {!channelInfo.isActive ? (
        <ComingSoon channel={channelInfo.label} />
      ) : (
        <>
          {/* Contenu existant + filtrage par channel */}
          {/* Ex: mockAlerts.filter(a => a.channel === selectedChannel) */}
        </>
      )}
    </div>
  );
}
```

## 🔍 Inspection du code

### Voir le Context en action

Dans `app/page.tsx`, ligne 19-20 :
```typescript
const { selectedChannel } = useChannel();
const channelInfo = CHANNELS[selectedChannel];
```

### Voir les KPIs dynamiques

Dans `data/mockByChannel.ts` :
```typescript
export const mockKPIsByChannel: Record<Channel, KPI[]> = {
  sea: [...],   // KPIs Google Ads
  seo: [...],   // KPIs SEO
  meta: [...]   // KPIs Meta
};
```

### Voir le filtrage

Dans `app/page.tsx`, ligne 27-32 :
```typescript
const criticalAlerts = mockAlerts
  .filter(a => a.channel === selectedChannel && a.priority === 'P0')
  .slice(0, 3);
```

## 🎨 UX actuelle

### ChannelSelector
```
Channel: [🎯 Google Ads (SEA)] [🔍 SEO 🔒] [📱 Meta Ads 🔒]
         ^^^^^^^^^^^^^^^^^^^^
         Sélectionné (bleu)
```

### Coming Soon (quand channel inactif)
```
┌─────────────────────────────────────┐
│           🔒                         │
│                                      │
│     SEO - Coming Soon                │
│                                      │
│  Cette fonctionnalité sera          │
│  disponible prochainement            │
│                                      │
│  🚀 En développement                 │
└─────────────────────────────────────┘
```

## ⚙️ Configuration

### Activer un channel

Dans [types/index.ts](types/index.ts), ligne 7 :
```typescript
export const CHANNELS: Record<Channel, { label: string; icon: string; isActive: boolean }> = {
  sea: { label: 'Google Ads (SEA)', icon: '🎯', isActive: true },
  seo: { label: 'SEO', icon: '🔍', isActive: false },  // ← Passer à true pour activer
  meta: { label: 'Meta Ads', icon: '📱', isActive: false },
};
```

## 📊 État actuel

| Page | État | Channel SEA | Channel SEO/META |
|------|------|-------------|------------------|
| Overview | ✅ Migrée | Fonctionne | Coming Soon |
| Audit | ⏳ À migrer | Toutes données | Toutes données |
| Alerts | ⏳ À migrer | Toutes données | Toutes données |
| Actions | ⏳ À migrer | Toutes données | Toutes données |
| Rules | ⏳ À migrer | Toutes données | Toutes données |
| History | ⏳ À migrer | Toutes données | Toutes données |

## 🐛 Debugging

### Vérifier le channel sélectionné

Ajouter dans n'importe quelle page :
```typescript
const { selectedChannel } = useChannel();
console.log('Channel actuel:', selectedChannel);
```

### Vérifier les données filtrées

```typescript
console.log('Alertes SEA:', mockAlerts.filter(a => a.channel === 'sea'));
console.log('Alertes SEO:', mockAlerts.filter(a => a.channel === 'seo'));
```

### Erreurs possibles

**Erreur : "useChannel must be used within a ChannelProvider"**
→ Vérifier que `ChannelProvider` est bien dans `layout.tsx`

**Erreur TypeScript : Property 'channel' does not exist**
→ Vérifier que tous les types dans `types/index.ts` ont bien le champ `channel`

## 📚 Documentation complète

- **[MIGRATION_V1_5.md](MIGRATION_V1_5.md)** : Guide complet de migration
- **[ARCHITECTURE.md](ARCHITECTURE.md)** : Architecture originale (à mettre à jour)
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** : Guide développeur (à mettre à jour)

## 🚀 Next steps

1. **Tester l'Overview** avec les 3 channels
2. **Migrer les autres pages** une par une (voir MIGRATION_V1_5.md)
3. **Ajouter des données mockées SEO/META** plus réalistes
4. **Activer SEO** quand prêt
5. **Activer META** quand prêt
6. **Brancher le backend** par channel

## ✨ Résumé

✅ **Architecture multi-channel** mise en place
✅ **Overview** fonctionnelle avec channel selector
✅ **Composants réutilisables** créés
✅ **Données mockées** par channel
✅ **Documentation** complète

🚧 **Pages restantes** à migrer (template fourni)
🎯 **SEA actif**, SEO/META en Coming Soon

---

**Bon dev !** 🚀

Si tu as des questions, consulte [MIGRATION_V1_5.md](MIGRATION_V1_5.md) pour plus de détails.
