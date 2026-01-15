# PLAN DE FUSION DES ÉCRANS - SHAMAR B2B
## Stratégie de fusion et finalisation

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Mission** : Fusionner les écrans dupliqués en conservant toutes les fonctionnalités  
**Mode** : Audit approfondi pour identifier les fusions nécessaires

---

## APPROCHE MÉTHODIQUE

### Phase 1 : Audit Complet (EN COURS)

**Objectif** : Identifier toutes les duplications et leurs fonctionnalités

**Actions** :
1. ✅ Lister tous les dossiers dans `/audit`
2. 🔄 Identifier les duplications (copies, variantes)
3. 🔄 Analyser chaque duplication pour extraire les fonctionnalités
4. 🔄 Mapper les écrans aux routes canoniques

---

## DUPLICATIONS IDENTIFIÉES (À ANALYSER)

### Marketplace

**Dossiers** :
- `shamar-marketplace/`
- `shamar-marketplace - Copie/`
- `shamar-marketplace (1)/`
- `shamar-marketplace (1) (1)/`
- `shamar-marketplace (1) (2)/`
- `shamar-marketplace (2)/`

**Action requise** : Analyser chaque version pour identifier les fonctionnalités complémentaires

---

### Profile Dashboard

**Dossiers** :
- `shamar-profile-dashboard/`
- `shamar-profile-dashboard - Copie/`
- `shamar-profile-dashboard (1)/`
- `shamar-profile-dashboard (1) - Copie/`
- `shamar-profile-dashboard (2)/`
- `shamar-profile-dashboard (3)/`
- `shamar-profile-dashboard (4)/`
- `shamar-profile-dashboard (5)/`

**Action requise** : Fusionner toutes les variantes en conservant toutes les fonctionnalités

---

### Business Hub

**Dossiers** :
- `shamar-business-hub/`
- `shamar-business-hub - Copie/`
- `shamar-business-hub - Copie (2)/`

**Action requise** : Identifier les fonctionnalités complémentaires

---

### Negoce Seller Dashboard

**Dossiers** :
- `shamar-negoce-seller-dashboard/`
- `shamar-negoce-seller-dashboard - Copie/`

**Action requise** : Fusionner les deux versions

---

### Autres Duplications Identifiées

- `shamar-user-hub/` + `shamar-user-hub - Copie/`
- `shamar-user-profile-hub/` + `shamar-user-profile-hub - Copie/`
- `shamar-secure-messaging-center/` + `shamar-secure-messaging-center - Copie/`
- `shamar-sourcing-china---quotation-detail/` + `shamar-sourcing-china---quotation-detail - Copie/`
- `shamar-global-platform/` + `shamar-global-platform - Copie/`
- `shamar-négoce---b2b-commodities/` + `shamar-négoce---b2b-commodities - Copie/`
- `negotiant-finance-hub/` + copies

---

## MAPPING ROUTES CANONIQUES → ÉCRANS

### Routes à Connecter

1. **`/sourcing`**
   - Écrans potentiels : `shamar-sourcing-*`, `Marketplace-shamar--main/`
   - À analyser

2. **`/b2b`** (groupé avec `/b2c`)
   - Écrans potentiels : `shamar-b2b-platform/`, `shamar-marketplace/`
   - Dashboard buyer/seller existants
   - À analyser

3. **`/international`**
   - Écrans potentiels : `shamar-global-platform/`, `shamar-marketplace/`
   - À analyser

4. **`/sourcing-chine`**
   - Écrans potentiels : `shamar-sourcing-china---quotation-detail/`
   - À analyser

5. **`/airbnb`**
   - Écrans potentiels : `shamar-tourism-*`, `shamar-host-*`
   - À analyser

6. **`/negociation`**
   - Écran partiel existant : `app/negociation/perplexity-assistant/page.tsx`
   - Écrans potentiels : `shamar-négoce-*`, `shamar-negotiant-*`
   - À analyser

---

## PROCHAINES ÉTAPES

### Étape 1 : Audit Détaillé des Duplications (EN COURS)

**Action** : Analyser chaque groupe de duplications pour :
- Identifier toutes les fonctionnalités de chaque version
- Identifier les fonctionnalités communes vs complémentaires
- Créer un inventaire complet des fonctionnalités

### Étape 2 : Fusion Méthodique

**Action** : Pour chaque groupe de duplications :
- Extraire toutes les fonctionnalités
- Fusionner en un seul écran final
- Conserver le design existant
- Éliminer les doublons fonctionnels uniquement après fusion complète

### Étape 3 : Raccordement des Routes

**Action** : Créer les routes manquantes et les connecter aux écrans fusionnés

### Étape 4 : Validation Complète

**Action** : Vérifier que :
- Toutes les fonctionnalités sont présentes
- Aucune fonctionnalité n'est perdue
- La navigation est complète et fluide
- La structure UI canonique est respectée

---

**Rapport généré** : Plan de fusion des écrans  
**Statut** : Audit en cours - Analyse approfondie nécessaire
