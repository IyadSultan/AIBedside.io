#!/usr/bin/env python3
"""Build the static PowerPoint version of AIBedside.io.

Same SIOP palette as the site, no interactive parts. Every live demo on the
site becomes a picture, a table, or a worked example on a slide.

    python3 tools/make-deck.py            # writes assets/deck/AI-at-the-Bedside-SIOP2026.pptx

Needs python-pptx and Pillow. Lesson QR PNGs are rendered from
assets/img/qr/*.svg with ImageMagick into .deck-build/ (see tools/make-deck.sh).

Deck options (khcc-pptx kickoff): detail=standard · images=user folder ·
diagrams=pptx-native shapes · colours=user-supplied (SIOP site palette) ·
content=user-supplied only · animation=none.
"""

from __future__ import annotations

import re
import uuid
from datetime import datetime
from pathlib import Path

from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml import parse_xml
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / ".deck-build"
OUT = ROOT / "assets" / "deck" / "AI-at-the-Bedside-SIOP2026.pptx"
SITE = "https://iyadsultan.github.io/AIBedside.io/"

# ---------------------------------------------------------------- palette
def rgb(h: str) -> RGBColor:
    h = h.lstrip("#")
    return RGBColor(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


BRAND = rgb("#21409A")
BRAND_DARK = rgb("#034EA2")
MAGENTA = rgb("#EC008C")
YELLOW = rgb("#FFC20E")
BG2 = rgb("#E8F1FB")
PINK_BG = rgb("#FDE8F4")
FG = rgb("#1B2A4A")
FG2 = rgb("#607D8B")
FG3 = rgb("#90A4AE")
RULE = rgb("#D6E4F5")
RULE2 = rgb("#E0E0E0")
WHITE = rgb("#FFFFFF")
PAPER = rgb("#FAFBFD")
WARN_BG = rgb("#FFF8E1")
WARN_FG = rgb("#8D6E00")
RED = rgb("#C62828")
GREEN = rgb("#2E7D32")
CODE_BG = rgb("#F4F6FA")

BLOCK = {
    0: ("#607D8B", "Open — no conflicts, four similar tools", "00:00"),
    1: ("#3F51B5", "Prompting like a guru", "00:04"),
    2: ("#00897B", "Reading the literature", "00:12"),
    3: ("#7B1FA2", "Skills — your house style", "00:22"),
    4: ("#E65100", "MCP — connect your own work", "00:29"),
    5: ("#6D4C41", "CLAUDE.md — the kitchen contract", "00:34"),
    6: ("#C62828", "Small models & the edge", "00:37"),
    7: ("#0277BD", "A small app in five minutes", "00:43"),
    8: ("#558B2F", "AI for research", "00:48"),
    9: ("#21409A", "What we learned at KHCC", "00:54"),
    10: ("#00695C", "Close — what to try on Monday", "00:57"),
}
QR_FOR_BLOCK = {
    0: "block-00-open", 1: "block-01-prompting", 2: "block-02-literature",
    3: "block-03-skills", 4: "block-04-mcp", 5: "block-05-5-claude-md",
    6: "block-05-small-models", 7: "block-06-small-app", 8: "block-07-research",
    9: "block-08-learned", 10: "closing-tasks",
}

FONT = "Calibri"
MONO = "Consolas"

SW, SH = Inches(13.333), Inches(7.5)
M = Inches(0.6)          # side margin
TOP = Inches(1.05)       # first content line below header
BOTTOM = SH - Inches(0.55)

prs = Presentation()
prs.slide_width, prs.slide_height = SW, SH
BLANK = prs.slide_layouts[6]
slide_no = 0


# ---------------------------------------------------------------- low-level
def _fill(shape, color):
    shape.fill.solid()
    shape.fill.fore_color.rgb = color


def _line(shape, color=None, width=Pt(0.75)):
    if color is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = color
        shape.line.width = width


def rect(slide, x, y, w, h, fill=None, line=None, shape=MSO_SHAPE.RECTANGLE, radius=None, lw=Pt(0.75)):
    s = slide.shapes.add_shape(shape, x, y, w, h)
    if fill is None:
        s.fill.background()
    else:
        _fill(s, fill)
    _line(s, line, lw)
    s.shadow.inherit = False
    if radius is not None and shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        s.adjustments[0] = radius
    s.text_frame.text = ""
    return s


def rrect(slide, x, y, w, h, fill=None, line=None, radius=0.08, lw=Pt(0.75)):
    return rect(slide, x, y, w, h, fill, line, MSO_SHAPE.ROUNDED_RECTANGLE, radius, lw)


_TOKEN = re.compile(r"(\*\*.+?\*\*|\[\[.+?\]\]|``.+?``)")


def add_runs(p, text, size, color=FG, bold=False, font=FONT, mark=MAGENTA, italic=False):
    """Inline markup: **bold**, [[accent colour]], ``mono``."""
    for part in _TOKEN.split(text):
        if not part:
            continue
        r = p.add_run()
        b, c, f = bold, color, font
        if part.startswith("**"):
            part, b = part[2:-2], True
        elif part.startswith("[["):
            part, c, b = part[2:-2], mark, True
        elif part.startswith("``"):
            part, f = part[2:-2], MONO
        r.text = part
        r.font.size = Pt(size)
        r.font.bold = b
        r.font.italic = italic
        r.font.name = f
        r.font.color.rgb = c


def _para(tf, first):
    return tf.paragraphs[0] if first else tf.add_paragraph()


def text(slide, x, y, w, h, lines, size=18, color=FG, bold=False, align=PP_ALIGN.LEFT,
         anchor=MSO_ANCHOR.TOP, font=FONT, spacing=1.15, space_after=4, mark=MAGENTA,
         italic=False, fill=None, line=None, inset=0.05, radius=None):
    """One text frame; `lines` is a str or list of str / (str, dict) tuples."""
    if radius is not None:
        box = rrect(slide, x, y, w, h, fill, line, radius)
    elif fill is not None or line is not None:
        box = rect(slide, x, y, w, h, fill, line)
    else:
        box = slide.shapes.add_textbox(x, y, w, h)
    tf = box.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = Inches(inset)
    tf.margin_top = tf.margin_bottom = Inches(inset)
    if isinstance(lines, str):
        lines = [lines]
    for i, item in enumerate(lines):
        opts = {}
        if isinstance(item, tuple):
            item, opts = item
        p = _para(tf, i == 0)
        p.alignment = opts.get("align", align)
        p.line_spacing = opts.get("spacing", spacing)
        p.space_after = Pt(opts.get("space_after", space_after))
        add_runs(p, item, opts.get("size", size), opts.get("color", color),
                 opts.get("bold", bold), opts.get("font", font), mark, opts.get("italic", italic))
    return box


def bullets(slide, x, y, w, h, items, size=17, color=FG, bullet_color=None, space_after=6,
            spacing=1.12, char="•", fill=None, line=None, radius=None, inset=0.08):
    """All bullets in one frame with a real hanging indent (renderer owns wrapping)."""
    bullet_color = bullet_color or MAGENTA
    if radius is not None:
        box = rrect(slide, x, y, w, h, fill, line, radius)
    elif fill is not None or line is not None:
        box = rect(slide, x, y, w, h, fill, line)
    else:
        box = slide.shapes.add_textbox(x, y, w, h)
    tf = box.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    tf.margin_left = tf.margin_right = Inches(inset)
    tf.margin_top = tf.margin_bottom = Inches(inset)
    for i, item in enumerate(items):
        opts = {}
        if isinstance(item, tuple):
            item, opts = item
        p = _para(tf, i == 0)
        p.line_spacing = spacing
        p.space_after = Pt(space_after)
        pPr = p._p.get_or_add_pPr()
        indent = Emu(Inches(0.28))
        pPr.set("marL", str(int(indent)))
        pPr.set("indent", str(-int(indent)))
        buClr = pPr.makeelement(qn("a:buClr"), {})
        srgb = buClr.makeelement(qn("a:srgbClr"), {"val": str(bullet_color)})
        buClr.append(srgb)
        pPr.append(buClr)
        buFont = pPr.makeelement(qn("a:buFont"), {"typeface": "Arial"})
        pPr.append(buFont)
        buChar = pPr.makeelement(qn("a:buChar"), {"char": opts.get("char", char)})
        pPr.append(buChar)
        add_runs(p, item, opts.get("size", size), opts.get("color", color), opts.get("bold", False))
    return box


def picture(slide, path, x, y, w, h, border=None, radius=False):
    """Contain-fit an image inside (x, y, w, h), centred."""
    path = Path(path)
    iw, ih = Image.open(path).size
    scale = min(w / iw, h / ih)
    pw, ph = int(iw * scale), int(ih * scale)
    px, py = int(x + (w - pw) / 2), int(y + (h - ph) / 2)
    pic = slide.shapes.add_picture(str(path), px, py, pw, ph)
    if border is not None:
        pic.line.color.rgb = border
        pic.line.width = Pt(0.75)
    return pic


def table(slide, x, y, w, col_w, rows, header=True, size=13, head_fill=BRAND, row_h=None,
          head_color=WHITE, zebra=True, first_col_bold=False, cell_fills=None):
    nrows, ncols = len(rows), len(rows[0])
    row_h = row_h or Inches(0.4)
    shp = slide.shapes.add_table(nrows, ncols, x, y, w, row_h * nrows)
    tbl = shp.table
    tbl.first_row = header
    total = sum(col_w)
    for i, cw in enumerate(col_w):
        tbl.columns[i].width = int(w * cw / total)
    for r, row in enumerate(rows):
        tbl.rows[r].height = row_h
        for c, val in enumerate(row):
            cell = tbl.cell(r, c)
            cell.margin_left = cell.margin_right = Inches(0.08)
            cell.margin_top = cell.margin_bottom = Inches(0.04)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            tf = cell.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            is_head = header and r == 0
            color = head_color if is_head else FG
            add_runs(p, str(val), size, color, bold=is_head or (first_col_bold and c == 0))
            cell.fill.solid()
            if is_head:
                cell.fill.fore_color.rgb = head_fill
            elif cell_fills and (r, c) in cell_fills:
                cell.fill.fore_color.rgb = cell_fills[(r, c)]
            elif zebra and r % 2 == 0:
                cell.fill.fore_color.rgb = PAPER
            else:
                cell.fill.fore_color.rgb = WHITE
    return shp


def pill(slide, x, y, label, fill, color=WHITE, size=11, w=None, h=Inches(0.3)):
    w = w or Inches(0.12 + 0.085 * len(label))
    box = text(slide, x, y, w, h, label, size=size, color=color, bold=True, align=PP_ALIGN.CENTER,
               anchor=MSO_ANCHOR.MIDDLE, fill=fill, radius=0.5, inset=0.02)
    return box


def num_badge(slide, x, y, label, fill, size=Inches(0.5), fsize=15):
    return text(slide, x, y, size, size, label, size=fsize, color=WHITE, bold=True,
                align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, fill=fill, radius=0.25, inset=0.0)


def card(slide, x, y, w, h, title=None, body=None, fill=WHITE, line=RULE2, tsize=15, bsize=13,
         tcolor=FG, bcolor=FG2, badge=None, badge_fill=BRAND, kicker=None, kicker_color=None,
         radius=0.06, pad=0.16, tlines=1):
    rrect(slide, x, y, w, h, fill, line, radius)
    cx = x + Inches(pad)
    cy = y + Inches(pad - 0.02)
    cw = w - Inches(2 * pad)
    if badge is not None:
        num_badge(slide, cx, cy, badge, badge_fill, size=Inches(0.42), fsize=13)
        cx2 = cx + Inches(0.55)
        cw2 = cw - Inches(0.55)
    else:
        cx2, cw2 = cx, cw
    ty = cy
    if kicker:
        text(slide, cx2, ty, cw2, Inches(0.25), kicker.upper(), size=9, color=kicker_color or badge_fill,
             bold=True, inset=0, spacing=1.0, space_after=0)
        ty += Inches(0.24)
    if title:
        text(slide, cx2, ty, cw2, Inches(0.36 * tlines), title, size=tsize, color=tcolor, bold=True, inset=0,
             spacing=1.0, space_after=0)
        ty += Inches(0.05 + tsize * 0.024 * tlines)
    if body:
        text(slide, cx2, ty, cw2, y + h - ty - Inches(pad * 0.6), body, size=bsize, color=bcolor,
             inset=0, spacing=1.12, space_after=3)


def chat(slide, x, y, w, h, who, body, kind="you", size=14):
    """A static chat bubble: you / tool / model."""
    style = {
        "you": (BG2, BRAND_DARK, "You"),
        "model": (WHITE, FG2, "Claude"),
        "model-off": (WHITE, FG2, "ChatGPT — not connected"),
        "tool": (WARN_BG, WARN_FG, "Tool"),
    }[kind]
    fill, lc, default = style
    who = who or default
    rrect(slide, x, y, w, h, fill, RULE2 if kind != "tool" else rgb("#F1DFA3"), 0.08)
    text(slide, x + Inches(0.14), y + Inches(0.08), w - Inches(0.28), Inches(0.25), who.upper(),
         size=9, color=lc, bold=True, inset=0, spacing=1.0, space_after=0)
    text(slide, x + Inches(0.14), y + Inches(0.32), w - Inches(0.28), h - Inches(0.4), body,
         size=size, color=FG, inset=0, spacing=1.12, space_after=3, font=MONO if kind == "tool" else FONT)


def code(slide, x, y, w, h, lines, size=12, fill=CODE_BG, color=FG):
    return text(slide, x, y, w, h, lines, size=size, color=color, font=MONO, fill=fill, line=RULE,
                spacing=1.08, space_after=0, inset=0.14, radius=0.04)


def arrow(slide, x, y, w, h=Inches(0.28), color=None):
    s = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, x, y, w, h)
    _fill(s, color or RULE)
    _line(s, None)
    s.shadow.inherit = False
    return s


def phi_line(slide, txt="Never paste a real patient into a consumer AI tool.", y=None):
    y = y or (BOTTOM - Inches(0.42))
    text(slide, M, y, SW - 2 * M, Inches(0.36), txt, size=12, color=RED, bold=True,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, fill=rgb("#FDECEA"), radius=0.5, inset=0.02)


def takehome(slide, txt, y=None, h=Inches(0.7)):
    y = y or (BOTTOM - Inches(0.5) - h)
    box = rrect(slide, M, y, SW - 2 * M, h, BG2, None, 0.1)
    rect(slide, M, y, Inches(0.08), h, MAGENTA)
    text(slide, M + Inches(0.25), y, SW - 2 * M - Inches(0.35), h, txt, size=14, color=FG,
         anchor=MSO_ANCHOR.MIDDLE, inset=0.06)
    return box


# Per-block QR, matching the site’s top-right “This lesson” chip.
QR_SIZE = Inches(0.78)
QR_GUTTER = Inches(1.15)
CURRENT_BLOCK = None


# ---------------------------------------------------------------- chrome
def new_slide(block=None, kicker=None, chrome=True):
    global slide_no, CURRENT_BLOCK
    s = prs.slides.add_slide(BLANK)
    slide_no += 1
    if block is not None:
        CURRENT_BLOCK = block
    if not chrome:
        return s
    # header bar, like the site header
    rect(s, 0, 0, SW, Inches(0.62), BRAND)
    rect(s, 0, Inches(0.62), SW, Inches(0.05), MAGENTA)
    picture(s, ROOT / "assets/img/siop-2026-icon.png", M, Inches(0.1), Inches(0.42), Inches(0.42))
    text(s, M + Inches(0.52), Inches(0.05), Inches(5), Inches(0.3), "AI at the Bedside",
         size=14, color=WHITE, bold=True, inset=0, spacing=1.0, space_after=0)
    text(s, M + Inches(0.52), Inches(0.32), Inches(5), Inches(0.25), "SIOP 2026 · GLOBAL HEALTH SESSION · KHCC",
         size=8, color=YELLOW, bold=True, inset=0, spacing=1.0, space_after=0)
    if block is not None:
        col, name, t = BLOCK[block]
        label = f"BLOCK {block} · {t}" if block else f"OPEN · {t}"
        text(s, SW - M - Inches(4), Inches(0.14), Inches(4), Inches(0.34), label, size=11, color=WHITE,
             bold=True, align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE, inset=0, spacing=1.0, space_after=0)
        chrome_qr(s, block)
    elif kicker:
        text(s, SW - M - Inches(4), Inches(0.14), Inches(4), Inches(0.34), kicker.upper(), size=11,
             color=WHITE, bold=True, align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE, inset=0, spacing=1.0, space_after=0)
        chrome_clock(s)
    # footer
    text(s, M, SH - Inches(0.4), Inches(6), Inches(0.28), "aibedside.io  ·  " + SITE, size=9, color=FG3,
         inset=0, spacing=1.0, space_after=0)
    text(s, SW - M - Inches(1.5), SH - Inches(0.4), Inches(1.5), Inches(0.28), str(slide_no), size=9,
         color=FG3, align=PP_ALIGN.RIGHT, inset=0, spacing=1.0, space_after=0)
    return s


def heading(s, title, kicker=None, block=None, size=30, y=TOP, w=None):
    col = rgb(BLOCK[block][0]) if block is not None else FG2
    gutter = QR_GUTTER if block is not None else 0
    tw = w if w is not None else (SW - 2 * M - gutter)
    if kicker:
        text(s, M, y - Inches(0.02), tw, Inches(0.28), kicker.upper(), size=11, color=col,
             bold=True, inset=0, spacing=1.0, space_after=0)
        y += Inches(0.3)
    text(s, M, y, tw, Inches(0.6), title, size=size, color=BRAND, bold=True, inset=0,
         spacing=1.0, space_after=0)
    return y + Inches(0.15 + size * 0.02)


