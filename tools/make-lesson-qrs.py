#!/usr/bin/env python3
"""Draw one QR image per lesson, pointing at the live page.

Latecomers scan the projector and land on that exact lesson.
Re-run this after you add a lesson or change a permalink:

    PYTHONPATH=.tmp-segno python3 tools/make-lesson-qrs.py

or:  python3 -m pip install segno && python3 tools/make-lesson-qrs.py
"""

from __future__ import annotations

import sys
from pathlib import Path

try:
    import segno
except ImportError:
    print(
        "This script needs the 'segno' package. "
        "Install it with: python3 -m pip install segno",
        file=sys.stderr,
    )
    sys.exit(1)

# Same values as _config.yml — the phone should open the published site,
# not a laptop's localhost preview.
SITE_URL = "https://iyadsultan.github.io"
BASEURL = "/AIBedside.io"

# Lesson permalinks (must match the permalink: line in each block page).
LESSONS = [
    "/block-00-open/",
    "/block-01-prompting/",
    "/block-02-literature/",
    "/block-03-skills/",
    "/block-04-mcp/",
    "/block-05-small-models/",
    "/block-05-5-claude-md/",
    "/block-06-small-app/",
    "/block-06-small-app/prd/",
    "/block-07-research/",
    "/block-08-learned/",
]


def slug_from_permalink(permalink: str) -> str:
    """Turn /block-06-small-app/prd/ into block-06-small-app-prd."""
    return "-".join(part for part in permalink.split("/") if part)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out_dir = root / "assets" / "img" / "qr"
    out_dir.mkdir(parents=True, exist_ok=True)

    for permalink in LESSONS:
        url = SITE_URL + BASEURL + permalink
        slug = slug_from_permalink(permalink)
        dest = out_dir / f"{slug}.svg"
        try:
            qr = segno.make(url, error="m")
            qr.save(
                dest,
                kind="svg",
                scale=6,
                border=2,
                dark="#1B2A4A",
                light="#ffffff",
            )
        except Exception as err:
            print(f"Failed while drawing QR for {permalink}: {err}", file=sys.stderr)
            sys.exit(1)
        print(f"wrote {dest.name}  →  {url}")


if __name__ == "__main__":
    main()
