# Trip Planner

AI-powered trip planning monorepo. An agent gathers places, weather, and currency data, then builds a day-by-day itinerary — exposed via a Hono API (JSON + SSE) and a local CLI.

Runs on local Ollama models (`gemma4:12b`, `qwen3.5:9b`) with LangChain / LangGraph.

## Workspace layout

```
trip-planner/
├── apps/
│   ├── api/          # Hono HTTP API (SSE streaming)
│   └── web/          # Frontend (not started yet)
├── packages/
│   └── agent/        # Trip planner agent + LangGraph pipeline
├── scripts/
│   └── cli.ts        # Interactive terminal client
├── plan.md           # Feature roadmap
└── package.json      # Workspace root scripts
```

Managed with **pnpm** workspaces (`apps/*`, `packages/*`).

---

## Packages & apps

### `@trip-planner/agent` (`packages/agent`)

Core planning logic. Two entry points today:

| Path | What it is |
|------|------------|
| `src/index.ts` | ReAct agent via `createAgent` — used by the API and CLI today |
| `src/graph/` | LangGraph pipeline: extract → gather tools in parallel → plan → format |

**Agent tools**

| Tool | Role |
|------|------|
| `TavilySearch` | Live web search (events, openings, fallback facts) |
| `placeSearchTool` | Attractions via Geoapify Places (+ geocode) |
| `weatherInfoTool` | Forecast for trip dates |
| `currencyConversionTool` | Budget FX conversion |
| `calculatorTool` | Arithmetic / budget totals |

**Models** (Ollama): `gemma4:12b` (planner), `qwen3.5:9b` (fast extract / format), `omnicoder-2:9b` available.

**LangGraph Studio**: `pnpm dev:agent` loads `langgraph.json` → graph `trip_planner`.

### `@trip-planner/api` (`apps/api`)

Hono server on port `3000` (configurable). Wires the agent with structured `ItinerarySchema` output.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/trip/plan` | Plan a trip; returns full reply |
| `POST` | `/trip/stream` | Same request; streams SSE `token` events, then `done` |

**Request body** (`/trip/plan`, `/trip/stream`):

```json
{
  "threadId": "optional-uuid",
  "message": "Plan 5 days in Kyoto under ¥80000, food and temples"
}
```

### CLI (`scripts/cli.ts`)

Interactive REPL against the same agent. Streams tokens to the terminal. Shared `threadId` per session for multi-turn chat.

### `apps/web`

Placeholder for a future Next.js / Expo client on the SSE endpoint.

---

## Prerequisites

- Node.js 22+
- [pnpm](https://pnpm.io) `12.16.1`
- [Ollama](https://ollama.com) running locally with at least one of: `gemma4:12b`, `qwen3.5:9b`
- API keys: **Tavily**, **Geoapify**, plus weather / exchange-rate keys used by the services

## Setup

```bash
pnpm install
```

Copy env into the places the apps load from (root, `apps/api`, and/or `packages/agent` as needed):

```env
TAVILY_API_KEY=
GEOAPIFY_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
PORT=3000

# Used by agent services
OPEN_WEATHER_API_KEY=
EXCHANGE_RATE_API_KEY=
```

Optional: LangSmith (`LANGSMITH_TRACING`, `LANGSMITH_API_KEY`, `LANGSMITH_PROJECT`).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:api` | API with hot reload |
| `pnpm start:api` | API without watch |
| `pnpm dev:agent` | LangGraph CLI / Studio for the graph |
| `pnpm cli` | Interactive CLI planner |
| `pnpm test:agent` | Agent smoke test |
| `pnpm typecheck` | Typecheck all packages |

---

## How planning works today

1. User sends a natural-language trip request (API or CLI).
2. Agent uses tools for places, weather, FX, and search when needed.
3. Reply is (or will be) a structured itinerary: destination, summary, cost, day → activities.

The newer LangGraph path (`packages/agent/src/graph`) is further along for control flow:

```
START → extract
          ├─ missing destination/days → END (ask clarifying question)
          └─ parallel: currency | weather | places
                → planner ⇄ tools (Tavily, capped)
                → format (ItinerarySchema)
                → END
```

The API still mounts the ReAct `createTripPlannerAgent` path; wiring it to the compiled graph is part of the next work.

---

## Roadmap (from `plan.md`)

Ordered by payoff. Weekend priority: **1 → 2 → 3**.

### 1. Structured itinerary output *(highest leverage)*

- Zod `ItinerarySchema` already exists; make it the contract everywhere (`withStructuredOutput` / format node).
- Unlocks frontend, PDF export, and budget validation.

### 2. Real graph instead of one ReAct loop

- Flesh out the LangGraph pipeline (budget-check node that loops back to draft when over limit).
- Use calculator + currency tools in that validation loop.
- Add `interrupt()` for human-in-the-loop (e.g. “Goa or Gokarna?”).

### 3. Persistent memory and trip storage

- Swap `MemorySaver` for `PostgresSaver` (e.g. Supabase).
- `trips` table: save, resume, edit (“make day 3 cheaper” as a patch).

### 4. More tools

- Routing / travel time (OSRM or OpenRouteService)
- Flights (Amadeus sandbox) + trains (Tavily fallback for India)
- Hotels / cost estimators (search + calculator, labelled as estimates)
- Events (Ticketmaster / Eventbrite) — interests already mention live shows

### 5. Quality and safety

- Evals: 10–15 golden prompts (“total ≤ budget”, dates in range, places from tools)
- Guardrails: validate tool args, cap tool calls, basic injection handling on Tavily
- Tracing: LangSmith or custom latency/token logging

### 6. Product layer

- Next.js or Expo client on SSE with structured events (`tool_start`, `token`, `itinerary_patch`)
- Map view with day-wise pins from geocode
- Export PDF / `.ics`
- Shareable trip links

### 7. Stretch

- Multi-agent split (planner / budget / logistics + supervisor)
- RAG over local travel corpus (guides, festivals)
- MCP server exposing weather / places / currency tools
- Group planning (merge several users’ preferences)

---

## Known issues

- **find-famous-places** can return **400** when the Geoapify `categories` array is not opened/joined correctly for the API — fix category serialization before relying on place search in production.

---

## Example prompt

> Plan a 5-day trip to Kyoto for 2 people in April. Budget ¥80,000. Interested in temples, food, and one live show if anything is on.
