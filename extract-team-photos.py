#!/usr/bin/env python3
"""Extraire les photos individuelles de la grille (4x2)"""

from PIL import Image
import os

# Créer le dossier
os.makedirs('public/images/directors', exist_ok=True)

# Ordre des directeurs: ligne 1 (gauche à droite), puis ligne 2
directors_order = [
    'jean-paul-julia',
    'helena-muller',
    'david-chen',
    'isabella-rossi',
    'marcus-weber',
    'sophie-fontaine',
    'antonio-garcia',
    'francesca-moretti'
]

try:
    # Charger l'image
    img = Image.open('team-photo.jpg')
    width, height = img.size
    
    print(f"Image chargée: {width}x{height}")
    
    # Calculer les dimensions de chaque photo
    # Grille 4x2 (4 colonnes, 2 rangées)
    photo_width = width // 4
    photo_height = height // 2
    
    print(f"Taille de chaque photo: {photo_width}x{photo_height}")
    print()
    
    # Découper et sauvegarder
    for idx, director_id in enumerate(directors_order):
        # Calculer position (col, row)
        col = idx % 4
        row = idx // 4
        
        # Coordonnées
        left = col * photo_width
        top = row * photo_height
        right = left + photo_width
        bottom = top + photo_height
        
        # Découper
        photo = img.crop((left, top, right, bottom))
        
        # Sauvegarder
        filepath = f'public/images/directors/{director_id}.jpg'
        photo.save(filepath, quality=95)
        
        print(f"✓ {director_id}.jpg ({col},{row})")
    
    print("\n✓ Toutes les photos ont été extraites!")
    
except FileNotFoundError:
    print("❌ team-photo.jpg non trouvé!")
    print("Sauvegarde l'image à la racine du projet sous ce nom.")

