# Topic backlog

Status: draft, awaiting SEO & Analytics review and Venkat's confirmation.

Source: Asana task 1220688744221501

This file scores the topic ideas from `docs/prd/content-pillars.md` so the top 10 can feed the editorial calendar. The audience and goals (G1 to G4) are in `docs/prd/prd.md`. T01 to T10 are the planned posts. T11 to T32 are the other topic ideas from that file. The scores are a team judgement. They are not data.

## Scoring

Score = value x demand / effort. Each is rated 1 to 5. The score is shown to one decimal. A higher score is better.

- Value: how much the post helps the target reader, an engineer building a production agentic system. 5 is the most.
- Demand: how likely readers are to look for the topic. 5 is the most.
- Effort: the work to produce a verified post, with sources, run code and review. 5 is the most work.

Search demand is a judgement. It is not measured. No search volumes exist in this file, and none were looked up. SEO & Analytics must validate demand with a keyword tool before the calendar is final. Any paid tool needs Venkat's approval.

Every claim in a post still needs a primary source. The "Source needed" column says which one. Nothing here is a claim about a paper, product or version.

## Backlog

| ID | Idea | Pillar | Value | Demand | Effort | Score | Status | Source needed |
|---|---|---|---|---|---|---|---|---|
| T01 | What is an AI agent? Agents vs workflows vs chatbots | Architectures | 5 | 5 | 2 | 12.5 | planned post 1 | A cited definition of an agent from a primary source |
| T02 | Anatomy of an agent: LLM, tools, memory and the ReAct loop | Architectures | 5 | 4 | 3 | 6.7 | planned post 2 | ReAct paper (Yao et al.), citation to be added by Research |
| T03 | Tool calling and MCP explained | Tools and MCP | 5 | 5 | 3 | 8.3 | planned post 3 | MCP spec, version and date |
| T04 | Agent memory: short-term, long-term and retrieval | Memory and RAG | 5 | 4 | 3 | 6.7 | planned post 4 | Primary source for each memory type named; none chosen yet |
| T05 | Building stateful agents with LangGraph | Architectures | 4 | 4 | 4 | 4.0 | planned post 5 | LangGraph docs, with the version used |
| T06 | Multi-agent patterns: supervisor, swarm and hierarchical | Multi-agent | 5 | 4 | 4 | 5.0 | planned post 6 | A cited definition for each of orchestrator-worker and handoff |
| T07 | Deep agents: planning, sub-agents and file systems for long tasks | Architectures | 4 | 3 | 4 | 3.0 | planned post 7 | A cited source that defines "deep agents", a vendor term |
| T08 | Evaluating agents: benchmarks, evals and LLM-as-judge | Evals and safety | 5 | 4 | 4 | 5.0 | planned post 8 | Primary source for each benchmark and for LLM-as-judge; none chosen yet |
| T09 | Guardrails, safety and human-in-the-loop for agents | Evals and safety | 5 | 4 | 4 | 5.0 | planned post 9 | Primary source for each guardrail approach named; none chosen yet |
| T10 | Research roundup #1: notable agent papers of the quarter | Roundup | 3 | 3 | 3 | 3.0 | planned post 10 | Each paper cited, with authors, date and link |
| T11 | Workflows versus agents: when a fixed pipeline is the better choice | Architectures | 5 | 4 | 2 | 10.0 | idea | A cited source for the workflow and agent distinction |
| T12 | Agent loop failure modes: runaway loops, stuck states and retries | Architectures | 5 | 3 | 3 | 5.0 | idea | Run examples of each failure; none yet |
| T13 | Cost and latency optimisation for agents | Architectures | 4 | 4 | 4 | 4.0 | idea | Measured data for any cost or latency claim |
| T14 | Computer-use and browser agents | Architectures | 3 | 4 | 5 | 2.4 | idea | Vendor docs for each product named, with version |
| T15 | Designing tool schemas that models call correctly | Tools and MCP | 5 | 4 | 2 | 10.0 | idea | Provider tool-calling docs, with date |
| T16 | Building a small MCP server and testing it | Tools and MCP | 4 | 5 | 4 | 5.0 | idea | MCP spec, version and date |
| T17 | Handling tool errors, retries and timeouts | Tools and MCP | 5 | 3 | 2 | 7.5 | idea | Provider docs on tool errors; run code samples |
| T18 | Permissions and trust boundaries for tools | Tools and MCP | 5 | 3 | 3 | 5.0 | idea | MCP spec on authorisation, version and date |
| T19 | Agent-to-agent protocols (A2A) | Tools and MCP | 4 | 3 | 4 | 3.0 | idea | A2A spec and version |
| T20 | Paper explainer: a tool-use paper | Tools and MCP | 3 | 2 | 3 | 2.0 | idea | The paper itself; none chosen yet |
| T21 | Context window management: trimming, summaries and compaction | Memory and RAG | 5 | 5 | 3 | 8.3 | idea | Provider docs on context limits; measured data for any claim |
| T22 | Agentic RAG vs classic RAG | Memory and RAG | 4 | 5 | 3 | 6.7 | idea | A primary source defining each; none chosen yet |
| T23 | Vector stores versus plain databases for agent memory | Memory and RAG | 4 | 4 | 3 | 5.3 | idea | Docs for each store compared, with version |
| T24 | Forgetting and privacy: what an agent must not keep | Memory and RAG | 4 | 2 | 3 | 2.7 | idea | Any legal or regulatory point needs the primary text |
| T25 | Paper explainer: a memory-for-agents paper | Memory and RAG | 3 | 2 | 3 | 2.0 | idea | The paper itself; none chosen yet |
| T26 | When one agent is enough | Multi-agent | 5 | 3 | 2 | 7.5 | idea | None yet, until a claim is made; any claim needs a cited source |
| T27 | Shared state and message passing between agents | Multi-agent | 4 | 3 | 3 | 4.0 | idea | Docs for each framework shown, with version |
| T28 | Failure modes in multi-agent systems and how to debug them | Multi-agent | 4 | 3 | 4 | 3.0 | idea | Run examples; none yet |
| T29 | Cost and latency of multi-agent designs | Multi-agent | 4 | 3 | 5 | 2.4 | idea | Measured data. Do not claim extra token cost without it |
| T30 | Prompt injection and how to contain it | Evals and safety | 5 | 5 | 3 | 8.3 | idea | Primary sources for each attack and defence named |
| T31 | Building a small eval harness in CI | Evals and safety | 5 | 4 | 3 | 6.7 | idea | none yet |
| T32 | Observability and debugging agents in production | Evals and safety | 5 | 4 | 4 | 5.0 | idea | Docs for each tracing tool named, with version |

