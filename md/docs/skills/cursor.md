---
title: "Cursor Skill — Signal Labs Docs"
description: "AI prompt and instructions for using the Signal Labs competitive intelligence API in Cursor IDE."
url: https://usesignallabs.com/docs/skills/cursor
---

# Cursor Skill

AI prompt and instructions for using the Signal Labs competitive intelligence API in Cursor.

## Setup

1.  Create an API key at [Settings > API Keys](https://app.usesignallabs.com/settings?tab=api-keys)
2.  Store it in the `SIGNALLABS_API_KEY` environment variable
3.  Install the SDK:

Bash

```bash
npm install @signal-labs/sdk
```

### Initialize

JavaScript

```javascript
import { SignalLabs } from '@signal-labs/sdk';

const sl = new SignalLabs(process.env.SIGNALLABS_API_KEY);
```

## Core Workflow

JavaScript

```javascript
// 1. Create a company
const company = await sl.companies.create({ domain: 'mycompany.com' });

// 2. Discover competitors
const suggestions = await sl.companies.competitors(company.id).discover();

// 3. Add a competitor
const competitors = await sl.companies.competitors(company.id).add({
  name: 'Competitor X',
  website: 'competitor.com',
});

// 4. Generate a battlecard (1 credit)
const battlecard = await sl.companies.battlecards(company.id).generate({
  competitor_id: competitors[0].id,
  enablement_focus: 'gtm_sales',
});

// 5. Get signals
const signals = await sl.companies.signals(company.id).list();

// 6. Get signal summary (last 7 days)
const summary = await sl.companies.signals(company.id).summary(7);

// 7. Ask AI
const answer = await sl.ai.chat({
  message: 'What are the main weaknesses?',
  company_id: company.id,
});
```

All battlecard generation calls accept an optional `special_instructions` string (max 10,000 chars) for custom AI guidance.

## Critical Instructions for AI Models

### Always

-   Store API key in an environment variable
-   Import from `@signal-labs/sdk`
-   Use `async`/`await`
-   Follow dependency chain: Company → Competitor → Battlecard
-   Handle `SignalLabsError`

### Never

-   Hardcode API keys
-   Call `generate` without a competitor
-   Use `competitor_id` (singular) with `landscape` focus — it requires `competitor_ids` (array of 2–8), via `generateLandscape()` in the SDK

## AI Verification Steps

1.  Is `SIGNALLABS_API_KEY` in an env var?
2.  Is `SignalLabs` imported from `@signal-labs/sdk`?
3.  Are all calls awaited?
4.  Does company exist before adding competitors?
5.  Does competitor exist before generating battlecard?
6.  Is `enablement_focus` one of: `gtm_sales`, `product`, `marketing_growth`, `leadership`, `custom`, `landscape`?
