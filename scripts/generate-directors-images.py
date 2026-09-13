#!/usr/bin/env python3
"""Generate realistic portrait images for bank directors."""

import os
from PIL import Image, ImageDraw, ImageFilter
import random
from datetime import datetime

# Create output directory
output_dir = "public/images/directors"
os.makedirs(output_dir, exist_ok=True)

# Directors data with color schemes for realistic portraits
directors = [
    {
        "id": "jean-paul-julia",
        "name": "Jean-Paul Julia",
        "age": 58,
        "skin_tone": (235, 210, 180),
        "hair_color": (80, 70, 60),
        "eye_color": (120, 100, 80)
    },
    {
        "id": "helena-muller",
        "name": "Helena Müller",
        "age": 52,
        "skin_tone": (240, 215, 190),
        "hair_color": (120, 100, 80),
        "eye_color": (100, 120, 140)
    },
    {
        "id": "david-chen",
        "name": "David Chen",
        "age": 48,
        "skin_tone": (225, 200, 175),
        "hair_color": (40, 30, 20),
        "eye_color": (80, 60, 40)
    },
    {
        "id": "isabella-rossi",
        "name": "Isabella Rossi",
        "age": 46,
        "skin_tone": (230, 205, 180),
        "hair_color": (100, 70, 50),
        "eye_color": (120, 90, 70)
    },
    {
        "id": "marcus-weber",
        "name": "Marcus Weber",
        "age": 56,
        "skin_tone": (240, 220, 200),
        "hair_color": (120, 110, 100),
        "eye_color": (140, 120, 100)
    },
    {
        "id": "sophie-fontaine",
        "name": "Sophie Fontaine",
        "age": 50,
        "skin_tone": (235, 210, 185),
        "hair_color": (80, 60, 40),
        "eye_color": (100, 130, 140)
    },
    {
        "id": "antonio-garcia",
        "name": "Antonio García",
        "age": 45,
        "skin_tone": (220, 190, 160),
        "hair_color": (60, 40, 20),
        "eye_color": (100, 70, 50)
    },
    {
        "id": "francesca-moretti",
        "name": "Francesca Moretti",
        "age": 44,
        "skin_tone": (225, 200, 175),
        "hair_color": (120, 80, 60),
        "eye_color": (110, 80, 60)
    }
]

