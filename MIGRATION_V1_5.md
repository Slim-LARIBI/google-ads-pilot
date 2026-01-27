# Migration V1 → V1.5 : Multi-channel Support

## 🎯 Objectif

Transformer l'application Google Ads Pilot en plateforme multi-channel supportant SEA (Google Ads), SEO et META Ads.

## 📦 Ce qui a été fait

### 1. Types enrichis ([types/index.ts](types/index.ts))

**Nouveau type ajouté** :
```typescript
export type Channel = 'sea' | 'seo' | 'meta';
```

**Constante des channels** :
```typescript
export const CHANNELS: Record<Channel, { label: string; icon: string; isActive: boolean }> = {
  sea: { label: 'Google Ads (SEA)', icon: '🎯', isActive: true },
  seo: { label: 'SEO', icon: '🔍', isActive: false },
  meta: { label: 'Meta Ads', icon: '📱', isActive: false },
};
```

**Tous les types existants ont été enrichis** avec le champ `channel`:
- `Campaign` → ajout de `channel: Channel`
- `Alert` → ajout de `channel: Channel`
- `Action` → ajout de `channel: Channel`
- `Rule` → ajout de `channel: Channel`
- `HistoryEntry` → ajout de `channel: Channel`
- `Finding` → ajout de `channel: Channel`

### 2. Context pour le channel sélectionné

**Nouveau fichier** : [contexts/ChannelContext.tsx](contexts/ChannelContext.tsx)

```typescript
// Utilisation dans n'importe quelle page
import { useChannel } from '@/contexts/ChannelContext';

const { selectedChannel, setSelectedChannel } = useChannel();
```

### 3. Composants partagés

**ChannelSelector** : [components/shared/ChannelSelector.tsx](components/shared/ChannelSelector.tsx)
- Dropdown pour sélectionner le channel
- Affiche les channels actifs et inactifs
- Lock icon sur les channels Coming Soon

**ComingSoon** : [components/shared/ComingSoon.tsx](components/shared/ComingSoon.tsx)
- Badge pour indiquer les features inactives
- À utiliser quand `!channelInfo.isActive`

### 4. Données mockées

**Fichier ajouté** : [data/mockByChannel.ts](data/mockByChannel.ts)
- `mockKPIsByChannel` : KPIs différents par channel
- `mockHealthScoreByChannel` : Health Score par channel
- `auditTypesByChannel` : Types d'audit par channel
- `metricsByChannel` : Métriques disponibles par channel

**Fichier mis à jour** : [data/mock.ts](data/mock.ts)
- Toutes les données existantes ont maintenant `channel: 'sea'`

### 5. Layout mis à jour

**[app/layout.tsx](app/layout.tsx)** :
- Ajout du `ChannelProvider` qui enveloppe toute l'app
- Titre changé : "Marketing Command Center"

**[components/layout/Sidebar.tsx](components/layout/Sidebar.tsx)** :
- Titre changé : "Marketing Command Center"
- Sous-titre : "Multi-channel Platform - V1.5"

### 6. Page Overview mise à jour

**[app/page.tsx](app/page.tsx)** : ✅ Complètement adaptée
- Utilise `useChannel()` pour récupérer le channel sélectionné
- KPIs dynamiques selon le channel
- Affiche `ComingSoon` si channel inactif
- Filtre les alertes et actions par channel

## 🚧 Ce qu'il reste à faire

### Pages à mettre à jour

#### 1. Page Audit ([app/audit/page.tsx](app/audit/page.tsx))

**Changements nécessaires** :
```typescript
'use client';

import { useChannel } from '@/contexts/ChannelContext';
import ChannelSelector from '@/components/shared/ChannelSelector';
import ComingSoon from '@/components/shared/ComingSoon';
import { CHANNELS } from '@/types';
import { auditTypesByChannel } from '@/data/mockByChannel';

export default function AuditPage() {
  const { selectedChannel } = useChannel();
  const channelInfo = CHANNELS[selectedChannel];
  const auditButtons = auditTypesByChannel[selectedChannel];

  // Si channel inactif, afficher Coming Soon
  if (!channelInfo.isActive) {
    return (
      <div>
        <ChannelSelector />
        <Header title="Audit" subtitle={`Audit ${channelInfo.label}`} />
        <ComingSoon
          channel={channelInfo.label}
          message="Les audits pour ce canal seront disponibles prochainement."
        />
      </div>
    );
  }

  // Sinon, afficher l'audit normaldans code existant
  // Filtrer mockCampaigns.filter(c => c.channel === selectedChannel)
  // Filtrer mockFindings.filter(f => f.channel === selectedChannel)
}
```

#### 2. Page Alerts ([app/alerts/page.tsx](app/alerts/page.tsx))

**Changements nécessaires** :
- Ajouter `ChannelSelector`
- Filtrer les alertes par `selectedChannel`
- Ajouter un badge de channel sur chaque alerte
- Ajouter un filtre par channel en plus de la sévérité

```typescript
const filteredAlerts = mockAlerts.filter(a => {
  const matchChannel = a.channel === selectedChannel;
  const matchSeverity = selectedSeverity === 'all' || a.severity === selectedSeverity;
  return matchChannel && matchSeverity;
});
```

#### 3. Page Actions ([app/actions/page.tsx](app/actions/page.tsx))

**Changements nécessaires** :
- Ajouter `ChannelSelector`
- Filtrer les actions par `selectedChannel`
- Afficher "No actions for this channel" si vide
- Si channel inactif, afficher `ComingSoon`

