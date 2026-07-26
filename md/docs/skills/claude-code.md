---
title: "Claude Code Snippet — Signal Labs Docs"
description: "CLAUDE.md snippet for persistent AI knowledge about the Signal Labs competitive intelligence API."
url: https://usesignallabs.com/docs/skills/claude-code
---

# Claude Code Snippet

Add this snippet to your project's `CLAUDE.md` file for persistent AI knowledge about Signal Labs.

## What is CLAUDE.md?

`CLAUDE.md` is a file in your project root that Claude Code reads automatically. Adding Signal Labs context here means Claude will always know how to use the API correctly.

## The Snippet

Copy the following into your project's `CLAUDE.md`:

Markdown

```bash
## Signal Labs Competitive Intelligence API

This project uses Signal Labs for competitive intelligence.
API docs: https://usesignallabs.com/docs

### Setup
- SDK: @signal-labs/sdk (JS/TS) or signallabs (Python)
- API Key: stored in SIGNALLABS_API_KEY env var
- MCP: claude mcp add signallabs -- npx -y signallabs-mcp

### Core API Pattern
1. sl.companies.create({domain}) — track a company
2. sl.companies.competitors(companyId).discover() — find competitors
3. sl.companies.competitors(companyId).add({name, website}) — add competitor
4. sl.companies.battlecards(companyId).generate({competitor_id, enablement_focus}) — generate battlecard (1 credit)
5. sl.companies.signals(companyId).list() — get competitive signals
6. sl.ai.chat({message, company_id}) — ask AI about competitive landscape

### Enablement Focus Types
gtm_sales (default), product, marketing_growth, leadership

### Error Handling
SDK throws SignalLabsError with code, message, type, upgradeUrl.
On prerequisite errors, follow required_step.
```

## Setup

### Install the SDK

JavaScript Python

```bash
npm install @signal-labs/sdk
```

```bash
pip install signallabs
```

### Add MCP Server

Bash

```bash
claude mcp add signallabs -- npx -y signallabs-mcp
```

## Core API Pattern

| Step | Method | Description |
| --- | --- | --- |
| 1 | sl.companies.create({domain}) | Track a company |
| 2 | sl.companies.competitors(id).discover() | Find competitors |
| 3 | sl.companies.competitors(id).add({name, website}) | Add competitor |
| 4 | sl.companies.battlecards(id).generate({...}) | Generate battlecard (1 credit) |
| 5 | sl.companies.signals(id).list() | Get competitive signals |
| 6 | sl.ai.chat({message, company_id}) | Ask AI about landscape |

## Error Handling

The SDK throws `SignalLabsError` with the following properties:

-   `code` — Machine-readable error code
-   `message` — Human-readable description
-   `type` — Error category
-   `upgradeUrl` — Link to upgrade (for credit/limit errors)

On prerequisite errors, check the `required_step` field and follow the `docs_url` for guidance.
