"""
Local chat server for the Block 4 Claude demo.

Haiku 4.5 answers twice:
  - without any plug (training memory only)
  - with the medical-terminologies MCP (live ICD-11, RxNorm, LOINC, MeSH, ATC)

The API key stays on this machine. The browser never sees it.
"""

from __future__ import annotations

import json
import os
import time
from collections import defaultdict
from pathlib import Path
from typing import Any, Iterator

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse

try:
    import anthropic
except Exception as err:  # pragma: no cover
    raise SystemExit(
        "The anthropic package failed to import. "
        "Start the server with mcp-chat/start.sh. Detail: " + str(err)
    ) from err

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

MODEL = "claude-haiku-4-5"
MCP_NAME = "medical-terms"
MCP_URL = os.environ.get("MCP_URL", "https://medical.sidneybissoli.com/mcp").strip()
CHAT_PORT = int(os.environ.get("CHAT_PORT", "8765"))
MAX_PROMPT = 2000
MAX_HISTORY = 8
RATE_LIMIT = 20
RATE_WINDOW = 60

# The project .env uses ANTHROPIC_API. The SDK also looks for ANTHROPIC_API_KEY.
API_KEY = (
    os.environ.get("ANTHROPIC_API")
    or os.environ.get("ANTHROPIC_API_KEY")
    or ""
).strip()

if API_KEY and not os.environ.get("ANTHROPIC_API_KEY"):
    os.environ["ANTHROPIC_API_KEY"] = API_KEY

SYSTEM_PLAIN = """You are Claude, in a teaching demo for a childhood-cancer conference.

You do NOT have a live terminology plug. You cannot look up ICD-11, RxNorm, LOINC, MeSH, or ATC from a database.

If the question is a code, mapping, or official display name:
- Answer from training memory if you can.
- Say clearly that this is recalled, not a live lookup.
- If you are unsure of the current code, say so. Do not invent a confident code.

Keep the answer short enough to read on a projector (about 120 words).
This is teaching, not clinical advice. Never ask for or use a real patient name, MRN, or date of birth.
"""

SYSTEM_MCP = """You are Claude, in a teaching demo for a childhood-cancer conference.

You HAVE a medical-terminologies MCP plug: ICD-11, LOINC, RxNorm, MeSH, ATC, CID-10, and ICD-10 to ICD-11 mapping.

When the question is a code, mapping, drug name, lab code, or official term, USE the tools. Do not guess a code if a tool can look it up.

After a tool returns:
- Lead with the official code and display name.
- Name the source (WHO ICD-11, RxNorm, LOINC, MeSH, ATC).
- Keep the answer short enough to read on a projector (about 120 words).

This is teaching, not clinical advice. Never ask for or use a real patient name, MRN, or date of birth.
"""

client = anthropic.Anthropic(api_key=API_KEY or None)

