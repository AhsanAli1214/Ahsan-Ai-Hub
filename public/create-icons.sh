#!/bin/bash

# Create a simple blue square PNG icon using ImageMagick if available
# If not, create a placeholder
if command -v convert &> /dev/null; then
  # 192x192 icon
  convert -size 192x192 xc:blue -pointsize 80 -fill white -gravity center -annotate +0+0 "A" icon-192.png
  # 512x512 icon
  convert -size 512x512 xc:blue -pointsize 200 -fill white -gravity center -annotate +0+0 "A" icon-512.png
  # Maskable icons (same content, different format)
  cp icon-192.png icon-maskable-192.png
  cp icon-512.png icon-maskable-512.png
  echo "Icons created successfully"
else
  echo "ImageMagick not available, skipping icon creation"
fi
