#!/usr/bin/env python3
"""Generate realistic professional portrait images for bank directors using gradients and advanced shading."""

import os
from PIL import Image, ImageDraw, ImageFilter
import random
import math

output_dir = "public/images/directors"
os.makedirs(output_dir, exist_ok=True)

# Directors with detailed characteristics
directors = [
    {
        "id": "jean-paul-julia",
        "name": "Jean-Paul Julia",
        "age": 58,
        "gender": "male",
        "skin_tone": (230, 200, 170),
        "hair_color": (100, 90, 75),
        "eye_color": (120, 100, 75),
        "facial_hair": True,
    },
    {
        "id": "helena-muller",
        "name": "Helena Müller",
        "age": 52,
        "gender": "female",
        "skin_tone": (240, 215, 190),
        "hair_color": (140, 110, 80),
        "eye_color": (100, 120, 140),
        "facial_hair": False,
    },
    {
        "id": "david-chen",
        "name": "David Chen",
        "age": 48,
        "gender": "male",
        "skin_tone": (225, 190, 160),
        "hair_color": (30, 25, 15),
        "eye_color": (75, 55, 35),
        "facial_hair": True,
    },
    {
        "id": "isabella-rossi",
        "name": "Isabella Rossi",
        "age": 46,
        "gender": "female",
        "skin_tone": (230, 200, 175),
        "hair_color": (110, 70, 45),
        "eye_color": (120, 90, 60),
        "facial_hair": False,
    },
    {
        "id": "marcus-weber",
        "name": "Marcus Weber",
        "age": 56,
        "gender": "male",
        "skin_tone": (240, 220, 200),
        "hair_color": (140, 130, 110),
        "eye_color": (140, 120, 90),
        "facial_hair": True,
    },
    {
        "id": "sophie-fontaine",
        "name": "Sophie Fontaine",
        "age": 50,
        "gender": "female",
        "skin_tone": (235, 205, 180),
        "hair_color": (100, 70, 45),
        "eye_color": (110, 130, 140),
        "facial_hair": False,
    },
    {
        "id": "antonio-garcia",
        "name": "Antonio García",
        "age": 45,
        "gender": "male",
        "skin_tone": (220, 185, 155),
        "hair_color": (60, 40, 20),
        "eye_color": (100, 70, 45),
        "facial_hair": True,
    },
    {
        "id": "francesca-moretti",
        "name": "Francesca Moretti",
        "age": 44,
        "gender": "female",
        "skin_tone": (225, 195, 170),
        "hair_color": (130, 85, 60),
        "eye_color": (115, 85, 55),
        "facial_hair": False,
    }
]

def blend_colors(c1, c2, alpha):
    """Blend two colors with alpha transparency."""
    return tuple(int(c1[i] * (1 - alpha) + c2[i] * alpha) for i in range(3))

def create_gradient_circle(draw, center_x, center_y, radius, color_start, color_end):
    """Draw a circle with a radial gradient."""
    for r in range(radius, 0, -1):
        alpha = 1 - (r / radius)
        color = blend_colors(color_start, color_end, alpha)
        draw.ellipse(
            [(center_x - r, center_y - r), (center_x + r, center_y + r)],
            fill=color
        )

def draw_shadow(draw, points, color=(0, 0, 0), alpha=0.15):
    """Draw a shadow polygon."""
    shadow_color = tuple(int(c * (1 - alpha)) for c in color)
    draw.polygon(points, fill=shadow_color)

