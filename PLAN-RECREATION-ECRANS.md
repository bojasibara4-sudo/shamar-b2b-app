# PLAN DE RECRÉATION SYSTÉMATIQUE DES ÉCRANS

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Mission** : Recréer 100% des écrans selon le pipeline validé

---

## 📊 INVENTAIRE INITIAL

### Sources
- **58 PNG** : Références visuelles dans `_archive/ecran/ecran/`
- **77 page.tsx** : Écrans actuellement implémentés
- **50+ projets** : Références fonctionnelles dans `_archive/audit/`

### Routes de navigation identifiées

**GlobalHeader** :
- `/sourcing` → `app/(marketplace)/sourcing/page.tsx` ✅
- `/b2b` → `app/(marketplace)/b2b/page.tsx` ✅
- `/international` → `app/(marketplace)/international/page.tsx` ✅
- `/sourcing-chine` → `app/(marketplace)/sourcing-chine/page.tsx` ✅
- `/airbnb` → `app/(public)/airbnb/page.tsx` ✅
- `/negociation` → `app/(public)/negociation/page.tsx` ✅

**BottomNavigation** :
- `/` → `app/page.tsx` ✅
- `/marketplace/products` → `app/(marketplace)/products/page.tsx` ✅
- `/panier` → `app/panier/page.tsx` ✅
- `/messages` → `app/(protected)/messages/page.tsx` ✅
- `/parametres` → `app/parametres/page.tsx` ✅

---

## 🎯 STRATÉGIE DE RECRÉATION

### Pipeline par écran (obligatoire)

Pour chaque écran :
1. **Identification** : Analyser PNG + audits
2. **Déduplication** : Fusionner les écrans similaires
3. **Reconstruction** : Design homogène AI Studio
4. **Implémentation** : Code propre Next.js 14
5. **Validation** : Navigation + responsive + build

---

## 📋 PRIORISATION

### Phase 1 : Écrans critiques navigation (URGENT)
1. ✅ Routes GlobalHeader (déjà existantes, à améliorer)
2. ✅ Routes BottomNavigation (déjà existantes, à améliorer)
3. ⚠️ Vérifier cohérence design

### Phase 2 : Écrans dashboard (IMPORTANT)
1. Dashboard buyer/seller/admin
2. Commandes (liste + détails)
3. Produits (liste + création + édition)
4. Messages

### Phase 3 : Écrans complémentaires
1. Profil & paramètres
2. Paiements
3. Négociation
4. Host/Tourisme

---

## ✅ STATUT ACTUEL

**Build** : ✅ SUCCESS  
**Routes navigation** : ✅ Toutes existantes  
**Architecture** : ✅ Stable  

**Prochaine étape** : Amélioration design homogène écran par écran

---

**STATUT** : Prêt pour recréation systématique