app = FastAPI(title="BedsideAI MCP chat", docs_url=None, redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

_hits: dict[str, list[float]] = defaultdict(list)


def _client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def _too_many(ip: str) -> bool:
    now = time.time()
    recent = [t for t in _hits[ip] if now - t < RATE_WINDOW]
    _hits[ip] = recent
    if len(recent) >= RATE_LIMIT:
        return True
    recent.append(now)
    return False


def _sse(payload: dict[str, Any]) -> str:
    return "data: " + json.dumps(payload, ensure_ascii=False) + "\n\n"


def _clean_messages(raw: Any) -> list[dict[str, str]]:
    if not isinstance(raw, list):
        return []
    out: list[dict[str, str]] = []
    for item in raw[-MAX_HISTORY:]:
        if not isinstance(item, dict):
            continue
        role = str(item.get("role") or "")
        text = str(item.get("content") or "").strip()
        if role not in ("user", "assistant") or not text:
            continue
        if len(text) > MAX_PROMPT:
            text = text[:MAX_PROMPT]
        out.append({"role": role, "content": text})
    return out


def _block_text(block: Any) -> str:
    block_type = getattr(block, "type", None) or (
        block.get("type") if isinstance(block, dict) else None
    )
    if block_type == "text":
        return getattr(block, "text", None) or (
            block.get("text") if isinstance(block, dict) else ""
        ) or ""
    return ""


def _tool_event(block: Any) -> dict[str, Any] | None:
    block_type = getattr(block, "type", None) or (
        block.get("type") if isinstance(block, dict) else None
    )
    if block_type == "mcp_tool_use":
        name = getattr(block, "name", None) or (
            block.get("name") if isinstance(block, dict) else "tool"
        )
        raw_input = getattr(block, "input", None)
        if raw_input is None and isinstance(block, dict):
            raw_input = block.get("input") or {}
        try:
            shown = json.dumps(raw_input, ensure_ascii=False)
        except Exception:
            shown = str(raw_input)
        if len(shown) > 400:
            shown = shown[:400] + "…"
        return {"type": "tool", "name": str(name), "detail": shown}
    if block_type == "mcp_tool_result":
        is_error = getattr(block, "is_error", None)
        if is_error is None and isinstance(block, dict):
            is_error = block.get("is_error")
        content = getattr(block, "content", None)
        if content is None and isinstance(block, dict):
            content = block.get("content")
        snippet = ""
        if isinstance(content, list) and content:
            first = content[0]
            snippet = getattr(first, "text", None) or (
                first.get("text") if isinstance(first, dict) else ""
            ) or ""
        elif isinstance(content, str):
            snippet = content
        snippet = str(snippet).strip().replace("\n", " ")
        if len(snippet) > 280:
            snippet = snippet[:280] + "…"
        return {
            "type": "tool_result",
            "ok": not bool(is_error),
            "detail": snippet or ("Tool error" if is_error else "Tool finished"),
        }
    return None


def _run_haiku(messages: list[dict[str, str]], use_mcp: bool) -> Iterator[str]:
    """Call Haiku. Yield SSE lines. Fail with a clear chunk name in the error."""
    kwargs: dict[str, Any] = {
        "model": MODEL,
        "max_tokens": 900,
        "system": SYSTEM_MCP if use_mcp else SYSTEM_PLAIN,
        "messages": messages,
    }
    if use_mcp:
        kwargs["mcp_servers"] = [
            {
                "type": "url",
                "url": MCP_URL,
                "name": MCP_NAME,
            }
        ]
        kwargs["tools"] = [
            {
                "type": "mcp_toolset",
                "mcp_server_name": MCP_NAME,
            }
        ]
        kwargs["betas"] = ["mcp-client-2025-11-20"]

    yield _sse(
        {
            "type": "status",
            "text": "Looking up live codes…" if use_mcp else "Asking Haiku…",
        }
    )

    try:
        if use_mcp:
            response = client.beta.messages.create(**kwargs)
        else:
            response = client.messages.create(**kwargs)
    except anthropic.APIStatusError as err:
        body = ""
        try:
            body = err.response.text[:400]
        except Exception:
            body = str(err)
        yield _sse(
            {
                "type": "error",
                "message": "The Haiku request failed in the API call: "
                + str(err)
                + ((" — " + body) if body else ""),
            }
        )
        return
    except Exception as err:
        yield _sse(
            {
                "type": "error",
                "message": "The Haiku request failed in the API call: " + str(err),
            }
        )
        return

    try:
        text_parts: list[str] = []
        for block in response.content:
            tool = _tool_event(block)
            if tool:
                yield _sse(tool)
                continue
            piece = _block_text(block)
            if piece:
                text_parts.append(piece)
        answer = "\n\n".join(part for part in text_parts if part).strip()
        if not answer:
            answer = (
                "Haiku returned no text. If the terms plug was on, the tool may have failed — try again."
            )
        yield _sse({"type": "text", "text": answer})
        yield _sse({"type": "done"})
    except Exception as err:
        yield _sse(
            {
                "type": "error",
                "message": "The Haiku request failed while reading the reply: " + str(err),
            }
        )


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "ok": bool(API_KEY),
        "model": MODEL,
        "mcp": MCP_URL,
        "key": "present" if API_KEY else "missing",
    }


