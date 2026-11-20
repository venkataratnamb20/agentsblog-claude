# Topic backlog

Status: draft, awaiting SEO & Analytics review and Venkat's confirmation.

Source: Asana task 1220688744221501

This file scores the topic ideas from `docs/prd/content-pillars.md` so the top 10 can feed the editorial calendar. The audience and goals (G1 to G4) are in `docs/prd/prd.md`. T01 to T10 are the planned posts. T11 to T33 are the other topic ideas from that file. The scores are a team judgement. They are not data.

## Scoring

Score = value x demand / effort. Each is rated 1 to 5. The score is shown to one decimal. A higher score is better.

- Value: how much the post helps the target reader, an engineer building a production agentic system. 5 is the most.
- Demand: how likely readers are to look for the topic. 5 is the most.
- Effort: the work to produce a verified post, with sources, run code and review. 5 is the most work.

Search demand is a judgement. It is not measured. No search volumes exist in this file, and none were looked up. SEO & Analytics must validate demand with a keyword tool before the calendar is final. Any paid tool needs Venkat's approval.

How to read the scores:

- Effort is in the denominator, so a cheap post can outscore a higher-demand one.
- Scores that differ by about 1 point are ties.
- Value is 5 on many ideas, so it separates little.

Every claim in a post still needs a primary source. The "Source needed" column says which one. Nothing here is a claim about a paper, product or version. Keywords are candidates only, taken from `docs/prd/content-pillars.md` where one fits.

## Backlog

