---
title: "API Introduction — Signal Labs Docs"
description: "Signal Labs API documentation. Authentication, error handling, rate limits, and getting started with the competitive intelligence API."
url: https://usesignallabs.com/docs
---

# Introduction

Signal Labs is a real-time competitive intelligence platform. Track competitors, generate AI-powered battlecards, and monitor competitive and market signals from the dashboard, or programmatically via REST API, native SDKs, or AI tools, agents, and CLIs via MCP.

## Base URL

All API requests are made to the following base URL:

Base URL

```bash
https://app.usesignallabs.com/api/v1
```

## Authentication

All API requests require a Bearer token in the `Authorization` header:

Bash

```bash
curl https://app.usesignallabs.com/api/v1/companies \
  -H "Authorization: Bearer sl_live_your_key_here"
```

Get your API key from [Settings > API Keys](https://app.usesignallabs.com/settings?tab=api-keys).

## Response Format

All responses return JSON with a consistent structure:

JSON

```json
{
  "data": { ... },
  "meta": {
    "total": 5
  }
}
```

List endpoints return `data` as an array. Single-resource endpoints return `data` as an object.

## Endpoints

Document endpoints are listed separately under [Documents](https://usesignallabs.com/docs#documents). A machine-readable OpenAPI description of everything below is available at `/v1/openapi.json`.

| Method | Path | Description |
| --- | --- | --- |
| GET | /v1/companies | List the companies your organization tracks |
| POST | /v1/companies | Track a company. Returns immediately; profile analysis continues in the background |
| GET | /v1/companies/{id} | Get a single company |
| GET | /v1/companies/{id}/profile | Offerings and value propositions extracted from the website, plus profile_status |
| POST | /v1/companies/{id}/profile/refresh | Re-extract the profile from the website |
| GET | /v1/companies/{id}/products | List product / service verticals |
| POST | /v1/companies/{id}/products | Add a product vertical |
| GET | /v1/companies/{id}/competitors | List tracked competitors |
| POST | /v1/companies/{id}/competitors | Add competitors. Returns immediately; research continues in the background |
| POST | /v1/companies/{id}/competitors/discover | AI competitor suggestions. Creates nothing and consumes no allowance |
| GET | /v1/competitors/{id}/page | The researched competitor page, plus generation_status |
| GET | /v1/companies/{id}/battlecards | List battlecards |
| POST | /v1/companies/{id}/battlecards/generate | Generate a battlecard (1 credit) |
| GET | /v1/companies/{id}/signals | Recent competitive and market signals |
| GET | /v1/companies/{id}/signals/summary | AI-generated digest of recent signals |
| POST | /v1/ai/chat | Ask a question about your competitive landscape |

## Asynchronous Operations

Creating a company and adding a competitor both return before their work is finished. Researching a website takes 30–90 seconds, so the API records the row, responds, and continues in the background rather than holding the connection open.

This means a company you just created has no offerings yet, and a competitor you just added has no researched page yet. Poll until the status field reports completion:

Bash

```bash
# profile_status is "pending" while the website is being analysed,
# then "ready". generation_status behaves the same way for competitors.
curl https://app.usesignallabs.com/api/v1/companies/{company_id}/profile \
  -H "Authorization: Bearer sl_live_your_key_here"
```

**Why this matters:** battlecards are grounded in the competitor's researched page and your own company profile. Generating one the instant after adding a competitor still works and still costs a credit, but the result is thinner. Wait for `generation_status` to read `ready` first.

## Errors

Errors return a structured JSON object with actionable guidance:

JSON

```json
{
  "error": {
    "code": "insufficient_credits",
    "message": "Battlecard generation requires 1 credit. Your organization has 0 remaining.",
    "type": "credit_error",
    "credits_remaining": 0,
    "credits_required": 1,
    "upgrade_url": "https://app.usesignallabs.com/settings/billing"
  }
}
```

### Error Types

| HTTP Code | Type | Description |
| --- | --- | --- |
| 400 | validation_error | Missing or invalid parameters |
| 400 | prerequisite_error | Must complete a prior step first (includes required_step and docs_url) |
| 401 | authentication_error | Missing, invalid, or revoked API key |
| 403 | credit_error | Insufficient credits for this operation |
| 403 | limit_error | Plan limit reached (e.g., competitor count) |
| 404 | not_found_error | Resource not found |
| 429 | rate_limit_error | Daily rate limit exceeded (includes retry_after) |
| 400 | invalid_file | File type not supported or exceeds 25MB |
| 400 | document_context_too_large | Combined document text exceeds 100,000 character limit |
| 400 | document_not_ready | Document not found or not yet processed |
| 403 | storage_quota_exceeded | Organization storage quota exceeded |
| 500 | server_error | Internal server error |

## Rate Limits

| Plan | Requests / Day |
| --- | --- |
| Free | 100 |
| Team | 10,000 |

### Storage Quotas

| Plan | Storage Quota |
| --- | --- |
| Free | 100 MB |
| Team | 10 GB |

## Credits

| Operation | Cost |
| --- | --- |
| Generate Battlecard | 1 credit |
| AI Modify Battlecard | 0.5 credits |
| Create Company | Free |
| Add Competitor | Free (plan limits apply) |
| Add Product | Free |
| List / Get (all read ops) | Free |

## Documents

Upload competitive documents for AI analysis and RAG-powered battlecard generation.

| Method | Path | Description |
| --- | --- | --- |
| POST | /v1/documents/upload | Upload a document (multipart form data, max 25MB). Supported: PDF, DOCX, XLSX, CSV, PPTX, TXT, MD, PNG, JPG, WebP. |
| GET | /v1/documents?company_id={id} | List documents with storage usage stats and auto-tags |
| GET | /v1/documents/{id} | Get document detail including extracted text and auto-tags |
| DELETE | /v1/documents/{id} | Delete a document and its RAG chunks |

Documents are automatically parsed, chunked, and embedded for RAG. Use `document_ids` when generating battlecards to include uploaded documents as additional context.

After processing, each document is also auto-tagged in the background: an AI pass identifies which of your tracked competitors it discusses, so the document surfaces on those competitors and in chat retrieval without you filing it manually. The upload response returns `auto_tagging: "pending"`; read the resulting `auto_tags` from either `GET` endpoint a few seconds later.

## Enablement Focus Types

When generating battlecards, specify one of these focus types:

| Focus | Description | Parameter |
| --- | --- | --- |
| gtm_sales | GTM / Sales enablement (default) | competitor_id |
| product | Product & engineering | competitor_id |
| marketing_growth | Marketing & growth | competitor_id |
| leadership | Strategy & leadership | competitor_id |
| custom | Written entirely from your own brief. Requires special_instructions | competitor_id |
| landscape | Multi-competitor landscape analysis | competitor_ids (array of 2–8) |

**Note:** The `landscape` focus requires `competitor_ids` instead of `competitor_id`, with between 2 and 8 competitor IDs. Anything beyond the eighth is ignored, so split larger comparisons into multiple reports.

## SDKs

-   **JavaScript / TypeScript:** `npm install @signal-labs/sdk`
-   **Python:** `pip install signallabs`

## MCP Server

For AI agents (Claude, Cursor, Copilot):

Bash

```bash
npx signallabs-mcp
```

See the [MCP Setup Guide](https://usesignallabs.com/docs/mcp) for full configuration instructions.

## What's Next?

[Quickstart](https://usesignallabs.com/docs/quickstart) [MCP Server](https://usesignallabs.com/docs/mcp) [Using the Dashboard](https://usesignallabs.com/docs/dashboard)
