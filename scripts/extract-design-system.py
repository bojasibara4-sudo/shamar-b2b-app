#!/usr/bin/env python3
"""
Script d'extraction automatique du Design System depuis les screenshots
Analyse les images PNG/JPG et génère les tokens CSS par module
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
    print("ERREUR: Bibliothèques manquantes.")
    print("Installer avec: pip install pillow numpy scikit-learn")
    sys.exit(1)


class DesignSystemExtractor:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.modules_data = defaultdict(lambda: {
            'images': [],
            'colors': [],
            'components': []
        })
        
    def extract_colors_from_image(self, image_path: Path, n_colors: int = 8) -> List[Tuple[int, int, int]]:
        """Extrait les n couleurs dominantes d'une image"""
        try:
            img = Image.open(image_path)
            # Convertir en RGB si nécessaire
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Redimensionner pour accélérer le traitement
            img.thumbnail((200, 200))
            
            # Convertir en array numpy
            pixels = np.array(img)
            pixels = pixels.reshape(-1, 3)
            
            # Utiliser K-means pour trouver les couleurs dominantes
            kmeans = KMeans(n_clusters=n_colors, random_state=42, n_init=10)
            kmeans.fit(pixels)
            
            # Récupérer les couleurs dominantes
            colors = kmeans.cluster_centers_.astype(int)
            
            # Trier par fréquence
            labels = kmeans.labels_
            color_counts = Counter(labels)
            sorted_colors = sorted(
                zip(colors, [color_counts[i] for i in range(n_colors)]),
                key=lambda x: x[1],
                reverse=True
            )
            
            return [tuple(color) for color, _ in sorted_colors]
            
        except Exception as e:
            print(f"Erreur lors de l'analyse de {image_path}: {e}")
            return []
    
    def rgb_to_hex(self, rgb: Tuple[int, int, int]) -> str:
        """Convertit RGB en hexadécimal"""
        return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
    
    def analyze_module(self, module_path: Path) -> Dict:
        """Analyse toutes les images d'un module"""
        images = []
        all_colors = []
        
        # Parcourir récursivement tous les fichiers image
        for ext in ['*.png', '*.jpg', '*.jpeg']:
            for img_path in module_path.rglob(ext):
                images.append(str(img_path))
                colors = self.extract_colors_from_image(img_path)
                all_colors.extend(colors)
        
        if not all_colors:
            return {
                'images_count': len(images),
                'colors': [],
                'palette': {}
            }
        
        # Trouver les couleurs les plus fréquentes
        color_counter = Counter(all_colors)
        top_colors = color_counter.most_common(20)
        
        # Classifier les couleurs
        palette = self.classify_colors(top_colors)
        
        return {
            'images_count': len(images),
            'colors': [self.rgb_to_hex(c) for c, _ in top_colors],
            'palette': palette,
            'image_paths': images
        }
    
    def classify_colors(self, colors: List[Tuple]) -> Dict[str, str]:
        """Classifie les couleurs en catégories (bg, accent, text, etc.)"""
        palette = {}
        
        if not colors:
            return palette
        
        # Trier par luminosité
        def luminance(rgb):
            r, g, b = rgb[0]
            return 0.299 * r + 0.587 * g + 0.114 * b
        
        sorted_colors = sorted(colors, key=luminance, reverse=True)
        
        # Couleur la plus claire = background
        if sorted_colors:
            palette['bg-base'] = self.rgb_to_hex(sorted_colors[0][0])
        
        # Couleur moyenne = bg-soft
        if len(sorted_colors) > 2:
            mid = len(sorted_colors) // 2
            palette['bg-soft'] = self.rgb_to_hex(sorted_colors[mid][0])
        
        # Couleur sombre = bg-elevated ou text
        if len(sorted_colors) > 1:
            palette['bg-elevated'] = self.rgb_to_hex(sorted_colors[-1][0])
        
        # Trouver les couleurs vives (accent)
        def saturation(rgb):
            r, g, b = rgb[0]
            max_val = max(r, g, b)
            min_val = min(r, g, b)
            if max_val == 0:
                return 0
            return (max_val - min_val) / max_val
        
        sorted_by_saturation = sorted(colors, key=saturation, reverse=True)
        
        # Couleur la plus saturée = accent
        if sorted_by_saturation:
            palette['accent'] = self.rgb_to_hex(sorted_by_saturation[0][0])
        
        # Couleur texte (sombre ou clair selon background)
        bg_lum = luminance((sorted_colors[0][0],)) if sorted_colors else 128
        if bg_lum > 128:
            # Fond clair -> texte sombre
            palette['text-primary'] = '#0f172a'
            palette['text-muted'] = '#64748b'
        else:
            # Fond sombre -> texte clair
            palette['text-primary'] = '#ffffff'
            palette['text-muted'] = '#9ca3af'
        
        return palette
    
    def generate_css_theme(self, module_name: str, data: Dict) -> str:
        """Génère le CSS du thème pour un module"""
        palette = data.get('palette', {})
        
        css = f"""/* ======================================================
   THEME {module_name.upper()} — Généré automatiquement
   Images analysées: {data.get('images_count', 0)}
   ====================================================== */

.theme-{module_name} {{
"""
        
        # Backgrounds
        if 'bg-base' in palette:
            css += f"  --bg-base: {palette['bg-base']};\n"
        if 'bg-soft' in palette:
            css += f"  --bg-soft: {palette['bg-soft']};\n"
        if 'bg-elevated' in palette:
            css += f"  --bg-elevated: {palette['bg-elevated']};\n"
        
        # Accents
        if 'accent' in palette:
            css += f"  --accent: {palette['accent']};\n"
            # Générer accent-strong (version assombrie)
            accent_rgb = self.hex_to_rgb(palette['accent'])
            darker = tuple(max(0, int(c * 0.8)) for c in accent_rgb)
            css += f"  --accent-strong: {self.rgb_to_hex(darker)};\n"
        
        # Textes
        if 'text-primary' in palette:
            css += f"  --text-primary: {palette['text-primary']};\n"
        if 'text-muted' in palette:
            css += f"  --text-muted: {palette['text-muted']};\n"
        
        # Gold (si couleur chaude détectée)
        warm_colors = [c for c in data.get('colors', [])[:10] if self.is_warm_color(c)]
        if warm_colors:
            css += f"  --gold: {warm_colors[0]};\n"
        
        css += "}\n"
        
        return css
    
    def hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        """Convertit hex en RGB"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def is_warm_color(self, hex_color: str) -> bool:
        """Détecte si une couleur est chaude (or, orange, jaune)"""
        r, g, b = self.hex_to_rgb(hex_color)
        # Couleur chaude = rouge et jaune dominants
        return r > g and r > b and (r + g) > (b * 1.5)
    
    def process_all_modules(self):
        """Traite tous les modules"""
        references_path = self.base_path / 'design-system' / '05-ui-references'
        
        if not references_path.exists():
            print(f"ERREUR: Dossier {references_path} introuvable")
            return
        
        modules = ['home', 'b2b', 'b2c', 'marketplace', 'sourcing', 'china', 
                   'negociation', 'airbnb', 'dashboard', 'profile']
        
        results = {}
        
        for module in modules:
            module_path = references_path / module
            if module_path.exists():
                print(f"\n[ANALYSE] Module: {module}")
                data = self.analyze_module(module_path)
                results[module] = data
                print(f"   [OK] {data.get('images_count', 0)} images analysees")
                print(f"   [COULEURS] {len(data.get('colors', []))} couleurs extraites")
        
        # Générer les fichiers CSS
        self.generate_output_files(results)
        
        # Générer le rapport
        self.generate_report(results)
        
        return results
    
    def generate_output_files(self, results: Dict):
        """Génère les fichiers CSS et JSON"""
        themes_dir = self.base_path / 'design-system' / 'themes'
        themes_dir.mkdir(parents=True, exist_ok=True)
        
        # Générer un fichier CSS combiné
        css_content = """/* ======================================================
   SHAMAR DESIGN SYSTEM — THÈMES GÉNÉRÉS AUTOMATIQUEMENT
   Généré depuis l'analyse visuelle des screenshots
   ====================================================== */