## Top 10

Ties are broken by lower effort, then by lower ID.

| Rank | ID | Idea | Score |
|---|---|---|---|
| 1 | T01 | What is an AI agent? Agents vs workflows vs chatbots | 12.5 |
| 2 | T11 | Workflows versus agents: when a fixed pipeline is the better choice | 10.0 |
| 3 | T15 | Designing tool schemas that models call correctly | 10.0 |
| 4 | T03 | Tool calling and MCP explained | 8.3 |
| 5 | T21 | Context window management: trimming, summaries and compaction | 8.3 |
| 6 | T30 | Prompt injection and how to contain it | 8.3 |
| 7 | T17 | Handling tool errors, retries and timeouts | 7.5 |
| 8 | T26 | When one agent is enough | 7.5 |
| 9 | T02 | Anatomy of an agent: LLM, tools, memory and the ReAct loop | 6.7 |
| 10 | T04 | Agent memory: short-term, long-term and retrieval | 6.7 |

Four ideas score 6.7 (T02, T04, T22, T31) and all have effort 3. The tie-break by lower ID gives T02 and T04 ranks 9 and 10. T22 and T31 just miss the top 10.

## Reconciliation with the planned posts

Planned posts in the top 10: Post 1 (T01), Post 2 (T02), Post 3 (T03) and Post 4 (T04).

Planned posts not in the top 10: Post 5 (LangGraph, 4.0), Post 6 (multi-agent patterns, 5.0), Post 7 (deep agents, 3.0), Post 8 (evaluation, 5.0), Post 9 (guardrails, 5.0) and Post 10 (research roundup, 3.0).

Ideas in the top 10 that are not planned posts: T11 (workflows versus agents), T15 (tool schemas), T21 (context window management), T30 (prompt injection), T17 (tool errors and retries) and T26 (when one agent is enough).

Recommendation for the editorial calendar:

- Posts 1 to 3 launch on 14 Dec 2026 and the order is approved. This backlog does not change it. Posts 1 to 3 all score well, which supports the order.
- Post 4 is in the top 10, so it stays where it is.
- Posts 5 to 10 score lower than six unplanned ideas. Any change to posts 4 to 10 is a decision for Venkat. This file does not decide it. Options for Venkat to weigh: keep posts 4 to 10 as planned; or swap in one or more of T11, T15, T21, T30, T17 and T26 ahead of posts 5 to 10.
- T11, T15, T17 and T26 have effort 2, so they are the cheapest to verify. T26 is the only top 10 idea in Multi-agent, and Post 6 is the planned post there.
- Posts 8 and 9 score 5.0 each. They are the planned core of the Production agents series. T30 (prompt injection) overlaps with Post 9, so the two need a clear split under the overlap rules in `docs/prd/content-pillars.md`.
- Post 10 is a roundup and has no pillar. It scores 3.0 and is unlikely to rank on a value x demand score, so rank is a poor test for it. Venkat to confirm how roundups are treated.
- The scores rest on unmeasured demand. SEO & Analytics must validate demand with a keyword tool, and the top 10 may change after that.
- The top 10 goes to the editorial calendar as a proposal only, once SEO & Analytics has reviewed it and Venkat has confirmed it.
