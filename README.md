# AI at the Bedside

Companion site for the SIOP 2026 Global Health Session talk **"AI at the
Bedside: A Practical Introduction for the Whole Childhood-Cancer Team"**
(SIOP Annual Congress, San Antonio, 15–18 September 2026).

Built the same way as [CCI.io](https://github.com/IyadSultan/CCI.io) — a
minimal Jekyll site on GitHub Pages, one page per talk block, meant to be
the QR-code handout attendees land on after the session.

- **Live site:** https://iyadsultan.github.io/AIBedside.io/
- **Source outline:** `_sources/outline.md` (mirrors the planning doc — not published)
- **Lead:** Iyad Sultan, MD — Chief AI Officer & CHIO, King Hussein Cancer Center

## Structure

- `index.md` — hero, objectives, and the run-of-show grid (links to every block)
- `block-XX-*.md` — one page per block: on-screen content + take-home
- `block-05-5-claude-md.md` — after MCP: `CLAUDE.md` as standing orders; demo folder at `assets/block-05.5/` (policies, wiki, `summary.html`)
- `block-08-learned.md` — last slides: KHCC habits, then hospital agents as a governed workforce (deck at `assets/slides/block-08.html`)
- `closing-tasks.md` — the three-minute close, one task per role (the actual handout content)
- `companion-sessions.md` — the Precision Medicine and AI-avatar Q&A blocks that follow
- `preparation.md` — speaker pre-build checklist and the run-long fallback plan

## Local preview

```
bundle install
bundle exec jekyll serve
```

For the live Claude chat on Block 4, in a second terminal:

```
./mcp-chat/start.sh
```

Then open the **Live** chip on the MCP page, or go straight to [http://127.0.0.1:8765](http://127.0.0.1:8765).
