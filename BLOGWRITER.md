# Blog writing spec — Kraftzen

Read this in full before drafting any post for the Kraftzen blog. It is the
source of truth for tone, structure, SEO and images.

Reference blog studied for tone: **enally.in/blog** (August 2026, 48 posts,
7 authors, 8 categories). What we take from it and what we deliberately do not
is set out below.

---

## The job of a post

Rank, then convert. In that order.

Every post is a piece of technical writing that a person searching a real
question lands on, reads to the end, and finishes thinking "these people know
what they are doing." The commercial ask lives in one block near the end and
nowhere else.

If a post could have been written by someone who has never built the thing, it
is not worth publishing.

---

## Voice

### The shape of it

Conversational and direct. Short sentences carrying the weight, longer ones for
explanation. Second person throughout: **you** and **your**. First person plural
for Kraftzen: **we**. Never "one" or "the user" when you mean you.

Open by naming the reader's actual situation, not by defining the topic. The
reference blog does this well:

> Most AI applications begin with a single prompt. One model. One response.
> One job. That works... until it doesn't.

Note what that is doing. It describes a state the reader recognises, then breaks
it. It does not open with "In this article we will explore."

### Devices to use

- **Punchy fragments.** "One model. One response. One job." Sentence fragments
  in a row are allowed and encouraged as an opener or a beat change.
- **Rhetorical questions as headings.** "Wait, what is ADK actually?" reads
  better than "Overview of ADK."
- **Pullquotes.** One every 600 to 900 words. A single line that compresses the
  section into something quotable. Format as a markdown blockquote.
- **Concrete numbers.** "Six weeks", "40 posts a month", "one to five lakh."
  Never "significantly faster" when you can say how much faster.
- **Named failure.** Say what broke, what it cost, what you changed.

### Devices banned outright

These carry over from the marketing site rules and are not negotiable here.

- **No em dashes.** Ever. Use a period, a comma, or restructure.
- **Banned vocabulary:** delve, crucial, robust, comprehensive, nuanced,
  multifaceted, furthermore, moreover, additionally, pivotal, landscape,
  tapestry, underscore, foster, showcase, intricate, vibrant, seamless,
  cutting-edge, leverage, empower, unlock, elevate, revolutionize, transform
  your business, take it to the next level, in today's fast-paced world, we are
  passionate about.
- **Banned constructions:** "Built for X." "Designed for Y." "It's not just X,
  it's Y." Sentences opening with a participle ("Leveraging the API, you can…").
- **No invented metrics.** If you do not have the number, cut the claim or write
  `NEEDS_REAL_NUMBER` and flag it.

### Where we deliberately differ from the reference

The reference blog leans on two patterns we do not copy:

1. **"X doesn't mean Y, it means Z"** headings, for example "Multi-Agent Doesn't
   Mean More Complexity, It Means Better Separation of Responsibilities." This
   is the banned "not just X, it's Y" construction wearing a hat. Write the
   positive claim directly: "Multi-agent systems separate responsibilities."
2. **Rhetorical triples used as filler**, for example "Fast. Simple. Powerful."
   A triple that carries real content is fine. A triple of adjectives is not.

Rhetorical *fragments* stay. Adjective triples go.

---

## Structure

Target **1,800 to 3,000 words**. The reference sits at 2,800 to 3,000 for its
flagship posts and 1,200 for quick ones. Do not pad to hit a number. A tight
1,500 word post beats a padded 3,000.

### The skeleton

```
Title                     H1, set from the post title field, not in the body
Excerpt                   1 to 2 sentences, the excerpt field
Cover image               IMAGE PROMPT block, see below

Hook                      2 to 4 short paragraphs. No heading. Name the
                          situation, break it, promise the specific thing
                          this post delivers.

## First real heading     Straight into substance. No "Introduction."
   ...
   > Pullquote

## Middle sections        4 to 8 H2s. H3s only where a section genuinely
                          splits. Each H2 is a question the reader has.

## Comparison table       Where the post compares options. See below.

## Common mistakes        Near the end. This is the highest value section in
                          almost every technical post and the reference uses
                          it well. 3 to 5 named mistakes with the fix.

## Key takeaways          5 to 7 bullets. Each one a complete, standalone
                          sentence a reader could screenshot.

FAQ                       Structured field, not body markdown. 4 to 6 questions.

Studio CTA                Rendered automatically by the post page. Do not
                          write your own CTA into the body.
```

