---
title: "MCP Server — Signal Labs Docs"
description: "Use Signal Labs competitive intelligence from Claude, Cursor, Copilot, Gemini, and other AI tools via the Model Context Protocol."
url: https://usesignallabs.com/docs/mcp
---

# MCP Server

Use Signal Labs competitive intelligence directly from Claude, Cursor, Copilot, Gemini, and other AI tools via the Model Context Protocol.

The Signal Labs MCP server lets AI assistants track competitors, generate battlecards, and query competitive intelligence on your behalf.

## Installation

Bash

```bash
npx signallabs-mcp
```

Requires a Signal Labs API key from [Settings > API Keys](https://app.usesignallabs.com/settings?tab=api-keys).

## Setup by Tool

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

JSON

```json
{
  "mcpServers": {
    "signallabs": {
      "command": "npx",
      "args": ["-y", "signallabs-mcp"],
      "env": {
        "SIGNALLABS_API_KEY": "sl_live_your_key"
      }
    }
  }
}
```

### Claude Code

Bash

```bash
claude mcp add signallabs -- npx -y signallabs-mcp
export SIGNALLABS_API_KEY=sl_live_your_key
```

### Cursor

Add to `.cursor/mcp.json` in your project root:

JSON

```json
{
  "mcpServers": {
    "signallabs": {
      "command": "npx",
      "args": ["-y", "signallabs-mcp"],
      "env": {
        "SIGNALLABS_API_KEY": "sl_live_your_key"
      }
    }
  }
}
```

### GitHub Copilot (VS Code)

Add to VS Code `settings.json`:

JSON

```json
{
  "mcp": {
    "servers": {
      "signallabs": {
        "command": "npx",
        "args": ["-y", "signallabs-mcp"],
        "env": {
          "SIGNALLABS_API_KEY": "sl_live_your_key"
        }
      }
    }
  }
}
```

### Gemini CLI

Add to `.gemini/settings.json`:

JSON

```json
{
  "mcpServers": {
    "signallabs": {
      "command": "npx",
      "args": ["-y", "signallabs-mcp"],
      "env": {
        "SIGNALLABS_API_KEY": "sl_live_your_key"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
| --- | --- |
| list_companies | List all tracked companies |
| create_company | Track a new company by name or domain |
| list_products | List products / service verticals |
| create_product | Add a product vertical |
| list_competitors | List competitors (optionally per product) |
| add_competitor | Add a competitor |
| discover_competitors | AI-powered competitor discovery |
| get_battlecards | Retrieve battlecards |
| generate_battlecard | Generate a new AI battlecard (1 credit) |
| generate_landscape_battlecard | Multi-competitor landscape analysis (1 credit, requires 2+ competitors) |
| get_signals | Get recent intelligence signals |
| get_signal_summary | AI-generated signal digest |
| ask_competitive_intel | Ask questions about your competitive landscape |
| list_documents | List uploaded documents for a company |
| get_document | Get document details and extracted text |

## Example Conversations

Once configured, you can ask your AI assistant questions like:

-   "What companies am I tracking in Signal Labs?"
-   "Discover competitors for my company"
-   "Generate a sales battlecard for us vs \[Competitor\]"
-   "What are the latest competitive signals?"
-   "Summarize competitive activity from the last week"
