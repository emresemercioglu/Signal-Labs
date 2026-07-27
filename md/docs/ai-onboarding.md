---
title: "AI Onboarding — Signal Labs Docs"
description: "Everything an AI agent needs to know to use Signal Labs: authentication, core workflow, endpoints, and credits."
url: https://usesignallabs.com/docs/ai-onboarding
---

# AI Onboarding

Everything an AI agent needs to know to use Signal Labs.

## What is Signal Labs?

Signal Labs is a competitive intelligence platform. It lets you track competitors, generate AI-powered battlecards, and monitor competitive signals via API or MCP.

## Authentication

API key in the `Authorization` header:

HTTP

```bash
Authorization: Bearer sl_live_...
```

Get a key at [app.usesignallabs.com/settings](https://app.usesignallabs.com/settings?tab=api-keys).

Base URL: `https://app.usesignallabs.com/api/v1`

## Core Workflow

1.  **Create a company:** `POST /v1/companies` with `{"domain": "example.com"}`
2.  **Discover competitors:** `POST /v1/companies/{id}/competitors/discover`
3.  **Add competitors:** `POST /v1/companies/{id}/competitors`
4.  **Generate battlecards:** `POST /v1/companies/{id}/battlecards/generate` (1 credit)
5.  **Monitor signals:** `GET /v1/companies/{id}/signals`
6.  **Ask AI:** `POST /v1/ai/chat` with `{"message": "...", "company_id": "..."}`

Products are optional. If not specified, competitors default to company-level.

**Steps 1 and 3 are asynchronous.** They return as soon as the row is written, then research the website in the background for 30–90 seconds. Poll `GET /v1/companies/{id}/profile` until `profile_status` is `ready`, and `GET /v1/competitors/{id}/page` until `generation_status` is `ready`, before relying on that data. Battlecards generated earlier still succeed and still cost a credit, but they are grounded in less material.

## Endpoints

| Method | Path | Description | Cost |
| --- | --- | --- | --- |
| GET | /v1/companies | List companies | Free |
| POST | /v1/companies | Create company | Free |
| GET | /v1/companies/{id} | Get company | Free |
| GET | /v1/companies/{id}/profile | Offerings, value propositions, profile_status | Free |
| POST | /v1/companies/{id}/profile/refresh | Re-extract profile from the website | Free |
| GET | /v1/companies/{id}/products | List products | Free |
| POST | /v1/companies/{id}/products | Create product | Free |
| GET | /v1/companies/{id}/competitors | List competitors | Free |
| POST | /v1/companies/{id}/competitors | Add competitors | Free |
| POST | /v1/companies/{id}/competitors/discover | AI discover. Returns suggestions only, creates nothing | Free |
| GET | /v1/competitors/{id}/page | Researched competitor page, generation_status | Free |
| GET | /v1/companies/{id}/battlecards | List battlecards | Free |
| POST | /v1/companies/{id}/battlecards/generate | Generate battlecard. Optional: include special_instructions (max 10,000 chars) to provide custom context or focus areas. | 1 credit |
| GET | /v1/companies/{id}/signals | List signals | Free |
| GET | /v1/companies/{id}/signals/summary | Signal digest | Free |
| POST | /v1/ai/chat | Ask AI | Free |
| POST | /v1/documents/upload | Upload document (multipart, max 25MB) | Free |
| GET | /v1/documents | List documents | Free |
| GET | /v1/documents/{id} | Get document | Free |
| DELETE | /v1/documents/{id} | Delete document | Free |

Documents are automatically processed for RAG (parsing, chunking, embedding). Use `document_ids` when generating battlecards to include as context (max 100k chars combined).

## Enablement Focus Types

When generating battlecards, use one of these focus types:

-   `gtm_sales` (default)
-   `product`
-   `marketing_growth`
-   `leadership`
-   `custom` (requires `special_instructions`)
-   `landscape`

**Note:** `landscape` requires `competitor_ids` (an array of 2–8 IDs) instead of `competitor_id`. IDs beyond the eighth are ignored.

Documents uploaded via the API are auto-tagged in the background against your tracked competitors; read `auto_tags` from either document `GET` endpoint.

## MCP Server

For AI tools, use the MCP server:

Bash

```bash
npx signallabs-mcp
```

Requires the `SIGNALLABS_API_KEY` environment variable. See the [MCP setup guide](https://usesignallabs.com/docs/mcp) for full details.