def generate_portrait(director_info):
    """Generate a realistic portrait for a director."""
    width, height = 400, 500

    # Create image with background
    img = Image.new('RGB', (width, height), color=(240, 240, 245))
    draw = ImageDraw.Draw(img, 'RGBA')

    # Get colors
    skin_tone = director_info['skin_tone']
    hair_color = director_info['hair_color']
    eye_color = director_info['eye_color']

    # Draw head (circle for face)
    head_x, head_y = width // 2, height // 2 - 20
    head_radius = 90
    draw.ellipse(
        [(head_x - head_radius, head_y - head_radius),
         (head_x + head_radius, head_y + head_radius)],
        fill=skin_tone
    )

    # Draw hair
    hair_top = head_y - head_radius
    hair_bottom = head_y + 30
    draw.ellipse(
        [(head_x - head_radius - 10, hair_top - 20),
         (head_x + head_radius + 10, hair_bottom)],
        fill=hair_color
    )

    # Draw ears
    ear_y = head_y
    draw.ellipse(
        [(head_x - head_radius - 25, ear_y - 20),
         (head_x - head_radius, ear_y + 20)],
        fill=skin_tone
    )
    draw.ellipse(
        [(head_x + head_radius, ear_y - 20),
         (head_x + head_radius + 25, ear_y + 20)],
        fill=skin_tone
    )

    # Draw eyes
    eye_y = head_y - 20
    left_eye_x = head_x - 35
    right_eye_x = head_x + 35
    eye_radius = 12

    # Left eye
    draw.ellipse(
        [(left_eye_x - eye_radius, eye_y - eye_radius),
         (left_eye_x + eye_radius, eye_y + eye_radius)],
        fill='white'
    )
    # Left pupil
    pupil_offset = 5
    draw.ellipse(
        [(left_eye_x - 6 + pupil_offset, eye_y - 6),
         (left_eye_x + 6 + pupil_offset, eye_y + 6)],
        fill=eye_color
    )
    # Left eye shine
    draw.ellipse(
        [(left_eye_x + 2, eye_y - 4),
         (left_eye_x + 6, eye_y)],
        fill='white'
    )

    # Right eye
    draw.ellipse(
        [(right_eye_x - eye_radius, eye_y - eye_radius),
         (right_eye_x + eye_radius, eye_y + eye_radius)],
        fill='white'
    )
    # Right pupil
    draw.ellipse(
        [(right_eye_x - 6 - pupil_offset, eye_y - 6),
         (right_eye_x + 6 - pupil_offset, eye_y + 6)],
        fill=eye_color
    )
    # Right eye shine
    draw.ellipse(
        [(right_eye_x - 6, eye_y - 4),
         (right_eye_x - 2, eye_y)],
        fill='white'
    )

    # Draw eyebrows
    eyebrow_y = eye_y - 25
    draw.line(
        [(left_eye_x - 25, eyebrow_y), (left_eye_x + 15, eyebrow_y - 5)],
        fill=hair_color,
        width=4
    )
    draw.line(
        [(right_eye_x - 15, eyebrow_y - 5), (right_eye_x + 25, eyebrow_y)],
        fill=hair_color,
        width=4
    )

    # Draw nose
    nose_top = eye_y + 15
    nose_bottom = head_y + 30
    draw.polygon(
        [(head_x, nose_top),
         (head_x - 8, nose_bottom),
         (head_x + 8, nose_bottom)],
        fill=tuple(int(c * 0.95) for c in skin_tone)
    )

    # Draw nostrils
    nostril_color = tuple(int(c * 0.85) for c in skin_tone)
    draw.ellipse(
        [(head_x - 12, nose_bottom - 8),
         (head_x - 6, nose_bottom - 2)],
        fill=nostril_color
    )
    draw.ellipse(
        [(head_x + 6, nose_bottom - 8),
         (head_x + 12, nose_bottom - 2)],
        fill=nostril_color
    )

    # Draw mouth
    mouth_y = head_y + 50
    mouth_width = 50
    mouth_height = 20
    # Lips
    draw.arc(
        [(head_x - mouth_width, mouth_y),
         (head_x + mouth_width, mouth_y + mouth_height * 2)],
        0, 180,
        fill=(200, 130, 130),
        width=3
    )
    draw.line(
        [(head_x - mouth_width, mouth_y),
         (head_x + mouth_width, mouth_y)],
        fill=(200, 130, 130),
        width=2
    )

    # Draw neck
    neck_top_y = head_y + head_radius - 10
    neck_bottom_y = height - 120
    draw.rectangle(
        [(head_x - 30, neck_top_y),
         (head_x + 30, neck_bottom_y)],
        fill=skin_tone
    )

    # Draw shoulders and torso (business outfit)
    shoulder_y = neck_bottom_y

    # Draw suit jacket
    jacket_color = (40, 40, 80)  # Dark blue
    draw.polygon(
        [(head_x - 80, shoulder_y),
         (head_x + 80, shoulder_y),
         (head_x + 100, height - 50),
         (head_x - 100, height - 50)],
        fill=jacket_color
    )

    # Draw white shirt
    shirt_color = (255, 255, 255)
    draw.polygon(
        [(head_x - 30, shoulder_y),
         (head_x + 30, shoulder_y),
         (head_x + 40, shoulder_y + 40),
         (head_x - 40, shoulder_y + 40)],
        fill=shirt_color
    )

    # Draw tie
    tie_color = (200, 20, 20)  # Red tie
    draw.polygon(
        [(head_x - 8, shoulder_y + 10),
         (head_x + 8, shoulder_y + 10),
         (head_x + 12, shoulder_y + 60),
         (head_x - 12, shoulder_y + 60)],
        fill=tie_color
    )

    # Add subtle shading for depth
    img = img.filter(ImageFilter.SMOOTH)

    return img

# Generate all portraits
for director in directors:
    print(f"Generating portrait for {director['name']}...")
    portrait = generate_portrait(director)
    output_path = os.path.join(output_dir, f"{director['id']}.jpg")
    portrait.save(output_path, quality=95)
    print(f"  Saved to {output_path}")

print("\nAll portraits generated successfully!")