| ID | Idea | Pillar | Value | Demand | Effort | Score | Status | Source needed | Primary keyword (candidate) | Overlap |
|---|---|---|---|---|---|---|---|---|---|---|
| T01 | What is an AI agent? Agents vs workflows vs chatbots | Architectures | 5 | 5 | 2 | 12.5 | planned post 1 | A cited definition of an agent from a primary source | what is an ai agent | T11 |
| T02 | Anatomy of an agent: LLM, tools, memory and the ReAct loop | Architectures | 5 | 4 | 3 | 6.7 | planned post 2 | The ReAct paper (Yao et al.), citation to be added by Research | ai agent architecture | T12 |
| T03 | Tool calling and MCP explained | Tools and MCP | 5 | 5 | 3 | 8.3 | planned post 3 | The MCP spec, with version and date | llm tool calling | T15, T16 |
| T04 | Agent memory: short-term, long-term and retrieval | Memory and RAG | 5 | 4 | 3 | 6.7 | planned post 4 | A primary source for each memory type named; none chosen yet | ai agent memory | T21, T22, T23 |
| T05 | Building stateful agents with LangGraph | Architectures | 4 | 4 | 4 | 4.0 | planned post 5 | The LangGraph docs, with the version used | langgraph tutorial | none known |
| T06 | Multi-agent patterns: supervisor, swarm and hierarchical | Multi-agent | 5 | 4 | 4 | 5.0 | planned post 6 | A cited definition for each of orchestrator-worker and handoff | multi-agent patterns | T26, T27 |
| T07 | Deep agents: planning, sub-agents and file systems for long tasks | Architectures | 4 | 3 | 4 | 3.0 | planned post 7 | A cited source that defines "deep agents", a vendor term | deep agents | none known |
| T08 | Evaluating agents: benchmarks, evals and LLM-as-judge | Evals and safety | 5 | 4 | 4 | 5.0 | planned post 8 | A primary source for each benchmark and for LLM-as-judge; none chosen yet | ai agent evaluation | T31 |
| T09 | Guardrails, safety and human-in-the-loop for agents | Evals and safety | 5 | 4 | 4 | 5.0 | planned post 9 | A primary source for each guardrail approach named; none chosen yet | ai agent guardrails | T30 |
| T10 | Research roundup #1: notable agent papers of the quarter | Roundup | 3 | 3 | 3 | 3.0 | planned post 10 | Each paper cited, with authors, date and link | none yet, SEO to set | none known |
| T11 | Workflows versus agents: when a fixed pipeline is the better choice | Architectures | 5 | 4 | 2 | 10.0 | idea | A cited source for the workflow and agent distinction | none yet, SEO to set | T01, T26 |
| T12 | Agent loop failure modes: runaway loops, stuck states and retries | Architectures | 5 | 3 | 3 | 5.0 | idea | Run examples of each failure, with the code shown | agent loop | T02, T28 |
| T13 | Cost and latency optimisation for agents | Architectures | 4 | 4 | 4 | 4.0 | idea | Measured data for any cost or latency claim | none yet, SEO to set | T29 |
| T14 | Computer-use and browser agents | Architectures | 3 | 4 | 5 | 2.4 | idea | The vendor docs for each product named, with version | none yet, SEO to set | none known |
| T15 | Designing tool schemas that models call correctly | Tools and MCP | 5 | 4 | 2 | 10.0 | idea | The provider tool-calling docs, with date | none yet, SEO to set | T03, T17 |
| T16 | Building a small MCP server and testing it | Tools and MCP | 4 | 5 | 4 | 5.0 | idea | The MCP spec, with version and date | mcp server tutorial | T03, T18 |
| T17 | Handling tool errors, retries and timeouts | Tools and MCP | 5 | 3 | 2 | 7.5 | idea | The provider docs on tool errors, and run code samples | none yet, SEO to set | T15 |
| T18 | Permissions and trust boundaries for tools | Tools and MCP | 5 | 3 | 3 | 5.0 | idea | The MCP spec on authorisation, with version and date | mcp security | T30, T16 |
| T19 | Agent-to-agent protocols (A2A) | Tools and MCP | 4 | 3 | 4 | 3.0 | idea | The A2A spec, with version | none yet, SEO to set | T03 |
| T20 | Paper explainer: a tool-use paper | Tools and MCP | 3 | 2 | 3 | 2.0 | idea | The paper itself; none chosen yet | none yet, SEO to set | none known |
| T21 | Context window management: trimming, summaries and compaction | Memory and RAG | 5 | 5 | 3 | 8.3 | idea | The provider docs on context limits, and measured data for any claim | context window management | T04, T22 |
| T22 | Agentic RAG vs classic RAG | Memory and RAG | 4 | 5 | 3 | 6.7 | idea | A primary source that defines each term; none chosen yet | rag for agents | T04, T21, T23 |
| T23 | Vector stores versus plain databases for agent memory | Memory and RAG | 4 | 4 | 3 | 5.3 | idea | The docs for each store compared, with version | none yet, SEO to set | T04, T22 |
| T24 | Forgetting and privacy: what an agent must not keep | Memory and RAG | 4 | 2 | 3 | 2.7 | idea | The primary text for any legal or regulatory point | none yet, SEO to set | T04 |
| T25 | Paper explainer: a memory-for-agents paper | Memory and RAG | 3 | 2 | 3 | 2.0 | idea | The paper itself; none chosen yet | none yet, SEO to set | none known |
| T26 | When one agent is enough | Multi-agent | 5 | 3 | 2 | 7.5 | idea | A cited source for any claim about when one agent is enough; none chosen yet | none yet, SEO to set | T06, T11 |
| T27 | Shared state and message passing between agents | Multi-agent | 4 | 3 | 3 | 4.0 | idea | The docs for each framework shown, with version | none yet, SEO to set | T06 |
| T28 | Failure modes in multi-agent systems and how to debug them | Multi-agent | 4 | 3 | 4 | 3.0 | idea | Run examples of each failure, with the code shown | none yet, SEO to set | T12, T32 |
| T29 | Cost and latency of multi-agent designs | Multi-agent | 4 | 3 | 5 | 2.4 | idea | Measured data. Do not claim extra token cost without it | none yet, SEO to set | T13 |
| T30 | Prompt injection and how to contain it | Evals and safety | 5 | 5 | 3 | 8.3 | idea | A primary source for each attack and defence named | prompt injection agents | T09, T18 |
| T31 | Building a small eval harness in CI | Evals and safety | 5 | 4 | 3 | 6.7 | idea | The docs for the eval framework shown, with version | llm agent evals | T08 |
| T32 | Observability and debugging agents in production | Evals and safety | 5 | 4 | 4 | 5.0 | idea | The docs for each tracing tool named, with version | agent observability | T28 |
| T33 | Paper explainer: a multi-agent paper | Multi-agent | 3 | 2 | 3 | 2.0 | idea | The paper itself; none chosen yet | none yet, SEO to set | none known |

## Ratings most at risk

These ratings are flagged judgements. They are the ones most likely to move once demand is checked. No rating has been changed.

- T22 (agentic RAG vs classic RAG): demand 5 rests on the topic feeling popular. The candidate keyword is "rag for agents", and the exact query "agentic rag vs rag" is unchecked.
- T21 (context window management): demand 5 is a judgement. The query may be dominated by vendor docs.
- T30 (prompt injection and how to contain it): demand 5, but it is likely a crowded query with strong existing pages. A high demand rating may not mean an easy win.
- T26 (when one agent is enough): conversational phrasing, with no candidate keyword. Demand 3 may be too high or too low.
- T15 (tool schemas): no candidate keyword. Readers may search for "function calling" instead.
- T17 (tool errors, retries and timeouts): no candidate keyword. Demand 3 is a guess.
- T07 (deep agents): a vendor term. Demand depends on how widely the term is used, which is unchecked.
- T10 (research roundup): demand is return traffic from readers who already follow the blog, not search. A search-based demand rating fits it poorly.

