Here are features that fit your current architecture, ordered by payoff. The first three matter most.

**[DONE]1. Structured itinerary output (highest leverage)**

- Right now the agent returns free text. Add a zod `ItinerarySchema` (days → activities → cost, location, time) and use `withStructuredOutput` or a final formatting node.
- This unlocks a frontend, a PDF export and budget validation, and it makes the later features easy to build.

**2.[ON HOLD] Real graph instead of one ReAct loop**

- `agentic-workflow.ts` is empty, so this is where it belongs. Use a LangGraph pipeline: `parse intent → gather (parallel tools) → draft → validate budget → refine`.
- Add a budget-check node that loops back to the draft if the total exceeds the user's limit. Your calculator and currency tools finally do real work there.
- Add `interrupt()` for human-in-the-loop. The agent asks "Did you mean Goa or Gokarna?" before it spends 20 tool calls.

**3. Persistent memory and trip storage**

- Swap `MemorySaver` for `PostgresSaver` (Supabase fits your stack).
- Add a `trips` table with save, resume and edit. Then you can support "make day 3 cheaper" as a patch to the stored itinerary instead of a full re-plan.

**4. Tools to add**

- **Routing and travel time** (OSRM or OpenRouteService, both free): the agent can then avoid plans with 6 hours of backtracking per day.
- **Flights and trains**: Amadeus sandbox for flights. For India trips, trains matter more, but there's no clean free API, so a Tavily fallback is realistic.
- **Hotels and costs**: a budget-tier estimator that uses search plus a calculator, with clear "estimate" labelling.
- **Events**: you already ask for "live shows, sports events", but nothing in the toolset supports that. Ticketmaster Discovery or Eventbrite would close the gap.

**5. Quality and safety (matches your agentic-ai folders)**

- **Evals**: a golden set of 10 to 15 prompts with assertions such as "total ≤ budget", "dates within the range" and "every place came from a tool result". Run them per model to compare qwen, gemma and omnicoder properly.
- **Guardrails**: validate tool args (dates in the past, invalid ISO codes), cap tool calls per request, and add basic prompt-injection handling for Tavily results.
- **Tracing**: LangSmith, or a lightweight custom logger for latency and tokens per tool.

**6. Product layer**

- A Next.js or Expo client on the SSE endpoint. Stream structured events (`tool_start`, `token`, `itinerary_patch`) instead of raw tokens, which also fixes the tool-output leakage I flagged.
- Map view with day-wise pins from the geocode output.
- Export to PDF or Google Calendar (`.ics` is the cheapest start).
- Shareable trip links.

**7. Stretch ideas**

- **Multi-agent split** using deepagents: separate planner, budget and logistics subagents with a supervisor.
- **RAG over a local travel corpus**, for example regional guides or festival calendars, for facts search handles poorly.
- **MCP server**: expose your tools (weather, places, currency) as an MCP server so other clients can use them.
- **Group planning**: merge preferences from several users into one itinerary, which suits your "5 people" example prompt.
