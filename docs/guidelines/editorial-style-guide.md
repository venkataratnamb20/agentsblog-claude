# Editorial style guide

How every post on the Agents Blog is written, edited and approved. Rules for front-matter live in `CLAUDE.md` and `src/lib/postSchema.ts`. This guide adds the writing rules. The `new-post` skill points here.

## Voice and tone
- Write plainly and precisely for engineers who build production agents.
- Use short sentences. One idea each.
- No hype. Do not call a tool "revolutionary" or "game-changing".
- Say what you tested, with which versions, and what you saw.
- Be honest about limits. Say what a result does not show.
- Spelling: use British English (behaviour, colour, licence as a noun). Keep to it in every post. Code, API names and quotes keep their original spelling.
- Do not use em dashes. Use a full stop or a comma.
- Words to avoid: "simply", "just", "obviously", "revolutionary", "seamless", "blazing fast", "state of the art" (unless a source says so), "10x".

## Structure of a post
Use this order. The post template in `.claude/skills/new-post/post-template.md` has the same shape.

1. **TL;DR.** Two to four sentences or bullets. The answer first. It must match the body.
2. **The problem.** What the reader faces, in two or three sentences.
3. **The idea.** The approach or finding, in plain words.
4. **Diagram.** One diagram that shows the idea (see Diagrams and images).
5. **Runnable code.** A sample the reader can run from a clean checkout (see Code samples).
6. **Results and failure modes.** What happened, what broke, and where the idea does not apply.
7. **What to do next.** One concrete step.
8. **Sources.** Every source used, with dates.

Length guidance by format. The PRD sets the formats but no word counts, so these are editorial defaults. Venkat may change them.

| Format | Shape |
|---|---|
| Deep dive | Full structure above. Long enough to cover one topic in depth; cut anything off topic. |
| Tutorial | Full structure. Numbered steps. Every step has code that was run, with versions stated. |
| Paper explainer | Link the paper near the top. Say what the paper shows and what it does not. Code is optional. |
| Research roundup | Short entries. Each has a source and a date. TL;DR lists the top items. Diagram and code are optional. |

## Titles and descriptions
- `title`: 70 characters or fewer. The schema enforces it.
- `description`: 160 characters or fewer. Say what the reader will be able to do. The schema enforces it.
- Start every post with `draft: true`. Never change it to false without approval from Venkat.
- Tags: a non-roundup post has 3 to 5 tags. They are exactly one pillar tag (first), one format tag and 1 to 3 topic tags. A roundup has 3 or 4 tags and no pillar tag: one format tag and 2 or 3 topic tags. See `docs/prd/content-pillars.md`.
- Slug (the file name in `content/posts/`): lowercase letters, digits and single hyphens only. No underscores, spaces or dates. Keep it short, ideally under 60 characters, with the main keyword in it. The target rule is that the slug equals `slugify(title)` from `src/lib/slugify.ts`; see `docs/seo-analytics-spec.md`.
- Once a post is published, its slug does not change without approval from Venkat.

## Code samples
- Every sample was run. Do not publish code you have not run.
- Record the language and library versions and the date you ran it, next to the sample.
- It must run from a clean checkout. List the setup steps and the exact commands.
- Pin versions (lock file or exact version numbers).
- Show the output you got, not the output you expect.
- No secrets, keys or tokens. Use placeholder names such as `API_KEY` read from the environment, and never paste real values.
- State the licence of the code. If you copy code, name its source and licence.
- Keep samples short enough to read. Link a repo for long code.

## Diagrams and images
- Keep the diagram source (for example Mermaid text) in the repo next to the post, so it can be edited.
- Every image has alt text that says what it shows. This is enforced by `npm run check:content`. Write the point of the image, not "diagram" or "screenshot".
- No text-only screenshots. Put text and code in the page as text.
- Add a caption when the image needs a source or a date.

