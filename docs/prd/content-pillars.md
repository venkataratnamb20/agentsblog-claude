# Content pillars and topic taxonomy

Status: draft, awaiting Venkat's approval. Goals come from `docs/prd/charter.md`. The planned posts 1 to 10 and the idea list come from the Asana tasks named "Post 1" to "Post 10" and the "Idea:" tasks in stage 6 (Content research and production). The charter has no post list. Asana is the source. Keywords are candidates only. No search volumes are stated, because none have been measured.

Sources: topic ideas below are proposals. Items marked "needs primary source" must be backed by a primary source before a post makes the claim. This file cites none yet and invents none. The Research Analyst supplies sources.

## Pillars

Five pillars cover the charter's purpose: architectures, tool calling and MCP, memory, multi-agent systems, evaluation and safety. Each post belongs to one main pillar.

### Pillar 1: Architectures

**Audience need**

Engineers and tech leads need a clear mental model of what an agent is and how its parts fit together, so they can choose a design and know its limits.

**Topic ideas**

- Post 1: What is an AI agent? Agents vs workflows vs chatbots.
- Post 2: Anatomy of an agent: LLM, tools, memory and the ReAct loop. Needs primary source: ReAct and the tool-use loop (Yao et al., citation to be added by Research).
- Post 5: Building stateful agents with LangGraph. Needs primary source: LangGraph docs, with the version used.
- Post 7: Deep Agents: planning, sub-agents and file systems for long tasks. Needs primary source: "deep agents" is a vendor term, so define it with a cited source.
- Workflows versus agents: when a fixed pipeline is the better choice.
- Agent loop failure modes (owner of this topic): runaway loops, stuck states, retries.
- Idea: cost and latency optimisation.
- Idea: computer-use and browser agents.

**Target keywords**

Candidate, SEO to validate:

- what is an ai agent
- ai agent architecture
- langgraph tutorial
- deep agents
- agent loop

### Pillar 2: Tools and MCP

**Audience need**

Engineers need to give agents safe, reliable access to tools and data, and to understand the Model Context Protocol well enough to build or use a server.

**Topic ideas**

- Post 3: Tool calling and MCP explained. Needs primary source: MCP claims need the spec, its version and its date.
- Designing tool schemas that models call correctly.
- Building a small MCP server and testing it. Needs primary source: spec version.
- Handling tool errors, retries and timeouts.
- Permissions and trust boundaries for tools (owner of this topic). Guardrails and prompt injection belong to Pillar 5.
- Idea: agent-to-agent protocols (A2A). Needs primary source: the A2A spec and version.
- Paper explainer: a tool-use paper. Unsourced until a paper is chosen.

**Target keywords**

Candidate, SEO to validate:

- mcp server tutorial
- model context protocol
- llm tool calling
- function calling agents
- mcp security

### Pillar 3: Memory and RAG

**Audience need**

Engineers need to decide what an agent should remember, where to store it and how to retrieve it, without filling the context window or leaking data.

**Topic ideas**

- Post 4: Agent memory: short-term, long-term and retrieval.
- Context window management: trimming, summaries and compaction.
- Idea: agentic RAG vs classic RAG.
- Vector stores versus plain databases for agent memory.
- Forgetting and privacy: what an agent must not keep.
- Paper explainer: a memory-for-agents paper. Unsourced until a paper is chosen.

**Target keywords**

Candidate, SEO to validate:

- ai agent memory
- agent memory types
- rag for agents
- context window management
- long-term memory llm

### Pillar 4: Multi-agent

**Audience need**

Tech leads and engineers need to know when more than one agent helps, which coordination pattern fits, and what it costs in complexity and tokens.

**Topic ideas**

- Post 6: Multi-agent patterns: supervisor, swarm and hierarchical. Needs primary source: orchestrator-worker and handoff patterns need a cited definition each.
- When one agent is enough.
- Shared state and message passing between agents.
- Failure modes in multi-agent systems and how to debug them.
- Cost and latency of multi-agent designs. Needs primary source: any claim that multi-agent costs more tokens needs measured data. Do not assert it without data.
- Paper explainer: a multi-agent paper. Unsourced until a paper is chosen.

**Target keywords**

Candidate, SEO to validate:

- multi-agent systems
- multi-agent patterns
- agent orchestration
- orchestrator worker pattern
- multi-agent llm

### Pillar 5: Evals and safety

**Audience need**

Tech leads and engineers need ways to measure whether an agent works and to limit the harm it can do, before and after release.

**Topic ideas**

- Post 8: Evaluating agents: benchmarks, evals and LLM-as-judge.
- Post 9: Guardrails, safety and human-in-the-loop for agents.
- Post 10: Research roundup #1: notable agent papers of the quarter (see the pillar rule for roundups below).
- Prompt injection and how to contain it (owner of this topic, with guardrails).
- Building a small eval harness in CI.
- Idea: observability and debugging in production (owner of observability and tracing).

**Target keywords**

Candidate, SEO to validate:

- ai agent evaluation
- llm agent evals
- ai agent guardrails
- prompt injection agents
- agent observability

## Overlap rules

