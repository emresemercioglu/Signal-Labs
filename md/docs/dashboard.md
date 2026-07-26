---
title: "Using the Dashboard — Signal Labs Docs"
description: "Overview of the Signal Labs web application dashboard: companies, competitors, battlecards, signals, AI chat, and API key management."
url: https://usesignallabs.com/docs/dashboard
---

# Using the Dashboard

Signal Labs is available as both a web application and an API. This guide covers the web app at [app.usesignallabs.com](https://app.usesignallabs.com).

## Overview

The Signal Labs dashboard provides a full visual interface for competitive intelligence:

-   **Companies** — Track your company and manage your competitive landscape
-   **Competitors** — Add competitors manually or use AI-powered discovery
-   **Battlecards** — Generate and view AI-powered competitive battlecards with 5 enablement focuses (GTM/Sales, Product, Marketing/Growth, Leadership, Landscape)
-   **Signals** — Monitor real-time competitive intelligence from competitor blogs and news
-   **Chat CIx** — Ask AI questions about your competitive landscape using your battlecards, signals, and uploaded documents
-   **Data Library** — Upload competitive documents (PDFs, DOCX, XLSX) for AI analysis
-   **Newsletters** — Configure automated competitive intelligence newsletters for your team

## API Keys

To use the API or MCP server, create API keys in **Settings > API Keys**:

1.  Navigate to **Settings**
2.  Click **Create API Key**
3.  Give it a descriptive name (e.g., "Production", "MCP Server")
4.  Copy the key immediately — it's only shown once
5.  Use it in the `Authorization: Bearer sl_live_...` header

## Integrations

-   **Slack** — Ask competitive questions directly in Slack with `@CIX`
-   **API** — REST API for programmatic access ([View API docs](https://usesignallabs.com/docs))
-   **MCP** — AI agent integration for Claude, Cursor, Copilot ([Setup guide](https://usesignallabs.com/docs/mcp))