def qr_png(slug):
    return BUILD / f"qr-{slug}.png"


def _hex(color: RGBColor) -> str:
    return f"{int(color[0]):02X}{int(color[1]):02X}{int(color[2]):02X}"


def clock_field(slide, x, y, w, h, size=12, color=BRAND, bold=True, font=FONT):
    """Laptop local time as a PowerPoint date/time field (h:mm AM/PM).

    PowerPoint fills this from the computer’s clock. It refreshes when you
    change slides — it does not tick every second during a show.
    """
    now = datetime.now().strftime("%I:%M %p").lstrip("0")
    box = slide.shapes.add_textbox(x, y, w, h)
    tf = box.text_frame
    tf.word_wrap = False
    tf.auto_size = None
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = tf.margin_right = Inches(0)
    tf.margin_top = tf.margin_bottom = Inches(0)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    for el in list(p._p):
        if el.tag != qn("a:pPr"):
            p._p.remove(el)
    try:
        fld = parse_xml(
            f'<a:fld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
            f'id="{{{uuid.uuid4()}}}" type="datetime9">'
            f'<a:rPr lang="en-US" sz="{int(size * 100)}" b="{"1" if bold else "0"}" dirty="0" smtClean="0">'
            f'<a:solidFill><a:srgbClr val="{_hex(color)}"/></a:solidFill>'
            f'<a:latin typeface="{font}"/>'
            f'</a:rPr>'
            f'<a:t>{now}</a:t>'
            f'</a:fld>'
        )
        p._p.append(fld)
    except Exception as err:
        print(f"Failed while writing the clock field: {err}")
        add_runs(p, now, size, color, bold, font)
    return box


def chrome_clock(s, size=QR_SIZE):
    """Time-only chip in the QR corner, for slides that have no lesson QR."""
    x = SW - Inches(0.22) - size
    y = Inches(0.78)
    rrect(s, x - Inches(0.06), y - Inches(0.06), size + Inches(0.12), Inches(0.38), WHITE, RULE2, 0.08)
    clock_field(s, x - Inches(0.08), y, size + Inches(0.16), Inches(0.26), size=14, color=BRAND)


def chrome_qr(s, block, size=QR_SIZE):
    """Small ‘This lesson’ chip — same corner as the live site, under the header."""
    x = SW - Inches(0.22) - size
    y = Inches(0.78)
    rrect(s, x - Inches(0.06), y - Inches(0.06), size + Inches(0.12), size + Inches(0.50), WHITE, RULE2, 0.08)
    picture(s, qr_png(QR_FOR_BLOCK[block]), x, y, size, size)
    text(s, x - Inches(0.08), y + size + Inches(0.01), size + Inches(0.16), Inches(0.16),
         "This lesson", size=8, color=BRAND, bold=True, align=PP_ALIGN.CENTER, inset=0,
         spacing=1.0, space_after=0)
    clock_field(s, x - Inches(0.08), y + size + Inches(0.16), size + Inches(0.16), Inches(0.24),
                size=12, color=BRAND)


def lesson_qr(s, block, x=None, y=None, size=Inches(1.25), caption="This lesson", dark=True):
    x = x if x is not None else SW - M - size
    y = y if y is not None else SH - Inches(0.42) - size - Inches(0.50)
    slug = QR_FOR_BLOCK[block]
    rrect(s, x - Inches(0.06), y - Inches(0.06), size + Inches(0.12), size + Inches(0.12), WHITE, None, 0.06)
    picture(s, qr_png(slug), x, y, size, size)
    text(s, x - Inches(0.3), y + size + Inches(0.06), size + Inches(0.6), Inches(0.22), caption, size=10,
         color=WHITE if dark else FG2, bold=True, align=PP_ALIGN.CENTER, inset=0, spacing=1.0, space_after=0)
    clock_field(s, x - Inches(0.3), y + size + Inches(0.26), size + Inches(0.6), Inches(0.24),
                size=14, color=WHITE if dark else BRAND)


def section(block, title=None, sub=None):
    col, name, t = BLOCK[block]
    s = new_slide(block=block, chrome=False)
    rect(s, 0, 0, SW, SH, BRAND)
    rect(s, 0, SH - Inches(0.12), SW, Inches(0.12), MAGENTA)
    rect(s, M, Inches(1.2), Inches(0.9), Inches(0.9), rgb(col), shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.2)
    text(s, M, Inches(1.2), Inches(0.9), Inches(0.9), str(block), size=30, color=WHITE, bold=True,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, inset=0)
    text(s, M + Inches(1.1), Inches(1.25), Inches(6), Inches(0.4),
         f"BLOCK {block}  ·  {t}" if block else f"OPEN  ·  {t}", size=14, color=YELLOW, bold=True, inset=0,
         anchor=MSO_ANCHOR.MIDDLE)
    text(s, M, Inches(2.5), Inches(9), Inches(2.2), title or name, size=54, color=WHITE, bold=True, inset=0,
         spacing=1.0, mark=YELLOW)
    if sub:
        text(s, M, Inches(4.9), Inches(8.5), Inches(1.2), sub, size=20, color=rgb("#C5D3EE"), inset=0)
    lesson_qr(s, block, caption="This lesson — scan to open")
    return s


def statement(title, meta=None, kicker=None, block=None, small=False):
    b = CURRENT_BLOCK if block is None else block
    s = new_slide(block=b, chrome=False)
    rect(s, 0, 0, SW, SH, BRAND)
    rect(s, 0, SH - Inches(0.12), SW, Inches(0.12), MAGENTA)
    if kicker:
        text(s, M, Inches(1.3), Inches(10), Inches(0.4), kicker.upper(), size=14, color=YELLOW, bold=True, inset=0)
    text(s, M, Inches(2.0), SW - 2 * M - Inches(0.5), Inches(3.2), title, size=36 if small else 46, color=WHITE,
         bold=True, inset=0, spacing=1.05, mark=YELLOW, anchor=MSO_ANCHOR.MIDDLE)
    if meta:
        text(s, M, Inches(5.4), SW - 2 * M - Inches(1), Inches(1.2), meta, size=20, color=rgb("#C5D3EE"), inset=0)
    if b is not None:
        chrome_qr(s, b)
    return s


# ================================================================ SLIDES
# ---------------------------------------------------------------- cover
def cover():
    s = new_slide(chrome=False)
    rect(s, 0, 0, SW, SH, WHITE)
    rect(s, 0, 0, SW, Inches(4.4), BG2)
    rect(s, 0, 0, Inches(0.16), SH, BRAND)
    rect(s, 0, SH - Inches(0.1), SW, Inches(0.1), MAGENTA)
    text(s, M + Inches(0.2), Inches(0.75), Inches(8), Inches(0.35), "SIOP 2026  ·  GLOBAL HEALTH SESSION",
         size=13, color=MAGENTA, bold=True, inset=0)
    text(s, M + Inches(0.2), Inches(1.15), Inches(8), Inches(1.4), "AI at the Bedside", size=60, color=BRAND,
         bold=True, inset=0, spacing=1.0)
    text(s, M + Inches(0.2), Inches(2.5), Inches(7.2), Inches(1.2),
         "A practical introduction for the whole childhood-cancer team. One hour, ten short blocks, every demo runnable at home.",
         size=18, color=FG2, inset=0)
    text(s, M + Inches(0.2), Inches(3.6), Inches(8), Inches(0.4), "Iyad Sultan, MD  ·  King Hussein Cancer Center",
         size=15, color=FG, bold=True, inset=0)
    picture(s, BUILD / "logo-siop.png", M + Inches(0.2), Inches(4.85), Inches(4.6), Inches(1.7))
    text(s, M + Inches(0.2), Inches(6.55), Inches(6), Inches(0.3), "SAN ANTONIO  ·  15–18 SEPTEMBER 2026",
         size=10, color=FG2, bold=True, inset=0)
    # QR box (the site's quick-access component)
    bx, by, bw, bh = SW - M - Inches(4.3), Inches(4.45), Inches(4.3), Inches(2.0)
    rrect(s, bx, by, bw, bh, PINK_BG, rgb("#B8D0EC"), 0.1)
    rrect(s, bx + Inches(0.2), by + Inches(0.2), Inches(1.6), Inches(1.6), WHITE, None, 0.06)
    picture(s, BUILD / "qr-home.png", bx + Inches(0.25), by + Inches(0.25), Inches(1.5), Inches(1.5))
    text(s, bx + Inches(2.0), by + Inches(0.3), Inches(2.2), Inches(0.35), "Quick Access", size=15,
         color=BRAND_DARK, bold=True, inset=0)
    text(s, bx + Inches(2.0), by + Inches(0.68), Inches(2.2), Inches(0.9),
         "Open your phone camera and scan to bookmark the companion site. Every demo in this deck is there, runnable at home.",
         size=11, color=FG2, inset=0)
    clock_field(s, bx + Inches(2.0), by + bh - Inches(0.42), Inches(2.2), Inches(0.3), size=14, color=BRAND)
    # moderators and presenters, under the QR box
    text(s, bx, by + bh + Inches(0.08), bw, Inches(0.75), [
        ("**MODERATORS**  Jorge Campos <camposmd94@gmail.com>", {"size": 9, "color": FG2}),
        ("Milena Villarroel <villarroelmilena@gmail.com>", {"size": 9, "color": FG2}),
        ("**PRESENTERS**  Uri Ilan <u.ilan-2@prinsesmaximacentrum.nl>", {"size": 9, "color": FG2}),
        ("Iyad Sultan <isultan@khcc.jo>", {"size": 9, "color": FG2}),
    ], inset=0, spacing=1.05, space_after=0, mark=BRAND_DARK)
    # hero picture on the right
    picture(s, ROOT / "assets/img/android-chrome-512x512.png", SW - M - Inches(3.2), Inches(0.9), Inches(2.8), Inches(2.8))


