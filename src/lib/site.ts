/**
 * Single source of truth for site content.
 *
 * Voice rules are binding, see DESIGN.md "Content Voice":
 * no em dashes, no AI filler vocabulary, concrete over adjectival.
 * Anything marked NEEDS_REAL_NUMBER is a placeholder Garv should replace
 * with a verified figure before launch.
 */

export const SITE = {
  name: "Kraftzen",
  domain: "https://kraftzen.in",
  tagline: "We build AI tools that take the busywork off your team.",
  email: "officialkraftzen@gmail.com",
  phone: "+91 9310367672",
  phoneHref: "tel:+919310367672",
  city: "Delhi",
  country: "India",
  founder: "Garvish Dua",
} as const;

export const NAV = [
  { label: "Services", to: "/services" },
  { label: "Products", to: "/products" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

export const HERO = {
  eyebrow: "AI studio · Delhi, India",
  headingLead: "We build AI tools that",
  headingAccent: "remove",
  headingTail: "the busywork.",
  body:
    "Kraftzen is a small studio. We design and ship AI products, automation and websites for teams who would rather have a working thing than a slide deck.",
  primaryCta: { label: "Start a project", to: "/contact" },
  secondaryCta: { label: "See the products", to: "/products" },
} as const;

/** Four claims that hold up without a case study behind them. */
export const HERO_PROOF = [
  { value: "2", label: "products live in public" },
  { value: "4", label: "service lines" },
  { value: "1 day", label: "typical reply time" },
  { value: "Delhi", label: "based, working worldwide" },
] as const;

/**
 * The explanatory pipeline. This drives the scroll-drawn diagram on Home,
 * so each step needs a short verb, one line of detail, and an artifact word
 * that the animation prints into the node.
 */
export const PROCESS = [
  {
    n: "01",
    verb: "Map",
    artifact: "the mess",
    detail:
      "We sit with the work you actually do and write down every manual step, every copy paste, every place a person waits on another person.",
  },
  {
    n: "02",
    verb: "Cut",
    artifact: "the steps",
    detail:
      "Most of what looks like an AI problem is a process problem. We delete the steps that should not exist before we automate anything.",
  },
  {
    n: "03",
    verb: "Build",
    artifact: "the tool",
    detail:
      "Then we build the smallest thing that does the job. An agent, a script, a dashboard, a site. Whatever the work needs, in whatever stack fits.",
  },
  {
    n: "04",
    verb: "Hand",
    artifact: "it over",
    detail:
      "You get the code, the accounts and a walkthrough. It runs without us. If you want us to keep running it, that is a separate conversation.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const SERVICES = [
  {
    slug: "ai-tools-and-agents",
    n: "01",
    title: "AI tools and agents",
    summary:
      "Custom AI tools built around one job your team does over and over.",
    body:
      "We start from the task, not the model. If a large language model is the right answer we use one. If a hundred lines of Python is the right answer, you get a hundred lines of Python and a smaller bill.",
    deliverables: [
      "Task specific agents with a clear scope",
      "Internal tools your team opens daily",
      "Prompt and evaluation setup so quality stays measurable",
      "Cost and rate limit guardrails",
    ],
  },
  {
    slug: "workflow-automation",
    n: "02",
    title: "Workflow automation",
    summary:
      "Pipelines that move work between the tools you already pay for.",
    body:
      "Leads, invoices, onboarding, reporting, content approval. The unglamorous chains of steps that eat a day a week. We wire them end to end and give you a place to watch them run.",
    deliverables: [
      "End to end automations across your existing stack",
      "n8n, Zapier or custom services, whichever fits",
      "Error handling and alerts, so silence means it worked",
      "A run log you can actually read",
    ],
  },
  {
    slug: "websites-and-web-apps",
    n: "03",
    title: "Websites and web apps",
    summary:
      "Sites that load fast, read clearly and rank for what you sell.",
    body:
      "Design and build in one pass, by the same people. You get real page speed, real semantic markup, and copy written for a person first and a crawler second.",
    deliverables: [
      "Marketing sites, product sites, landing pages",
      "React or WordPress, your call",
      "Technical SEO baked in, not bolted on afterwards",
      "A CMS your non technical people can use",
    ],
  },
  {
    slug: "automated-content-systems",
    n: "04",
    title: "Automated content systems",
    summary:
      "Blogs and content pipelines that publish on their own schedule.",
    body:
      "This is the system behind AniVerseX, packaged for your brand. Research, draft, review, publish, index. You keep an approval step if you want one, or you let it run.",
    deliverables: [
      "Automated blog site on your domain",
      "Topic research and internal linking handled",
      "Schema, sitemaps and indexing wired up",
      "Optional human review gate before anything goes live",
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

/**
 * A part of a product. `image` is optional on purpose: only include one when a
 * genuinely distinct screenshot exists. Repeating the same capture four times
 * looks worse than clean type.
 */
export interface ProductModule {
  name: string;
  detail: string;
  image?: string;
  alt?: string;
}

export interface Product {
  n: string;
  slug: string;
  name: string;
  status: string;
  href: string;
  ctaLabel: string;
  kicker: string;
  summary: string;
  body: string[];
  modules: ProductModule[];
  tags: string[];
  cover: { src: string; alt: string };
  /** Square product mark, generated by npm run assets. */
  logo: string;
  /** True when the mark has its own dark ground and must not sit on a light plate. */
  logoOnDark?: boolean;
}

/**
 * Our own products. There are exactly two, both live. Client work belongs in
 * SERVICES, not here, so this page never pads itself out with things that are
 * not really products.
 */
export const PRODUCTS: Product[] = [
  {
    n: "01",
    slug: "bro-ai",
    name: "Bro AI",
    status: "Live",
    href: "https://bro.ai.in",
    ctaLabel: "Open Bro AI",
    kicker: "Five narrow AI tools behind one login",
    summary:
      "One place for the small creative jobs that usually need a separate subscription each.",
    body: [
      "Most AI products are a single chat box that claims to do everything. Bro AI is the opposite. Each tool does one narrow job and has a screen built for that job, so you are not describing your intent to an empty prompt every time.",
      "It exists because we kept paying for a different tool for every small job. Now they sit behind one login and share the same brand settings.",
    ],
    /** The sub tools. This is what makes the product concrete rather than a claim. */
    modules: [
      {
        name: "Designer Bro",
        // Wording follows the product's own dashboard copy.
        detail: "Visuals, professional headshots and cinematic thumbnails from a brief.",
        image: "/designerbro.png",
        alt: "A product visual produced by Designer Bro",
      },
      {
        name: "Gen-Z Bro",
        detail:
          "Turns your photos into whatever art style is trending, Ghibli and whatever comes after it.",
        image: "/broai-genz.jpg",
        alt: "Gen-Z Bro rendering a photo in a trending illustration style",
      },
      {
        name: "Animator Bro",
        detail: "Short motion pieces, and animated variants of a static design.",
        image: "/Animatorbro.png",
        alt: "Animator Bro turning a static design into motion inside Bro AI",
      },
      {
        name: "Portfolio Bro",
        detail: "A portfolio site built from your work, ready to publish.",
        image: "/PortfolioBro.png",
        alt: "Portfolio Bro assembling a portfolio site inside Bro AI",
      },
      {
        name: "Emailer Bro",
        detail: "Campaign copy and sequences that read like a person wrote them.",
        image: "/Emailerbro.png",
        alt: "Emailer Bro drafting an email sequence inside Bro AI",
      },
    ],
    tags: ["Product design", "Multi tool platform", "AI"],
    cover: {
      src: "/broai-dashboard.jpg",
      alt: "The Bro AI dashboard, with Designer Bro, Gen-Z Bro and Animator Bro on it",
    },
    logo: "/logo-bro-ai.png",
  },
  {
    n: "02",
    slug: "aniversex",
    name: "AniVerseX",
    status: "Live",
    href: "https://aniblogs.vercel.app",
    ctaLabel: "Open AniVerseX",
    kicker: "A blog that runs itself, end to end",
    summary:
      "It researches, writes and publishes on its own, then keeps its own SEO in order.",
    body: [
      "We built it to prove the content pipeline worked before selling that pipeline to anyone. It picks topics, drafts posts, wires internal links and pings search engines, with no person in the loop unless you want one there.",
      "The same system is what we rebuild for clients on their own domain. That is the automated content service on the services page.",
    ],
    /**
     * No per module images. These are pipeline stages rather than screens, and
     * the only capture we have is the published blog itself.
     */
    modules: [
      {
        name: "Topic research",
        detail: "Finds gaps worth writing about instead of rewriting what already ranks.",
      },
      {
        name: "Drafting",
        detail: "Full posts with real structure, not five paragraphs of filler.",
      },
      {
        name: "Internal linking",
        detail: "New posts get wired into the existing archive automatically.",
      },
      {
        name: "Indexing",
        detail: "Schema, sitemaps and search engine pings handled on publish.",
      },
    ],
    tags: ["Automation", "Content pipeline", "SEO"],
    cover: { src: "/aniversex.png", alt: "The AniVerseX automated blog homepage" },
    logo: "/logo-aniversex.png",
    logoOnDark: true,
  },
] as const;

/* ------------------------------------------------------------------ */
/* Engagement shapes (Services page only)                              */
/* ------------------------------------------------------------------ */

/**
 * Concrete commercials. This is the block that replaced a second copy of the
 * process diagram on the services page, so it has to carry real information.
 * Figures are unverified, confirm with Garv before launch. See CLAUDE.md.
 */
export const ENGAGEMENTS = [
  {
    name: "Sprint",
    price: "From ₹60,000",
    duration: "1 to 2 weeks",
    best: "One automation, one landing page, or a proof that an idea works.",
    includes: [
      "One clearly scoped deliverable",
      "Built, tested and handed over",
      "Two rounds of changes",
    ],
  },
  {
    name: "Build",
    price: "₹1L to ₹5L",
    duration: "3 to 8 weeks",
    best: "A custom tool, an automated content system, or a full site.",
    includes: [
      "Discovery call and written scope",
      "Fixed price, fixed date",
      "Weekly demo of what actually runs",
      "Handover of code, accounts and docs",
    ],
    featured: true,
  },
  {
    name: "Ongoing",
    price: "Monthly, cancel anytime",
    duration: "Rolling",
    best: "You want us to keep running and extending what we built.",
    includes: [
      "A set number of days each month",
      "Monitoring and fixes on what we shipped",
      "No minimum term, no exit fee",
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export const ABOUT = {
  lead:
    "Kraftzen started because too much software is sold on what it might do one day. We would rather show you the thing running.",
  body: [
    "We are a small studio in Delhi working with founders and small teams. Most of our clients are somewhere between five and fifty people, past the point where spreadsheets hold and short of the point where they can hire an engineering team for it.",
    "We build our own products in the same week we build client work, which keeps us honest. Bro AI and AniVerseX are both live and both started as something we needed ourselves.",
    "The name is craft plus zen. Careful tools, and less noise once they are running.",
  ],
  /** Fills the left rail on the about page and answers the obvious questions fast. */
  facts: [
    { label: "Based", value: "Delhi, India" },
    { label: "Working with", value: "Teams of 5 to 50" },
    { label: "Products live", value: "Bro AI, AniVerseX" },
    { label: "Typical build", value: "2 to 8 weeks" },
    { label: "You own", value: "Code and accounts" },
  ],
} as const;

export const PRINCIPLES = [
  {
    n: "01",
    title: "Show the working thing",
    body:
      "A demo you can click beats a deck every time. We would rather turn up to the second meeting with something running than something drawn.",
  },
  {
    n: "02",
    title: "Delete before you automate",
    body:
      "Automating a step that should not exist just makes the wrong thing happen faster. We look for steps to remove first, and it usually shrinks the quote.",
  },
  {
    n: "03",
    title: "Boring where it counts",
    body:
      "We use the interesting tool where it earns its place and the dull, well documented one everywhere else. You should be able to hand our work to another developer.",
  },
  {
    n: "04",
    title: "You own it",
    body:
      "Code, accounts, credentials, documentation. All of it is yours at the end. No lock in, no hostage keys, no monthly fee to keep your own tool switched on.",
  },
] as const;

export const FOUNDER = {
  name: "Garvish Dua",
  role: "Founder",
  photo: "/founder-garvish.jpg",
  /** One line, used on the home page founder block. */
  kicker: "Founder, and the person who writes the code",
  body: [
    "Garvish started Kraftzen after watching small teams pay for software that added work instead of removing it.",
    "He works on the products and the client builds directly, which is why the first reply you get to an enquiry comes from the person who would be building the thing.",
  ],
  /**
   * Home page version. The signature block sits below this paragraph, so it
   * cannot open with "he" the way the about page copy can.
   */
  homeNote:
    "Garvish works on the products and the client builds directly, which is why the first reply you get to an enquiry comes from the person who would be building the thing.",
} as const;

/* ------------------------------------------------------------------ */
/* Contact and FAQ                                                     */
/* ------------------------------------------------------------------ */

export const CONTACT = {
  lead:
    "The more specific you are, the more useful our reply. We answer within one business day, and it comes from the person who would build the thing.",
  budgets: [
    "Under 1 lakh",
    "1 to 5 lakh",
    "5 lakh and up",
    "Not sure yet",
  ],
  topics: [
    "AI tools and agents",
    "Workflow automation",
    "Website or web app",
    "Automated content system",
    "Something else",
  ],
} as const;

/** FAQ doubles as FAQPage schema on the Services route. */
export const FAQS = [
  {
    q: "How much does a project cost?",
    a: "Most automation and tooling projects land between one and five lakh rupees depending on how many systems we have to touch. Websites start lower. We give a fixed number after one call, not a range that moves later.",
  },
  {
    q: "How long does it take?",
    a: "A focused automation or a marketing site is usually two to four weeks. A custom tool with several integrations runs six to ten. We tell you the date before we start and flag slippage the week it happens, not at the end.",
  },
  {
    q: "Do you work with companies outside India?",
    a: "Yes. We are based in Delhi and most of our communication is written, so the timezone rarely matters. Calls get scheduled around yours.",
  },
  {
    q: "Do I own the code?",
    a: "Yes, all of it, along with every account and credential we set up. Nothing we build depends on Kraftzen staying in the picture.",
  },
  {
    q: "Will AI actually help my business, or is this a fad?",
    a: "Sometimes it will not, and we will say so. Plenty of problems that get pitched as AI problems are solved better by fixing a process or writing a small script. We would rather quote you for the smaller correct thing.",
  },
  {
    q: "Can you take over a project someone else started?",
    a: "Usually yes. We will read the existing code first and tell you honestly whether continuing it costs less than restarting it.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Capability marquee                                                  */
/* ------------------------------------------------------------------ */

export const CAPABILITIES = [
  "AI agents",
  "Workflow automation",
  "Internal tools",
  "React",
  "Next.js",
  "n8n",
  "Automated blogs",
  "Technical SEO",
  "WordPress",
  "API integrations",
  "Web apps",
  "Prompt engineering",
  "Data pipelines",
  "Landing pages",
] as const;