### Heading rules

- Do not manually number H2s. The table of contents lists headings verbatim and
  a manual "1." renders next to nothing useful.
- Headings should read as questions or claims, never as labels. "Why one giant
  prompt stops working" beats "Prompt limitations."
- Keep the primary keyword in at least two H2s, naturally.

---

## Comparison tables

Use one whenever the post compares two or more options. They win featured
snippets and they are the single highest leverage SEO element available in a
markdown body.

Rules:

- 3 to 6 columns. More than six is unreadable on a phone.
- First column is the thing being compared. Last column is the verdict or
  recommendation, because that is what people screenshot.
- Fill every cell. "N/A" is fine, blank is not.
- Plain GFM markdown. The renderer scrolls wide tables inside their own
  container, so the page never scrolls sideways.

```markdown
| Task | Model | Script | What we use |
|------|-------|--------|-------------|
| Extract totals from a fixed template | Works, costs per call | Exact, free, instant | Script |
| Read messy supplier emails | Handles the variation | Breaks on every new format | Model |
```

---

## Images

**Never invent an image URL and never leave a bare placeholder.** Where an image
belongs, write an image prompt block that Garvish can paste straight into an
image generator, then replace with the real URL.

Use exactly this format so the blocks are easy to find and replace:

```markdown
> **[IMAGE PROMPT]**
> **Alt:** ADK multi-agent system with a coordinator routing to four sub-agents
> **Prompt:** Clean technical diagram on a warm off-white background (#FBF8F3),
> near-black labels, one vermilion accent (#E5502A). A single "Coordinator Agent"
> box at the top connected by thin arrows to four boxes below labelled Research,
> Code, Data and Deploy. Flat vector, thin hairline strokes, generous whitespace,
> no gradients, no glow, no 3D. Wide 16:9.
```

Rules for the prompts:

- Always name the palette: warm off-white `#FBF8F3`, near-black `#16130F`,
  one vermilion accent `#E5502A`. This keeps every post's imagery on brand.
- Always say **no gradients, no glow, no 3D**. Those are banned sitewide.
- Always give an aspect ratio. Cover images are 16:9. In-body diagrams are 16:9
  or 4:3.
- The **Alt** line becomes the real alt text and the caption, so write it as a
  description of what the image shows, not as a keyword dump.

Where to place images:

- One cover image per post, always.
- One diagram per major concept that has structure worth drawing. Do not add a
  decorative image just to break up text. If it does not explain something, cut it.
- Screenshots of real product UI beat generated diagrams every time. Use a real
  capture wherever one exists.

---

## SEO

### Titles

Study the reference patterns, they are effective:

- Year in parentheses for anything that dates: `(2026)`
- Comparison framing: `A vs B vs C: Which … for X?`
- How-to opener: `How to …`
- Quantified list: `50 …`, `20+ …`
- Keyword stacking with a colon: `Primary Keyword: Secondary Angle & Third Hook`

Examples in that house style, on our niche:

- `n8n vs Make vs Zapier (2026): Which Automation Platform Actually Scales?`
- `How to Build an AI Agent That Reads Your Invoices: A Working Guide`
- `12 Workflow Automations Every 10-Person Team Should Have Running`

Keep under 60 characters where you can. When keyword stacking pushes past that,
set a shorter `seo.title` separately.

### Required fields on every post

| Field | Rule |
|-------|------|
| `excerpt` | 1 to 2 sentences. Shown on the card. Must make sense out of context. |
| `seo.description` | 140 to 160 characters. Contains the primary keyword. Written for a human deciding whether to click. |
| `seo.keywords` | 4 to 8 terms. Primary first. |
| `tags` | 3 to 5. Lowercase. These are user-facing. |
| `faqs` | 4 to 6 questions minimum. This is what powers the `FAQPage` schema and the expandable results. |
| `category_id` | Exactly one. |
| `cover_url` | Required before publishing. |

### FAQ writing

