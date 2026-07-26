---
title: "Introducing the Signal Labs API and MCP Server: Give Your AI Agents Real-Time Competitive Intelligence - Signal Labs Blog"
description: "Launch of the Signal Labs public API, native SDKs for JavaScript and Python, and an MCP server for Claude, Cursor, Copilot, and Gemini. Everything you can do in the dashboard, now programmable."
image: https://usesignallabs.com/og-image-blog-api-mcp-launch-v2.png
url: https://usesignallabs.com/blog/introducing-signal-labs-api-mcp-server
---

[Home](https://usesignallabs.com/) / [Blog](https://usesignallabs.com/blog) / Introducing the Signal Labs API and MCP Server

[← Back to Blog](https://usesignallabs.com/blog)

March 19, 2026 Product Update

# Introducing the Signal Labs API and MCP Server: Give Your AI Agents Real-Time Competitive Intelligence

ES

Emre Semercioglu

Founder

Competitive intelligence shouldn't live behind a dashboard. It should be everywhere your team works: in your code, your AI tools, your agents, and your workflows.

Today, we're launching the Signal Labs public API, native SDKs for JavaScript and Python, and an MCP server that connects directly to Claude, Cursor, GitHub Copilot, and Gemini. Everything you can do in the Signal Labs dashboard, you can now do programmatically.

## Why We Built This

When we started Signal Labs, we set out to solve a simple problem: competitive intelligence is too slow, too manual, and too siloed. We built a platform that tracks competitors in real time, generates AI-powered battlecards, and monitors market signals so GTM teams can act before their competitors' moves hit the field.

But the way people consume information is changing fast. Sales reps are using AI copilots in their workflows. Engineers are building custom tools with Claude Code and Cursor. Product teams are spinning up internal dashboards that pull data from APIs. And a growing number of companies are building AI agents that need access to real-time competitive data.

We realized that if competitive intelligence can't be accessed programmatically, it can't keep up with how modern teams actually work.

So we opened it up.

## What You Can Do With the API

The Signal Labs REST API gives you full access to the platform's core capabilities:

**Create your company profile.** Just enter your URL and we fill out the details for you — description, industry, size, revenue range, and location — all pulled in automatically.

**Discover and monitor competitors.** We'll find relevant competitors for you to track — AI-suggested with reasoning for each, split by direct and indirect relationships. Choose company-level or narrow it to a specific product or service vertical. No manual research required.

**Generate AI-powered battlecards.** We automatically scrape the web for the latest and freshest information — your and your competitors' websites, technical documentation, blogs, news, articles, user reviews from G2 and TrustRadius, social media like Reddit and LinkedIn, analyst reports from Forrester and Gartner, and whatever else we can find publicly available. Create battlecards across five enablement focuses: GTM/Sales, Product, Marketing/Growth, Leadership, and Landscape (multi-competitor analysis). Attach your own documents for additional context, and add custom instructions to guide the AI.

**Monitor competitive signals.** Pull real-time intelligence signals from competitor blogs and news, with AI-generated summaries, importance scores, and team-specific recommendations for Sales, Product, Marketing, and Leadership.

**Ask AI about your competitive landscape.** A RAG-powered chat endpoint that draws from your battlecards, signals, and uploaded documents to answer competitive questions on the fly.

**Upload and manage documents.** Add PDFs, DOCX files, spreadsheets, and more to your data library via API. Documents are automatically parsed, chunked, and embedded for RAG, so your AI chat and battlecards get smarter with your own data.

All endpoints are authenticated with API keys, rate-limited by plan, and scoped to your organization. Credits work the same way as the dashboard: battlecard generation costs 1 credit, and read operations are free.

## MCP: One Line to Connect Your AI Tools

If you use Claude, Cursor, GitHub Copilot, or Gemini, you can connect Signal Labs as an MCP server with a single line of configuration:

```
npx signallabs-mcp
```

Once connected, your AI assistant can track competitors, generate battlecards, query signals, and answer competitive questions natively. No copy-pasting, no switching tabs. Just ask.

Here are some things you can say to your AI after connecting:

-   "What companies am I tracking in Signal Labs?"
-   "Discover competitors for Acme Corp"
-   "Generate a sales battlecard for us vs Competitor X"
-   "What are the latest competitive signals this week?"
-   "What are our competitors' main weaknesses?"

The MCP server supports 14 tools covering the full API surface. It's published on npm and registered on the official MCP Registry.

## Who This Is For

We see three main groups who will get the most out of this:

**CI and PMM teams who live in AI tools.** If you're already using Claude Code, Cursor, or Copilot in your daily workflow, you can now pull competitive intelligence without leaving your environment. Generate a battlecard before a sales call. Check what a competitor announced this week. Ask a strategic question about your market positioning. All from your terminal or IDE.

**Teams building AI agents and AI-powered products.** If you're building an AI SDR, a sales roleplay training platform, a deal coaching tool, copilots for sales and marketing, or any product where users might bring up competitors, you can plug into Signal Labs for real-time battlecards and competitive context. Your agent gets access to the same intelligence that powers enterprise CI programs.

**Companies building internal CI workflows.** If you have an internal competitive intelligence program and want to integrate it into Slack bots, CRM enrichment, automated reporting, or custom dashboards, the API gives you everything you need. Pull battlecards into your existing tools, trigger alerts when new signals arrive, or build a competitive feed that updates automatically.

## Built-In Limits and Error Handling

The API is designed to be developer-friendly from the start. Every error returns a structured JSON response with a machine-readable code, a human-readable message, and actionable guidance. If you're missing a prerequisite step (like trying to generate a battlecard before adding a competitor), the error tells you exactly which endpoint to call next.

Rate limits scale by plan:

| Plan | Requests per Day |
| --- | --- |
| Free | 100 |
| Team | 10,000 |

Credit costs match the dashboard: battlecard generation costs 1 credit, AI modifications cost 0.5 credits, and all read operations (listing companies, fetching signals, retrieving battlecards) are free within your rate limits.

If you hit a limit, the API tells you exactly what happened and links you to the upgrade page. AI agents using the MCP server get the same structured errors, so they can explain the situation to the user or automatically retry.

## SDKs for JavaScript and Python

We also shipped native SDKs so you can integrate in a few lines of code:

**JavaScript / TypeScript:**

```
import { SignalLabs } from '@signal-labs/sdk';

const sl = new SignalLabs(process.env.SIGNALLABS_API_KEY);

const company = await sl.companies.create({ domain: 'competitor.com' });
const suggestions = await sl.companies.competitors(company.id).discover();
const battlecard = await sl.companies.battlecards(company.id).generate({
  competitor_id: suggestions[0].id,
  enablement_focus: 'gtm_sales',
});
```

**Python:**

```
from signallabs import SignalLabs

sl = SignalLabs(api_key="sl_live_your_key")

company = sl.companies.create(domain="competitor.com")
suggestions = sl.companies.competitors(company["id"]).discover()
battlecard = sl.companies.battlecards(company["id"]).generate(
    competitor_id=suggestions[0]["id"],
    enablement_focus="gtm_sales"
)
```

From zero to a full competitive battlecard in four lines of code.

## Free to Use

The API, MCP server, and SDKs are included with every Signal Labs plan at no extra cost. The free plan includes 100 API requests per day; Team plans scale to 10,000. See [pricing](https://usesignallabs.com/pricing) for the current comparison.

If you don't have an account yet, sign up at [app.usesignallabs.com](https://app.usesignallabs.com) and create your first API key in Settings.

## Get Started

Here's everything you need:

-   **Documentation:** [usesignallabs.com/docs](https://usesignallabs.com/docs)
-   **Quickstart (3 minutes):** [usesignallabs.com/docs/quickstart](https://usesignallabs.com/docs/quickstart)
-   **MCP Setup Guide:** [usesignallabs.com/docs/mcp](https://usesignallabs.com/docs/mcp)
-   **JavaScript SDK:** npm install @signal-labs/sdk
-   **Python SDK:** pip install signallabs
-   **MCP Server:** npx signallabs-mcp
-   **OpenAPI Spec:** [app.usesignallabs.com/api/v1/openapi.json](https://app.usesignallabs.com/api/v1/openapi.json)

We built Signal Labs to make competitive intelligence fast, real-time, and actionable. Now it's also programmable.

We'd love to see what you build with it.

_Emre Semercioglu, Founder of Signal Labs_

### More Reads on Competitive Intelligence

[

#### The Real-Time CI Playbook for Product Marketing

Build real-time competitive intelligence into your positioning, messaging, and launches

Read more →

](https://usesignallabs.com/blog/real-time-ci-playbook-for-product-marketing)[

#### Sales Enablement Battlecards

From static docs to real-time competitive intelligence for sales teams

Read more →

](https://usesignallabs.com/blog/sales-enablement-battlecards-real-time-competitive-intelligence)[

#### Competitive Landscape Analysis

Compare 10+ competitors in one view with positioning, gaps, and market insights

Read more →

](https://usesignallabs.com/blog/competitive-landscape-analysis)

```json
{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://usesignallabs.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://usesignallabs.com/blog" },
        { "@type": "ListItem", "position": 3, "name": "Introducing the Signal Labs API and MCP Server", "item": "https://usesignallabs.com/blog/introducing-signal-labs-api-mcp-server" }
      ]
    }
```