## Sources and citations
- Give a source for every claim. This includes numbers, dates, benchmarks and behaviour of a tool.
- Prefer primary sources: papers, specifications, and vendor documentation with the version and date.
- Mark vendor claims and vendor terms (pricing, limits, licences) as vendor statements, and give the date.
- Link each source with the date you accessed it.
- Never invent a citation. If you cannot find a source, remove the claim or say it is your own observation and how you tested it.
- A statistic needs its data: who measured it, on what, and when.
- Pillar notes marked "needs primary source" in `docs/prd/content-pillars.md` must have one before review.
- List all sources in the final `## Sources` section.

## Accessibility
- Headings go in order: one H1 (the title), then H2, then H3. Do not skip levels.
- Link text describes the target. Do not write "click here".
- Check colour contrast in any image or diagram you make.
- Never use colour alone to carry meaning. Add a label or a shape.
- Code blocks must be readable: name the language, keep lines short, avoid horizontal scrolling where you can.
- Give captions or a transcript for any audio or video.
- See the accessibility requirements in `docs/srs/srs.md`.

## Content QA checklist
The Technical Editor ticks every item before asking Venkat to approve. Link the Asana task in the QA comment.

Each item says how it is checked. "By hand" means the editor reads or tests it and says so in the QA comment.

- [ ] Facts match the sources: by hand, open each source in the research brief and compare every claim, number and date.
- [ ] Every code sample was run, and versions and run date are recorded: by hand, run it from a clean checkout and paste the output into the QA comment.
- [ ] Every image has alt text that says what it shows: `npm run check:content` for presence, by hand for quality.
- [ ] Front-matter is valid and `draft: true`: `npm run check:content`.
- [ ] Title is 70 characters or fewer and description is 160 or fewer: `npm run check:content` (the schema enforces it).
- [ ] Tags follow the rule for the post format: by hand until the F2 enforcement exists, then `npm run check:content`.
- [ ] Slug equals `slugify(title)`: by hand until enforced (compare with `src/lib/slugify.ts`).
- [ ] All links work and each source has an access date: by hand, open each link.
- [ ] The TL;DR matches the body: by hand, read the TL;DR after the body and compare each point.
- [ ] SEO basics are done: run the `seo-audit` skill.
- [ ] No secrets, keys or personal data in text, code or images: `npm run secrets:scan` and by hand for images.
- [ ] Headings are in order and link text is descriptive: by hand.
- [ ] No em dashes: by hand or search for the character.
- [ ] British spelling is used throughout (code, API names and quotes excepted): by hand.
- [ ] No words from the avoid list in Voice and tone: by hand or search.
- [ ] Original writing, with no copied passages: by hand, search one sentence from each paragraph and compare it to its source.
- [ ] Quotes are attributed, short and quoted exactly: by hand against the source.
- [ ] Code sample dependencies are pinned and the samples pass in CI: by hand until a CI job runs the samples. That job is not built yet. It is a requirement for the QA Engineer and Frontend Engineer, not a promise that it exists.
- [ ] Internal links go to related posts and use descriptive text: by hand.
- [ ] AI assistance is noted at the end of the post as set out in "AI assistance": by hand.
- [ ] Approval is requested from Venkat in the Asana task, which is linked in the QA comment: by hand, open the task and confirm the request is there.

## AI assistance
Status: proposed wording.

This blog is written with AI assistance. The policy is stated, not hidden. Every post carries a one-line note saying so at the end of the post. The proposed note is:

> This post was drafted with AI assistance, checked against its sources and edited by a human reviewer before publication.

Venkat reviews every post before publication. The Technical Editor ticks the AI assistance item in the checklist. Sources and code are still checked by hand and by tests. An AI note does not make a claim true.

Decision for Venkat: whether to disclose on every post, and the exact wording of the note. Until he decides, use the proposed note.

## Who approves what
- The Technical Editor checks the post and posts the QA comment.
- The named reviewer approves the PR.
- Venkat alone approves `draft: false`. That change is a separate commit after approval.