The FAQ block is emitted as `FAQPage` JSON-LD, which is how a post wins the
expandable Google result. Treat it as a ranking surface, not an afterthought.

- Write the question as a person would type it into Google, not as a heading.
  "How long does a first automation usually take?" not "Automation timelines."
- Answer in 40 to 80 words. Complete enough to stand alone in a search result.
- Never repeat an answer verbatim from the body. Rephrase.
- At least one FAQ should be a question the post's competitors do not answer.

### Internal linking

Every post links to:

- At least one other post, where a relevant one exists.
- At least one service page, in the body where it is genuinely relevant, not
  bolted on. `/services#workflow-automation` and friends.

Do not stuff. Two or three internal links in a 2,000 word post is right.

---

## AEO and GEO: getting cited by AI answers

**Run `/ai-seo` before drafting any post.** The skill
(`coreyhaines31/marketingskills@ai-seo`) is installed and is the source of
truth for this section. What follows is the short version plus the Kraftzen
specific decisions.

### Why this section exists

Traditional SEO gets you ranked. AI SEO gets you **cited**. Those are different
jobs. AI Overviews now appear in roughly 45% of Google searches and cut clicks
through to sites by up to 58%, so a post that ranks but never gets quoted is
losing most of its traffic to the answer box above it.

The upside: a well structured page can be cited by ChatGPT, Perplexity or Claude
even when it ranks on page two or three, because those systems select on
structure and trustworthiness rather than rank position alone.

### What actually moves the needle

Princeton's GEO study (KDD 2024, measured on Perplexity) ranked nine tactics.
These are the ones worth building into every post:

| Tactic | Visibility lift | How we do it |
|--------|:---------------:|--------------|
| Cite sources | +40% | Link the primary source for every claim that is not ours |
| Add statistics | +37% | Real numbers with a date and a source |
| Add quotations | +30% | Named person, their title, their org |
| Authoritative tone | +25% | Write from what we actually built |
| Improve clarity | +20% | Short sentences, one idea per paragraph |
| Use technical terms | +18% | Name the tool, the version, the API |
| **Keyword stuffing** | **-10%** | **Actively harmful. Do not do it.** |

Statistics plus fluency is the strongest pairing. Sites with lower authority
gain the most from citations, up to a 115% lift, which describes kraftzen.com
today.

### The extractability rules

AI systems extract **passages**, not pages. Every key claim has to survive being
lifted out of the article on its own.

- **Lead every section with the answer.** Do not build to it. The first sentence
  under an H2 should answer the H2.
- **Keep the answer passage to 40 to 60 words.** That is the extraction sweet
  spot. Expand underneath it, not above it.
- **Write H2s the way people type queries.** "How long does an automation take
  to build" beats "Timelines".
- **A paragraph carries one idea.** Two ideas means neither gets extracted.
- **Tables beat prose** for anything comparative. **Numbered lists beat
  paragraphs** for anything sequential.

### Block patterns by query type

Match the block to the query the post targets. Full templates are in the skill
at `references/content-patterns.md`.

| Query shape | Block to use |
|-------------|--------------|
| "What is X?" | Definition block: one sentence definition, then two sentences of expansion, then why it matters |
| "How to X" | Numbered steps, each with a bolded step name and one or two sentences |
| "X vs Y" | Comparison table, verdict in the last column |
| "Is X worth it" | Pros and cons block |
| Common questions | The `faqs` field, which already emits `FAQPage` schema |
| Any hard claim | Statistic block: the number, the date, the source link |

### Query fan-out

Google's AI does not answer only the query typed. It generates related queries
underneath and synthesises across all of them. So a narrow page targeting one
keyword loses to a page that covers the whole cluster.

**Before drafting, list the 5 to 10 questions the AI is likely to fan out to,
and make sure the post or the surrounding posts answer them.** Several of those
belong in the `faqs` field, which is exactly what it is for.

### Freshness

AI engines weight recency. Two things are wired already:

- `BlogPosting` JSON-LD carries `dateModified`.
- The post page shows a visible "Updated" date once a post is edited a day or
  more after publishing. This deliberately ignores same-day typo fixes.

Refresh anything competitive quarterly. Update the numbers and the year, do not
just bump the date.

### Schema coverage