```typescript
const channelActions = actions.filter(a => a.channel === selectedChannel);
const pendingActions = channelActions.filter(a => a.status === 'pending');
```

#### 4. Page Rules ([app/rules/page.tsx](app/rules/page.tsx))

**Changements nécessaires** :
- Ajouter `ChannelSelector`
- Grouper les règles par channel (tabs ou sections)
- Afficher message "Read-only" pour SEO/META
- Filtrer par `selectedChannel`

```typescript
const channelRules = mockRules.filter(r => r.channel === selectedChannel);
```

#### 5. Page History ([app/history/page.tsx](app/history/page.tsx))

**Changements nécessaires** :
- Ajouter `ChannelSelector`
- Filtrer l'historique par `selectedChannel`
- Ajouter un badge de channel sur chaque entrée
- Ajouter des stats par channel

## 📋 Checklist de migration par page

Pour chaque page, suivre cette checklist :

- [ ] Ajouter `'use client';` en haut du fichier
- [ ] Importer `useChannel`, `ChannelSelector`, `ComingSoon`, `CHANNELS`
- [ ] Ajouter `const { selectedChannel } = useChannel()`
- [ ] Ajouter `<ChannelSelector />` avant le Header
- [ ] Vérifier si `channelInfo.isActive` → si non, afficher `ComingSoon`
- [ ] Filtrer toutes les données par `selectedChannel`
- [ ] Tester avec les 3 channels (SEA actif, SEO/META inactifs)

## 🔧 Patterns à suivre

### Pattern 1 : Page simple avec Coming Soon

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
        // Contenu normal de la page
        <></>
      )}
    </div>
  );
}
```

### Pattern 2 : Filtrage des données par channel

```typescript
// Filtrer un array
const filteredData = mockData.filter(item => item.channel === selectedChannel);

// Compter par channel
const seaCount = mockData.filter(d => d.channel === 'sea').length;
const seoCount = mockData.filter(d => d.channel === 'seo').length;
const metaCount = mockData.filter(d => d.channel === 'meta').length;
```

### Pattern 3 : Affichage conditionnel selon le channel

```typescript
// Boutons différents selon le channel
const actions = auditTypesByChannel[selectedChannel];

{actions.map((action) => (
  <Button
    key={action.label}
    disabled={action.disabled}
    icon={action.icon}
  >
    {action.label}
  </Button>
))}
```

## 🧪 Tests à effectuer

Après migration de chaque page :

1. **SEA (actif)** :
   - ✅ Données affichées correctement
   - ✅ Actions fonctionnelles
   - ✅ Pas de message Coming Soon

2. **SEO (inactif)** :
   - ✅ Badge "Coming Soon" affiché
   - ✅ Aucune action disponible
   - ✅ Message clair

3. **META (inactif)** :
   - ✅ Badge "Coming Soon" affiché
   - ✅ Aucune action disponible
   - ✅ Message clair

4. **Navigation** :
   - ✅ Le channel sélectionné persiste entre les pages
   - ✅ Pas de bug lors du changement de channel
   - ✅ Les filtres fonctionnent correctement

## 📚 Documentation des nouveaux fichiers

| Fichier | Description | Utilisation |
|---------|-------------|-------------|
| `contexts/ChannelContext.tsx` | Context global du channel | `useChannel()` dans n'importe quelle page |
| `components/shared/ChannelSelector.tsx` | Dropdown de sélection | `<ChannelSelector />` au début de chaque page |
| `components/shared/ComingSoon.tsx` | Badge "Coming Soon" | Quand `!channelInfo.isActive` |
| `data/mockByChannel.ts` | Données spécifiques par channel | KPIs, Health Score, types d'audit |

## 🚀 Prochaines étapes (après migration complète)

1. **Ajouter des données mockées SEO/META**
   - Campagnes SEO (pages, mots-clés)
   - Campagnes META (ads sets, audiences)
   - Alertes SEO/META
   - Actions SEO/META

2. **Activer SEO**
   - Passer `isActive: true` dans `CHANNELS.seo`
   - Tester toutes les pages avec SEO actif

3. **Activer META**
   - Passer `isActive: true` dans `CHANNELS.meta`
   - Tester toutes les pages avec META actif

4. **Backend**
   - Créer des endpoints par channel
   - `/api/sea/*`, `/api/seo/*`, `/api/meta/*`

## ❓ Questions fréquentes

**Q: Pourquoi SEO et META sont-ils inactifs ?**
R: Pour l'instant, seul SEA (Google Ads) est fonctionnel. Les autres channels seront activés progressivement.

**Q: Comment activer un channel ?**
R: Dans `types/index.ts`, changer `isActive: false` en `isActive: true` dans l'objet `CHANNELS`.

**Q: Les pages existantes vont-elles casser ?**
R: Non ! Toutes les données SEA existantes ont été enrichies avec `channel: 'sea'`. L'app continue de fonctionner normalement.

**Q: Dois-je migrer toutes les pages en même temps ?**
R: Non, tu peux migrer page par page. Les pages non migrées montreront simplement toutes les données SEA.

## 📊 État de la migration

- [x] Types mis à jour
- [x] Context créé
- [x] Composants créés
- [x] Données mockées ajoutées
- [x] Layout mis à jour
- [x] **Overview** migrée ✅
- [ ] **Audit** à migrer
- [ ] **Alerts** à migrer
- [ ] **Actions** à migrer
- [ ] **Rules** à migrer
- [ ] **History** à migrer

---

**Version actuelle**: V1.5 (Multi-channel foundation)
**Prochaine version**: V2.0 (Activation SEO/META + Backend)
