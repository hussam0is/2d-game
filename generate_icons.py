#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Icon sizes needed for PWA
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# Create icons directory if it doesn't exist
os.makedirs('icons', exist_ok=True)

for size in sizes:
    # Create a new image with green background
    img = Image.new('RGB', (size, size), color='#1a472a')
    draw = ImageDraw.Draw(img)

    # Calculate proportions
    card_width = size // 4
    card_height = int(card_width * 1.4)
    card_margin = size // 10

    # Draw first card (white background)
    card1_x = card_margin
    card1_y = size // 4
    draw.rounded_rectangle(
        [(card1_x, card1_y), (card1_x + card_width, card1_y + card_height)],
        radius=size // 40,
        fill='white'
    )

    # Draw second card (white background) - slightly offset
    card2_x = card1_x + card_width // 2
    card2_y = card1_y + card_height // 4
    draw.rounded_rectangle(
        [(card2_x, card2_y), (card2_x + card_width, card2_y + card_height)],
        radius=size // 40,
        fill='white'
    )

    # Draw a simple chip
    chip_x = size - card_margin - size // 6
    chip_y = size - card_margin - size // 6
    chip_radius = size // 8

    # Outer circle (gold)
    draw.ellipse(
        [(chip_x - chip_radius, chip_y - chip_radius),
         (chip_x + chip_radius, chip_y + chip_radius)],
        fill='#ffd700',
        outline='#ff8c00',
        width=max(1, size // 128)
    )

    # Inner circle
    inner_radius = chip_radius * 0.6
    draw.ellipse(
        [(chip_x - inner_radius, chip_y - inner_radius),
         (chip_x + inner_radius, chip_y + inner_radius)],
        fill='#ffd700',
        outline='#ff8c00',
        width=max(1, size // 256)
    )

    # Add text/symbols if size is large enough
    if size >= 128:
        try:
            # Try to use a larger font for bigger icons
            font_size = size // 10

            # Draw spade symbol on first card
            spade_size = card_width // 2
            spade_x = card1_x + card_width // 2
            spade_y = card1_y + card_height // 2
            draw.text((spade_x, spade_y), '♠', fill='black', anchor='mm', font_size=spade_size)

            # Draw heart symbol on second card
            heart_x = card2_x + card_width // 2
            heart_y = card2_y + card_height // 2
            draw.text((heart_x, heart_y), '♥', fill='#d32f2f', anchor='mm', font_size=spade_size)

            # Draw $ on chip
            draw.text((chip_x, chip_y), '$', fill='black', anchor='mm', font_size=chip_radius)
        except:
            pass

    # Save the icon
    output_path = f'icons/icon-{size}x{size}.png'
    img.save(output_path, 'PNG')
    print(f'Created {output_path}')

print('All icons generated successfully!')
