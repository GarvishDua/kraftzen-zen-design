# Blog writing spec, Kraftzen

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

### Blog imagery is loud. The marketing site is not.

**This is a deliberate split, confirmed by Garvish on 2026-08-08. Do not
"correct" blog image prompts back to the site palette.**

`DESIGN.md` governs the site: restrained, one accent, no gradients. That is
right for a page someone already chose to visit. A blog cover competes in a
social feed, a search result and a card grid, where restrained reads as
invisible. So blog images are **bold, saturated and graphic**.

Every image prompt must be a **diagram, flowchart, chart or graphic that carries
the idea**. Never a decorative abstract. If the image does not explain something
a reader would otherwise have to work out from the prose, cut it.

---

### The cover template

**The left rail is fixed. Everything else is chosen per post.**

That split is the whole rule, and it was corrected on 2026-08-09 after four
covers in a row came back looking like the same image. The earlier version of
this file said the right 40% is always Garvish at a desk, and following it
produced a series that was recognisable and boring.

The reference is the enally.in cover set, studied 2026-08-08. Look at what it
actually does: the PageSpeed post floats real product UI and a score gauge next
to the author, the LinkedIn post stages a recruiter and a candidate at a desk,
the human rights post uses a photo-illustration and no author at all. **One rail,
many right sides.**

**The fixed part.** A wide 16:9 card. Roughly the left 50 to 60% is a
typographic zone on warm off-white (`#FBF8F3`), with a faint vermilion dotted
grid tucked into the top-left and bottom-left corners. Stacked down it, in this
order:

1. **Badge**, top left. A small rounded pill in vermilion with white caps text
   and a sparkle glyph. Always carries the year: `✦ 2026 GUIDE`, `✦ 2026 COMPARISON`.
2. **Headline**, the largest thing in the frame. Heavy geometric sans, tight
   leading, left aligned, three lines at most. **The first line or the key
   number is vermilion, the rest near-black.** That single colour switch is what
   makes the series recognisable, so never colour the whole headline.
3. **Short vermilion rule**, a stubby horizontal bar under the headline. Roughly
   one quarter of the headline width.
4. **Subhead**, one line or two, medium weight, near-black, with **the audience
   or the payoff in vermilion**. "Which Architecture Platform Is Best for
   *Students & Professionals*?"
5. **Icon chip row**, four or five chips across the bottom of the text zone.
   Each chip is a small vermilion-outlined rounded-square icon above a two or
   three word label in small near-black caps. These name what the post covers.
   This row is what stops the cover looking like a quote card.
6. **Author strip**, bottom left. Small circular avatar, then the author name in
   bold near-black, then a thin vertical divider, then the Kraftzen mark and the
   `kraftzen.in` wordmark.

**The variable part: read the post, then decide what goes beside the rail.**

Pick the treatment from what the post is, not from habit. Rough mapping:

| Post shape | What fills the rest of the frame |
|---|---|
| How-to, setup, tutorial | The real product UI as floating glass cards: a terminal with the actual command, a settings panel, a number badge for the step count. Author photo optional, usually small and low |
| Comparison, "X vs Y" | A head-to-head. Two contender cards angled toward each other with a vermilion `VS` disc between, each carrying that model's two decisive numbers. Usually **no author photo**, avatar only in the strip |
| Data or cost story | One chart that carries the finding, colour-blocked, with the key numeral two to four times the size of the others |
| Opinion, process, "what we learned" | A staged scene or photo-illustration of the situation, with small handwritten-style annotations and arrows naming what you are looking at |
| Everything else | Garvish's photo, waist up at a desk, room softly out of focus |

**Where the photo goes is a per-post decision, not a rule.** Right 40% is the
safe default and should stay the most common. But it can sit centre, low-left,
cropped small in a corner behind floating cards, or be absent entirely with only
the avatar in the author strip. Vary it deliberately across consecutive posts. If
the last two covers put him on the right, the next one should do something else.

**Where the saturated palette goes.** The warm off-white ground is the safe
default. A cover carrying a chart or a comparison can swap it for a deep
saturated field and colour-block the data. What never changes is the left rail:
badge, big headline with one vermilion element, short rule, subhead, chip row,
author strip. **Change the colour and the right side, keep the rail.**

**Fill-in template.** Copy this and replace the bracketed parts:

```markdown
> **[IMAGE PROMPT]**
> **Alt:** [what the cover shows, as a sentence]
> **Prompt:** Wide 16:9 blog cover card, warm editorial style, rounded corners.
> I am supplying a photo of a man at a desk. Place him on the RIGHT 40% of the
> frame, waist up, keeping his room behind him softly out of focus. Do not alter
> his face.
> LEFT 60% is a typographic zone on warm off-white (#FBF8F3) with a faint
> vermilion dotted grid in the top-left and bottom-left corners.
> Stacked down the left zone:
> 1. A small vermilion (#E5502A) rounded pill with a sparkle glyph and white caps
>    text reading "[✦ 2026 GUIDE]".
> 2. A very large heavy geometric sans headline, tight leading, left aligned:
>    "[FIRST LINE]" in vermilion, then "[SECOND LINE]" and "[THIRD LINE]" in
>    near-black (#16130F).
> 3. A short stubby vermilion rule beneath the headline.
> 4. A subhead in medium weight near-black reading "[SUBHEAD]", with
>    "[EMPHASIS WORDS]" in vermilion.
> 5. A row of [four] chips, each a small vermilion-outlined rounded-square icon
>    above a short near-black caps label: "[LABEL 1]", "[LABEL 2]", "[LABEL 3]",
>    "[LABEL 4]".
> 6. A bottom author strip: small circular avatar, "Garvish Dua" in bold
>    near-black, a thin vertical divider, then a small mark and "kraftzen.in".
> STYLE: clean editorial, flat vector graphics over a real photo, crisp type,
> generous whitespace. No gradients on the type, no glow, no 3D bevels.
> TEXT RULE: only the labels quoted above. No paragraphs, no invented words.
```

