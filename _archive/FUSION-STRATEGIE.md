# STRATÉGIE DE FUSION - SHAMAR B2B
## Plan d'action pour fusionner et finaliser les écrans

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Mission** : Fusionner les écrans existants et créer les routes manquantes  
**Mode** : Action méthodique - Adaptation vers Next.js App Router

---

## ÉCRANS IDENTIFIÉS DANS `shamar-marketplace/`

### Views Disponibles (à adapter vers Next.js App Router)

1. **`Home.tsx`** → Route `/sourcing` (vue d'accueil/sourcing)
2. **`Shops.tsx`** → Routes `/b2b`, `/b2c`, `/international` (même composant, filtrage différent)
3. **`AirbnbView.tsx`** → Route `/airbnb`
4. **`MatierePremiere.tsx`** → Route `/negociation` (fusionner avec `/negociation/perplexity-assistant`)
5. **`Cart.tsx`** → Route `/panier`
6. **`Messages.tsx`** → Route `/messages` (fusionner avec `/dashboard/buyer/messages`)
7. **`Profile.tsx`** → Route `/parametres`
8. **`Products.tsx`** → Routes produits (déjà existantes partiellement)
9. **`OrderList.tsx`** → Commandes (déjà existantes)
10. **`OrderDetail.tsx`** → Détail commande (déjà existant)

---

## PLAN D'ACTION

### Phase 1 : Routes Canoniques Principales (PRIORITÉ)

1. **`/sourcing`** - Adapter `Home.tsx`
   - Vue d'accueil/sourcing principal
   - Segments : B2B, B2C, International, Airbnb, Matières Premières

2. **`/b2b`** - Adapter `Shops.tsx` avec filtrage B2B
   - Groupé avec `/b2c` dans GlobalHeader
   - Même composant, contexte différent

3. **`/b2c`** - Adapter `Shops.tsx` avec filtrage B2C
   - Groupé avec `/b2b` dans GlobalHeader
   - Même composant, contexte différent

4. **`/international`** - Adapter `Shops.tsx` avec filtrage International

5. **`/airbnb`** - Adapter `AirbnbView.tsx`

6. **`/negociation`** - Fusionner `MatierePremiere.tsx` + `/negociation/perplexity-assistant`

### Phase 2 : Navigation Basse

1. **`/panier`** - Adapter `Cart.tsx`
2. **`/messages`** - Fusionner `Messages.tsx` + `/dashboard/buyer/messages`
3. **`/parametres`** - Adapter `Profile.tsx`

### Phase 3 : Routes Secondaires

1. **`/sourcing-chine`** - À identifier dans les écrans existants
2. Autres routes complémentaires

---

## ADAPTATION TECHNIQUE REQUISE

### Conversion React Router → Next.js App Router

**Changements nécessaires** :
- `HashRouter` → Next.js App Router (basé sur fichiers)
- `useState<AppView>` → Routes Next.js
- `setView()` → `router.push()`
- Props `onNavigate` → Liens Next.js
- Composants React → Server/Client Components Next.js

**Conserver** :
- Design exact
- Logique métier
- Structure des composants

---

## DUPLICATIONS À FUSIONNER

### Marketplace

**Dossiers** :
- `shamar-marketplace/` (version principale identifiée)
- `shamar-marketplace - Copie/`
- `shamar-marketplace (1)/` à `(2)/`
- `copy-of-shamar-marketplace/`

**Action** : Utiliser `shamar-marketplace/` comme base, vérifier les copies pour fonctionnalités complémentaires

### Négociation

**Écrans** :
- `MatierePremiere.tsx` (marketplace)
- `app/negociation/perplexity-assistant/page.tsx` (existant)
- Écrans dans `shamar-négoce-*` (à vérifier)

**Action** : Fusionner toutes les fonctionnalités de négociation

---

## PROCHAINES ÉTAPES IMMÉDIATES

1. **Analyser les views marketplace** en détail
2. **Créer les routes manquantes** en adaptant les views
3. **Fusionner les duplications** méthodiquement
4. **Raccorder à la structure canonique**

---

**Rapport généré** : Stratégie de fusion  
**Statut** : Plan identifié - Prêt pour action