| Content type | Schema | Status |
|--------------|--------|--------|
| Every post | `BlogPosting` | Wired in `BlogPost.tsx` |
| FAQs | `FAQPage` | Wired, driven by the `faqs` field |
| Blog index | `Blog` | Wired in `Blog.tsx` |
| How-to posts | `HowTo` | **Not wired yet.** Worth adding when the first real how-to ships |
| Comparison posts | `ItemList` | **Not wired yet.** Worth adding for the first "X vs Y" post |

### AI crawler access

`public/robots.txt` explicitly allows GPTBot, ChatGPT-User, OAI-SearchBot,
PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended and Bingbot. Naming them
is deliberate. A broad `Disallow` added later would silently cut off the exact
citations this blog is chasing.

`public/llms.txt` is the context file those systems read. Keep it current when
services or products change.

### One thing Google says that cuts against the rest

Google's own guidance is that no special markup or AI-specific files are needed
for AI Overviews, and that writing separate content for AI risks their scaled
content abuse policy. That is not a contradiction of the above: every pattern
here is just clear organisation that helps a human reader too. **Never write a
block for the machine that a person would not want to read.** If a choice is
ever genuinely between the two, write for the person.

---

## Categories

Use one of these. They exist in the database.

| Slug | Name | What goes here |
|------|------|----------------|
| `ai-engineering` | AI engineering | Agents, models, evals, prompt systems, the plumbing |
| `automation` | Automation | Workflows, pipelines, n8n, taking repeat work off people |
| `web-development` | Web development | React, performance, shipping sites that hold up |
| `seo` | SEO | Technical SEO, content systems, getting found |
| `product` | Product | Decisions, scope, what we learned building ours |
| `tools` | Tools | What we actually use, what we dropped, and why |

---

## Working checklist

Before a post leaves draft:

**Voice**
- [ ] No em dashes anywhere. Search the body for one.
- [ ] No banned vocabulary. Search for the worst offenders.
- [ ] Opens by naming a situation, not defining a term.
- [ ] At least one pullquote per 600 to 900 words.

**Structure**
- [ ] Every H2 reads as a question or a claim, phrased the way someone would type it.
- [ ] Every section leads with its answer in the first sentence.
- [ ] The primary answer passage is 40 to 60 words.
- [ ] One idea per paragraph.
- [ ] A comparison table, if the post compares anything.
- [ ] A "common mistakes" section.
- [ ] Key takeaways, 5 to 7 standalone bullets.

**AEO and GEO**
- [ ] `/ai-seo` was consulted before drafting.
- [ ] Every claim that is not ours has a linked source. This is the single
      biggest lift, +40%.
- [ ] At least two real statistics, each with a date and a source.
- [ ] No keyword stuffing. It measurably hurts, at -10%.
- [ ] The 5 to 10 fan-out queries are listed, and covered by the post or its FAQs.
- [ ] 4 to 6 FAQs written as search queries, feeding `FAQPage` schema.

**Fields and links**
- [ ] Every image is either a real URL or an `[IMAGE PROMPT]` block.
- [ ] `seo.description` filled, 140 to 160 characters.
- [ ] 2 to 3 internal links, at least one to a service page.
- [ ] Every factual claim is either sourced, or something we actually did.

---

## How to draft a post with Claude

Paste this, filling the brackets:

> Read BLOGWRITER.md, then run the `/ai-seo` skill. Write a Kraftzen blog post.
>
> Topic: [title or idea from the ideas board]
> Angle: [who it is for and why now]
> Primary keyword: [keyword]
> Category: [slug]
>
> Before writing, list the 5 to 10 fan-out queries an AI would generate from the
> primary keyword, and tell me which the post covers and which go in the FAQs.
>
> Then output the body as markdown ready to paste into the admin editor, plus
> the excerpt, seo.title, seo.description, seo.keywords, tags and 4 to 6 FAQs as
> a separate block I can copy field by field. Use [IMAGE PROMPT] blocks wherever
> an image belongs. Every claim that is not ours needs a linked source.

Two reasons for the shape of that prompt. The fields come back separately from
the body because the admin editor has separate inputs for them. The fan-out
queries come first because they change what the post covers, and working them
out after the draft exists means rewriting it.
