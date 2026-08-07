import LegalPage, { type LegalSection } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

const sections: LegalSection[] = [
  {
    title: "What these terms cover",
    body: [
      "These terms apply to this website. Client work is governed by the written proposal and agreement we sign for that project, and where the two disagree, the signed agreement wins.",
      "Using this site means you accept what is written here.",
    ],
  },
  {
    title: "Using this site",
    body: [
      "Read it, share it, quote it. Do not attempt to break into it, scrape it at a volume that degrades it for other people, or use it to send us anything unlawful.",
    ],
  },
  {
    title: "Who owns what",
    body: [
      "The Kraftzen name, the writing, the design and the code of this site belong to Kraftzen unless stated otherwise. Product screenshots show our own products.",
      "Work we build for a client is different. Once a project is paid for, the client owns the deliverables outright, including source code and accounts. We keep the right to describe the work publicly unless the agreement says we cannot.",
    ],
  },
  {
    title: "Quotes and estimates",
    body: [
      "Prices, timelines and figures shown on this site are indicative. A binding number only exists once we have sent you a written quote for your specific project.",
      "Where we quote a fixed price, that price holds for the scope described in the quote. Changes to scope get repriced before we build them, not after.",
    ],
  },
  {
    title: "What we do not promise",
    body: [
      "This site is provided as it is. We keep it accurate but we do not warrant that everything on it is current or error free at every moment.",
      "AI systems produce imperfect output. Where a project involves them, we build in review steps and say plainly what the system can and cannot be trusted to do. We do not promise a specific commercial outcome from any tool we build.",
    ],
  },
  {
    title: "Limits on liability",
    body: [
      "To the extent the law allows, Kraftzen is not liable for indirect or consequential loss arising from your use of this site.",
      "For client work, our liability is capped at the fees paid for the project in question, as set out in the project agreement.",
    ],
  },
  {
    title: "Links out",
    body: [
      "This site links to products we run and to third party tools. We are not responsible for the content or the terms of sites we do not control.",
    ],
  },
  {
    title: "Governing law",
    body: [
      `These terms are governed by the laws of ${SITE.country}, and the courts of ${SITE.city} have jurisdiction over any dispute arising from them.`,
    ],
  },
  {
    title: "Changes",
    body: [
      "We may update these terms. The date at the top of the page shows when they last changed. Continuing to use the site after a change means you accept the updated version.",
    ],
  },
  {
    title: "Getting in touch",
    body: [`Questions about these terms go to ${SITE.email}.`],
  },
];

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      path="/terms"
      description="Terms covering the Kraftzen website. Client work is governed by the signed project agreement, and clients own the deliverables once a project is paid for."
      updated="7 August 2026"
      intro="These cover the website itself. If we are working together, the agreement we signed for your project is the document that matters, and it takes precedence over anything here."
      sections={sections}
    />
  );
}
