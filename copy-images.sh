#!/bin/bash

echo "================================================"
echo "Director Images Setup"
echo "================================================"
echo ""

# Create output directory
mkdir -p public/images/directors

# Image mappings
declare -A images=(
    ["jean-paul-julia"]="Jean-Paul Julia (CEO)"
    ["helena-muller"]="Helena Müller"
    ["david-chen"]="David Chen"
    ["isabella-rossi"]="Isabella Rossi"
    ["marcus-weber"]="Marcus Weber"
    ["sophie-fontaine"]="Sophie Fontaine"
    ["antonio-garcia"]="Antonio García"
    ["francesca-moretti"]="Francesca Moretti"
)

# Loop through each director
for id in "${!images[@]}"; do
    name="${images[$id]}"
    echo ""
    echo "Enter the path to $name's image file:"
    echo "(e.g., /Users/username/Downloads/helena-muller.jpg)"
    read -p "> " filepath

    if [ -f "$filepath" ]; then
        # Copy and convert to jpg
        cp "$filepath" "public/images/directors/${id}.jpg"
        echo "✓ Copied: ${id}.jpg"
    else
        echo "✗ File not found: $filepath"
    fi
done

echo ""
echo "================================================"
echo "All images processed!"
echo "================================================"
