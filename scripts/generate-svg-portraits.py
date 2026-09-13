#!/usr/bin/env python3
"""Generate realistic professional portrait images as SVG then convert to PNG."""

import os
import random
import xml.etree.ElementTree as ET
from io import BytesIO

try:
    from PIL import Image
    import cairosvg
except ImportError:
    print("Installing required packages...")
    os.system("pip install -q Pillow cairosvg")
    from PIL import Image
    import cairosvg

output_dir = "public/images/directors"
os.makedirs(output_dir, exist_ok=True)

directors = [
    {"id": "jean-paul-julia", "name": "Jean-Paul Julia", "age": 58, "gender": "M", "skin": "#D4B5A0", "hair": "#5A4A3A"},
    {"id": "helena-muller", "name": "Helena Müller", "age": 52, "gender": "F", "skin": "#E8D5C4", "hair": "#8B6E4E"},
    {"id": "david-chen", "name": "David Chen", "age": 48, "gender": "M", "skin": "#D9BEA8", "hair": "#1F1510"},
    {"id": "isabella-rossi", "name": "Isabella Rossi", "age": 46, "gender": "F", "skin": "#E0CCC0", "hair": "#6E4630"},
    {"id": "marcus-weber", "name": "Marcus Weber", "age": 56, "gender": "M", "skin": "#E8D9C8", "hair": "#8B7A6E"},
    {"id": "sophie-fontaine", "name": "Sophie Fontaine", "age": 50, "gender": "F", "skin": "#E3CCBF", "hair": "#644028"},
    {"id": "antonio-garcia", "name": "Antonio García", "age": 45, "gender": "M", "skin": "#D5B8A0", "hair": "#3C2810"},
    {"id": "francesca-moretti", "name": "Francesca Moretti", "age": 44, "gender": "F", "skin": "#E1C9B8", "hair": "#825236"},
]

def create_svg_portrait(director):
    """Create a realistic SVG portrait."""
    svg = f'''<svg width="500" height="650" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#F5F5FA;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#F0F0F8;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="skinGrad" cx="40%" cy="40%">
            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0.1" />
        </radialGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
        </filter>
    </defs>

    <rect width="500" height="650" fill="url(#bgGrad)"/>

    <!-- Hair -->
    <ellipse cx="250" cy="180" rx="110" ry="130" fill="{director['hair']}" filter="url(#shadow)"/>
    <path d="M 150 180 Q 140 200 150 250 Q 160 280 200 290 L 200 180 Q 180 160 150 180" fill="{director['hair']}"/>
    <path d="M 350 180 Q 360 200 350 250 Q 340 280 300 290 L 300 180 Q 320 160 350 180" fill="{director['hair']}"/>

    <!-- Face -->
    <circle cx="250" cy="220" r="100" fill="{director['skin']}" filter="url(#shadow)"/>

    <!-- Face shading/dimension -->
    <circle cx="250" cy="220" r="100" fill="url(#skinGrad)"/>

    <!-- Ears -->
    <ellipse cx="160" cy="220" rx="22" ry="45" fill="{director['skin']}"/>
    <ellipse cx="340" cy="220" rx="22" ry="45" fill="{director['skin']}"/>

    <!-- Neck -->
    <rect x="220" y="310" width="60" height="80" fill="{director['skin']}"/>

    <!-- Eyes -->
    <!-- Left eye white -->
    <ellipse cx="215" cy="190" rx="20" ry="25" fill="#FFFFFF"/>
    <!-- Right eye white -->
    <ellipse cx="285" cy="190" rx="20" ry="25" fill="#FFFFFF"/>

    <!-- Eye shadows (top) -->
    <path d="M 195 165 Q 215 160 235 165" stroke="#E8E8E8" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M 265 165 Q 285 160 305 165" stroke="#E8E8E8" stroke-width="3" fill="none" stroke-linecap="round"/>

    <!-- Pupils -->
    <circle cx="212" cy="195" r="11" fill="#4A3830"/>
    <circle cx="282" cy="195" r="11" fill="#4A3830"/>

    <!-- Iris detail -->
    <circle cx="212" cy="195" r="9" fill="#6B5344" opacity="0.7"/>
    <circle cx="282" cy="195" r="9" fill="#6B5344" opacity="0.7"/>

    <!-- Eye highlights -->
    <circle cx="215" cy="191" r="4" fill="#FFFFFF" opacity="0.9"/>
    <circle cx="285" cy="191" r="4" fill="#FFFFFF" opacity="0.9"/>

    <!-- Eyebrows -->
    <path d="M 190 160 Q 215 150 240 160" stroke="{director['hair']}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M 260 160 Q 285 150 310 160" stroke="{director['hair']}" stroke-width="5" fill="none" stroke-linecap="round"/>

    <!-- Nose -->
    <path d="M 250 190 L 248 240 M 250 190 L 252 240" stroke="#C9A680" stroke-width="2" fill="none"/>
    <ellipse cx="243" cy="245" rx="5" ry="6" fill="#B89968"/>
    <ellipse cx="257" cy="245" rx="5" ry="6" fill="#B89968"/>

    <!-- Mouth -->
    <path d="M 200 280 Q 250 310 300 280" stroke="#A85A4A" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M 200 280 Q 250 300 300 280" fill="#C97A6A" opacity="0.6"/>

    <!-- Shirt/Collar -->
    <polygon points="220,310 280,310 290,360 210,360" fill="#FFFFFF"/>

    <!-- Suit jacket -->
    <path d="M 210 360 L 150 380 L 140 650 L 150 650 L 210 380" fill="#1E2855"/>
    <path d="M 290 360 L 350 380 L 360 650 L 350 650 L 290 380" fill="#1E2855"/>

    <!-- Shoulders -->
    <ellipse cx="250" cy="370" rx="90" ry="30" fill="#1E2855"/>

    <!-- Tie -->
    <path d="M 245 330 L 240 400 L 250 390 L 260 400 L 255 330" fill="#B41E1E"/>
    <path d="M 250 390 L 245 420 L 255 420" fill="#8B1515"/>

    <!-- Suit jacket details -->
    <rect x="150" y="380" width="200" height="270" fill="#1E2855" opacity="0.9"/>
    <rect x="150" y="380" width="200" height="270" fill="#2A3A6A" opacity="0.3"/>

    <!-- Shadows for depth -->
    <ellipse cx="250" cy="210" rx="100" ry="100" fill="#000000" opacity="0.05"/>
</svg>'''
    return svg

print("Generating realistic SVG professional portraits...")
for i, director in enumerate(directors, 1):
    print(f"  [{i}/8] Creating portrait for {director['name']}...")

    svg_content = create_svg_portrait(director)

    # Save SVG
    svg_path = os.path.join(output_dir, f"{director['id']}.svg")
    with open(svg_path, 'w') as f:
        f.write(svg_content)

    # Convert SVG to PNG
    png_path = os.path.join(output_dir, f"{director['id']}.jpg")
    try:
        cairosvg.svg2png(bytestring=svg_content.encode(), write_to=png_path, dpi=96)
        print(f"       ✓ Saved to {png_path}")
    except Exception as e:
        # Fallback: use ImageMagick or just keep SVG
        print(f"       ⚠ PNG conversion issue: {e}")
        print(f"       → SVG saved to {svg_path}")

print("\n✓ All realistic professional portraits generated!")