The keyword tool must confirm volume and trend for these candidate queries, and who already ranks for them:

- what is an ai agent
- agent loop
- agentic rag vs rag
- context window management
- prompt injection agents
- mcp server tutorial

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

Ranks 9 and 10 are a four-way tie at 6.7 (T02, T04, T22 and T31, all effort 3). The lower-ID tie-break favours the already planned posts (T02 and T04) over T22 and T31. Ranks inside about 1 point are ties, so the order within ranks 4 to 10 is not firm. The cut-off at rank 10 is a decision for Venkat.

## Overlaps

These are recommendations only. They name ideas that could compete for the same query. Any change to a planned post is a decision for Venkat.

- T01 and T11 compete on "what is an ai agent" and "agents vs workflows". Suggest T01 owns the definition query and T11 owns "when not to use an agent". The calendar should not place them close together. A merge is an option.
- T18 and T30 compete on "mcp security". Follow the pillars rule: T18 covers the MCP side (servers and permissions) and T30 covers attacks and defences. T16 must not target this keyword.
- T09 and T30 overlap on guardrails and prompt injection. Suggest T09 covers guardrails and human-in-the-loop, and T30 covers injection attacks and their containment. Each links to the other.
- T04, T21 and T22 overlap on memory and retrieval. Suggest T04 owns the agent memory types overview, T21 owns context trimming and compaction, and T22 owns the RAG comparison. Each links to the other two.
- T12 and T28 overlap, and so do T13 and T29. Publish the single-agent post first. The multi-agent follow-up links back to it.
- T03, T15 and T16 sit near each other: "llm tool calling", "model context protocol" and "mcp server tutorial". Suggest T03 targets the first two, T15 covers schema design and T16 targets "mcp server tutorial".
- T02 and T12 overlap on "agent loop". T02 explains the loop as part of the anatomy. T12 owns the failure modes. SEO to decide which page targets the keyword.

## Reconciliation with the planned posts

The launch order of posts 1 to 3 is approved (Venkat, 20 Nov 2026, recorded in `docs/prd/content-pillars.md`). This backlog does not change it.

Planned posts in the top 10: Post 1 (T01), Post 2 (T02), Post 3 (T03) and Post 4 (T04).

Planned posts not in the top 10: Post 5 (LangGraph, 4.0), Post 6 (multi-agent patterns, 5.0), Post 7 (deep agents, 3.0), Post 8 (evaluation, 5.0), Post 9 (guardrails, 5.0) and Post 10 (research roundup, 3.0).

Ideas in the top 10 that are not planned posts: T11 (workflows versus agents), T15 (tool schemas), T21 (context window management), T30 (prompt injection), T17 (tool errors and retries) and T26 (when one agent is enough).

Recommendation for the editorial calendar:

- The top 10 and the ten calendar slots are not the same list. The top 10 ranks ideas. The calendar places posts in time, with launch posts fixed and series order respected.
- Post 4 is in the top 10, so it stays where it is.
- Posts 5 to 10 score lower than six unplanned ideas. Any change to posts 4 to 10 is a decision for Venkat. This file does not decide it.
- Swaps must respect the approved series: posts 8 and 9 form "Production agents", posts 1, 2 and 4 form "Agents from first principles", and posts 3 and 5 form "Agent tooling".
- A merge option that displaces no planned post: fold T11 into Post 1, or fold T30 into Post 9. This is also a decision for Venkat.
- Another option: keep posts 4 to 10 as planned, and place the best unplanned ideas (T11, T15, T21, T30, T17, T26) after post 10 or beside the planned posts.
- Posts 8 and 9 score 5.0 each. T30 overlaps Post 9, so the two need a clear split (see Overlaps).
- Post 10 is a roundup with no pillar. Rank is a poor test for it. Venkat confirmed the roundup exception on 20 Nov 2026.
- The final ranks 5 to 12 must wait for keyword validation by SEO & Analytics. Demand is not measured, so the top 10 may change after that.
- The top 10 goes to the editorial calendar as a proposal only, once SEO & Analytics has reviewed it and Venkat has confirmed it.