**Two rules that will bite you otherwise.** Keep the headline to three lines or
it stops being readable at card size, which is where most people see it. And
always end with the TEXT RULE line, because image models invent extra words into
empty space and a typo baked into a cover is permanent once it is in the OG card.

---

### In-body diagrams

These are where the loud, saturated treatment belongs. Use exactly this format
so the blocks are easy to find and replace:

```markdown
> **[IMAGE PROMPT]**
> **Alt:** A coordinator agent routing work to four specialist sub-agents
> **Prompt:** Bold editorial poster illustration, saturated flat-vector pop style,
> wide 16:9.
> CONCEPT: one coordinator delegating to four specialists.
> BACKGROUND: deep saturated indigo (#1B1B3A) with a faint halftone dot texture.
> COMPOSITION: one large rounded panel at the top in bright vermilion (#E5502A)
> labelled "COORDINATOR" in heavy cream condensed caps. Four thick cream arrows
> fan down to four rounded panels: "RESEARCH" in electric blue (#2E6BFF),
> "CODE" in mint green (#3DDC97), "DATA" in acid yellow (#FFD93D) with
> near-black type, "DEPLOY" in electric violet (#7B2FF7). Each panel carries one
> big numeral 01 to 04 in its corner.
> STYLE: flat vector, thick confident shapes, high saturation, heavy geometric
> sans, strong colour blocking, slight retro-print grain. Crisp edges, no soft
> shadows, no 3D bevels, no photorealism.
> TEXT RULE: only the short caps labels and numerals listed above.
```

Rules for the prompts:

- **Lead with CONCEPT.** State what the picture has to prove before describing
  how it looks. A prompt that only describes style produces decoration.
- **Structure every prompt** as CONCEPT, BACKGROUND, COMPOSITION, STYLE, TEXT
  RULE. Composition is the long part: say where things sit, how big they are
  relative to each other, and what each one is labelled.
- **Use the saturated palette.** Vermilion `#E5502A` stays the anchor so the blog
  still reads as ours, then draw from electric blue `#2E6BFF`, mint green
  `#3DDC97`, acid yellow `#FFD93D`, electric violet `#7B2FF7`, hot coral
  `#FF5A3C`, against a deep ground like indigo `#1B1B3A` or near-black `#141419`.
- **Size differences must carry meaning.** If one number is the point of the
  chart, say it is twice the size of the others. Flat hierarchy wastes the image.
- **Always exactly 16:9.** Cover containers are `aspect-[16/9]` with
  `object-contain`, so a true 16:9 render fills the frame with no letterboxing.
  A square or 4:3 render shows cream bars down both sides.
- **Cap the on-image text.** Image models garble sentences. Short caps labels,
  big numerals and short mono tags only. End every prompt with a TEXT RULE line
  naming exactly what may appear. Regenerate rather than accept mangled letters,
  because a typo in a cover is permanent once it is in the OG card.
- Banned in diagrams: soft drop shadows, 3D bevels, photorealism, stock
  illustration. Bold and flat, not glossy. The cover is the one exception,
  because it composites a real photo of Garvish, and even there the graphics
  laid over that photo stay flat.
- The **Alt** line becomes the real alt text and the caption, so write it as a
  description of what the image shows, not as a keyword dump.

Where to place images:

- One cover image per post, always, built from **the cover template above**.
  This is the one that has to stop a scroll, and the one that has to look like
  it belongs to the same publication as the last five.
- One diagram, flowchart or chart per major concept that has structure worth
  drawing. Two to three images in a 2,000 word post is the right density.
- Charts that carry real numbers stay legible first and loud second. A cost
  curve or a benchmark comparison can be saturated and bold, but if the reader
  cannot read the axis at blog-body width the image failed.
- Screenshots of real product UI beat generated graphics every time. Use a real
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

The FAQ block is emitted as `FAQPage` JSON-LD. Treat it as a ranking surface,
not an afterthought.

**Correction, checked 2026-08-08.** An earlier version of this file said the
FAQ block "wins the expandable Google result". That is no longer true. Google
restricted FAQ rich results to authoritative government and health sites on
14 September 2023, then removed the feature from Search entirely on
15 June 2026 and deleted the documentation.

Keep writing the FAQs anyway, for reasons that still hold:

- **AI answer engines still read them.** ChatGPT, Perplexity and Claude extract
  question and answer pairs, and a direct answer in 40 to 80 words is the
  easiest thing in a post to lift into a cited response. This is the AEO play
  and it is now the main one.
- **They cover the fan-out queries** the post body does not have room for.
- **They are good writing.** A reader scanning for one specific answer finds it.

What changed is the expected payoff, not the practice. Do not promise anyone an
expandable Google result from them.

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
gain the most from citations, up to a 115% lift, which describes kraftzen.in
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
