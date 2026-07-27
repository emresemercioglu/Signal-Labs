---
title: "Quickstart — Signal Labs Docs"
description: "Track your first competitor in 3 minutes using the Signal Labs API with curl, JavaScript, or Python."
url: https://usesignallabs.com/docs/quickstart
---

# Quickstart

Track your first competitor in 3 minutes.

## Prerequisites

1.  Sign up at [app.usesignallabs.com](https://app.usesignallabs.com)
2.  Go to **Settings > API Keys** and create an API key

1

## Create Your Company

cURL JavaScript Python

```bash
curl -X POST https://app.usesignallabs.com/api/v1/companies \
  -H "Authorization: Bearer sl_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{"domain": "yourcompany.com"}'
```

```javascript
import { SignalLabs } from '@signal-labs/sdk';

const sl = new SignalLabs(process.env.SIGNALLABS_API_KEY);

const company = await sl.companies.create({ domain: 'yourcompany.com' });
console.log(company.id);
```

```python
from signallabs import SignalLabs

sl = SignalLabs(api_key="sl_live_your_key")

company = sl.companies.create(domain="yourcompany.com")
print(company["id"])
```

This returns right away, then analyses your website in the background for 30–90 seconds to extract your offerings and value propositions. Everything below works immediately, but discovery and battlecards are sharper once that finishes — poll `GET /v1/companies/{id}/profile` until `profile_status` reads `ready`. See [Asynchronous Operations](https://usesignallabs.com/docs#asynchronous-operations).

2

## Discover Competitors

cURL JavaScript Python

```bash
curl -X POST https://app.usesignallabs.com/api/v1/companies/{company_id}/competitors/discover \
  -H "Authorization: Bearer sl_live_your_key"
```

```javascript
const suggestions = await sl.companies.competitors(company.id).discover();
console.log(suggestions);
```

```python
suggestions = sl.companies.competitors(company["id"]).discover()
print(suggestions)
```

3

## Add a Competitor

cURL JavaScript Python

```bash
curl -X POST https://app.usesignallabs.com/api/v1/companies/{company_id}/competitors \
  -H "Authorization: Bearer sl_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{"competitors": [{"name": "Competitor X", "website": "competitor.com"}]}'
```

```javascript
const competitors = await sl.companies.competitors(company.id).add({
  name: 'Competitor X',
  website: 'competitor.com',
});
```

```python
competitors = sl.companies.competitors(company["id"]).add(
    name="Competitor X",
    website="competitor.com"
)
```

4

## Generate a Battlecard

cURL JavaScript Python

```bash
curl -X POST https://app.usesignallabs.com/api/v1/companies/{company_id}/battlecards/generate \
  -H "Authorization: Bearer sl_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{"competitor_id": "competitor-uuid", "enablement_focus": "gtm_sales", "special_instructions": "Focus on enterprise pricing and our SOC 2 advantage"}'
```

```javascript
const battlecard = await sl.companies.battlecards(company.id).generate({
  competitor_id: competitors[0].id,
  enablement_focus: 'gtm_sales',
  special_instructions: 'Focus on enterprise pricing and our SOC 2 advantage',
});

console.log(battlecard.overview);
console.log(battlecard.win_strategy);
```

```python
battlecard = sl.companies.battlecards(company["id"]).generate(
    competitor_id=competitors[0]["id"],
    enablement_focus="gtm_sales",
    special_instructions="Focus on enterprise pricing and our SOC 2 advantage"
)

print(battlecard["overview"])
print(battlecard["win_strategy"])
```

The `special_instructions` field is optional (max 10,000 characters) — use it to guide the AI with specific context, focus areas, or instructions.

5

## Attach Documents (optional)

You can upload competitive documents and attach them as additional context when generating battlecards:

cURL JavaScript Python

```bash
# Upload a document
curl -X POST https://app.usesignallabs.com/api/v1/documents/upload \
  -H "Authorization: Bearer sl_live_your_key" \
  -F "file=@competitor-report.pdf" \
  -F "company_id=your-company-id" \
  -F "title=Q1 Competitor Report"

# Then generate with document context
curl -X POST https://app.usesignallabs.com/api/v1/companies/{company_id}/battlecards/generate \
  -H "Authorization: Bearer sl_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{"competitor_id": "...", "enablement_focus": "gtm_sales", "document_ids": ["document-id"]}'
```

```javascript
// Uploading is multipart, so it is not part of the SDK yet — post the
// file directly, then pass the returned id to the SDK.
const form = new FormData();
form.append('file', new Blob([await readFile('competitor-report.pdf')]), 'competitor-report.pdf');
form.append('company_id', company.id);
form.append('title', 'Q1 Competitor Report');

const res = await fetch('https://app.usesignallabs.com/api/v1/documents/upload', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.SIGNALLABS_API_KEY}` },
  body: form,
});
const { data: doc } = await res.json();

// Then generate with document context
const battlecard = await sl.companies.battlecards(company.id).generate({
  competitor_id: competitors[0].id,
  enablement_focus: 'gtm_sales',
  document_ids: [doc.id],
});
```

```python
# Uploading is multipart, so it is not part of the SDK yet — post the
# file directly, then pass the returned id to the SDK.
import os, requests

with open("competitor-report.pdf", "rb") as fh:
    res = requests.post(
        "https://app.usesignallabs.com/api/v1/documents/upload",
        headers={"Authorization": f"Bearer {os.environ['SIGNALLABS_API_KEY']}"},
        files={"file": fh},
        data={"company_id": company["id"], "title": "Q1 Competitor Report"},
    )
doc = res.json()["data"]

# Then generate with document context
battlecard = sl.companies.battlecards(company["id"]).generate(
    competitor_id=competitors[0]["id"],
    enablement_focus="gtm_sales",
    document_ids=[doc["id"]]
)
```

Combined document text must not exceed 100,000 characters. Documents are automatically parsed, chunked, and embedded for RAG.

6

## Generate a Landscape Analysis (optional)

Compare multiple competitors at once with a landscape battlecard. Takes between 2 and 8 competitor IDs.

cURL JavaScript Python

```bash
curl -X POST https://app.usesignallabs.com/api/v1/companies/{company_id}/battlecards/generate \
  -H "Authorization: Bearer sl_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{"competitor_ids": ["competitor-id-1", "competitor-id-2"], "enablement_focus": "landscape"}'
```

```javascript
const landscape = await sl.companies.battlecards(company.id).generateLandscape({
  competitor_ids: [competitors[0].id, competitors[1].id],
});

console.log(landscape.overview);
```

```python
landscape = sl.companies.battlecards(company["id"]).generate_landscape(
    competitor_ids=[competitors[0]["id"], competitors[1]["id"]]
)

print(landscape["overview"])
```

## What's Next?

[MCP Server](https://usesignallabs.com/docs/mcp) [AI Onboarding](https://usesignallabs.com/docs/ai-onboarding) [Using the Dashboard](https://usesignallabs.com/docs/dashboard)