- Roundups (Post 10 and later): a roundup has no pillar of its own. It carries the `research-roundup` format tag and no pillar tag. This is a documented exception to the "one pillar tag" rule. The table below lists Post 10 under Evals and safety only as a placeholder. Venkat to confirm.
- Observability and tracing belong to Pillar 5. Agent loop failure modes belong to Pillar 1. A post on one links to the other.
- Permissions and trust boundaries for tools belong to Pillar 2. Guardrails and prompt injection belong to Pillar 5.
- The keyword "mcp security" in Pillar 2 spills into Pillar 5. Pillar 2 owns the MCP side (servers, permissions). Pillar 5 owns attacks and defences. SEO to decide which page targets it, so two posts do not compete for it.

## Planned posts 1 to 10

Source: Asana tasks "Post 1" to "Post 10".

| Post | Topic | Pillar |
|---|---|---|
| 1 | What is an agent | Architectures |
| 2 | Anatomy of an agent | Architectures |
| 3 | Tool calling and MCP | Tools and MCP |
| 4 | Memory | Memory and RAG |
| 5 | LangGraph | Architectures |
| 6 | Multi-agent patterns | Multi-agent |
| 7 | Deep agents | Architectures |
| 8 | Evaluation | Evals and safety |
| 9 | Guardrails | Evals and safety |
| 10 | Research roundup | None (exception, see Overlap rules) |

Posts 1 to 3 launch on 14 Dec 2026. The order is a proposal. The Research Analyst and SEO & Analytics may reorder it with Venkat's approval.

## Tags and series

### Tag naming rules

- Tags are lowercase and hyphenated, for example `tool-calling`.
- Letters a to z, digits and single hyphens only. No spaces, underscores, accents or punctuation.
- A tag is also its URL slug. It must equal `slugify(tag)` from `src/lib/slugify.ts`, so `model-context-protocol` is valid and `Model Context Protocol` is normalised to it.
- Use the singular form unless the term is a plural name, for example `evals`.
- Spell out names in full unless the short form is the common one, for example `mcp`, `rag`.
- Non-roundup posts: 3 to 5 tags. Exactly one pillar tag (first), one format tag, and 1 to 3 topic tags.
- Roundups: 3 or 4 tags (no pillar tag). One format tag and 2 or 3 topic tags.
- New tags need Technical Editor approval, so the list stays small and consistent.
- Tag normalisation in `src/lib/tags.ts` trims, lowercases and hyphenates spaces. It does not check the approved list.
- Requirement, not yet built: `src/lib/postSchema.ts` types `tags` as a plain string array. It does not enforce one pillar tag (none for roundups), one format tag, the tag counts (non-roundup posts 3 to 5, roundups 3 or 4), pillar first, or the approved list. Enforcement is a requirement for the Frontend Engineer under PRD F2, like series. Until then the Technical Editor checks these rules by hand.

### Pillar to tag map

| Pillar | Pillar tag | Example topic tags |
|---|---|---|
| Architectures | `architectures` | `agent-basics`, `agent-loop`, `langgraph`, `deep-agents`, `workflows` |
| Tools and MCP | `tools-and-mcp` | `tool-calling`, `mcp`, `function-calling`, `tool-design` |
| Memory and RAG | `memory-and-rag` | `memory`, `rag`, `context-window`, `vector-search` |
| Multi-agent | `multi-agent` | `orchestration`, `handoff`, `agent-coordination` |
| Evals and safety | `evals-and-safety` | `evals`, `guardrails`, `prompt-injection`, `observability` |

Format tags: `deep-dive`, `tutorial`, `paper-explainer`, `research-roundup`.

Every post has exactly one format tag. Every post has exactly one pillar tag, except roundups, which have none. Pillar tags are the only tags that map to a pillar page.

### Planned series

Assumption: series names and membership are proposals for Venkat to approve.

| Series | Posts | Notes |
|---|---|---|
| Agents from first principles | 1 and 2, then 4 | Foundations, read in order. |
| Agent tooling | 3, then 5 | Tools, MCP and LangGraph. |
| Production agents | 8 and 9 | Evaluation and guardrails. |
| Research roundup | Monthly | One series, one post a month. |

A series is declared in post front-matter. The current schema (`src/lib/postSchema.ts`) has no series field. Adding two optional fields, a flat `series` (string slug) and `seriesOrder` (number), is a proposal. Adding them is a requirement for the Frontend Engineer under PRD F2, to be agreed with the Solution Architect. Not yet agreed.

### Navigation

UX sign-off is still open. The UX/UI Designer has not reviewed this section, so nothing here is agreed. Proposal only:

- Main navigation: Home, Posts, Topics (the five pillars), Series, Newsletter, About.
- Topics page lists the five pillars. Each pillar page has its audience need and its posts.
- Tag pages are at `/tags/<tag>/`. Tags appear on each post and link to their tag page. Tags are not in the main navigation.
- Series pages list posts in order. A post in a series shows a series box with previous and next links.
- Breadcrumbs on post and tag pages use the BreadcrumbList helper in `src/lib/seo.ts`.
- The footer links to RSS and the newsletter form.