"""
        
        for module, data in results.items():
            if data.get('images_count', 0) > 0:
                css_content += self.generate_css_theme(module, data)
                css_content += "\n"
        
        # Sauvegarder
        output_file = themes_dir / 'themes-generated.css'
        output_file.write_text(css_content, encoding='utf-8')
        print(f"\n[OK] Fichier CSS genere: {output_file}")
        
        # Sauvegarder aussi en JSON pour référence
        json_file = themes_dir / 'themes-data.json'
        json_data = {
            module: {
                'images_count': data.get('images_count', 0),
                'palette': data.get('palette', {}),
                'top_colors': data.get('colors', [])[:10]
            }
            for module, data in results.items()
        }
        json_file.write_text(json.dumps(json_data, indent=2, ensure_ascii=False), encoding='utf-8')
        print(f"[OK] Fichier JSON genere: {json_file}")
    
    def generate_report(self, results: Dict):
        """Génère un rapport d'analyse"""
        report_path = self.base_path / 'design-system' / '05-ui-references' / 'RAPPORT-ANALYSE-AUTO.md'
        
        report = """# RAPPORT D'ANALYSE AUTOMATIQUE — DESIGN SYSTEM

**Généré automatiquement par extract-design-system.py**

---

## RÉSUMÉ PAR MODULE

"""
        
        for module, data in sorted(results.items()):
            images_count = data.get('images_count', 0)
            palette = data.get('palette', {})
            
            report += f"\n### Module {module.upper()}\n\n"
            report += f"- **Images analysées**: {images_count}\n"
            report += f"- **Couleurs extraites**: {len(data.get('colors', []))}\n\n"
            
            if palette:
                report += "**Palette détectée**:\n"
                for key, value in palette.items():
                    report += f"- `{key}`: `{value}`\n"
            
            report += "\n---\n"
        
        report_path.write_text(report, encoding='utf-8')
        print(f"[OK] Rapport genere: {report_path}")


def main():
    # Chemin de base du projet
    script_dir = Path(__file__).parent
    base_path = script_dir.parent
    
    print("Extraction automatique du Design System")
    print("=" * 50)
    
    extractor = DesignSystemExtractor(base_path)
    results = extractor.process_all_modules()
    
    print("\n" + "=" * 50)
    print("Analyse terminee!")
    print("\nFichiers generes:")
    print("  - design-system/themes/themes-generated.css")
    print("  - design-system/themes/themes-data.json")
    print("  - design-system/05-ui-references/RAPPORT-ANALYSE-AUTO.md")


if __name__ == '__main__':
    main()
