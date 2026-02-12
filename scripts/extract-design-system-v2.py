#!/usr/bin/env python3
"""
Script d'extraction automatique du Design System depuis les screenshots
VERSION 2 : Un thème CSS par dossier (récursif)
Chaque dossier avec images = thème indépendant
"""

import os
import json
from pathlib import Path
from collections import defaultdict, Counter
from typing import Dict, List, Tuple
import sys

try:
    from PIL import Image
    import numpy as np
    from sklearn.cluster import KMeans
except ImportError:
    print("ERREUR: Bibliotheques manquantes.")
    print("Installer avec: pip install pillow numpy scikit-learn")
    sys.exit(1)


class DesignSystemExtractorV2:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.themes_data = {}
        
    def extract_colors_from_image(self, image_path: Path, n_colors: int = 12) -> List[Tuple[int, int, int]]:
        """Extrait les n couleurs dominantes d'une image"""
        try:
            img = Image.open(image_path)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Redimensionner pour accélérer
            img.thumbnail((300, 300))
            
            pixels = np.array(img)
            pixels = pixels.reshape(-1, 3)
            
            # K-means pour couleurs dominantes
            kmeans = KMeans(n_clusters=n_colors, random_state=42, n_init=10)
            kmeans.fit(pixels)
            
            colors = kmeans.cluster_centers_.astype(int)
            labels = kmeans.labels_
            color_counts = Counter(labels)
            
            sorted_colors = sorted(
                zip(colors, [color_counts[i] for i in range(n_colors)]),
                key=lambda x: x[1],
                reverse=True
            )
            
            return [tuple(color) for color, _ in sorted_colors]
            
        except Exception as e:
            print(f"  [ERREUR] {image_path.name}: {e}")
            return []
    
    def rgb_to_hex(self, rgb: Tuple[int, int, int]) -> str:
        """Convertit RGB en hexadécimal"""
        return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
    
    def hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        """Convertit hex en RGB"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def luminance(self, rgb: Tuple[int, int, int]) -> float:
        """Calcule la luminosité d'une couleur (0-255)"""
        r, g, b = rgb
        return 0.299 * r + 0.587 * g + 0.114 * b
    
    def saturation(self, rgb: Tuple[int, int, int]) -> float:
        """Calcule la saturation d'une couleur (0-1)"""
        r, g, b = rgb
        max_val = max(r, g, b)
        min_val = min(r, g, b)
        if max_val == 0:
            return 0
        return (max_val - min_val) / max_val if max_val > 0 else 0
    
    def analyze_folder(self, folder_path: Path) -> Dict:
        """Analyse toutes les images d'un dossier spécifique"""
        images = []
        all_colors = []
        
        # Parcourir uniquement ce dossier (pas récursif)
        for ext in ['*.png', '*.jpg', '*.jpeg']:
            for img_path in folder_path.glob(ext):
                images.append(str(img_path))
                colors = self.extract_colors_from_image(img_path)
                all_colors.extend(colors)
        
        if not all_colors:
            return None
        
        # Trouver les couleurs les plus fréquentes
        color_counter = Counter(all_colors)
        top_colors = color_counter.most_common(30)
        
        # Classifier les couleurs
        palette = self.classify_colors_advanced(top_colors)
        
        return {
            'images_count': len(images),
            'colors': [self.rgb_to_hex(c) for c, _ in top_colors],
            'palette': palette,
            'image_paths': images
        }
    
    def classify_colors_advanced(self, colors: List[Tuple]) -> Dict[str, str]:
        """Classification SaaS moderne : fond blanc, couleurs = accents uniquement"""
        palette = {}
        
        if not colors:
            return palette
        
        # RÈGLE STRICTE : Fond toujours blanc/très clair
        palette['bg-page'] = '#ffffff'
        palette['bg-surface'] = '#f8fafc'
        palette['bg-elevated'] = '#f1f5f9'
        
        # Text colors (toujours sombre sur fond clair)
        palette['text-primary'] = '#0f172a'
        palette['text-muted'] = '#64748b'
        
        # Trouver les couleurs vives pour les ACCENTS uniquement
        sorted_by_sat = sorted(colors, key=lambda x: self.saturation(x[0]), reverse=True)
        
        # Accent principal (couleur la plus saturée et visible)
        accent_found = False
        for color_rgb, count in sorted_by_sat[:15]:
            lum = self.luminance(color_rgb)
            sat = self.saturation(color_rgb)
            # Couleur vive mais pas trop sombre ni trop claire (pour contraste)
            if sat > 0.25 and 60 < lum < 200:
                accent_hex = self.rgb_to_hex(color_rgb)
                palette['accent'] = accent_hex
                
                # Accent hover (assombri de 15%)
                accent_rgb = color_rgb
                hover_rgb = tuple(max(0, int(c * 0.85)) for c in accent_rgb)
                palette['accent-hover'] = self.rgb_to_hex(hover_rgb)
                
                # Accent soft (version très claire pour backgrounds subtils)
                soft_rgb = tuple(min(255, int(c * 0.1 + 245)) for c in accent_rgb)
                palette['accent-soft'] = self.rgb_to_hex(soft_rgb)
                
                accent_found = True
                break
        
        # Si pas d'accent trouvé, utiliser bleu par défaut (SaaS standard)
        if not accent_found:
            palette['accent'] = '#2563eb'
            palette['accent-hover'] = '#1d4ed8'
            palette['accent-soft'] = '#eff6ff'
        
        # Border (gris très clair)
        palette['border'] = '#e2e8f0'
        palette['border-hover'] = '#cbd5e1'
        
        # Badge (utilise l'accent avec fond très clair)
        if 'accent' in palette:
            palette['badge'] = palette['accent']
            palette['badge-bg'] = palette.get('accent-soft', '#eff6ff')
        
        # États (success, warning, danger) - chercher dans les couleurs ou defaults
        # Success (vert)
        for color_rgb, _ in sorted_by_sat[:20]:
            r, g, b = color_rgb
            if g > r * 1.4 and g > b * 1.4 and 100 < self.luminance(color_rgb) < 180:
                palette['success'] = self.rgb_to_hex(color_rgb)
                break
        if 'success' not in palette:
            palette['success'] = '#22c55e'
        palette['success-bg'] = '#dcfce7'
        
        # Warning (orange/jaune)
        for color_rgb, _ in sorted_by_sat[:20]:
            r, g, b = color_rgb
            if r > g * 1.1 and b < g * 0.7 and 120 < self.luminance(color_rgb) < 200:
                palette['warning'] = self.rgb_to_hex(color_rgb)
                break
        if 'warning' not in palette:
            palette['warning'] = '#f59e0b'
        palette['warning-bg'] = '#fef3c7'
        
        # Danger (rouge)
        for color_rgb, _ in sorted_by_sat[:20]:
            r, g, b = color_rgb
            if r > g * 1.5 and r > b * 1.5 and 80 < self.luminance(color_rgb) < 180:
                palette['danger'] = self.rgb_to_hex(color_rgb)
                break
        if 'danger' not in palette:
            palette['danger'] = '#ef4444'
        palette['danger-bg'] = '#fee2e2'
        
        # Gold (couleur chaude pour premium)
        warm_colors = [c for c, _ in sorted_by_sat[:20] 
                      if self.is_warm_color(c) and 120 < self.luminance(c) < 200]
        if warm_colors:
            palette['gold'] = self.rgb_to_hex(warm_colors[0])
        else:
            palette['gold'] = '#f59e0b'
        palette['gold-bg'] = '#fef3c7'
        
        return palette
    
    def is_warm_color(self, rgb: Tuple[int, int, int]) -> bool:
        """Détecte si une couleur est chaude (or, orange, jaune)"""
        r, g, b = rgb
        return r > g and r > b and (r + g) > (b * 1.5)
    
    def normalize_path_name(self, folder_path: Path, base_path: Path) -> str:
        """Normalise le nom du chemin pour le thème CSS"""
        # Chemin relatif depuis base
        rel_path = folder_path.relative_to(base_path)
        # Remplacer / par -
        normalized = str(rel_path).replace('/', '-').replace('\\', '-')
        return normalized.lower()
    
    def generate_css_theme(self, theme_name: str, data: Dict) -> str:
        """Génère le CSS du thème SaaS moderne"""
        palette = data.get('palette', {})
        
        css = f"""/* ======================================================
   THEME {theme_name.upper().replace('-', ' ')} — SaaS Moderne
   Images analysées: {data.get('images_count', 0)}
   Style: Fond blanc + accents colorés (Stripe/Notion/Linear)
   ====================================================== */

.theme-{theme_name} {{
"""
        
        # Backgrounds (toujours blanc/très clair)
        css += f"  --bg-page: {palette.get('bg-page', '#ffffff')};\n"
        css += f"  --bg-surface: {palette.get('bg-surface', '#f8fafc')};\n"
        css += f"  --bg-elevated: {palette.get('bg-elevated', '#f1f5f9')};\n"
        
        # Textes (toujours sombre sur fond clair)
        css += f"  --text-primary: {palette.get('text-primary', '#0f172a')};\n"
        css += f"  --text-muted: {palette.get('text-muted', '#64748b')};\n"
        
        # Accents (couleurs extraites des images)
        if 'accent' in palette:
            css += f"  --accent: {palette['accent']};\n"
        if 'accent-hover' in palette:
            css += f"  --accent-hover: {palette['accent-hover']};\n"
        if 'accent-soft' in palette:
            css += f"  --accent-soft: {palette['accent-soft']};\n"
        
        # Borders
        css += f"  --border: {palette.get('border', '#e2e8f0')};\n"
        css += f"  --border-hover: {palette.get('border-hover', '#cbd5e1')};\n"
        
        # Badge
        if 'badge' in palette:
            css += f"  --badge: {palette['badge']};\n"
        if 'badge-bg' in palette:
            css += f"  --badge-bg: {palette['badge-bg']};\n"
        
        # États
        if 'success' in palette:
            css += f"  --success: {palette['success']};\n"
        if 'success-bg' in palette:
            css += f"  --success-bg: {palette['success-bg']};\n"
        if 'warning' in palette:
            css += f"  --warning: {palette['warning']};\n"
        if 'warning-bg' in palette:
            css += f"  --warning-bg: {palette['warning-bg']};\n"
        if 'danger' in palette:
            css += f"  --danger: {palette['danger']};\n"
        if 'danger-bg' in palette:
            css += f"  --danger-bg: {palette['danger-bg']};\n"
        
        # Gold
        if 'gold' in palette:
            css += f"  --gold: {palette['gold']};\n"
        if 'gold-bg' in palette:
            css += f"  --gold-bg: {palette['gold-bg']};\n"
        
        css += "}\n"
        
        return css
    
    def scan_all_folders(self):
        """Scanne récursivement tous les dossiers avec images"""
        references_path = self.base_path / 'design-system' / '05-ui-references'
        
        if not references_path.exists():
            print(f"ERREUR: Dossier {references_path} introuvable")
            return
        
        themes_dir = self.base_path / 'design-system' / 'themes'
        themes_dir.mkdir(parents=True, exist_ok=True)
        
        # Scanner récursivement
        folders_with_images = []
        
        for folder_path in references_path.rglob('*'):
            if folder_path.is_dir():
                # Vérifier si ce dossier contient des images
                has_images = any(
                    folder_path.glob(ext) 
                    for ext in ['*.png', '*.jpg', '*.jpeg']
                )
                
                if has_images:
                    folders_with_images.append(folder_path)
        
        print(f"\n[SCAN] {len(folders_with_images)} dossiers avec images trouves\n")
        
        # Analyser chaque dossier indépendamment
        for folder_path in sorted(folders_with_images):
            theme_name = self.normalize_path_name(folder_path, references_path)
            
            print(f"[ANALYSE] {theme_name}")
            data = self.analyze_folder(folder_path)
            
            if data and data.get('images_count', 0) > 0:
                self.themes_data[theme_name] = data
                
                # Générer le fichier CSS pour ce dossier
                css_content = self.generate_css_theme(theme_name, data)
                css_file = themes_dir / f"{theme_name}.css"
                css_file.write_text(css_content, encoding='utf-8')
                
                print(f"  [OK] {data.get('images_count', 0)} images -> {css_file.name}")
        
        # Générer un fichier index qui importe tous les thèmes
        self.generate_index_file(themes_dir)
        
        # Générer le rapport
        self.generate_report()
        
        return self.themes_data
    
    def generate_index_file(self, themes_dir: Path):
        """Génère un fichier index qui importe tous les thèmes"""
        theme_files = sorted(themes_dir.glob('*.css'))
        theme_files = [f for f in theme_files if f.name != 'index.css']
        
        index_content = """/* ======================================================
   SHAMAR DESIGN SYSTEM — INDEX DES THÈMES
   Tous les thèmes générés automatiquement depuis les screenshots
   ====================================================== */

"""
        
        for theme_file in theme_files:
            rel_path = theme_file.relative_to(themes_dir)
            index_content += f"@import './{rel_path}';\n"
        
        index_file = themes_dir / 'index.css'
        index_file.write_text(index_content, encoding='utf-8')
        print(f"\n[OK] Fichier index genere: {index_file}")
    
    def generate_report(self):
        """Génère un rapport d'analyse"""
        report_path = self.base_path / 'design-system' / '05-ui-references' / 'RAPPORT-ANALYSE-V2.md'
        
        report = """# RAPPORT D'ANALYSE AUTOMATIQUE V2 — DESIGN SYSTEM

**Généré automatiquement par extract-design-system-v2.py**
**Un thème par dossier (récursif)**

---

## RÉSUMÉ

"""
        
        report += f"**Total thèmes générés**: {len(self.themes_data)}\n\n"
        
        for theme_name, data in sorted(self.themes_data.items()):
            images_count = data.get('images_count', 0)
            palette = data.get('palette', {})
            
            report += f"\n### Thème `{theme_name}`\n\n"
            report += f"- **Images analysées**: {images_count}\n"
            report += f"- **Couleurs extraites**: {len(data.get('colors', []))}\n\n"
            
            if palette:
                report += "**Palette détectée**:\n"
                for key, value in sorted(palette.items()):
                    report += f"- `{key}`: `{value}`\n"
            
            report += "\n---\n"
        
        report_path.write_text(report, encoding='utf-8')
        print(f"[OK] Rapport genere: {report_path}")


def main():
    script_dir = Path(__file__).parent
    base_path = script_dir.parent
    
    print("Extraction Design System V2 - Un theme par dossier")
    print("=" * 60)
    
    extractor = DesignSystemExtractorV2(base_path)
    results = extractor.scan_all_folders()
    
    print("\n" + "=" * 60)
    print(f"Analyse terminee! {len(results)} themes generes")
    print("\nFichiers generes dans:")
    print("  - design-system/themes/*.css (un fichier par dossier)")
    print("  - design-system/themes/index.css (imports tous les thèmes)")
    print("  - design-system/05-ui-references/RAPPORT-ANALYSE-V2.md")


if __name__ == '__main__':
    main()
