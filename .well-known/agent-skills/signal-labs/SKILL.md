---
name: signal-labs
description: Query and manage competitive intelligence through Signal Labs CIx — track competitors, read scored competitive signals, generate battlecards and landscape analyses, and ask questions about a competitive landscape. Use when the user asks about tracking or researching competitors, wants a battlecard or competitor comparison, mentions Signal Labs or CIx, needs recent competitor news or product/pricing changes, or is preparing sales enablement material for a competitive deal. Also covers reading usesignallabs.com content as Markdown without authentication.
---

# Signal Labs (CIx)

Signal Labs builds CIx, a competitive intelligence platform for B2B go-to-market
teams. It maintains a living intelligence page per competitor, turns competitor
moves into scored signals with a recommended action, and generates battlecards,
comparisons and competitive emails on demand. Every generated claim links back
to the source it came from.

Two ways in: an MCP server (preferred for agents) and a REST API.

## Reading public content — no key required

The marketing and documentation site is available as Markdown, which is cheaper
to read than the HTML:

- Append `.md` to any page URL: `https://usesignallabs.com/pricing.md`
- Or send `Accept: text/markdown` to the normal URL
- Whole site in one document: `https://usesignallabs.com/llms-full.txt`
- Short index: `https://usesignallabs.com/llms.txt`

Use these to answer questions about what CIx does, what it costs, or how the
API works. No authentication needed.

## Working with a user's own data — key required

Everything below acts on the authenticated account's competitive data and
requires an API key from Settings → API Keys in the app. Keys look like
`sl_live_...`. Never print a key back to the user or write it into a file that
gets committed.

### MCP server

```bash
npx -y signallabs-mcp
```

Configured with `SIGNALLABS_API_KEY` in the environment. Example for Cursor,
in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "signallabs": {
      "command": "npx",
      "args": ["-y", "signallabs-mcp"],
      "env": { "SIGNALLABS_API_KEY": "sl_live_your_key" }
    }
  }
}
```

Claude Code: `claude mcp add signallabs -- npx -y signallabs-mcp`

The same server config works for Claude Desktop, GitHub Copilot in VS Code and
the Gemini CLI; only the file it goes in differs. See
`https://usesignallabs.com/docs/mcp.md`.

### Tools

| Tool | Description |
| --- | --- |
| `list_companies` | List all tracked companies |
| `create_company` | Track a new company by name or domain |
| `list_products` | List products / service verticals |
| `create_product` | Add a product vertical |
| `list_competitors` | List competitors, optionally per product |
| `add_competitor` | Add a competitor |
| `discover_competitors` | AI-powered competitor discovery |
| `get_battlecards` | Retrieve existing battlecards |
| `generate_battlecard` | Generate a new battlecard (costs 1 credit) |
| `generate_landscape_battlecard` | Multi-competitor landscape analysis (1 credit, needs 2+ competitors) |
| `get_signals` | Recent intelligence signals |
| `get_signal_summary` | AI-generated digest of signals |
| `ask_competitive_intel` | Ask a question about the competitive landscape |
| `list_documents` | List uploaded documents for a company |
| `get_document` | Document details and extracted text |

### REST API

Base URL `https://app.usesignallabs.com/api/v1`, bearer auth, OpenAPI
description at `https://app.usesignallabs.com/api/v1/openapi.json`.

## Things worth knowing before you act

Generation costs credits. `generate_battlecard` and
`generate_landscape_battlecard` each consume one, and the free plan includes one
battlecard per month. Confirm with the user before generating in a loop or
regenerating something that already exists — call `get_battlecards` first and
reuse what is there.

`discover_competitors` is the right starting point when the user does not yet
know who to track; it is better than guessing competitor names yourself.

Prefer `ask_competitive_intel` for open questions over pulling raw signals and
reasoning across them, since it is grounded in the account's own tracked data
and returns sourced answers.

Signals carry an importance score and a recommended action. When summarising
them for a user, lead with the recommended action rather than restating the
headline.