@app.get("/")
def home() -> HTMLResponse:
    """Full-page Claude desk so the live demo works even without Jekyll."""
    try:
        css = (ROOT / "assets" / "css" / "claude-desk.css").read_text(
            encoding="utf-8"
        )
        desk = (ROOT / "_includes" / "claude-desk.html").read_text(encoding="utf-8")
        js = (ROOT / "assets" / "js" / "block-04-chat.js").read_text(encoding="utf-8")
    except Exception as err:
        return HTMLResponse(
            "<p>The chat page failed while reading files: "
            + str(err)
            + "</p>",
            status_code=500,
        )
    html = (
        "<!DOCTYPE html><html lang='en' class='claude-full'><head>"
        "<meta charset='utf-8'>"
        "<meta name='viewport' content='width=device-width, initial-scale=1'>"
        "<title>Claude · Haiku 4.5 · medical terms</title>"
        "<style>"
        + css
        + "</style></head><body class='claude-full'>"
        "<main class='claude-full-wrap'>"
        + desk
        + "</main><script>"
        + js
        + "</script></body></html>"
    )
    return HTMLResponse(html)


@app.post("/api/chat")
async def chat(request: Request) -> StreamingResponse:
    ip = _client_ip(request)
    if _too_many(ip):
        return StreamingResponse(
            iter(
                [
                    _sse(
                        {
                            "type": "error",
                            "message": "Too many questions in a minute. Wait a moment, then try again.",
                        }
                    )
                ]
            ),
            media_type="text/event-stream",
        )

    if not API_KEY:
        return StreamingResponse(
            iter(
                [
                    _sse(
                        {
                            "type": "error",
                            "message": "No Anthropic key. Put ANTHROPIC_API in the project .env file, then restart the chat server.",
                        }
                    )
                ]
            ),
            media_type="text/event-stream",
        )

    try:
        body = await request.json()
    except Exception as err:
        return StreamingResponse(
            iter(
                [
                    _sse(
                        {
                            "type": "error",
                            "message": "The chat failed while reading the request JSON: "
                            + str(err),
                        }
                    )
                ]
            ),
            media_type="text/event-stream",
        )

    try:
        prompt = str(body.get("prompt") or "").strip()
        if not prompt:
            raise ValueError("Type a question first.")
        if len(prompt) > MAX_PROMPT:
            prompt = prompt[:MAX_PROMPT]
        history = _clean_messages(body.get("messages"))
        use_mcp = bool(body.get("use_mcp"))
        messages = history + [{"role": "user", "content": prompt}]
    except Exception as err:
        return StreamingResponse(
            iter(
                [
                    _sse(
                        {
                            "type": "error",
                            "message": "The chat failed while preparing the prompt: "
                            + str(err),
                        }
                    )
                ]
            ),
            media_type="text/event-stream",
        )

    return StreamingResponse(
        _run_haiku(messages, use_mcp),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.exception_handler(Exception)
async def on_error(_request: Request, err: Exception) -> JSONResponse:
    return JSONResponse(
        {"ok": False, "message": "The chat server failed: " + str(err)},
        status_code=500,
    )


if __name__ == "__main__":
    import uvicorn

    if not API_KEY:
        print("Missing ANTHROPIC_API in .env — the chat will refuse questions until you add it.")
    print("Haiku chat on http://127.0.0.1:%s  (MCP: %s)" % (CHAT_PORT, MCP_URL))
    uvicorn.run(app, host="127.0.0.1", port=CHAT_PORT, reload=False)
