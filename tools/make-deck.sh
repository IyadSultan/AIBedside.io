#!/usr/bin/env bash
# Render the deck's image assets, then build the .pptx.
#   bash tools/make-deck.sh
# Needs: ImageMagick (magick), macOS qlmanage, python-pptx, Pillow, segno.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .deck-build
# Same URLs as tools/make-lesson-qrs.py, drawn with segno (ImageMagick renders the
# site's stroke-based SVGs too faintly to scan).
python3 - <<'PY'
import segno
from pathlib import Path
base = "https://iyadsultan.github.io/AIBedside.io/"
for slug in ["block-00-open", "block-01-prompting", "block-02-literature", "block-03-skills",
             "block-04-mcp", "block-05-5-claude-md", "block-05-small-models", "block-06-small-app",
             "block-07-research", "block-08-learned", "closing-tasks"]:
    out = Path(f".deck-build/qr-{slug}.png")
    if not out.exists():
        segno.make(base + slug + "/", error="m").save(str(out), scale=16, border=2, dark="#1B2A4A")
PY
if [ ! -f .deck-build/logo-siop.png ]; then
  qlmanage -t -s 1600 -o .deck-build assets/img/logo-siop-2026.svg >/dev/null 2>&1
  python3 - <<'PY'
from PIL import Image, ImageChops
im = Image.open(".deck-build/logo-siop-2026.svg.png").convert("RGB")
bbox = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).getbbox()
im.crop(bbox).save(".deck-build/logo-siop.png")
PY
fi
python3 tools/make-deck.py
