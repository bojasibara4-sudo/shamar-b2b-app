# Script d'Extraction Automatique du Design System

## Installation

```bash
pip install -r requirements-design-system.txt
```

## Utilisation

```bash
python scripts/extract-design-system.py
```

## Fonctionnalités

- ✅ Analyse récursive de toutes les images PNG/JPG
- ✅ Extraction automatique des couleurs dominantes (K-means clustering)
- ✅ Classification intelligente des couleurs (background, accent, text)
- ✅ Génération automatique des tokens CSS
- ✅ Création de fichiers de thème par module
- ✅ Rapport d'analyse détaillé

## Sorties

1. **`design-system/themes/themes-generated.css`**
   - Fichier CSS avec tous les thèmes générés

2. **`design-system/themes/themes-data.json`**
   - Données brutes en JSON pour référence

3. **`design-system/05-ui-references/RAPPORT-ANALYSE-AUTO.md`**
   - Rapport détaillé de l'analyse

## Algorithme

1. **Extraction couleurs** : K-means clustering sur les pixels de l'image
2. **Classification** : 
   - Couleur la plus claire → `bg-base`
   - Couleur moyenne → `bg-soft`
   - Couleur sombre → `bg-elevated`
   - Couleur la plus saturée → `accent`
3. **Génération CSS** : Création automatique des variables CSS

## Notes

- Les images sont redimensionnées à 200x200px pour accélérer le traitement
- Les couleurs sont triées par fréquence d'apparition
- La classification est basée sur la luminosité et la saturation