def generate_portrait(director):
    """Generate a realistic professional portrait."""
    width, height = 500, 650

    # Create base image with neutral background
    img = Image.new('RGB', (width, height), color=(245, 245, 250))
    draw = ImageDraw.Draw(img, 'RGBA')

    # Get colors
    skin_tone = director['skin_tone']
    hair_color = director['hair_color']
    eye_color = director['eye_color']
    gender = director['gender']

    # Draw background gradient (subtle)
    for y in range(height):
        alpha = y / height
        bg_color = blend_colors((245, 245, 250), (240, 240, 248), alpha)
        draw.line([(0, y), (width, y)], fill=bg_color)

    # Head position
    head_x = width // 2
    head_y = height // 2 - 40
    head_radius = 95

    # Draw hair with shading
    hair_dark = tuple(int(c * 0.85) for c in hair_color)
    create_gradient_circle(draw, head_x, head_y - 30, head_radius + 15, hair_color, hair_dark)

    # Draw ears with shading
    ear_shade = tuple(int(c * 0.9) for c in skin_tone)
    # Left ear
    ear_x_left = head_x - head_radius - 20
    draw.ellipse(
        [(ear_x_left - 18, head_y - 25), (ear_x_left + 12, head_y + 35)],
        fill=ear_shade
    )
    # Right ear
    ear_x_right = head_x + head_radius + 20
    draw.ellipse(
        [(ear_x_right - 12, head_y - 25), (ear_x_right + 18, head_y + 35)],
        fill=ear_shade
    )

    # Draw face with subtle shading
    skin_light = tuple(min(255, int(c * 1.1)) for c in skin_tone)
    skin_dark = tuple(int(c * 0.95) for c in skin_tone)

    # Face base
    create_gradient_circle(draw, head_x, head_y, head_radius, skin_light, skin_dark)

    # Add chin shading
    chin_points = [
        (head_x - head_radius * 0.7, head_y + head_radius * 0.6),
        (head_x + head_radius * 0.7, head_y + head_radius * 0.6),
        (head_x, head_y + head_radius * 0.9)
    ]
    draw.polygon(chin_points, fill=skin_dark)

    # Eyes with depth
    eye_y = head_y - 15
    left_eye_x = head_x - 30
    right_eye_x = head_x + 30

    # Eye whites with subtle shade
    eye_white = (250, 250, 252)
    eye_shadow = (240, 240, 245)

    # Left eye
    draw.ellipse(
        [(left_eye_x - 18, eye_y - 14), (left_eye_x + 18, eye_y + 14)],
        fill=eye_white
    )
    # Left eye shadow
    draw.arc(
        [(left_eye_x - 18, eye_y - 14), (left_eye_x + 18, eye_y + 14)],
        0, 180, fill=eye_shadow, width=2
    )

    # Right eye
    draw.ellipse(
        [(right_eye_x - 18, eye_y - 14), (right_eye_x + 18, eye_y + 14)],
        fill=eye_white
    )
    # Right eye shadow
    draw.arc(
        [(right_eye_x - 18, eye_y - 14), (right_eye_x + 18, eye_y + 14)],
        0, 180, fill=eye_shadow, width=2
    )

    # Pupils
    pupil_radius = 8
    left_pupil_x = left_eye_x + 6
    right_pupil_x = right_eye_x + 6
    pupil_y = eye_y + 2

    draw.ellipse(
        [(left_pupil_x - pupil_radius, pupil_y - pupil_radius),
         (left_pupil_x + pupil_radius, pupil_y + pupil_radius)],
        fill=eye_color
    )
    draw.ellipse(
        [(right_pupil_x - pupil_radius, pupil_y - pupil_radius),
         (right_pupil_x + pupil_radius, pupil_y + pupil_radius)],
        fill=eye_color
    )

    # Eye highlights for realism
    highlight_color = (255, 255, 255)
    draw.ellipse(
        [(left_pupil_x - 3, pupil_y - 4), (left_pupil_x + 1, pupil_y - 1)],
        fill=highlight_color
    )
    draw.ellipse(
        [(right_pupil_x - 3, pupil_y - 4), (right_pupil_x + 1, pupil_y - 1)],
        fill=highlight_color
    )

    # Eyebrows
    brow_y = eye_y - 22
    brow_color = tuple(int(c * 0.8) for c in hair_color)

    # Left brow
    brow_points_left = [
        (left_eye_x - 20, brow_y),
        (left_eye_x + 15, brow_y - 8),
        (left_eye_x + 18, brow_y - 6),
        (left_eye_x - 18, brow_y + 2)
    ]
    draw.polygon(brow_points_left, fill=brow_color)

    # Right brow
    brow_points_right = [
        (right_eye_x - 15, brow_y - 8),
        (right_eye_x + 20, brow_y),
        (right_eye_x + 18, brow_y + 2),
        (right_eye_x - 18, brow_y - 6)
    ]
    draw.polygon(brow_points_right, fill=brow_color)

    # Nose with shading
    nose_top_y = eye_y + 8
    nose_bottom_y = head_y + 35
    nose_width = 12

    # Nose bridge
    nose_color = tuple(int(c * 0.92) for c in skin_tone)
    nose_shadow = tuple(int(c * 0.85) for c in skin_tone)

    nose_points = [
        (head_x - nose_width // 2, nose_top_y),
        (head_x + nose_width // 2, nose_top_y),
        (head_x + nose_width // 2 + 3, nose_bottom_y - 5),
        (head_x - nose_width // 2 - 3, nose_bottom_y - 5)
    ]
    draw.polygon(nose_points, fill=nose_color)

    # Nostrils
    nostril_color = tuple(int(c * 0.75) for c in skin_tone)
    draw.ellipse(
        [(head_x - 10, nose_bottom_y - 8), (head_x - 4, nose_bottom_y)],
        fill=nostril_color
    )
    draw.ellipse(
        [(head_x + 4, nose_bottom_y - 8), (head_x + 10, nose_bottom_y)],
        fill=nostril_color
    )

    # Mouth
    mouth_y = head_y + 50
    mouth_width = 45
    mouth_color = (180, 120, 120)
    mouth_dark = (150, 90, 90)

    # Lips outline
    draw.arc(
        [(head_x - mouth_width, mouth_y), (head_x + mouth_width, mouth_y + 30)],
        0, 180, fill=mouth_color, width=3
    )

    # Mouth line
    draw.line(
        [(head_x - mouth_width + 5, mouth_y + 8), (head_x + mouth_width - 5, mouth_y + 8)],
        fill=mouth_dark, width=1
    )

    # Facial hair if applicable
    if director['facial_hair']:
        stubble_color = tuple(int(c * 0.5) for c in hair_color)
        # Beard shadow area
        beard_points = [
            (head_x - head_radius * 0.4, head_y + head_radius * 0.5),
            (head_x + head_radius * 0.4, head_y + head_radius * 0.5),
            (head_x + head_radius * 0.3, head_y + head_radius * 0.9),
            (head_x - head_radius * 0.3, head_y + head_radius * 0.9)
        ]
        draw.polygon(beard_points, fill=(stubble_color[0], stubble_color[1], stubble_color[2], 100))

    # Neck
    neck_x1 = head_x - 25
    neck_x2 = head_x + 25
    neck_start_y = head_y + head_radius - 10
    neck_end_y = height - 100

    neck_color = tuple(int(c * 0.95) for c in skin_tone)
    draw.polygon(
        [(neck_x1, neck_start_y), (neck_x2, neck_start_y),
         (head_x + 35, neck_end_y), (head_x - 35, neck_end_y)],
        fill=neck_color
    )

    # Suit jacket (dark blue)
    jacket_color = (35, 40, 85)
    jacket_dark = (25, 30, 70)

    # Left shoulder
    draw.polygon(
        [(head_x - 35, neck_end_y),
         (head_x - 120, neck_end_y + 10),
         (head_x - 140, height - 20),
         (head_x - 50, height - 20)],
        fill=jacket_color
    )

    # Right shoulder
    draw.polygon(
        [(head_x + 35, neck_end_y),
         (head_x + 120, neck_end_y + 10),
         (head_x + 140, height - 20),
         (head_x + 50, height - 20)],
        fill=jacket_color
    )

    # White shirt/collar
    shirt_color = (255, 255, 255)
    collar_y = neck_end_y + 5

    draw.polygon(
        [(head_x - 25, neck_start_y),
         (head_x + 25, neck_start_y),
         (head_x + 35, collar_y + 25),
         (head_x - 35, collar_y + 25)],
        fill=shirt_color
    )

    # Tie
    tie_color = (180, 30, 30)  # Red tie
    tie_width = 15

    draw.polygon(
        [(head_x - tie_width, collar_y),
         (head_x + tie_width, collar_y),
         (head_x + tie_width + 3, collar_y + 80),
         (head_x - tie_width - 3, collar_y + 80)],
        fill=tie_color
    )

    # Apply some smoothing filters for realism
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))

    return img

# Generate all portraits
print("Generating realistic professional portraits...")
for i, director in enumerate(directors, 1):
    print(f"  [{i}/8] Generating portrait for {director['name']}...")
    portrait = generate_portrait(director)
    output_path = os.path.join(output_dir, f"{director['id']}.jpg")
    portrait.save(output_path, quality=95, optimize=True)
    print(f"       ✓ Saved to {output_path}")

print("\n✓ All realistic portraits generated successfully!")