def run_of_show():
    s = new_slide(kicker="Run of show")
    y = heading(s, "Run of show", "Sixty minutes · times are minutes from the start")
    items = [(b,) + BLOCK[b] for b in range(11)]
    desc = {
        0: "Disclosures, four similar tools, Wachter, Chat versus Cowork.",
        1: "Build the prompt: role, context, constraints, format.",
        2: "One guideline: NotebookLM, infographic, video, artifact, mermaid.",
        3: "Build one skill. Find a stats library. A sample-size calculator.",
        4: "USB for AI. Haiku with and without a medical-terms plug.",
        5: "Standing orders for a folder. Five policies in; a wiki and a review out.",
        6: "Four places a model can live. Fine-tune here. Federate across hospitals.",
        7: "A prompt, a PRD, a roster app — then eight jobs a hospital still owes.",
        8: "Plug the chat into your own Zotero library. The model writes the code; you remain the author.",
        9: "People first. Then agents, with their own rules. Cybersecurity before everything.",
        10: "Crash cart, patient guide, six point-of-care tools. One task per role.",
    }
    colw = (SW - 2 * M - Inches(0.3)) / 2
    rh = Inches(0.78)
    for i, (b, col, name, t) in enumerate(items):
        cx = M + (i % 2) * (colw + Inches(0.3))
        cy = y + (i // 2) * (rh + Inches(0.1))
        rrect(s, cx, cy, colw, rh, WHITE, RULE2, 0.1)
        num_badge(s, cx + Inches(0.15), cy + Inches(0.17), str(b), rgb(col), Inches(0.44), 13)
        text(s, cx + Inches(0.72), cy + Inches(0.08), colw - Inches(1.7), Inches(0.3), name, size=13, color=FG,
             bold=True, inset=0, spacing=1.0, space_after=0)
        text(s, cx + Inches(0.72), cy + Inches(0.36), colw - Inches(1.7), Inches(0.42), desc[b], size=10,
             color=FG2, inset=0, spacing=1.05, space_after=0)
        text(s, cx + colw - Inches(0.9), cy + Inches(0.1), Inches(0.8), Inches(0.3), t, size=11, color=FG3,
             bold=True, font=MONO, align=PP_ALIGN.RIGHT, inset=0, spacing=1.0, space_after=0)
    # companion card
    cy = y + 6 * (rh + Inches(0.1))
    cx = M + colw + Inches(0.3)
    rrect(s, cx, cy - Inches(0.88), colw, rh, PAPER, RULE2, 0.1)
    num_badge(s, cx + Inches(0.15), cy - Inches(0.88) + Inches(0.17), "+", rgb("#F4511E"), Inches(0.44), 13)
    text(s, cx + Inches(0.72), cy - Inches(0.88) + Inches(0.08), colw - Inches(1.0), Inches(0.3),
         "Companion sessions", size=13, color=FG, bold=True, inset=0, spacing=1.0, space_after=0)
    text(s, cx + Inches(0.72), cy - Inches(0.88) + Inches(0.36), colw - Inches(1.0), Inches(0.4),
         "Precision medicine tool, then Q&A with an AI avatar.", size=10, color=FG2, inset=0, spacing=1.05, space_after=0)


# ---------------------------------------------------------------- block 0
def block0():
    section(0, "Open — no conflicts,\nfour similar tools", "Disclosures, then Claude / ChatGPT / Gemini / Perplexity, then Wachter, then Chat versus Cowork.")

    statement("No conflicts.\nOnly KHCC.", kicker="Disclosure",
              meta="I have no conflict of interest. I am not affiliated with Anthropic, OpenAI, Google, Perplexity, or any other AI company. My only institutional affiliation is King Hussein Cancer Center.")

    s = new_slide(block=0)
    y = heading(s, "Four names. Same work.", "Language models", block=0)
    models = [("Anthropic", "Claude", "#D97757"), ("OpenAI", "ChatGPT", "#10A37F"), ("Google", "Gemini", "#4285F4"),
              ("Perplexity", "Perplexity", "#20808D")]
    cw = (SW - 2 * M - 3 * Inches(0.3)) / 4
    for i, (maker, name, col) in enumerate(models):
        cx = M + i * (cw + Inches(0.3))
        rrect(s, cx, y + Inches(0.2), cw, Inches(2.2), WHITE, RULE2, 0.08)
        rect(s, cx, y + Inches(0.2), cw, Inches(0.12), rgb(col))
        text(s, cx, y + Inches(0.7), cw, Inches(0.35), maker.upper(), size=11, color=FG2, bold=True,
             align=PP_ALIGN.CENTER, inset=0)
        text(s, cx, y + Inches(1.1), cw, Inches(0.8), name, size=30, color=FG, bold=True, align=PP_ALIGN.CENTER, inset=0)
    caps = ["Skills", "Tools (MCP)", "Internet", "Deep research", "Large context window"]
    text(s, M, y + Inches(2.8), Inches(6), Inches(0.3), "ALL FOUR NOW OFFER", size=11, color=FG2, bold=True, inset=0)
    cx = M
    for c in caps:
        w = Inches(0.5 + 0.11 * len(c))
        pill(s, cx, y + Inches(3.15), c, BG2, color=BRAND_DARK, size=13, w=w, h=Inches(0.42))
        cx += w + Inches(0.15)
    text(s, M, y + Inches(3.9), SW - 2 * M, Inches(0.6),
         "Pick the one your hospital allows. The way of working is the same in all four.", size=16, color=FG2, inset=0)

    statement("And they all [[hallucinate]].", meta="Right often enough to be useful. Wrong often enough not to be trusted.")

    s = new_slide(block=0)
    y = heading(s, "‘The greatest experiment in the history of medicine’", "CU Anschutz · 19 March 2026", block=0, size=26)
    picture(s, ROOT / "assets/block-00/wachter-article.jpg", M, y + Inches(0.1), Inches(6.2), Inches(4.65), border=RULE2)
    bx = M + Inches(6.5)
    bw = SW - M - bx
    text(s, bx, y + Inches(0.2), bw, Inches(1.8),
         "“I think we are in the early stages of probably the greatest experiment in the history of medicine.”",
         size=22, color=BRAND, bold=True, inset=0, italic=True)
    text(s, bx, y + Inches(2.1), bw, Inches(0.8), "Robert Wachter, MD · UCSF\nInterviewed by Tayler Shaw, Department of Medicine, CU Anschutz",
         size=13, color=FG2, inset=0)
    text(s, bx, y + Inches(3.0), bw, Inches(0.8), "Right often enough to be useful.\nWrong often enough not to be trusted.",
         size=16, color=FG, bold=True, inset=0)
    text(s, bx, y + Inches(3.9), bw, Inches(0.7),
         "Hear it in his own voice: instagram.com/reels/DVrUy7okp2N\nArticle: news.cuanschutz.edu/department-of-medicine/artificial-intelligence-health-care-impact",
         size=10, color=FG3, inset=0)

    statement("We are not here to pick a brand.\nWe are here to learn a way of working.", meta="First: two seats at the same desk.")

    s = new_slide(block=0)
    y = heading(s, "Chat versus Cowork", "claude.ai", block=0)
    cw = (SW - 2 * M - Inches(0.4)) / 2
    for i, (name, job, pts, pick) in enumerate([
        ("Chat", "A conversation in the window.", ["You type. It answers.", "Attach a file if you need one.", "Good for thinking, a draft, a quick check."], False),
        ("Cowork", "You pick a folder on your computer.", ["It can read and write those files.", "A report, a protocol, a set of slides.", "Like a colleague at your desk, not a chat box."], True),
    ]):
        cx = M + i * (cw + Inches(0.4))
        rrect(s, cx, y + Inches(0.1), cw, Inches(3.5), WHITE, BRAND if pick else RULE2, 0.08, lw=Pt(2) if pick else Pt(0.75))
        text(s, cx + Inches(0.3), y + Inches(0.3), cw - Inches(0.6), Inches(0.5), name, size=26, color=BRAND, bold=True, inset=0)
        text(s, cx + Inches(0.3), y + Inches(0.85), cw - Inches(0.6), Inches(0.4), job, size=15, color=FG2, inset=0, italic=True)
        bullets(s, cx + Inches(0.3), y + Inches(1.4), cw - Inches(0.6), Inches(2.0), pts, size=16)
    text(s, M, y + Inches(3.85), SW - 2 * M, Inches(0.5), "Same model. Different job.", size=22, color=MAGENTA, bold=True,
         align=PP_ALIGN.CENTER, inset=0)

    s = new_slide(block=0)
    y = heading(s, "What actually changes", "Chat versus Cowork", block=0)
    rows = [["", "Chat", "Cowork"],
            ["Files stay on your computer", "No — you attach them", "Yes — they stay in the folder"],
            ["File size limit", "Upload cap", "No upload cap"],
            ["Data still goes to Anthropic", "Yes", "Yes"],
            ["Rules so PHI does not leave", "Too late — you already pasted it", "Possible. Needs work."],
            ["Organizing a project", "One long chat", "A folder. Easier."],
            ["Skills and extra tools", "In the window", "Easier to import and use"],
            ["Work from anywhere", "Everywhere", "Everywhere"]]
    fills = {(1, 2): BG2, (2, 2): BG2, (5, 2): BG2, (6, 2): BG2, (3, 1): WARN_BG, (3, 2): WARN_BG}
    table(s, M, y + Inches(0.1), SW - 2 * M, [3, 3, 3], rows, size=14, row_h=Inches(0.5), first_col_bold=True, cell_fills=fills)

    s = new_slide(block=0)
    y = heading(s, "The same switch, on the screen", "claude.ai home", block=0)
    picture(s, ROOT / "assets/block-00/claude-cowork.png", M, y, SW - 2 * M, BOTTOM - y - Inches(0.1), border=RULE2)


# ---------------------------------------------------------------- block 1
def block1():
    section(1, "Prompting\nlike a guru", "Build the prompt in four pieces: role, context, constraints, format.")

    s = new_slide(block=1)
    y = heading(s, "6-year-old — fever on day 10", "Synthetic case · not a real patient", block=1)
    pill(s, M, y + Inches(0.05), "SYNTHETIC CASE", BG2, BRAND_DARK, 10, Inches(1.5))
    pill(s, M + Inches(1.65), y + Inches(0.05), "NOT A REAL PATIENT", WARN_BG, WARN_FG, 10, Inches(1.8))
    bullets(s, M, y + Inches(0.5), Inches(7), Inches(2.6), [
        "B-ALL, day 10 after intensification. Tunneled central line.",
        "Temperature 38.8 °C at home for 2 hours. ANC this morning: 80 /µL.",
        "Penicillin allergy (rash). Parents ask: can we wait for the morning clinic?",
    ], size=19, space_after=10)
    rrect(s, M + Inches(7.5), y + Inches(0.1), SW - 2 * M - Inches(7.5), Inches(3.0), BG2, None, 0.1)
    text(s, M + Inches(7.75), y + Inches(0.25), SW - 2 * M - Inches(8.0), Inches(2.7), [
        ("THE JOB", {"size": 10, "color": BRAND_DARK, "bold": True}),
        ("Write a note the parents can take home about tonight.", {"size": 18, "color": FG, "bold": True}),
        ("The same request, sent four ways. Each piece you add changes the answer.", {"size": 13, "color": FG2}),
    ], inset=0)
    phi_line(s)

    s = new_slide(block=1)
    y = heading(s, "Four pieces. Add them one at a time.", "The prompt", block=1)
    pieces = [
        ("Role", "You are a pediatric oncology nurse writing for a parent who finished primary school."),
        ("Context", "Synthetic case (not a real patient): 6-year-old, B-ALL, day 10 after intensification · tunneled central line · fever 38.8 °C at home for 2 hours · ANC this morning 80 /µL · penicillin allergy (rash) · the child is coming to the unit now; the parents asked if they could wait until morning clinic."),
        ("Constraints", "Do not invent citations · do not use a patient name · grade 6 reading level · this is teaching, not a discharge order · do not tell them they can wait at home."),
        ("Format", "A short note they can keep: 1) what is happening · 2) what we will do tonight · 3) what they should watch for · 4) one sentence they can repeat to family."),
    ]
    cw = (SW - 2 * M - Inches(0.25)) / 2
    ch = Inches(2.15)
    for i, (t, body) in enumerate(pieces):
        cx = M + (i % 2) * (cw + Inches(0.25))
        cy = y + (i // 2) * (ch + Inches(0.2))
        card(s, cx, cy, cw, ch, title=t, body=body, badge=str(i + 1), badge_fill=rgb(BLOCK[1][0]), tsize=17, bsize=13)

    s = new_slide(block=1)
    y = heading(s, "What comes back", "Same case · the pieces change the answer", block=1)
    cw = (SW - 2 * M - Inches(0.3)) / 2
    chat(s, M, y, cw, Inches(1.55), "NO PIECES — just the job",
         "Your child has a fever after chemotherapy. Give paracetamol and bring them to the morning clinic if they are otherwise well. A 2019 Smith review found most of these episodes settle at home.", "model-off", 13)
    text(s, M, y + Inches(1.6), cw, Inches(0.5), "Wrong advice, invented citation, no facts. This is the lazy answer.", size=12, color=RED, bold=True, inset=0)
    chat(s, M, y + Inches(2.2), cw, Inches(1.75), "ROLE + CONTEXT + CONSTRAINTS",
         "Your child has a fever and a very low white-cell count, and they have a central line. That combination is treated as urgent. We want them on the unit tonight, not at home until morning. We will take blood tests and start antibiotics that are safe with the penicillin rash. I am not quoting a paper; we will follow the unit protocol.", "model", 12)
    cx = M + cw + Inches(0.3)
    chat(s, cx, y, cw, Inches(3.95), "ALL FOUR PIECES",
         "**What is happening.** Your child has a fever and a very low infection-fighting count. They also have a central line. We treat that as urgent.\n\n**What we will do tonight.** Come to the unit now. We will take blood, look at the line, and start antibiotics that are safe with the penicillin rash.\n\n**What to watch for.** New shivering, looking much more tired, fast breathing, or a red line site — tell the nurse at once.\n\n**One sentence for family.** “Fever with a low count and a line means we come in tonight, not in the morning.”\n\nThis is a teaching note, not a discharge order.", "model", 12)
    text(s, cx, y + Inches(4.0), cw, Inches(0.5), "Correct, safe, and in the shape the family can keep.", size=12, color=GREEN, bold=True, inset=0)
    phi_line(s)


# ---------------------------------------------------------------- block 2
def block2():
    section(2, "Reading the\nliterature", "One guideline, five outputs: NotebookLM, infographic, video, artifact, mermaid.")

    s = new_slide(block=2)
    y = heading(s, "One paper for the whole block", "The source", block=2)
    rrect(s, M, y + Inches(0.1), SW - 2 * M, Inches(1.7), WHITE, RULE2, 0.08)
    pill(s, M + Inches(0.3), y + Inches(0.3), "JCO 2023", BG2, BRAND_DARK, 10, Inches(1.0))
    text(s, M + Inches(0.3), y + Inches(0.7), SW - 2 * M - Inches(0.6), Inches(0.5),
         "Guideline for the Management of Fever and Neutropenia in Pediatric Patients With Cancer and HCT Recipients: 2023 Update",
         size=17, color=FG, bold=True, inset=0)
    text(s, M + Inches(0.3), y + Inches(1.25), SW - 2 * M - Inches(0.6), Inches(0.4),
         "Lehrnbecher et al. · J Clin Oncol. 2023;41(9):1774-1785 · doi 10.1200/JCO.22.02224", size=13, color=FG2, inset=0)
    steps = [("Paper", "Open the PDF."), ("Upload", "New NotebookLM notebook."), ("Notebook", "Ask it questions."),
             ("Infographic", "Studio → Infographic."), ("Video", "Studio → Video overview."),
             ("Artifact", "Claude + paper-to-artifact skill."), ("Mermaid", "Claude + mermaid connector.")]
    cw = (SW - 2 * M - 6 * Inches(0.15)) / 7
    for i, (t, b) in enumerate(steps):
        cx = M + i * (cw + Inches(0.15))
        card(s, cx, y + Inches(2.2), cw, Inches(1.6), title=t, body=b, badge=str(i + 1), badge_fill=rgb(BLOCK[2][0]), tsize=13, bsize=11, pad=0.12)
    text(s, M, y + Inches(4.0), SW - 2 * M, Inches(0.5), "Same guideline every time. Only the output changes.", size=16, color=FG2, inset=0)
    phi_line(s)

    s = new_slide(block=2)
    y = heading(s, "NotebookLM — before and after the PDF is in", "Steps 2 and 3", block=2)
    cw = (SW - 2 * M - Inches(0.3)) / 2
    text(s, M, y, cw, Inches(0.3), "NEW NOTEBOOK", size=10, color=FG2, bold=True, inset=0)
    picture(s, ROOT / "assets/block-02/notebooklm-empty.png", M, y + Inches(0.3), cw, Inches(3.9), border=RULE2)
    text(s, M + cw + Inches(0.3), y, cw, Inches(0.3), "AFTER THE GUIDELINE IS LOADED", size=10, color=FG2, bold=True, inset=0)
    picture(s, ROOT / "assets/block-02/notebooklm-loaded.png", M + cw + Inches(0.3), y + Inches(0.3), cw, Inches(3.9), border=RULE2)
    text(s, M, y + Inches(4.3), SW - 2 * M, Inches(0.5), "Ask it the question you argue about on the ward. The answer cites the page.", size=14, color=FG2, inset=0)

    s = new_slide(block=2)
    y = heading(s, "Studio → Infographic", "Step 4", block=2)
    picture(s, ROOT / "assets/block-02/infographic.jpg", M, y, SW - 2 * M, BOTTOM - y - Inches(0.1), border=RULE2)

    s = new_slide(block=2)
    y = heading(s, "Studio → Video overview, then paper → artifact", "Steps 5 and 6", block=2)
    cw = (SW - 2 * M - Inches(0.3)) / 2
    rrect(s, M, y, cw, Inches(4.3), BG2, None, 0.1)
    text(s, M + Inches(0.3), y + Inches(0.3), cw - Inches(0.6), Inches(0.3), "VIDEO OVERVIEW", size=10, color=BRAND_DARK, bold=True, inset=0)
    text(s, M + Inches(0.3), y + Inches(0.65), cw - Inches(0.6), Inches(2.6), [
        ("NotebookLM turned the same guideline into a short explainer video.", {"size": 17, "bold": True}),
        ("It opens on Google’s site; the companion page links to it. Play it from the site if the network allows.", {"size": 13, "color": FG2}),
        ("Same source. Different medium for a different learner.", {"size": 13, "color": FG2}),
    ], inset=0)
    cx = M + cw + Inches(0.3)
    text(s, cx, y, cw, Inches(0.3), "CLAUDE — PAPER TO ARTIFACT", size=10, color=FG2, bold=True, inset=0)
    picture(s, ROOT / "assets/block-02/artifact.png", cx, y + Inches(0.3), cw, Inches(2.8), border=RULE2)
    text(s, cx, y + Inches(3.2), cw, Inches(1.1),
         "The prompt: “convert this paper to an artifact using the paper-to-artifact skill.” The result is a clickable explainer of the 2023 algorithm — open it from the Block 2 page on the site.",
         size=13, color=FG2, inset=0)

    s = new_slide(block=2)
    y = heading(s, "Mermaid connector — the algorithm as a diagram", "Step 7", block=2)
    picture(s, ROOT / "assets/block-02/mermaid-prompt.png", M, y, Inches(5.6), Inches(1.9), border=RULE2)
    text(s, M, y + Inches(2.0), Inches(5.6), Inches(2.3),
         "The prompt: “convert to a mermaid diagram using the mermaid connector.” The site draws it live. The boxes on the right are the same flow, drawn by hand.",
         size=13, color=FG2, inset=0)
    # hand-drawn flow of the FN algorithm
    fx = M + Inches(6.0)
    fw = SW - M - fx
    nodes = [
        ("Fever and neutropenia", BG2), ("Blood cultures from every CVC lumen", WHITE),
        ("Unstable? → antibiotics now. Stable? → empiric antibiotics after cultures", WHITE),
        ("Validated risk rule: high-risk → antipseudomonal monotherapy · low-risk → consider outpatient / oral", WHITE),
        ("48 hours: well, afebrile 24 h, cultures negative?", WHITE),
        ("Marrow recovery → stop · low-risk → consider stop · high-risk → no recommendation · fever to 96 h → IFD pathway", PINK_BG),
    ]
    ny = y
    nh = Inches(0.56)
    for i, (label, fill) in enumerate(nodes):
        text(s, fx, ny, fw, nh, label, size=11, color=FG, bold=(i == 0), align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE,
             fill=fill, line=RULE2, radius=0.15, inset=0.06)
        if i < len(nodes) - 1:
            a = slide_arrow_down(s, fx + fw / 2 - Inches(0.1), ny + nh, Inches(0.2), Inches(0.14))
        ny += nh + Inches(0.14)
    phi_line(s)


def slide_arrow_down(s, x, y, w, h):
    a = s.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, x, y, w, h)
    _fill(a, RULE)
    _line(a, None)
    a.shadow.inherit = False
    return a


# ---------------------------------------------------------------- block 3
def block3():
    section(3, "Skills —\nyour house style", "A skill is a prompt you save once and run with /name. Build one. Find a stats library. Open the calculator.")

    s = new_slide(block=3)
    y = heading(s, "What a skill is", "On Claude.ai — no paid plan", block=3)
    bullets(s, M, y + Inches(0.1), Inches(7.2), Inches(3.4), [
        "Sidebar → **Customize** → **Skills**.",
        "A skill is a Markdown file: a prompt, plus a short header that names it.",
        "Simple ones are only text. Fancier ones can carry a bit of code, the way an annual-report skill can run a table.",
        "Either way, it is a saved briefing, not a new product.",
        "Long prompts do not sit in every chat. They load only when you trigger them. That is why twenty skills do not drown one conversation.",
    ], size=17, space_after=9)
    steps = ["What", "Ask", "File", "Test", "Run", "Everywhere", "Share"]
    cx = M + Inches(7.7)
    rrect(s, cx, y + Inches(0.1), SW - M - cx, Inches(3.5), BG2, None, 0.1)
    text(s, cx + Inches(0.25), y + Inches(0.25), Inches(4), Inches(0.3), "THE PATH THIS BLOCK FOLLOWS", size=10, color=BRAND_DARK, bold=True, inset=0)
    for i, st in enumerate(steps):
        num_badge(s, cx + Inches(0.25), y + Inches(0.65 + i * 0.4), str(i + 1), rgb(BLOCK[3][0]), Inches(0.32), 11)
        text(s, cx + Inches(0.7), y + Inches(0.63 + i * 0.4), Inches(3.5), Inches(0.35), st, size=15, color=FG, bold=True, inset=0, anchor=MSO_ANCHOR.MIDDLE)
    takehome(s, "A skill is your SOP written once, applied every time.")

    s = new_slide(block=3)
    y = heading(s, "Create with Claude — paste this", "Plus → Create skill → Create with Claude", block=3)
    chat(s, M, y + Inches(0.1), SW - 2 * M, Inches(1.9), "YOU",
         "Given a long email or WhatsApp thread among our childhood-cancer team — consultant, registrar, CNC, pharmacist — summarize the main points, list action items by role, and draft a reply in our unit voice. Do not invent patients, labs, or decisions. What else should I clarify?", "you", 15)
    bullets(s, M, y + Inches(2.3), SW - 2 * M, Inches(1.8), [
        "The last sentence stops it guessing. It will ask you questions before it writes.",
        "When it asks about triggers: pick the **slash name**. Auto-detect is getting better. Slash is what you can trust.",
        "If it keeps asking questions, say “Create the skill.”",
    ], size=16, space_after=8)

    s = new_slide(block=3)
    y = heading(s, "Front matter, then the prompt", "The file Claude wrote", block=3)
    code(s, M, y + Inches(0.05), Inches(7.6), Inches(4.6), [
        ("---", {"color": WARN_FG}), ("name: ward-thread", {"color": WARN_FG}),
        ("description: Summarize a team thread, list actions by role, draft a reply in unit voice.", {"color": WARN_FG}),
        ("---", {"color": WARN_FG}),
        "You are helping a pediatric oncology clinician catch up on a long thread.", "",
        "Rules:", "- Use only what is in the thread. If a lab or decision is missing, say so.",
        "- No real names, MRNs, or dates of birth in the output.",
        "- Voice: short sentences, no \"I hope this email finds you well.\"",
        "- End with action items grouped as Consultant / Registrar / CNC / Pharmacy.", "",
        "Output:", "1. Five-line summary", "2. Action items",
        "3. Two draft replies — one to the team, one the CNC can send to the family",
    ], size=11)
    bx = M + Inches(7.9)
    bullets(s, bx, y + Inches(0.1), SW - M - bx, Inches(4.5), [
        "The yellow block at the top is the label. The rest is the briefing.",
        "Claude only loads this file when the skill is on.",
        "The real work is the feedback you type next. “Do not sign off with Best” is a skill update, not a new skill.",
        "Save skill. Three dots → **Try in chat**. Type ``/ward-thread``, paste the thread, send.",
    ], size=15, space_after=10)

    s = new_slide(block=3)
    y = heading(s, "Test on a synthetic thread", "Not a real patient", block=3)
    cw = (SW - 2 * M - Inches(0.3)) / 2
    rrect(s, M, y, cw, Inches(4.3), rgb("#E7F6EC"), None, 0.1)
    text(s, M + Inches(0.25), y + Inches(0.15), cw - Inches(0.5), Inches(0.3), "WHATSAPP — NIGHT REGISTRAR, CNC, PHARMACY", size=10, color=GREEN, bold=True, inset=0)
    text(s, M + Inches(0.25), y + Inches(0.5), cw - Inches(0.5), Inches(3.7), [
        "**Registrar:** 6 yo B-ALL, day 10, fever 38.8 at home 2 h, line in, ANC 80 this morning. Parents ask to wait until clinic.",
        "**CNC:** I can call them now. Do we bring them in tonight?",
        "**Pharmacy:** penicillin rash on file. Confirm if we still use our FN first-line.",
        "**Consultant:** do not wait. Cultures, then antibiotics. I will see them in ER.",
    ], size=14, inset=0, space_after=8)
    cx = M + cw + Inches(0.3)
    chat(s, cx, y, cw, Inches(4.3), "/WARD-THREAD — WHAT CAME BACK",
         "**Summary.** High-risk FN. Family wanted to wait. Team agrees: come in now, cultures, then first-line covering the rash.\n\n**Actions.** Consultant — ER. Registrar — cultures, then antibiotics. CNC — call the family. Pharmacy — first-line that respects the rash.\n\n**Draft to family.** Please come to ER tonight. We need cultures and antibiotics the same evening. This is the safe plan after a fever on treatment.", "model", 13)
    phi_line(s, "Never paste a real patient thread — names, MRNs, photos — into a consumer AI tool.")

    s = new_slide(block=3)
    y = heading(s, "One skill, three places", "Chat, Cowork, Claude Code", block=3)
    cw = (SW - 2 * M - Inches(0.5)) / 3
    for i, (t, b) in enumerate([
        ("Chat", "Slash, paste the thread, go. Install Claude Desktop and the same skill is already there. You do not install it three times."),
        ("Cowork", "Point it at a local folder — unit SOP, house voice, last month’s report. The skill can use that folder as context."),
        ("Claude Code", "Skills live in .claude/skills/ward-thread/. Download from the web app as a zip, drop in that folder, start a new session. Global skills are for every project on your laptop. Project skills stay with the folder you share."),
    ]):
        card(s, M + i * (cw + Inches(0.25)), y + Inches(0.1), cw, Inches(2.6), title=t, body=b, badge=str(i + 1), badge_fill=rgb(BLOCK[3][0]), tsize=18, bsize=13)
    y2 = y + Inches(2.95)
    text(s, M, y2, SW - 2 * M, Inches(0.3), "FOUR WAYS TO SHARE — ONE TO AVOID", size=11, color=rgb(BLOCK[3][0]), bold=True, inset=0)
    rows = [["Way", "What happens"],
            ["Zip file", "Works once. Then you have two copies. The next edit splits the team."],
            ["Organization skills", "Claude Team or Enterprise. Admin uploads once. Everyone can run it. They cannot edit it."],
            ["Shared folder", "Cowork on a synced drive, plus a CLAUDE.md that points at the skills. Fiddly. Useful with no Team plan."],
            ["Git", "Skills are text. Version history means you can undo the edit that made it worse."]]
    table(s, M, y2 + Inches(0.35), SW - 2 * M, [2, 8], rows, size=12, row_h=Inches(0.36), first_col_bold=True,
          cell_fills={(1, 0): rgb("#FDECEA"), (1, 1): rgb("#FDECEA")})

    s = new_slide(block=3)
    y = heading(s, "Four skills you can take home", "Download the .skill file from the site → Customize → Skills → Upload a skill", block=3, size=26)
    cw = (SW - 2 * M - Inches(0.75)) / 4
    for i, (t, b) in enumerate([
        ("paper-to-artifact", "Turns a paper into a clickable explainer — the same move as the fever-and-neutropenia artifact in Block 2."),
        ("peer-review", "A structured review of a manuscript or grant: methods, statistics, and reporting checklists such as CONSORT or STROBE."),
        ("prd-builder", "Turns messy notes or a meeting transcript into a product requirements document — clinical or generic."),
        ("scientific-writing", "Drafts a paper, review, or grant with real citations, instead of a generic chat reply."),
    ]):
        cx = M + i * (cw + Inches(0.25))
        card(s, cx, y + Inches(0.1), cw, Inches(2.9), title=t, body=b, kicker="/" + t, kicker_color=rgb(BLOCK[3][0]), tsize=16, bsize=13)
        pill(s, cx + Inches(0.16), y + Inches(2.5), "Download .skill on the site", BG2, BRAND_DARK, 10, Inches(2.1))
    text(s, M, y + Inches(3.3), SW - 2 * M, Inches(0.8),
         "Same zip works in Claude Code if you drop the folder into .claude/skills/. Files are at aibedside.io → Block 3.", size=14, color=FG2, inset=0)

    s = new_slide(block=3)
    y = heading(s, "Find a skill the way you find a paper", "Search → library → ask → findings → artifact", block=3)
    text(s, M, y, Inches(6.2), Inches(0.3), "GOOGLE — SAME HABIT AS A LITERATURE SEARCH", size=10, color=FG2, bold=True, inset=0)
    code(s, M, y + Inches(0.32), Inches(6.2), Inches(0.5), "scientific agent skills github", size=14)
    text(s, M, y + Inches(0.95), Inches(6.2), Inches(1.3),
         "Skills live in public GitHub folders. You are not looking for an app to buy. Other searches that work: claude scientific skills, agent skills statistics, claude skills sample size.",
         size=13, color=FG2, inset=0)
    rrect(s, M, y + Inches(2.2), Inches(6.2), Inches(2.0), WHITE, RULE2, 0.08)
    text(s, M + Inches(0.25), y + Inches(2.35), Inches(5.7), Inches(0.3), "GITHUB", size=10, color=FG2, bold=True, inset=0)
    text(s, M + Inches(0.25), y + Inches(2.65), Inches(5.7), Inches(0.4), "Scientific Agent Skills", size=17, color=FG, bold=True, inset=0)
    text(s, M + Inches(0.25), y + Inches(3.05), Inches(5.7), Inches(1.1),
         "k-dense-ai/scientific-agent-skills · 164 skills · MIT · works with Claude, Cursor, Codex. Statistics, survival, papers, protocols. Do not install all 164. Ask which three you need.",
         size=12, color=FG2, inset=0)
    picture(s, ROOT / "assets/block-03/scientific-skills-github.png", M + Inches(6.6), y, SW - M - M - Inches(6.6), Inches(4.3), border=RULE2)

    s = new_slide(block=3)
    y = heading(s, "Ask Claude which statistics skills to install", "Paste the library link. Ask for a ranking, not a dump.", block=3)
    chat(s, M, y, Inches(5.8), Inches(3.2), "YOU",
         "I do pediatric oncology research. Look at https://github.com/k-dense-ai/scientific-agent-skills and tell me the best statistics skills to install first.\n\nI need:\n1. the right test for my data\n2. a sample size before I start a study\n3. survival analysis — EFS, OS, competing risks\n\nRank the top three and say why. Do not install everything.", "you", 13)
    picture(s, ROOT / "assets/block-03/stats-findings.png", M + Inches(6.1), y, SW - M - M - Inches(6.1), Inches(4.3), border=RULE2)
    text(s, M, y + Inches(3.35), Inches(5.8), Inches(1.0),
         "Then: “proceed with installation in this folder.” Twenty-six files land in .claude/skills/. They only load in that project unless you copy them to your global skills folder.",
         size=12, color=FG2, inset=0)

    s = new_slide(block=3)
    y = heading(s, "What Claude picked — install these three", "Not 164 skills. Three.", block=3)
    cw = (SW - 2 * M - Inches(0.5)) / 3
    for i, (t, b) in enumerate([
        ("statistical-analysis", "Picks the right test, checks assumptions first, reports effect size with the p-value. Stops you running a t-test on skewed data with n = 14."),
        ("statistical-power", "Answers “how many patients do I need?” before you start. Also the reverse: with this n, what is the smallest effect you could actually detect."),
        ("scikit-survival", "Survival with censoring handled properly. For this audience: EFS, OS, relapse with death as a competing risk."),
    ]):
        card(s, M + i * (cw + Inches(0.25)), y + Inches(0.1), cw, Inches(2.1), title=t, body=b, badge=str(i + 1), badge_fill=rgb(BLOCK[3][0]), tsize=16, bsize=13)
    picture(s, ROOT / "assets/block-03/stats-installed.png", M, y + Inches(2.4), SW - 2 * M, Inches(2.0), border=RULE2)

    s = new_slide(block=3)
    y = heading(s, "One skill, one artifact", "The skill did the formulas. You still own the protocol.", block=3)
    picture(s, ROOT / "assets/block-03/power-artifact-prompt.png", M, y, SW - 2 * M, Inches(1.5), border=RULE2)
    bullets(s, M, y + Inches(1.8), SW - 2 * M, Inches(2.0), [
        "The skill is installed. You do not re-explain statistics. You ask for the thing you need.",
        "Result: an interactive sample-size calculator, several study designs, written for someone who is not a statistician. It opens on Claude’s site — link on the Block 3 page.",
    ], size=16, space_after=8)
    takehome(s, "Search → pick a library → ask which three → run one. That is how a skill becomes a tool.")


# ---------------------------------------------------------------- block 4
def block4():
    section(4, "MCP — connect\nyour own work", "MCP is a USB port for AI. Show it first, then name the parts — on a childhood-cancer unit, not a sales database.")

    s = new_slide(block=4)
    y = heading(s, "One sentence, then stop", "What MCP is", block=4)
    text(s, M, y + Inches(0.05), SW - 2 * M, Inches(0.9),
         "MCP (Model Context Protocol) is a shared plug. It lets the chat model reach a file, a mailbox, or a spreadsheet — and [[do something]], not just talk about it.",
         size=22, color=FG, inset=0)
    # diagram: You → Chat → MCP → four connectors
    dy = y + Inches(1.3)
    bw = Inches(2.2)
    bh = Inches(0.8)
    text(s, M, dy + Inches(1.0), bw, bh, "You, in the chat", size=15, color=FG, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, fill=BG2, radius=0.15)
    arrow(s, M + bw + Inches(0.1), dy + Inches(1.26), Inches(0.5))
    text(s, M + bw + Inches(0.7), dy + Inches(1.0), bw, bh, "Claude · ChatGPT · Gemini", size=14, color=FG, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, fill=WHITE, line=RULE2, radius=0.15)
    arrow(s, M + 2 * bw + Inches(0.8), dy + Inches(1.26), Inches(0.5))
    text(s, M + 2 * bw + Inches(1.4), dy + Inches(0.95), Inches(1.3), Inches(0.9), "MCP", size=22, color=WHITE, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, fill=rgb(BLOCK[4][0]), radius=0.2)
    conns = ["Drive — protocols", "Gmail — drafts", "Calendar — tumour board", "Unit log — FN list"]
    cx = M + 2 * bw + Inches(3.3)
    for i, c in enumerate(conns):
        cy = dy + i * Inches(0.72)
        arrow(s, cx - Inches(0.55), cy + Inches(0.17), Inches(0.45), Inches(0.24))
        text(s, cx, cy, Inches(3.2), Inches(0.58), c, size=14, color=FG, bold=True, anchor=MSO_ANCHOR.MIDDLE, fill=WHITE, line=RULE2, radius=0.2, inset=0.15)
    text(s, M, dy + Inches(3.05), SW - 2 * M, Inches(1.0),
         "Before USB-C, every camera had its own cable. Before MCP, every hospital tool needed its own custom hook-up. One plug shape now works across brands. Anthropic published it. OpenAI put it in ChatGPT. Google is doing the same with Gemini. You do not pick a vendor to use the idea.",
         size=13, color=FG2, inset=0)

    s = new_slide(block=4)
    y = heading(s, "Same question, no plug", "You open ordinary ChatGPT — nothing connected — and ask about your ward.", block=4)
    chat(s, M, y + Inches(0.1), SW - 2 * M, Inches(0.95), "YOU",
         "How many febrile neutropenia admissions did our unit have in August, and how many were high-risk?", "you", 15)
    chat(s, M, y + Inches(1.25), SW - 2 * M, Inches(1.6), None,
         "I don’t have access to your hospital records. If you paste the table or describe the columns, I can tally it. In general, fever during neutropenia is an emergency: high-risk children should get antibiotics quickly, and…", "model-off", 15)
    text(s, M, y + Inches(3.1), SW - 2 * M, Inches(1.0),
         "That answer is not wrong. It is a textbook. It has never seen your list. Here it is the FN log it cannot read.",
         size=17, color=FG, inset=0)

    s = new_slide(block=4)
    y = heading(s, "Same question, unit log connected", "A read-only connector to a synthetic FN log — a spreadsheet, not a live EMR", block=4)
    chat(s, M, y + Inches(0.05), Inches(5.6), Inches(0.9), "TOOL — UNIT-LOG CONNECTOR",
         "Read-only query: count August episodes, split by high-risk vs low-risk.   [Continue]", "tool", 11)
    chat(s, M, y + Inches(1.05), Inches(5.6), Inches(2.4), "CLAUDE — CONNECTED",
         "Six episodes in August. Four high-risk, all admitted. Two low-risk, both outpatient. The 6-year-old with B-ALL on day 10 is in this list — penicillin rash, house alternative used. Median door-to-antibiotic in the extract: 41 minutes.", "model", 13)
    text(s, M, y + Inches(3.55), Inches(5.6), Inches(0.9),
         "The model asks to run a lookup. You click Continue. Then it answers from the rows — and you can check the table.", size=13, color=FG2, inset=0)
    tx = M + Inches(5.9)
    tw = SW - M - tx
    pill(s, tx, y, "SYNTHETIC UNIT LOG · NOT KHCC DATA · NOT A REAL PATIENT", WARN_BG, WARN_FG, 9, Inches(4.2))
    rows = [["Date", "Age", "Diagnosis", "ANC", "Line", "Risk", "Door-to-abx"],
            ["3 Aug", "6", "B-ALL, day 10", "80", "Yes", "High — admitted", "38 min"],
            ["7 Aug", "14", "Osteosarcoma, cycle 3", "420", "No", "Low — outpatient", "55 min"],
            ["12 Aug", "4", "AML", "40", "Yes", "High — admitted", "29 min"],
            ["18 Aug", "9", "Burkitt", "210", "Yes", "High — admitted", "44 min"],
            ["22 Aug", "11", "Hodgkin", "580", "No", "Low — outpatient", "62 min"],
            ["28 Aug", "3", "Neuroblastoma", "90", "Yes", "High — admitted", "41 min"]]
    table(s, tx, y + Inches(0.4), tw, [1.1, 0.7, 2.4, 0.8, 0.7, 2.0, 1.4], rows, size=10, row_h=Inches(0.42), head_fill=rgb(BLOCK[4][0]))

    s = new_slide(block=4)
    y = heading(s, "Three names, then stop", "Client, server, protocol — on the ward they are just:", block=4)
    text(s, M, y + Inches(0.2), Inches(3.2), Inches(1.0), "You type in the chat\nClaude · ChatGPT · Gemini", size=14, color=FG, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, fill=BG2, radius=0.15)
    arrow(s, M + Inches(3.3), y + Inches(0.56), Inches(0.5))
    text(s, M + Inches(3.9), y + Inches(0.2), Inches(1.6), Inches(1.0), "MCP plug", size=16, color=WHITE, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, fill=rgb(BLOCK[4][0]), radius=0.2)
    conns = [("Drive connector", "Protocol PDF"), ("Gmail connector", "Inbox"), ("Calendar connector", "Friday slot"), ("Unit-log connector", "FN spreadsheet")]
    cx = M + Inches(6.1)
    for i, (c, place) in enumerate(conns):
        cy = y + Inches(0.05) + i * Inches(0.66)
        arrow(s, cx - Inches(0.5), cy + Inches(0.16), Inches(0.4), Inches(0.24))
        text(s, cx, cy, Inches(2.8), Inches(0.55), c, size=13, color=FG, bold=True, anchor=MSO_ANCHOR.MIDDLE, fill=WHITE, line=RULE2, radius=0.2, inset=0.12)
        arrow(s, cx + Inches(2.9), cy + Inches(0.16), Inches(0.4), Inches(0.24))
        text(s, cx + Inches(3.4), cy, Inches(2.5), Inches(0.55), place, size=13, color=FG2, anchor=MSO_ANCHOR.MIDDLE, inset=0.12)
    text(s, M, y + Inches(2.9), SW - 2 * M, Inches(1.3),
         "Each connector talks to one place. The chat is not “inside” Drive. The connector is. That is why you can add Gmail tomorrow without rewriting the model. Below this walkthrough on the site is a list of medical plugs — PubMed, NICE, trials, imaging, even FHIR. Same idea. Different sockets.",
         size=14, color=FG2, inset=0)

    s = new_slide(block=4)
    y = heading(s, "What a connector is allowed to do", "Every connector advertises three kinds of thing. The model can only use what that connector listed.", block=4, size=26)
    cw = (SW - 2 * M - Inches(0.5)) / 3
    for i, (t, k, b) in enumerate([
        ("Tools", "Actions", "Look up the FN log. Search Drive for the protocol. Draft a Gmail. Book Room 4. Same idea as “run a SQL query” — except the jobs are ours."),
        ("Resources", "Things to read", "Last month’s census. The 2023 fever-and-neutropenia PDF. A de-identified extract. Read-only. Context, not a change."),
        ("Prompts", "Starter questions", "Saved briefs the connector offers: “Prep Friday tumour board from this week’s FN list.” You still send it. You still read the draft."),
    ]):
        card(s, M + i * (cw + Inches(0.25)), y + Inches(0.1), cw, Inches(2.5), title=t, body=b, kicker=k, kicker_color=rgb(BLOCK[4][0]), tsize=20, bsize=13)
    takehome(s, "A read-only FN log cannot discharge a child. If the Calendar connector cannot delete events, the model cannot cancel clinic. The list of tools is the list of verbs.", y=y + Inches(2.9))

    s = new_slide(block=4)
    y = heading(s, "Same question, two plugs — PubMed API versus PubMed MCP", "Same job: find the 2023 JCO fever and neutropenia guideline", block=4, size=24)
    cw = (SW - 2 * M - Inches(0.3)) / 2
    rrect(s, M, y, cw, Inches(3.6), WHITE, RULE2, 0.08)
    text(s, M + Inches(0.25), y + Inches(0.15), cw - Inches(0.5), Inches(0.3), "PUBMED API — BUILT FOR A PROGRAM", size=10, color=FG2, bold=True, inset=0)
    code(s, M + Inches(0.25), y + Inches(0.5), cw - Inches(0.5), Inches(1.75), [
        "GET eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
        "  ?db=pubmed&term=fever+neutropenia+pediatric+2023+Lehrnbecher",
        "  &retmode=json", "then efetch with the PMIDs  → XML / JSON"], size=10)
    text(s, M + Inches(0.25), y + Inches(2.35), cw - Inches(0.5), Inches(1.2),
         "You write code, or click the website. The machine speaks HTTP. Errors are status codes. A model can only use this if someone taught it the URL, the parameters, and how to parse the reply.",
         size=12, color=FG2, inset=0)
    cx = M + cw + Inches(0.3)
    rrect(s, cx, y, cw, Inches(3.6), WHITE, rgb(BLOCK[4][0]), 0.08, lw=Pt(1.5))
    text(s, cx + Inches(0.25), y + Inches(0.15), cw - Inches(0.5), Inches(0.3), "PUBMED MCP — BUILT FOR YOU AND THE MODEL", size=10, color=rgb(BLOCK[4][0]), bold=True, inset=0)
    code(s, cx + Inches(0.25), y + Inches(0.5), cw - Inches(0.5), Inches(1.75), [
        "You:  Find the 2023 JCO fever and neutropenia guideline.",
        "Tool: search_pubmed  query: fever neutropenia pediatric JCO 2023 Lehrnbecher",
        "[Continue] → PMID 36626595 · Lehrnbecher et al. J Clin Oncol 2023"], size=10)
    text(s, cx + Inches(0.25), y + Inches(2.35), cw - Inches(0.5), Inches(1.2),
         "You speak. You approve. The model fills in the tool. Errors come back as a sentence. The connector still calls Entrez; it just advertises tools with names the model can read, and a Continue button you can refuse.",
         size=12, color=FG2, inset=0)
    takehome(s, "Same core: NCBI Entrez under pubmed.gov, under every script, and under mcp-simple-pubmed. MCP is not a new PubMed. It is a plug that both a human and an LLM can hold.", y=y + Inches(3.8), h=Inches(0.65))

    s = new_slide(block=4)
    y = heading(s, "One sentence, three connectors", "Run one sentence across plugs you already have", block=4)
    chat(s, M, y + Inches(0.05), SW - 2 * M, Inches(0.95), "YOU",
         "Find the tumour-board template on Drive, draft Friday’s note from this week’s FN list, and put the meeting on my calendar Friday 08:00, Room 4.", "you", 15)
    steps = [("Drive", "Found Tumour-board-note-template.docx in the shared protocols folder."),
             ("Unit log", "Three high-risk FN this week, including the day-10 B-ALL with the penicillin rash."),
             ("Gmail", "Draft to the team — not sent. You read it the way you read a letter before you sign it."),
             ("Calendar", "Friday 08:00, Room 4, title: Paediatric tumour board.")]
    cw = (SW - 2 * M - Inches(0.75)) / 4
    for i, (t, b) in enumerate(steps):
        cx = M + i * (cw + Inches(0.25))
        card(s, cx, y + Inches(1.2), cw, Inches(2.2), title=t, body=b, badge=str(i + 1), badge_fill=rgb(BLOCK[4][0]), tsize=16, bsize=12)
        pill(s, cx + Inches(0.16), y + Inches(2.95), "Continue", BRAND, WHITE, 10, Inches(1.0))
    takehome(s, "Continue is the same habit as signing the order. The model proposes. You release it.", y=y + Inches(3.6), h=Inches(0.6))

    s = new_slide(block=4)
    y = heading(s, "The point, and the risk", "A connector works because it uses your login", block=4)
    text(s, M, y, SW - 2 * M, Inches(0.9),
         "If you can open the shared Drive, so can the model once the plug is in. If you can send mail as the unit, so can a Gmail connector — if you click Continue on send.",
         size=16, color=FG, inset=0)
    cw = (SW - 2 * M - Inches(0.3)) / 2
    card(s, M, y + Inches(1.05), cw, Inches(1.9), title="Fine on Monday", body="Claude or ChatGPT connected to a folder of public guidelines, or a synthetic / de-identified spreadsheet on your laptop.", fill=rgb("#E7F6EC"), line=None, tcolor=GREEN, bcolor=FG, tsize=18, bsize=14)
    card(s, M + cw + Inches(0.3), y + Inches(1.05), cw, Inches(1.9), title="Not this week", body="A live EMR, a pharmacy system, or anyone’s real inbox, plugged into a consumer chat. That is an IT project, not a conference demo.", fill=rgb("#FDECEA"), line=None, tcolor=RED, bcolor=FG, tsize=18, bsize=14)
    takehome(s, "A connector inherits your access — that is the point and the risk.", y=y + Inches(3.2), h=Inches(0.6))
    phi_line(s, "Never paste a real patient list — names, MRNs, dates of birth — into a consumer AI tool, even through a connector.")

    s = new_slide(block=4)
    y = heading(s, "Same question, two Claudes", "Live on the site: Claude Haiku 4.5 with and without the medical-terminologies plug", block=4, size=26)
    cw = (SW - 2 * M - Inches(0.3)) / 2
    chat(s, M, y + Inches(0.05), SW - 2 * M, Inches(0.8), "YOU — SENT TO BOTH PANES",
         "What is the ICD-11 code for febrile neutropenia, and the RxNorm name for the first-line antipseudomonal we would use with a penicillin rash?", "you", 13)
    chat(s, M, y + Inches(1.0), cw, Inches(2.0), "HAIKU — NO PLUG",
         "Recalls from memory. Gives a plausible-looking code and a drug name. No lookup happens. You cannot tell from the answer whether the code is current.", "model-off", 13)
    chat(s, M + cw + Inches(0.3), y + Inches(1.0), cw, Inches(2.0), "HAIKU + MEDICAL-TERMINOLOGIES MCP",
         "Calls a named tool for ICD-11 and one for RxNorm. Shows the tool call, then the answer built from what came back. You can open the same code in the source.", "model", 13)
    picture(s, ROOT / "assets/block-04/medical-terminologies-mcp.png", M, y + Inches(3.15), Inches(6.0), Inches(1.4), border=RULE2)
    text(s, M + Inches(6.3), y + Inches(3.15), SW - M - M - Inches(6.3), Inches(1.4),
         "One connector, seven code systems: ICD-11, LOINC, RxNorm, MeSH, ATC, CID-10, and SNOMED CT if you host it. github.com/SidneyBissoli/medical-terminologies-mcp. Watch which side looks a code up.",
         size=12, color=FG2, inset=0)

    s = new_slide(block=4)
    y = heading(s, "Medical MCP examples", "Community connectors, not a KHCC install list · catalogue: github.com/sunanhe/awesome-medical-mcp-servers", block=4, size=26)
    rows = [["Group", "Examples", "Try where?"],
            ["Literature and evidence", "mcp-simple-pubmed · pubmedmcp · mcp-pubmed-server · medrxiv-mcp-server · medadapt-content-server", "Your laptop"],
            ["Guidelines and decision support", "medical-terminologies-mcp (ICD-11, LOINC, RxNorm, MeSH, ATC) · chris-lovejoy/medical-mcp (NICE) · Medical_calculator_MCP · JamesANZ/medical-mcp (FDA, WHO, PubMed)", "Your laptop"],
            ["Records (FHIR, EMR)", "agentcare-mcp / langcare-mcp-fhir · wso2/fhir-mcp-server · openehr-mcp-server · FHIR care-plan toolkits", "IT, not a conference laptop"],
            ["Imaging and radiology", "dicom-mcp · dicom-mcp-server · mcp-slicer (3D Slicer)", "IT / PACS team"],
            ["Biomedical databases, trials, terms", "pascalwhoop/medical-mcps (100+ tools) · bio-mcp · clinicaltrialsgov-mcp-server · fhir-mcp-suite · Keragon (commercial)", "Public ones on a laptop"]]
    fills = {(3, 2): rgb("#FDECEA"), (4, 2): rgb("#FDECEA"), (1, 2): rgb("#E7F6EC"), (2, 2): rgb("#E7F6EC")}
    table(s, M, y + Inches(0.05), SW - 2 * M, [2.4, 7, 2], rows, size=11, row_h=Inches(0.62), first_col_bold=True, head_fill=rgb(BLOCK[4][0]), cell_fills=fills)
    text(s, M, y + Inches(3.85), SW - 2 * M, Inches(0.5),
         "Public literature plugs are the ones you can try on a laptop. Anything that touches an EMR, PACS, or real identifiers stays with IT.", size=13, color=FG2, inset=0)


# ---------------------------------------------------------------- block 5
def block5():
    section(5, "CLAUDE.md —\nthe kitchen contract", "Standing orders for a folder. Five policies in. A wiki and a quality review out.")

    s = new_slide(block=5)
    y = heading(s, "One picture, then the names", "The robot is not the point. The book on the left is.", block=5)
    picture(s, ROOT / "assets/block-05.5/kitchen.jpg", M, y, Inches(7.4), Inches(4.05), border=RULE2)
    bx = M + Inches(7.7)
    bw = SW - M - bx
    for i, (t, b, col) in enumerate([("The book", "CLAUDE.md — the contract. Standing orders read at the start of every session. You do not re-explain the job.", rgb(BLOCK[5][0])),
                                     ("The recipes", "Skills — Block 3.", rgb(BLOCK[3][0])),
                                     ("The appliances", "MCP — the plug, Block 4.", rgb(BLOCK[4][0])),
                                     ("The ingredients", "Whatever you drop in the folder.", FG2)]):
        card(s, bx, y + i * Inches(1.02), bw, Inches(0.92), title=t, body=b, badge=None, kicker=None, tsize=14, bsize=11, pad=0.12)
        rect(s, bx, y + i * Inches(1.02), Inches(0.08), Inches(0.92), col)

    s = new_slide(block=5)
    y = heading(s, "A short file, left in the project", "The whole brief: read the folder, make a wiki, write a summary. Do not invent a rule.", block=5, size=26)
    code(s, M, y + Inches(0.05), Inches(7.4), Inches(4.5), [
        ("# Cedar Ward — standing orders", {"bold": True}),
        "You are the unit's second brain for written policy.",
        "This folder is a teaching copy. It is not KHCC policy.", "",
        ("## When files land in policies/", {"bold": True}),
        "1. Read every document, including appendices.",
        "2. Convert each into one wiki note in wiki/.",
        "3. Link notes wherever they share a topic.",
        "4. Write summary.html for the quality committee.", "",
        ("## The summary must include", {"bold": True}),
        "- Inventory of the documents",
        "- Contradictions, with the quoted sentences",
        "- Errors, duplications, and suggestions",
        "- Who should own each fix", "",
        ("## Hard rules", {"bold": True}),
        "- Do not invent a rule that is not in the files.",
        "- If you are unsure, say so.",
        "- Never paste a real patient name or MRN.",
    ], size=11)
    bx = M + Inches(7.7)
    bullets(s, bx, y + Inches(0.1), SW - M - bx, Inches(4.4), [
        "Read at the start of every session — in Cowork or Claude Code.",
        "It names the job, the outputs, and the lines it must not cross.",
        "Skills are the recipes. MCP is the appliances. This is the book the chef follows every shift.",
        "Full file on the site: Block 5 → Open the full CLAUDE.md.",
    ], size=15, space_after=10)

    s = new_slide(block=5)
    y = heading(s, "Five policies, dropped in a folder", "Cedar Ward, Riverside Children’s Cancer Centre. Made up on purpose. They do not agree with each other.", block=5, size=26)
    pols = [("POL-CW-01", "Febrile neutropenia", "ID · Mar 2024 · ages 0–18"),
            ("POL-CW-02", "Central lines", "Vascular access · Jan 2026 · under 16"),
            ("POL-CW-03", "Visitors & isolation", "IPC · Jun 2023 · review overdue"),
            ("POL-CW-04", "Chemo safety", "Pharmacy · Nov 2025 · ages 0–21"),
            ("POL-CW-05", "Discharge fever leaflet", "Nursing education · ID has not signed")]
    cw = (SW - 2 * M - Inches(1.0)) / 5
    for i, (idn, t, meta) in enumerate(pols):
        card(s, M + i * (cw + Inches(0.25)), y + Inches(0.1), cw, Inches(1.7), title=t, body=meta, kicker=idn, kicker_color=rgb(BLOCK[5][0]), tsize=15, bsize=11)
    text(s, M, y + Inches(2.1), SW - 2 * M, Inches(0.3), "WHAT THE MODEL FOUND", size=11, color=rgb(BLOCK[5][0]), bold=True, inset=0)
    cw2 = (SW - 2 * M - Inches(0.75)) / 4
    for i, (t, b) in enumerate([("Three age bands", "0–18, under 16, 0–21. Which ward is this?"),
                                ("Two ANC cut-offs", "The policies disagree on who is neutropenic."),
                                ("Two first-line antibiotics", "Pharmacy and ID name different drugs."),
                                ("The leaflet says wait", "The family leaflet tells parents to wait until morning.")]):
        card(s, M + i * (cw2 + Inches(0.25)), y + Inches(2.45), cw2, Inches(1.5), title=t, body=b, fill=PINK_BG, line=None, tsize=14, bsize=12, tcolor=MAGENTA, bcolor=FG)

    s = new_slide(block=5)
    y = heading(s, "Second brain — one note per file, linked", "A wiki note is not a rewrite. It is the rules, the links, and the open questions.", block=5, size=26)
    # hub-and-spoke map: FN in the middle
    cx0, cy0 = M + Inches(3.3), y + Inches(1.75)
    spokes = [("Central lines", "Heparin rule disagrees with itself", -Inches(2.6), -Inches(1.25)),
              ("Visitors", "Review overdue · unlimited adults", Inches(2.6), -Inches(1.25)),
              ("Chemo safety", "Warm pack on doxorubicin", -Inches(2.6), Inches(1.25)),
              ("Discharge leaflet", "Links to the rule it undoes", Inches(2.6), Inches(1.25))]
    for t, b, dx, dy in spokes:
        ln = s.shapes.add_connector(1, cx0, cy0, cx0 + dx, cy0 + dy)
        ln.line.color.rgb = RULE
        ln.line.width = Pt(2)
        text(s, cx0 + dx - Inches(1.15), cy0 + dy - Inches(0.42), Inches(2.3), Inches(0.84), [(t, {"bold": True, "size": 13}), (b, {"size": 10, "color": FG2})],
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, fill=WHITE, line=RULE2, radius=0.3, space_after=0)
    hub = text(s, cx0 - Inches(1.1), cy0 - Inches(0.45), Inches(2.2), Inches(0.9), "Febrile neutropenia\nthe hub", size=13, color=WHITE, bold=True,
               align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, fill=rgb(BLOCK[5][0]), radius=0.5)
    bx = M + Inches(7.3)
    bw = SW - M - bx
    bullets(s, bx, y + Inches(0.1), bw, Inches(2.0), [
        "Dark dots are notes. Pale dots are the files they came from.",
        "Febrile neutropenia sits in the middle because every other note argues with it.",
        "On the site the map is clickable — a dot opens the file.",
    ], size=14, space_after=8)
    card(s, bx, y + Inches(2.1), bw, Inches(1.5), title="The file the committee actually opens", kicker="summary.html", kicker_color=rgb(BLOCK[5][0]),
         body="Not a chat reply. A briefing: inventory, quoted contradictions, errors, duplications, and who should fix what. First screen: the family leaflet next to the ID rule.", tsize=14, bsize=11)
    takehome(s, "A skill is a recipe. MCP is a plug. CLAUDE.md is the standing orders for the folder. That is how a drop of policies becomes a wiki and a quality review, instead of another chat you cannot find next week.", h=Inches(0.75))


# ---------------------------------------------------------------- block 6
def block6():
    section(6, "Small models\n& the edge", "Four places a model can live. Fine-tune here. Federate across hospitals — scans never leave.")

    s = new_slide(block=6)
    y = heading(s, "Where does the program sit when you send it a note?", "Four places. Far to near.", block=6, size=26)
    places = [("1 · Public cloud", "Large model on the cloud, via a connector API", "Notes leave the hospital", "ChatGPT, Claude, Gemini in the browser. Usually no hospital contract.", RED),
              ("2 · Contracted cloud", "Large model, HIPAA path with a BAA", "Notes leave — under contract", "Azure OpenAI, AWS Bedrock, Google Vertex through a private encrypted link.", rgb("#E65100")),
              ("3 · Hospital servers", "Large model on-premise", "Notes stay inside the walls", "Computers in the hospital’s own data centre. You own the box, so you own the rules.", rgb("#0277BD")),
              ("4 · On this device", "Small model on the edge (1–8B)", "Notes stay on this laptop", "Small enough for a laptop, a phone, a browser tab. Compute stays where the notes already are.", GREEN)]
    cw = (SW - 2 * M - Inches(0.75)) / 4
    for i, (t, sub, flag, body, col) in enumerate(places):
        cx = M + i * (cw + Inches(0.25))
        rrect(s, cx, y + Inches(0.1), cw, Inches(3.2), WHITE, RULE2, 0.08)
        rect(s, cx, y + Inches(0.1), cw, Inches(0.1), col)
        text(s, cx + Inches(0.2), y + Inches(0.3), cw - Inches(0.4), Inches(0.4), t, size=17, color=FG, bold=True, inset=0)
        text(s, cx + Inches(0.2), y + Inches(0.72), cw - Inches(0.4), Inches(0.6), sub, size=12, color=FG2, inset=0)
        pill(s, cx + Inches(0.2), y + Inches(1.4), flag, col, WHITE, 9, cw - Inches(0.4))
        text(s, cx + Inches(0.2), y + Inches(1.85), cw - Inches(0.4), Inches(1.4), body, size=12, color=FG2, inset=0)
    text(s, M, y + Inches(3.5), SW - 2 * M, Inches(0.9),
         "A BAA (Business Associate Agreement) is a contract that says the vendor must protect patient information the way the hospital must. HIPAA is the US name. Outside the US you still want the same kind of contract under your own law.",
         size=12, color=FG2, inset=0)

    s = new_slide(block=6)
    y = heading(s, "Pros and cons, square by square", "Small and local for the routine and the sensitive; large and remote for the difficult.", block=6, size=26)
    rows = [["", "Pros", "Cons"],
            ["1 · Public cloud", "Strongest models, ready this afternoon · nothing to install; connectors to Drive, mail, PubMed · cheap to try", "Patient notes leave the hospital · consumer terms, no BAA · needs the internet"],
            ["2 · Contracted cloud", "Large-model quality with a legal contract · encrypted, logged, access-controlled · IT can switch it off for a unit", "Notes still leave the building, to a named vendor · needs IT, money, and months · not a conference-laptop demo"],
            ["3 · Hospital servers", "Data never leaves the hospital · you set who can use it · keeps working if the public internet is down", "GPUs and staff cost real money · usually a step behind ChatGPT · hard for a small unit to own alone"],
            ["4 · On this device", "Notes never leave this device · works with the wi-fi off · no per-token bill; answers the sovereignty question", "Weaker at hard, open-ended questions · best at narrow jobs, not a second opinion · first download is large — cache it before you demo"]]
    table(s, M, y + Inches(0.05), SW - 2 * M, [2.2, 5, 5], rows, size=11, row_h=Inches(0.85), first_col_bold=True, head_fill=rgb(BLOCK[6][0]))

    s = new_slide(block=6)
    y = heading(s, "Teach it on our data. Do not ship the notes.", "The next move", block=6)
    text(s, M, y, SW - 2 * M, Inches(1.3),
         "A general model is a new intern from a good school. It can write. It has not rotated on your ward. Fine-tuning is that extra month of practice on your examples — your reports, your language, your habit. You are not building a new intern from scratch. You are sending this one to your unit.",
         size=15, color=FG, inset=0)
    cw = (SW - 2 * M - Inches(0.3)) / 2
    card(s, M, y + Inches(1.45), cw, Inches(1.7), title="Fine-tune · one hospital", kicker="Extra practice on local examples", kicker_color=rgb(BLOCK[6][0]),
         body="Show the model a few hundred of your reports. It copies the local habit. Notes never leave the building. This is square 3 or 4 with homework.", tsize=17, bsize=13)
    card(s, M + cw + Inches(0.3), y + Inches(1.45), cw, Inches(1.7), title="Federate · many hospitals", kicker="The intern goes on rotation", kicker_color=rgb(BLOCK[6][0]),
         body="The same extra practice, at every site. Each hospital trains on its own scans. Only the updated lesson — not the images, not the names — comes back.", tsize=17, bsize=13)
    text(s, M, y + Inches(3.3), SW - 2 * M, Inches(1.1),
         "Pediatric data is the hard case: rare enough that no single centre has enough, sensitive enough that you cannot post the archive to a shared drive. Data-use agreements and de-identification eat years. So turn the arrow around.",
         size=13, color=FG2, inset=0)

    s = new_slide(block=6)
    y = heading(s, "Turn the arrow around", "Bring the data to the model · bring the model to the data", block=6)
    cw = (SW - 2 * M - Inches(0.4)) / 2
    for i, (t, sub, note, fl) in enumerate([
        ("Usual study", "Bring the data to the model", "Copy every MRI into one computer. Lawyers first. Imaging later. A 19-hospital pediatric archive almost never leaves the building this way.", False),
        ("Federated learning", "Bring the model to the data", "Each hospital trains on what it already holds. You still need an ethics board. You do not assemble one giant copy of everyone’s MRI archive.", True),
    ]):
        cx = M + i * (cw + Inches(0.4))
        rrect(s, cx, y, cw, Inches(4.35), WHITE, rgb(BLOCK[6][0]) if fl else RULE2, 0.08, lw=Pt(1.5) if fl else Pt(0.75))
        text(s, cx + Inches(0.25), y + Inches(0.15), cw - Inches(0.5), Inches(0.4), t, size=20, color=BRAND, bold=True, inset=0)
        text(s, cx + Inches(0.25), y + Inches(0.55), cw - Inches(0.5), Inches(0.35), sub, size=13, color=FG2, inset=0, italic=True)
        # sites row
        sw_ = Inches(1.35)
        for j, site in enumerate(["Site A", "Site B", "Site C"]):
            sx = cx + Inches(0.3) + j * (sw_ + Inches(0.2))
            text(s, sx, y + Inches(1.05), sw_, Inches(0.7), site + ("\nscans stay" if fl else ""), size=11, color=FG, bold=True, align=PP_ALIGN.CENTER,
                 anchor=MSO_ANCHOR.MIDDLE, fill=BG2, radius=0.2)
            a = s.shapes.add_shape(MSO_SHAPE.UP_ARROW if fl else MSO_SHAPE.DOWN_ARROW, sx + sw_ / 2 - Inches(0.12), y + Inches(1.85), Inches(0.24), Inches(0.4))
            _fill(a, rgb(BLOCK[6][0]) if fl else FG3)
            _line(a, None)
            a.shadow.inherit = False
        bx_w = 3 * sw_ + 2 * Inches(0.2)
        text(s, cx + Inches(0.3), y + Inches(2.35), bx_w, Inches(0.75),
             "MODEL visits · only the lesson travels" if fl else "ONE BOX · all the scans · contracts, de-id, years",
             size=12, color=WHITE, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, fill=rgb(BLOCK[6][0]) if fl else FG2, radius=0.15)
        text(s, cx + Inches(0.25), y + Inches(3.2), cw - Inches(0.5), Inches(1.1), note, size=12, color=FG2, inset=0)

    s = new_slide(block=6)
    y = heading(s, "FL-PedBrain — the scans never sat in one folder", "Nature Communications 2024 · doi 10.1038/s41467-024-51172-5", block=6, size=26)
    picture(s, ROOT / "assets/block-05/fl-pedbrain.png", M, y, Inches(6.0), Inches(3.9), border=RULE2)
    bx = M + Inches(6.3)
    bw = SW - M - bx
    text(s, bx, y, bw, Inches(0.9), "An international study presenting a federated learning AI platform for pediatric brain tumors", size=15, color=FG, bold=True, inset=0)
    text(s, bx, y + Inches(0.9), bw, Inches(0.4), "Lee, Han, Wright, Prolo, Yeom et al. · Nat Commun 15, 7615 (2024)", size=11, color=FG2, inset=0)
    stats = [("19", "sites, five continents"), ("1,468", "children, posterior fossa tumours"), ("<1.5%", "off pooling everything (classification)"), ("20–30%", "better than one hospital alone (segmentation)")]
    sw_ = (bw - Inches(0.2)) / 2
    for i, (n, l) in enumerate(stats):
        sx = bx + (i % 2) * (sw_ + Inches(0.2))
        sy = y + Inches(1.4) + (i // 2) * Inches(1.15)
        rrect(s, sx, sy, sw_, Inches(1.05), BG2, None, 0.1)
        text(s, sx + Inches(0.15), sy + Inches(0.08), sw_ - Inches(0.3), Inches(0.5), n, size=24, color=BRAND, bold=True, inset=0)
        text(s, sx + Inches(0.15), sy + Inches(0.58), sw_ - Inches(0.3), Inches(0.45), l, size=10, color=FG2, inset=0)
    text(s, bx, y + Inches(3.7), bw, Inches(0.7),
         "Medulloblastoma, ependymoma, pilocytic astrocytoma, DIPG. The model learned to classify the tumour and draw its outline on MRI. That is the SIOP problem, and the SIOP opening.",
         size=11, color=FG2, inset=0)

    s = new_slide(block=6)
    y = heading(s, "Square 4, live — Bonsai 1.7B in a browser tab", "On the site: load once (~290 MB), then switch the wi-fi off", block=6, size=26)
    bullets(s, M, y + Inches(0.1), Inches(7.2), Inches(3.3), [
        "Prism ML’s 1-bit Bonsai 1.7B, weights from onnx-community/Bonsai-1.7B-ONNX. After the first download it stays in the browser.",
        "The demo: paste a sentence with language errors and ask it to fix the English. Nothing is sent to a cloud.",
        "It is not a second opinion. It is the fourth square: a narrow job, on the computer that already has the note.",
        "Chrome or Edge works best. Cache it before you demo.",
    ], size=15, space_after=9)
    bx = M + Inches(7.6)
    bw = SW - M - bx
    chat(s, bx, y + Inches(0.1), bw, Inches(1.3), "YOU → BONSAI (WI-FI OFF)",
         "Fix the English: “the patient have fever since 2 hour and the ANC are 80, we brought him in the ER”.", "you", 12)
    chat(s, bx, y + Inches(1.55), bw, Inches(1.85), "BONSAI 1.7B — IN THIS TAB",
         "The patient has had a fever for two hours and the ANC is 80. We brought him to the ER.\n\n(Illustrative of the demo output; the live model rephrases slightly each run.)", "model", 12)
    takehome(s, "Small and local for the routine and the sensitive; large and remote for the difficult. When the notes cannot travel, send the model. Fine-tune on one hospital. Federate across the network.", h=Inches(0.75))


# ---------------------------------------------------------------- block 7
def block7():
    section(7, "A small app\nin five minutes", "A saved skill writes the brief. The brief writes the app. You still own the rules.")

    s = new_slide(block=7)
    y = heading(s, "Roster Builder, live — Cedar Ward, April 2026", "A head nurse’s monthly headache, as something you can show IT on Monday", block=7, size=26)
    picture(s, ROOT / "assets/block-06/roster-builder.png", M, y, SW - 2 * M, Inches(3.5), border=RULE2)
    text(s, M, y + Inches(3.6), SW - 2 * M, Inches(0.7),
         "Staff list, requested days off, and approved leave are in. Capacity is green. Generate ten candidates. Compare. Export. Live at roster-builder-iyadsultan.replit.app — no patient names anywhere.",
         size=13, color=FG2, inset=0)

    s = new_slide(block=7)
    y = heading(s, "Five beats. Do not skip the last one.", "Block 1 taught the prompt. Block 3 gave you prd-builder. Here they earn their keep.", block=7, size=26)
    beats = [("Prompt", "Name the job. Name the input. Name the constraint. Ask it not to guess."),
             ("Skill", "The skill asks the missing pieces before it writes a word."),
             ("PRD", "Who it is for. What it must do. What it must never do."),
             ("App", "Ten candidate rosters, ranked, on Replit."),
             ("Still", "Screens, server, locks, store, who may look, a real address, a hosting bill, and talking to other apps.")]
    cw = (SW - 2 * M - Inches(1.0)) / 5
    for i, (t, b) in enumerate(beats):
        cx = M + i * (cw + Inches(0.25))
        card(s, cx, y + Inches(0.1), cw, Inches(2.4), title=t, body=b, badge=str(i + 1), badge_fill=rgb(BLOCK[7][0]) if i < 4 else MAGENTA, tsize=17, bsize=12)
        if i < 4:
            arrow(s, cx + cw + Inches(0.02), y + Inches(1.15), Inches(0.21), Inches(0.24), rgb(BLOCK[7][0]))
    takehome(s, "The app is the proof. The PRD is the thing you keep. The last beat is what IT will ask you on Monday.", y=y + Inches(2.8), h=Inches(0.65))

    s = new_slide(block=7)
    y = heading(s, "On Claude.ai — prd-builder on. Paste this.", "Customize → Skills → turn on prd-builder", block=7)
    chat(s, M, y + Inches(0.05), Inches(7.6), Inches(4.3), "YOU",
         "Write a PRD for a nurse call-scheduling tool.\n\nInput: a list of nurses with name, seniority level, the maximum number of call shifts each can take, and the October dates they've asked not to be on duty.\n\nThe tool should generate ten or more candidate call schedules and rank them on how evenly they distribute workload — total shifts, day versus night, and weekends — and on how many of the requested days off they satisfy.\n\nConstraint: keep the patient-to-nurse ratio at 4 patients per nurse per shift. The unit holds 20 patients on weekdays and 15 on weekends.\n\nAsk me if anything is unclear.", "you", 13)
    bx = M + Inches(7.9)
    bw = SW - M - bx
    text(s, bx, y + Inches(0.05), bw, Inches(0.3), "THE SKILL STOPS AND ASKS", size=10, color=rgb(BLOCK[7][0]), bold=True, inset=0)
    for i, (q, a) in enumerate([("How many shifts in a day?", "Three 8-hour shifts: Morning 07:00–15:00, Evening 15:00–23:00, Night 23:00–07:00. Not two."),
                                ("Are requested days off a hard block?", "No. Requested off is a preference. Approved leave is a hard block — never schedule through it."),
                                ("Must every shift have a senior nurse?", "Yes. A candidate that leaves a shift without a Senior is never shown.")]):
        cy = y + Inches(0.4 + i * 1.32)
        rrect(s, bx, cy, bw, Inches(1.22), WHITE, RULE2, 0.08)
        text(s, bx + Inches(0.15), cy + Inches(0.08), bw - Inches(0.3), Inches(0.35), q, size=13, color=FG, bold=True, inset=0)
        text(s, bx + Inches(0.15), cy + Inches(0.42), bw - Inches(0.3), Inches(0.8), a, size=11, color=FG2, inset=0)

    s = new_slide(block=7)
    y = heading(s, "What the skill wrote", "Roster Builder — a small Django app for one unit", block=7)
    text(s, M, y, SW - 2 * M, Inches(0.8),
         "The head nurse types the staff list, marks leave, and gets ten legal October schedules, ranked on coverage, fairness, and requests honoured. Export to Excel or PDF. No patient names anywhere. Census is just a number.",
         size=14, color=FG2, inset=0)
    stats = [("Weekday", "20 patients", "5 nurses × 3 shifts × 22 days"), ("Weekend", "15 patients", "4 nurses × 3 shifts × 9 days"), ("October 2026", "438", "nurse-shifts to fill")]
    sw_ = Inches(2.5)
    for i, (k, n, l) in enumerate(stats):
        sx = M + i * (sw_ + Inches(0.2))
        rrect(s, sx, y + Inches(0.9), sw_, Inches(1.25), BG2, None, 0.1)
        text(s, sx + Inches(0.15), y + Inches(0.95), sw_ - Inches(0.3), Inches(0.3), k.upper(), size=9, color=BRAND_DARK, bold=True, inset=0)
        text(s, sx + Inches(0.15), y + Inches(1.2), sw_ - Inches(0.3), Inches(0.5), n, size=22, color=BRAND, bold=True, inset=0)
        text(s, sx + Inches(0.15), y + Inches(1.7), sw_ - Inches(0.3), Inches(0.4), l, size=10, color=FG2, inset=0)
    text(s, M, y + Inches(2.25), Inches(8.0), Inches(0.7),
         "At a 21-shift cap you need about 21 nurses with no leave — realistically 24 or more. Senior cover on all 93 shifts is usually the binding constraint, not headcount.",
         size=11, color=FG2, inset=0)
    bx = M + Inches(8.4)
    bw = SW - M - bx
    bullets(s, bx, y + Inches(0.0), bw, Inches(2.3), [
        ("**Never break** — no one works approved leave · one shift per nurse per day · stay under the monthly cap · a Senior on every shift · night → off the next calendar day · no evening then next morning · no more than 5 days in a row", {"char": "✕"}),
    ], size=11, bullet_color=RED, fill=rgb("#FDECEA"), radius=0.08)
    bullets(s, bx, y + Inches(2.4), bw, Inches(1.2), [
        ("**Rank on these** — requested days off honoured · even share of total shifts · even nights · even weekends", {"char": "✓"}),
    ], size=11, bullet_color=GREEN, fill=rgb("#E7F6EC"), radius=0.08)
    text(s, M, y + Inches(3.05), Inches(8.0), Inches(0.5), "A schedule that breaks a hard rule is not a candidate. Soft rules are scored, not guaranteed.", size=12, color=FG, bold=True, inset=0)
    takehome(s, "Full PRD on the site: Block 7 → Read the full PRD / Download .md. Then open Replit and paste it.", y=y + Inches(3.75), h=Inches(0.55))

    s = new_slide(block=7)
    y = heading(s, "Then hand the PRD to a builder", "Replit — easy to start, a monthly bill, not a hospital system", block=7)
    cw = (SW - 2 * M - Inches(0.75)) / 4
    items = [("Easy to use", "Type what you want in ordinary words. Watch a working page appear."),
             ("Prompt an app", "Paste the PRD. That is the whole brief. Do not start from a blank file."),
             ("Any coding skill", "A head nurse and a resident can both try. You do not need the same background."),
             ("Backend + database", "Not just a pretty page. It can save the staff list and serve it next time."),
             ("Affordable, not free", "A small monthly bill. Ask who pays before you promise the unit a tool."),
             ("Secure, not HIPAA", "Login and HTTPS, but no hospital contract. Do not put real patients here."),
             ("Right job", "A proof of concept, a first working version, or a place to develop. Not the ward on Monday."),
             ("Five minutes is the demo", "The week of checking it against a real month is still yours.")]
    for i, (t, b) in enumerate(items):
        cx = M + (i % 4) * (cw + Inches(0.25))
        cy = y + Inches(0.1) + (i // 4) * Inches(1.75)
        warn = t in ("Affordable, not free", "Secure, not HIPAA")
        card(s, cx, cy, cw, Inches(1.6), title=t, body=b, fill=WARN_BG if warn else WHITE, line=None if warn else RULE2, tsize=14, bsize=11, tcolor=WARN_FG if warn else FG)
    phi_line(s, "Never paste a real staff roster — names, leave dates, employee numbers — into a consumer cloud builder unless your hospital has already said that hosting is allowed.")

    s = new_slide(block=7)
    y = heading(s, "What five minutes did not buy you", "A quick app still has eight jobs. Skip one and you have a demo, not a hospital tool.", block=7, size=26)
    jobs = [("Front end", "The screens people click. If a head nurse cannot read it from a ward computer, it is not done."),
            ("Back end", "The hidden work. Saving the staff list. Running the generator. Building the Excel file."),
            ("Security", "Locks. Encrypted traffic. No passwords in the code. A log of who opened what."),
            ("Database", "Where the lists live after you close the tab. A file on someone’s laptop is not a database."),
            ("Who may look", "Authorization — permission, not just a login. The head nurse sees Cedar Ward. Not every ward."),
            ("Domain name", "roster.yourhospital.org can live on a badge. A Replit link is a temporary street."),
            ("Hosting — and the bill", "The computer the app lives on is a monthly cost. Backups, and a promise it stays up overnight."),
            ("Talking to other apps", "A live roster should speak to HR, email, or the record. That is integration.")]
    cw = (SW - 2 * M - Inches(0.75)) / 4
    for i, (t, b) in enumerate(jobs):
        cx = M + (i % 4) * (cw + Inches(0.25))
        cy = y + Inches(0.05) + (i // 4) * Inches(1.85)
        card(s, cx, cy, cw, Inches(1.7), title=t, body=b, badge=str(i + 1), badge_fill=rgb(BLOCK[7][0]), tsize=14, bsize=11)
    takehome(s, "Roster Builder is the conversation with IT. These eight are the work after the conversation.", y=y + Inches(3.85), h=Inches(0.55))

    s = new_slide(block=7)
    y = heading(s, "If the app holds patient data: de-identify before it lands", "HIPAA in the US, GDPR in Europe, and your own national law all say the same first move", block=7, size=24)
    cw = Inches(4.6)
    rrect(s, M, y + Inches(0.2), cw, Inches(1.9), rgb("#FDECEA"), None, 0.1)
    text(s, M + Inches(0.25), y + Inches(0.35), cw - Inches(0.5), Inches(0.3), "WHAT YOU MUST NOT STORE", size=10, color=RED, bold=True, inset=0)
    text(s, M + Inches(0.25), y + Inches(0.7), cw - Inches(0.5), Inches(0.6), "142-04-6697", size=28, color=FG, bold=True, font=MONO, inset=0)
    text(s, M + Inches(0.25), y + Inches(1.35), cw - Inches(0.5), Inches(0.7), "US Social Security number — or your local national ID. This example is made up.", size=11, color=FG2, inset=0)
    arrow(s, M + cw + Inches(0.3), y + Inches(0.95), Inches(1.2), Inches(0.4), rgb(BLOCK[7][0]))
    text(s, M + cw + Inches(0.2), y + Inches(1.4), Inches(1.4), Inches(0.3), "becomes", size=11, color=FG2, align=PP_ALIGN.CENTER, inset=0)
    cx = M + cw + Inches(1.8)
    rrect(s, cx, y + Inches(0.2), SW - M - cx, Inches(1.9), rgb("#E7F6EC"), None, 0.1)
    text(s, cx + Inches(0.25), y + Inches(0.35), SW - M - cx - Inches(0.5), Inches(0.3), "WHAT THE DATABASE HOLDS", size=10, color=GREEN, bold=True, inset=0)
    text(s, cx + Inches(0.25), y + Inches(0.7), SW - M - cx - Inches(0.5), Inches(0.6), "34321226754342423", size=28, color=FG, bold=True, font=MONO, inset=0)
    text(s, cx + Inches(0.25), y + Inches(1.35), SW - M - cx - Inches(0.5), Inches(0.7), "A token. Only the hospital vault knows the pairing.", size=11, color=FG2, inset=0)
    bullets(s, M, y + Inches(2.4), SW - 2 * M, Inches(1.4), [
        "Swap the real identifier for a token the hospital vault can map back, and the app cannot. Names, dates of birth, national IDs, and medical record numbers all count.",
        "Roster Builder sidesteps this on purpose: census is a number, not a patient list. Staff names and leave are still personal data. The moment you add an MRN, this swap is required.",
    ], size=14, space_after=8)
    takehome(s, "Write the brief first. A prototype starts the conversation with IT; it does not replace screens, a server, a database, security, who may look, a real address, a hosting bill, or a way to talk to other apps. Patient IDs go in as tokens, not as the real number.", h=Inches(0.8))


# ---------------------------------------------------------------- block 8
def block8():
    section(8, "AI for\nresearch", "Plug the chat into your own Zotero library, step by step — then the model writes the code; you remain the author.")

    s = new_slide(block=8)
    y = heading(s, "Five steps. Ten minutes. Nothing leaves your laptop.", "zotero-mcp — a free community connector that talks to the Zotero app already running on your machine", block=8, size=24)
    steps = [("Zotero", "Zotero 7 open, with one tick-box turned on."), ("Install", "Two lines in a terminal. One installs the tool runner, one installs the plug."),
             ("Connect", "One command writes the Claude Desktop config for you. Restart Claude."), ("Check", "Ask Claude for your five most recent items. If it lists them, you are done."),
             ("Ask", "The real question: find, summarise, cite — from your own library.")]
    cw = (SW - 2 * M - Inches(1.0)) / 5
    for i, (t, b) in enumerate(steps):
        card(s, M + i * (cw + Inches(0.25)), y + Inches(0.1), cw, Inches(2.1), title=t, body=b, badge=str(i + 1), badge_fill=rgb(BLOCK[8][0]), tsize=17, bsize=12)
    bullets(s, M, y + Inches(2.5), SW - 2 * M, Inches(1.5), [
        "No account, no upload, no key needed for reading. Works in Claude Desktop on Mac or Windows — not in the browser tab.",
        "The terminal is the only unfamiliar part. It is three pasted lines. Everything else is clicking.",
    ], size=15, space_after=8)

    s = new_slide(block=8)
    y = heading(s, "Step 1 · Let Zotero answer the door", "Zotero keeps its local door shut by default. Open it once.", block=8)
    for i, (t, b) in enumerate([("Install or update to Zotero 7", "zotero.org/download. Zotero 6 does not have the local door. Check the version under Help → About Zotero."),
                                ("Open Settings", "Mac: Zotero → Settings. Windows: Edit → Settings."),
                                ("Advanced → tick one box", "“Allow other applications on this computer to communicate with Zotero.” That is the whole setting. Close Settings."),
                                ("Leave Zotero running", "The plug only works while Zotero is open. If Claude later says it cannot reach Zotero, this is the first thing to check.")]):
        cy = y + i * Inches(0.85)
        num_badge(s, M, cy + Inches(0.05), str(i + 1), rgb(BLOCK[8][0]), Inches(0.42), 13)
        text(s, M + Inches(0.6), cy, Inches(8.5), Inches(0.35), t, size=16, color=FG, bold=True, inset=0)
        text(s, M + Inches(0.6), cy + Inches(0.35), Inches(8.5), Inches(0.5), b, size=12, color=FG2, inset=0)
    takehome(s, "“Other applications on this computer” means exactly that. Nothing on the internet can use this door. It is the chat app on your laptop talking to the Zotero app on your laptop.", y=y + Inches(3.5), h=Inches(0.7))

    s = new_slide(block=8)
    y = heading(s, "Step 2 · Two lines in a terminal", "Paste line one. Close and reopen the terminal. Paste line two.", block=8)
    cw = (SW - 2 * M - Inches(0.3)) / 2
    for i, (osn, l1) in enumerate([("Mac — Terminal (Spotlight, type Terminal)", "curl -LsSf https://astral.sh/uv/install.sh | sh"),
                                   ("Windows — PowerShell (Start, type PowerShell)", "powershell -ExecutionPolicy ByPass -c \"irm https://astral.sh/uv/install.ps1 | iex\"")]):
        cx = M + i * (cw + Inches(0.3))
        text(s, cx, y, cw, Inches(0.3), osn.upper(), size=10, color=rgb(BLOCK[8][0]), bold=True, inset=0)
        text(s, cx, y + Inches(0.32), cw, Inches(0.3), "Line 1 — install uv, the tool runner", size=12, color=FG2, inset=0)
        code(s, cx, y + Inches(0.62), cw, Inches(0.7), l1, size=11)
        text(s, cx, y + Inches(1.4), cw, Inches(0.3), "Close the terminal, reopen it. Line 2 — install the plug", size=12, color=FG2, inset=0)
        code(s, cx, y + Inches(1.7), cw, Inches(0.5), "uv tool install zotero-mcp-server", size=11)
    text(s, M, y + Inches(2.4), SW - 2 * M, Inches(0.3), "Then confirm it landed. This should print a version number, nothing else.", size=12, color=FG2, inset=0)
    code(s, M, y + Inches(2.7), Inches(4), Inches(0.45), "zotero-mcp version", size=11)
    card(s, M, y + Inches(3.3), cw, Inches(1.1), title="What uv is", body="A small program that installs and runs Python tools without you touching Python. The App Store for command-line plugs. Install once and forget it.", tsize=13, bsize=11)
    card(s, M + cw + Inches(0.3), y + Inches(3.3), cw, Inches(1.1), title="“command not found”", body="You did not reopen the terminal after line 1. Close it fully, open a new one, try again. On Mac, uv tool update-shell then reopen also fixes it.", tsize=13, bsize=11, fill=WARN_BG, line=None, tcolor=WARN_FG)

    s = new_slide(block=8)
    y = heading(s, "Step 3 · One command writes the config", "Claude Desktop keeps a small file listing its plugs. You do not have to edit it by hand.", block=8, size=26)
    code(s, M, y + Inches(0.05), Inches(4.5), Inches(0.45), "zotero-mcp setup", size=12)
    for i, (t, b) in enumerate([("“Use local Zotero API?” → press Enter", "Yes is the default. Local means the door you opened in Step 1. No key, no account."),
                                ("“Configure semantic search?” → skip for today", "It offers to build an AI index of your PDFs. Useful later, slow now. Keyword search works without it."),
                                ("It writes the Claude Desktop file", "You will see a path ending in claude_desktop_config.json."),
                                ("Quit Claude Desktop fully, then reopen", "Mac: ⌘Q, not the red dot. Windows: right-click the tray icon → Quit. Claude reads the plug list only on launch.")]):
        cy = y + Inches(0.65) + i * Inches(0.8)
        num_badge(s, M, cy + Inches(0.02), str(i + 1), rgb(BLOCK[8][0]), Inches(0.38), 12)
        text(s, M + Inches(0.55), cy, Inches(6.8), Inches(0.32), t, size=14, color=FG, bold=True, inset=0)
        text(s, M + Inches(0.55), cy + Inches(0.32), Inches(6.8), Inches(0.5), b, size=11, color=FG2, inset=0)
    bx = M + Inches(7.8)
    bw = SW - M - bx
    text(s, bx, y + Inches(0.05), bw, Inches(0.3), "THE ENTRY IT ADDED", size=10, color=rgb(BLOCK[8][0]), bold=True, inset=0)
    code(s, bx, y + Inches(0.35), bw, Inches(2.1), ["{", "  \"mcpServers\": {", "    \"zotero\": {", "      \"command\": \"zotero-mcp\",",
                                                   "      \"env\": { \"ZOTERO_LOCAL\": \"true\" }", "    }", "  }", "}"], size=11)
    text(s, bx, y + Inches(2.6), bw, Inches(1.4),
         "Reading only, by design. Adding an API key from zotero.org lets the plug write to your library too (add items, notes, tags). Do that on a day you have time to check what it wrote.",
         size=11, color=FG2, inset=0)

    s = new_slide(block=8)
    y = heading(s, "Step 4 · Prove it", "New chat → tools icon under the message box → zotero should be in the list", block=8)
    chat(s, M, y + Inches(0.05), Inches(7.2), Inches(0.85), "YOU", "List the five most recent items in my Zotero library. Title, first author, year.", "you", 14)
    chat(s, M, y + Inches(1.0), Inches(7.2), Inches(0.7), "TOOL — ZOTERO", "zotero_get_recent · limit 5   →  [Allow]", "tool", 11)
    chat(s, M, y + Inches(1.8), Inches(7.2), Inches(1.25), "CLAUDE — CONNECTED",
         "Five items, newest first: the 2023 JCO fever and neutropenia guideline (Lehrnbecher), the 2024 Lancet Oncology paper on…", "model", 13)
    text(s, M, y + Inches(3.15), Inches(7.2), Inches(0.6), "If those are your papers, you are done. Same habit as Block 4: the model asks, you press Allow, then it answers from your rows.", size=12, color=FG2, inset=0)
    bx = M + Inches(7.5)
    bw = SW - M - bx
    text(s, bx, y + Inches(0.05), bw, Inches(0.3), "IF IT DOES NOT WORK", size=10, color=rgb(BLOCK[8][0]), bold=True, inset=0)
    for i, (t, b) in enumerate([("No zotero in the tools list", "Claude was not fully quit. ⌘Q or tray-icon Quit, reopen. Still missing: run zotero-mcp setup-info and check the path it prints exists."),
                                ("“Cannot connect to Zotero”", "Zotero is not open, or the Step 1 tick-box is off. Open Zotero, check Settings → Advanced, ask again."),
                                ("Claude lists papers you do not own", "It is guessing, not reading. The tool call never happened. Look for the Allow prompt. If there was none, the plug is not loaded.")]):
        cy = y + Inches(0.4) + i * Inches(1.25)
        card(s, bx, cy, bw, Inches(1.15), title=t, body=b, fill=WARN_BG, line=None, tsize=12, bsize=10, tcolor=WARN_FG, pad=0.12)

    s = new_slide(block=8)
    y = heading(s, "Step 5 · Now the question you came for", "A general chat reads the internet. This one reads the folder you curated over ten years.", block=8, size=26)
    chat(s, M, y + Inches(0.05), SW - 2 * M, Inches(1.6), "YOU",
         "Search my Zotero library for guidelines on fever and neutropenia in children.\nFor each hit, give me the title, first author, year, and the one recommendation on time-to-antibiotics.\nQuote the recommendation from the PDF; do not paraphrase. If a paper has no PDF attached, say so instead of guessing.", "you", 13)
    text(s, M, y + Inches(1.8), SW - 2 * M, Inches(0.9),
         "The last two sentences are the Block 1 habit. The plug can read the attached PDF; make it quote, not summarise. Where a citation is thin, add Consensus (consensus.app) in the same chat for what the wider literature says — then put the paper you like into Zotero, and it is in the next search.",
         size=13, color=FG2, inset=0)
    cw = (SW - 2 * M - Inches(0.3)) / 2
    card(s, M, y + Inches(2.8), cw, Inches(1.35), title="Fine on Monday", body="Your own library on your own laptop. Guidelines, reviews, your published work. Nothing patient-level is in Zotero, so nothing patient-level leaves.", fill=rgb("#E7F6EC"), line=None, tcolor=GREEN, bcolor=FG, tsize=15, bsize=12)
    card(s, M + cw + Inches(0.3), y + Inches(2.8), cw, Inches(1.35), title="Not this week", body="Turning on write access and letting it retag or merge your library unattended. Read first. Add write when you have an afternoon to check it.", fill=rgb("#FDECEA"), line=None, tcolor=RED, bcolor=FG, tsize=15, bsize=12)

    s = new_slide(block=8)
    y = heading(s, "Before Monday · the rules around the plug", "Do and do not when you use AI for research", block=8)
    rows = [["Do", "Don’t"],
            ["Brainstorm with it. Questions, outlines, angles you had not named yet.", "Fabricate data. Not a number, not a patient, not a p-value."],
            ["Review the manuscript with it before you submit.", "Let the model rewrite or “tidy” your results."],
            ["Write analysis code with it — only if you understand the statistic it is running.", "Generate statistics you cannot explain, or cannot change later when a reviewer asks."],
            ["Let it teach you a new tool until you can run it yourself. Kaplan–Meier. A model. A plot.", "Trust a reference it fetched until you have read it and know why it was cited."],
            ["Draft a strict blueprint of the paper. Then augment or review the references you already chose.", "Hide that you used AI. Journals will ask. Your IRB already does."]]
    fills = {}
    for r in range(1, 6):
        fills[(r, 0)] = rgb("#E7F6EC")
        fills[(r, 1)] = rgb("#FDECEA")
    table(s, M, y + Inches(0.05), SW - 2 * M, [1, 1], rows, size=12, row_h=Inches(0.55), head_fill=rgb(BLOCK[8][0]), cell_fills=fills)
    takehome(s, "That is the line. One side is transparent, reproducible, honest, legitimate research. Cross it and the work is uninformed, unethical, dangerous — and it is plagiarism.", y=y + Inches(3.5), h=Inches(0.7))

    s = new_slide(block=8)
    y = heading(s, "The governance brief", "Why a model that passed its studies can still fail on your patients", block=8)
    bullets(s, M, y + Inches(0.1), Inches(7.5), Inches(3.0), [
        "Your hospital, your ethics board, and your journal each have a view on this.",
        "The brief covers: why validation does not transfer, what the reporting rules ask of you, and what a health system should actually do. Six tabs. Start with **Action plan** if you have two minutes.",
        "Built the same way as the Block 2 guideline explainer: a paper-to-artifact prompt, then a person checking every number. The footnote on the recall figure is the honest part — keep it.",
        "Open it from the site: Block 8 → Open the brief.",
    ], size=15, space_after=9)
    takehome(s, "The model writes the code; you remain the author. Plug it into the library you already trust before you plug it into anything else.")


# ---------------------------------------------------------------- block 9
def block9():
    section(9, "What we learned\nat KHCC", "People first. Then agents, with their own rules. Cybersecurity before everything else.")

    s = new_slide(block=9)
    y = heading(s, "We did not start with a model.", "Six habits, then a floor", block=9)
    habits = [("Listen", "Clinicians, pharmacists, and nurses help build the tool."), ("Buy-in", "People adopt what they helped shape."),
              ("Write a PRD", "Who it is for. What it must never do."), ("Ask for the code", "You do not have to write it to own the question."),
              ("One data store", "One number the team can trust."), ("Govern first", "Policy and permission, then the work.")]
    cw = (SW - 2 * M - Inches(0.5)) / 3
    for i, (t, b) in enumerate(habits):
        cx = M + (i % 3) * (cw + Inches(0.25))
        cy = y + Inches(0.1) + (i // 3) * Inches(1.75)
        card(s, cx, cy, cw, Inches(1.6), title=t, body=b, badge=f"{i + 1:02d}", badge_fill=BRAND, tsize=18, bsize=13)

    statement("Cybersecurity comes first. [[Everything else]] comes after.", kicker="The floor", meta="A clever tool that leaks a name is not a clever tool.")

    statement("Agents need\ntheir own rules", kicker="The new staff", meta="A chatbot answers. An agent does work.")

    s = new_slide(block=9)
    y = heading(s, "A chatbot answers. An agent does work.", "Not the same thing", block=9)
    cw = (SW - 2 * M - Inches(0.4)) / 2
    for i, (t, pts, pick) in enumerate([("A generic language model", ["Sits in a browser tab", "Forgets you tomorrow", "Cannot act on a chart", "Not allowed near a child"], False),
                                        ("A hospital agent", ["Has a named job", "Reads, remembers, learns", "Can face a family — or build the hospital’s AI", "Works only with a human in the loop"], True)]):
        cx = M + i * (cw + Inches(0.4))
        rrect(s, cx, y + Inches(0.1), cw, Inches(2.75), WHITE, BRAND if pick else RULE2, 0.08, lw=Pt(2) if pick else Pt(0.75))
        text(s, cx + Inches(0.3), y + Inches(0.25), cw - Inches(0.6), Inches(0.5), t, size=22, color=BRAND, bold=True, inset=0)
        bullets(s, cx + Inches(0.3), y + Inches(0.8), cw - Inches(0.6), Inches(2.0), pts, size=16, space_after=6)
    cw2 = (SW - 2 * M - Inches(0.4)) / 2
    card(s, M, y + Inches(3.05), cw2, Inches(1.15), title="With the family", kicker="Patient-facing", kicker_color=MAGENTA, body="Explain a protocol in the language the ward actually uses.", tsize=13, bsize=11, pad=0.12)
    card(s, M + cw2 + Inches(0.4), y + Inches(3.05), cw2, Inches(1.15), title="With the hospital", kicker="Infrastructure", kicker_color=MAGENTA, body="Read notes, keep tables, help build the AI the centre runs on.", tsize=13, bsize=11, pad=0.12)

    s = new_slide(block=9)
    y = heading(s, "Learn. Read. Be corrected.", "What they must be able to do", block=9)
    cw = (SW - 2 * M - Inches(0.5)) / 3
    card(s, M, y + Inches(0.1), 2 * cw + Inches(0.25), Inches(1.6), title="Keep humans in the loop", body="A person signs off before anything touches a child.", fill=BRAND, line=None, tcolor=WHITE, bcolor=rgb("#C5D3EE"), tsize=22, bsize=15)
    card(s, M + 2 * cw + Inches(0.5), y + Inches(0.1), cw, Inches(1.6), title="Learn", body="From the work, not only from a prompt.", tsize=20, bsize=14)
    for i, (t, b) in enumerate([("Read", "The chart, the guideline, the last message."), ("Take feedback", "A nurse can say “wrong,” and it sticks."), ("Talk to each other", "Hand-offs in writing, the way teams already do.")]):
        card(s, M + i * (cw + Inches(0.25)), y + Inches(1.95), cw, Inches(1.6), title=t, body=b, tsize=20, bsize=14)

    s = new_slide(block=9)
    y = heading(s, "An agent error is an [[incident]].", "When it fails", block=9)
    text(s, M, y, Inches(5.2), Inches(1.5), "Not a glitch. Not “the model was having a day.” The same investigation as a missed dose.", size=18, color=FG, inset=0)
    bx = M + Inches(5.6)
    bw = SW - M - bx
    for i, (when, t, b) in enumerate([("Name it", "Who owns this agent?", "A person, not a vendor slide."), ("Watch it", "Life cycle, in the open", "Born, supervised, updated, retired."),
                                      ("See it", "Output is visible", "If you cannot see the work, you cannot govern it."), ("Investigate", "Full incident review", "Document. Learn. Change the rule.")]):
        cy = y + i * Inches(1.0)
        pill(s, bx, cy + Inches(0.08), when.upper(), BRAND, WHITE, 9, Inches(1.2))
        text(s, bx + Inches(1.4), cy, bw - Inches(1.4), Inches(0.35), t, size=16, color=FG, bold=True, inset=0)
        text(s, bx + Inches(1.4), cy + Inches(0.36), bw - Inches(1.4), Inches(0.5), b, size=12, color=FG2, inset=0)
        if i < 3:
            ln = s.shapes.add_connector(1, bx + Inches(0.6), cy + Inches(0.42), bx + Inches(0.6), cy + Inches(1.05))
            ln.line.color.rgb = RULE
            ln.line.width = Pt(2)

    s = new_slide(block=9)
    y = heading(s, "This becomes a new language on the ward.", "Words the hospital does not have yet", block=9)
    text(s, M, y, Inches(5), Inches(1.0), "Administration may not know these words. The work will, soon.", size=16, color=FG2, inset=0)
    rows = [["", ""], ["Old question", "Which consultant is the primary for this patient?"], ["New question", "Which agent owns this task — and who supervises it?"],
            ["Old meeting", "Morbidity and mortality."], ["New meeting", "The same room, with the agent’s log on the table."]]
    fills = {(2, 0): BG2, (2, 1): BG2, (4, 0): BG2, (4, 1): BG2}
    table(s, M + Inches(5.4), y, SW - M - M - Inches(5.4), [1, 2.4], rows[1:], header=False, size=14, row_h=Inches(0.75), first_col_bold=True, cell_fills=fills, zebra=False)

    statement("Treat agents as a new breed of [[staff]].", kicker="If you remember one line",
              meta="Watch the life cycle. Make the output visible. Keep a human in the loop.\nNext — three minutes. Three pictures, then what to try on Monday.")


# ---------------------------------------------------------------- block 10
def block10():
    section(10, "What to try\non Monday", "Three pictures of where this hour was going. Then one task per role. This is your handout.")

    def picture_slide(title, kicker, img, caption, jobs):
        s = new_slide(block=10)
        y = heading(s, title, kicker, block=10, size=26)
        picture(s, ROOT / img, M, y, Inches(7.2), Inches(4.4), border=RULE2)
        bx = M + Inches(7.5)
        bw = SW - M - bx
        text(s, bx, y, bw, Inches(0.9), caption, size=12, color=FG2, inset=0)
        n = len(jobs)
        rh = Inches(3.45) / n
        for i, (t, b) in enumerate(jobs):
            cy = y + Inches(0.95) + i * rh
            num_badge(s, bx, cy + Inches(0.03), str(i + 1), rgb(BLOCK[10][0]), Inches(0.3), 10)
            text(s, bx + Inches(0.42), cy - Inches(0.02), bw - Inches(0.42), Inches(0.28), t, size=12, color=FG, bold=True, inset=0, spacing=1.0, space_after=0)
            text(s, bx + Inches(0.42), cy + Inches(0.24), bw - Inches(0.42), rh - Inches(0.26), b, size=10, color=FG2, inset=0, spacing=1.05, space_after=0)

    picture_slide("An intelligent crash cart", "Where this hour is going · concept design, not a product", "assets/block-10/intelligent-crash-cart.jpg",
                  "Every tool in this hour has a place on a cart. This is a concept drawing, not a product you can order. The six jobs are already in your notes.",
                  [("Talk & listen", "Hands-free voice. The team keeps their hands on the child."), ("Calculate doses", "Weight in. Dose out. The math is not the job during a code."),
                   ("Guide actions", "Step-by-step, the way the protocol is written."), ("Assist assessment", "A structured look at the child, not a free-form chat."),
                   ("Evaluate the team", "Camera-assisted timing and feedback after the event."), ("Run mock training", "Scenarios, scoring, and debrief when the corridor is quiet.")])
    picture_slide("Intelligent patient instructions", "And at the clinic desk · concept design", "assets/block-10/patient-instructions.jpg",
                  "A protocol is written for the team. A family needs a guide they can take home. You already practiced this when you turned a guideline into something a parent can read.",
                  [("Import protocol", "Load the treatment plan. Do not type it from memory."), ("Review & approve", "A person on the care team signs off before it leaves the clinic."),
                   ("Personalize", "Clear language for this patient, not a photocopy of the protocol."), ("Print & share", "A take-home guide. Paper still works.")])
    picture_slide("AI at the point of care", "Six more places the work already lives · concept designs, clinical oversight built in", "assets/block-10/point-of-care.jpg",
                  "Not one cart. Not one desk. Discharge. The handover. The infusion. Practice. The waiting-room kiosk. The phone at home. A person still signs off.",
                  [("Smart discharge station", "Turns the care plan into a take-home guide."), ("Bedside nursing assistant", "Captures observations and drafts the handover."),
                   ("Infusion safety assistant", "Flags mismatches for a nurse to verify."), ("Procedure training coach", "Guides practice and supports the debrief."),
                   ("Patient education kiosk", "Explains care and checks understanding."), ("Home symptom companion", "Collects symptoms and alerts the care team.")])

    s = new_slide(block=10)
    y = heading(s, "Until then — pick the card that matches your job", "The pictures are the destination. Monday is the first step.", block=10)
    roles = [("Physicians", "Put one guideline you argue about into NotebookLM; query it instead of remembering it."),
             ("Nurses", "Draft a parent-facing explanation of one procedure at a reading level your families actually use."),
             ("Pharmacists", "Turn one dosing protocol into an interactive artifact; see if it catches the recurring error."),
             ("Data managers & researchers", "Hand a de-identified extract to a model and ask for the table-one you keep postponing.")]
    cw = (SW - 2 * M - Inches(0.75)) / 4
    for i, (t, b) in enumerate(roles):
        card(s, M + i * (cw + Inches(0.25)), y + Inches(0.1), cw, Inches(2.4), title=t, body=b, kicker="Monday", kicker_color=rgb(BLOCK[10][0]), tsize=17, bsize=14, tlines=2 if "&" in t else 1)
    takehome(s, "Skills today. Lives tomorrow. The pictures are drawings. The Monday task is real.", y=y + Inches(2.75), h=Inches(0.6))
    phi_line(s, "Everyone — never paste patient-identifiable data into a consumer AI tool.")

    s = new_slide(kicker="Companion sessions")
    y = heading(s, "Companion sessions", "The 30 minutes that follow the core hour")
    cw = (SW - 2 * M - Inches(0.3)) / 2
    card(s, M, y + Inches(0.1), cw, Inches(1.8), title="Precision medicine tool for all — Capricorn", kicker="01:00 – 01:15", kicker_color=rgb("#F4511E"), body="", tsize=18)
    card(s, M + cw + Inches(0.3), y + Inches(0.1), cw, Inches(1.8), title="Q&A with an AI avatar", kicker="01:15 – 01:30", kicker_color=rgb("#F4511E"),
         body="An AI avatar of Uri Ilan (Princess Máxima), moderated by Jorge Campos — answers the room and is itself the closing demonstration.", tsize=18, bsize=13)
    takehome(s, "Confirm likeness approval; rehearse on venue AV and network; keep a pre-recorded fallback.", y=y + Inches(2.2), h=Inches(0.6))


def closing():
    s = new_slide(chrome=False)
    rect(s, 0, 0, SW, SH, BRAND)
    rect(s, 0, SH - Inches(0.12), SW, Inches(0.12), MAGENTA)
    text(s, M, Inches(1.0), Inches(7.5), Inches(0.4), "AIBEDSIDE.IO — THE COMPANION SITE", size=13, color=YELLOW, bold=True, inset=0)
    text(s, M, Inches(1.5), Inches(7.5), Inches(2.0), "Every demo in this deck is runnable at home.", size=40, color=WHITE, bold=True, inset=0, spacing=1.05)
    bullets(s, M, Inches(3.6), Inches(7.5), Inches(2.4), [
        "The four .skill files, the PRD, the CLAUDE.md folder, the wiki, and the governance brief.",
        "The live demos: prompt builder, Haiku with and without MCP, Bonsai in the browser.",
        "The closing page is the handout — Save as PDF.",
    ], size=16, color=WHITE, bullet_color=YELLOW, space_after=8)
    text(s, M, Inches(6.2), Inches(8), Inches(0.5), SITE, size=16, color=rgb("#C5D3EE"), inset=0, font=MONO)
    bx = SW - M - Inches(3.4)
    rrect(s, bx - Inches(0.15), Inches(1.4), Inches(3.7), Inches(4.4), WHITE, None, 0.06)
    picture(s, BUILD / "qr-home.png", bx, Inches(1.55), Inches(3.4), Inches(3.4))
    text(s, bx, Inches(5.0), Inches(3.4), Inches(0.48), "Scan to open the site.\nSave to your home screen.", size=13, color=FG, bold=True, align=PP_ALIGN.CENTER, inset=0)
    clock_field(s, bx, Inches(5.48), Inches(3.4), Inches(0.28), size=16, color=BRAND)
    text(s, M, SH - Inches(0.6), Inches(9), Inches(0.35), "Iyad Sultan, MD · King Hussein Cancer Center · SIOP 2026, San Antonio", size=11, color=rgb("#C5D3EE"), inset=0)


# ---------------------------------------------------------------- build
def prepare_assets():
    BUILD.mkdir(exist_ok=True)
    home = BUILD / "qr-home.png"
    if not home.exists():
        im = Image.open(ROOT / "qr-code.png").convert("RGB")
        im.resize((im.width * 4, im.height * 4), Image.NEAREST).save(home)
    missing = [slug for slug in QR_FOR_BLOCK.values() if not qr_png(slug).exists()]
    if missing:
        raise SystemExit("Missing QR PNGs in .deck-build/: " + ", ".join(missing) + "  (run tools/make-deck.sh)")
    if not (BUILD / "logo-siop.png").exists():
        raise SystemExit("Missing .deck-build/logo-siop.png (run tools/make-deck.sh)")


def main():
    prepare_assets()
    cover()
    run_of_show()
    block0()
    block1()
    block2()
    block3()
    block4()
    block5()
    block6()
    block7()
    block8()
    block9()
    block10()
    closing()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    prs.save(OUT)
    print(f"wrote {OUT.relative_to(ROOT)} — {slide_no} slides")


if __name__ == "__main__":
    main()
