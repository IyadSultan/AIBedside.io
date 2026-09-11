#!/bin/zsh
# Starts the local Haiku chat server for Block 4.
# Reads ANTHROPIC_API from the project .env file.

set -e
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Missing .env — copy .env.example and add your Anthropic API key."
  exit 1
fi

exec uv run --with fastapi --with 'uvicorn[standard]' --with anthropic --with python-dotenv \
  python mcp-chat/server.py
